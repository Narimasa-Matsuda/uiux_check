import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { DiagnosisResult } from "./types";

const LEADS_DIR = path.join(process.cwd(), ".data", "leads");

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

export function generateToken(): string {
  return crypto.randomBytes(24).toString("hex"); // 48-char hex
}

export function saveLeadEntry(entry: LeadEntry): void {
  const monthKey = toMonthKey(new Date(entry.timestamp));
  const entries = readLeadsFile(monthKey);
  entries.unshift(entry);
  writeLeadsFile(monthKey, entries);
}

export function getLeadMonths(): string[] {
  ensureLeadsDir();
  return fs
    .readdirSync(LEADS_DIR)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .map((f) => f.replace(".json", ""))
    .sort((a, b) => b.localeCompare(a));
}

export function getLeadsByMonth(monthKey: string): Omit<LeadEntry, "screenshot">[] {
  return readLeadsFile(monthKey).map((entry) => ({
    token: entry.token,
    email: entry.email,
    company: entry.company,
    name: entry.name,
    diagnosedUrl: entry.diagnosedUrl,
    timestamp: entry.timestamp,
    result: entry.result,
  }));
}

export function findLeadByToken(token: string): LeadEntry | null {
  ensureLeadsDir();
  const files = fs
    .readdirSync(LEADS_DIR)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .sort((a, b) => b.localeCompare(a)); // newest first

  for (const file of files) {
    const monthKey = file.replace(".json", "");
    const entries = readLeadsFile(monthKey);
    const found = entries.find((e) => e.token === token);
    if (found) return found;
  }
  return null;
}

export function removeLeadByToken(token: string): boolean {
  ensureLeadsDir();
  const files = fs
    .readdirSync(LEADS_DIR)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .sort((a, b) => b.localeCompare(a));

  for (const file of files) {
    const monthKey = file.replace(".json", "");
    const entries = readLeadsFile(monthKey);
    const nextEntries = entries.filter((entry) => entry.token !== token);
    if (nextEntries.length !== entries.length) {
      writeLeadsFile(monthKey, nextEntries);
      return true;
    }
  }

  return false;
}
