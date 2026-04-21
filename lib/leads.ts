import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DiagnosisResult } from "./types";
import { getRedis } from "./redis";

const LEADS_DIR = process.env.VERCEL
  ? path.join("/tmp", ".data", "leads")
  : path.join(process.cwd(), ".data", "leads");

export interface LeadEntry {
  token: string;
  email: string;
  company: string;
  name: string;
  diagnosedUrl: string;
  timestamp: string;
  result: DiagnosisResult;
  screenshot?: string;
}

function toMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// ── File-based (local) ────────────────────────────────────────────────────────

function ensureLeadsDir() {
  if (!fs.existsSync(LEADS_DIR)) fs.mkdirSync(LEADS_DIR, { recursive: true });
}

function readLeadsFile(monthKey: string): LeadEntry[] {
  try {
    const file = path.join(LEADS_DIR, `${monthKey}.json`);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

function writeLeadsFile(monthKey: string, entries: LeadEntry[]) {
  ensureLeadsDir();
  fs.writeFileSync(
    path.join(LEADS_DIR, `${monthKey}.json`),
    JSON.stringify(entries, null, 2),
    "utf-8"
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export async function saveLeadEntry(entry: LeadEntry): Promise<void> {
  const redis = getRedis();
  const monthKey = toMonthKey(new Date(entry.timestamp));
  if (redis) {
    await redis.set(`lead:${entry.token}`, JSON.stringify(entry));
    await redis.sadd("leads:months", monthKey);
    await redis.lpush(`leads:month:${monthKey}`, entry.token);
  } else {
    const entries = readLeadsFile(monthKey);
    entries.unshift(entry);
    writeLeadsFile(monthKey, entries);
  }
}

export async function getLeadMonths(): Promise<string[]> {
  const redis = getRedis();
  if (redis) {
    const months = await redis.smembers("leads:months");
    return months.sort((a, b) => b.localeCompare(a));
  }
  ensureLeadsDir();
  return fs
    .readdirSync(LEADS_DIR)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .map((f) => f.replace(".json", ""))
    .sort((a, b) => b.localeCompare(a));
}

export async function getLeadsByMonth(monthKey: string): Promise<Omit<LeadEntry, "screenshot">[]> {
  const redis = getRedis();
  if (redis) {
    const tokens = await redis.lrange(`leads:month:${monthKey}`, 0, -1);
    const entries = await Promise.all(
      tokens.map(async (token) => {
        const raw = await redis.get(`lead:${token}`);
        if (!raw) return null;
        const entry: LeadEntry = JSON.parse(raw);
        const { screenshot: _, ...rest } = entry;
        return rest;
      })
    );
    return entries.filter((e): e is Omit<LeadEntry, "screenshot"> => e !== null);
  }
  return readLeadsFile(monthKey).map(({ screenshot: _, ...rest }) => rest);
}

export async function findLeadByToken(token: string): Promise<LeadEntry | null> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get(`lead:${token}`);
    if (!raw) return null;
    return JSON.parse(raw) as LeadEntry;
  }
  ensureLeadsDir();
  const files = fs
    .readdirSync(LEADS_DIR)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .sort((a, b) => b.localeCompare(a));
  for (const file of files) {
    const entries = readLeadsFile(file.replace(".json", ""));
    const found = entries.find((e) => e.token === token);
    if (found) return found;
  }
  return null;
}

export async function removeLeadByToken(token: string): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get(`lead:${token}`);
    if (!raw) return false;
    const entry: LeadEntry = JSON.parse(raw);
    const monthKey = toMonthKey(new Date(entry.timestamp));
    await redis.del(`lead:${token}`);
    await redis.lrem(`leads:month:${monthKey}`, 0, token);
    return true;
  }
  ensureLeadsDir();
  const files = fs
    .readdirSync(LEADS_DIR)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .sort((a, b) => b.localeCompare(a));
  for (const file of files) {
    const monthKey = file.replace(".json", "");
    const entries = readLeadsFile(monthKey);
    const next = entries.filter((e) => e.token !== token);
    if (next.length !== entries.length) {
      writeLeadsFile(monthKey, next);
      return true;
    }
  }
  return false;
}
