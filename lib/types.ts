export interface DiagnosisScores {
  first_impression: number;
  information_architecture: number;
  cta_clarity: number;
  trust: number;
  navigation: number;
  improvement_priority: number;
}

export interface TopPriorityFix {
  title: string;
  reason: string;
  suggestion: string;
}

export type SiteType = "corporate" | "recruitment" | "brand" | "service" | "media";

export const SITE_TYPE_LABELS: Record<SiteType, string> = {
  corporate: "コーポレートサイト",
  recruitment: "採用サイト",
  brand: "ブランドサイト",
  service: "サービスサイト",
  media: "メディアサイト",
};

export interface DiagnosisResult {
  site_type: SiteType;
  overall_score: number;
  scores: DiagnosisScores;
  summary: string;
  strengths: string[];
  issues: string[];
  top_priority_fix: TopPriorityFix;
  lead_tags: string[];
}

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  result?: DiagnosisResult;
  screenshot?: string; // base64 JPEG
  message?: string;
}

export interface LeadRequest {
  email: string;
  company: string;
  name: string;
  diagnosedUrl: string;
  result: DiagnosisResult;
  screenshot?: string;
}

export interface LeadResponse {
  success: boolean;
  emailSent?: boolean;
  message?: string;
}

export const SCORE_MAX: DiagnosisScores = {
  first_impression: 20,
  information_architecture: 20,
  cta_clarity: 20,
  trust: 15,
  navigation: 15,
  improvement_priority: 10,
};

export const SCORE_LABELS: Record<keyof DiagnosisScores, string> = {
  first_impression: '第一印象',
  information_architecture: '情報設計',
  cta_clarity: 'CTAの明確さ',
  trust: '信頼性',
  navigation: 'ナビゲーション',
  improvement_priority: '改善優先度',
};

export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export function getLeadTemperature(result: DiagnosisResult): LeadTemperature {
  if (result.overall_score <= 60 || result.scores.cta_clarity <= 12) return 'Hot';
  if (result.overall_score <= 75) return 'Warm';
  return 'Cold';
}

export const STORAGE_KEY = 'uiux_diagnosis_result';
export const URL_STORAGE_KEY = 'uiux_diagnosis_url';
export const SCREENSHOT_STORAGE_KEY = 'uiux_diagnosis_screenshot';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSiteType(value: unknown): value is SiteType {
  return value === "corporate" || value === "recruitment" || value === "brand" || value === "service" || value === "media";
}

function isDiagnosisScores(value: unknown): value is DiagnosisScores {
  if (!isRecord(value)) return false;
  return typeof value.first_impression === "number"
    && typeof value.information_architecture === "number"
    && typeof value.cta_clarity === "number"
    && typeof value.trust === "number"
    && typeof value.navigation === "number"
    && typeof value.improvement_priority === "number";
}

function isTopPriorityFix(value: unknown): value is TopPriorityFix {
  if (!isRecord(value)) return false;
  return typeof value.title === "string"
    && typeof value.reason === "string"
    && typeof value.suggestion === "string";
}

export function isDiagnosisResult(value: unknown): value is DiagnosisResult {
  if (!isRecord(value)) return false;
  return isSiteType(value.site_type)
    && typeof value.overall_score === "number"
    && isDiagnosisScores(value.scores)
    && typeof value.summary === "string"
    && isStringArray(value.strengths)
    && isStringArray(value.issues)
    && isTopPriorityFix(value.top_priority_fix)
    && isStringArray(value.lead_tags);
}

export function parseDiagnosisResult(value: unknown): DiagnosisResult | null {
  return isDiagnosisResult(value) ? value : null;
}
