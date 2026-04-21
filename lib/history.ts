import fs from "fs";
import path from "path";
import type { DiagnosisResult } from "./types";
import { getLeadTemperature } from "./types";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", ".data")
  : path.join(process.cwd(), ".data");

export interface HistoryEntry {
  id: string;
  url: string;
  timestamp: string;
  overall_score: number;
  lead_temperature: "Hot" | "Warm" | "Cold";
  lead_tags: string[];
  summary: string;
  scores: DiagnosisResult["scores"];
  strengths: string[];
  issues: string[];
  top_priority_fix: DiagnosisResult["top_priority_fix"];
}

function toMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthFilePath(monthKey: string): string {
  return path.join(DATA_DIR, `${monthKey}.json`);
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readMonth(monthKey: string): HistoryEntry[] {
  try {
    const file = monthFilePath(monthKey);
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

function writeMonth(monthKey: string, entries: HistoryEntry[]) {
  ensureDataDir();
  fs.writeFileSync(monthFilePath(monthKey), JSON.stringify(entries, null, 2), "utf-8");
}

export function saveHistory(url: string, result: DiagnosisResult): HistoryEntry {
  const now = new Date();
  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    url,
    timestamp: now.toISOString(),
    overall_score: result.overall_score,
    lead_temperature: getLeadTemperature(result),
    lead_tags: result.lead_tags,
    summary: result.summary,
    scores: result.scores,
    strengths: result.strengths,
    issues: result.issues,
    top_priority_fix: result.top_priority_fix,
  };

  const monthKey = toMonthKey(now);
  const entries = readMonth(monthKey);
  entries.unshift(entry);
  writeMonth(monthKey, entries);
  return entry;
}

export function getAvailableMonths(): string[] {
  ensureDataDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .map((f) => f.replace(".json", ""))
    .sort((a, b) => b.localeCompare(a)); // 新しい月順
}

export function getHistoryByMonth(monthKey: string): HistoryEntry[] {
  return readMonth(monthKey);
}
