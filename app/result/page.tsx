"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseDiagnosisResult, type DiagnosisResult } from "@/lib/types";
import { SITE_TYPE_LABELS, STORAGE_KEY, URL_STORAGE_KEY } from "@/lib/types";
import { BrandHeader } from "@/app/components/BrandHeader";
import { GradientLinkButton } from "@/app/components/GradientButton";

function readStoredDiagnosis(): DiagnosisResult | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return parseDiagnosisResult(JSON.parse(raw));
  } catch {
    return null;
  }
}

function readStoredUrl(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(URL_STORAGE_KEY) ?? "";
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 76 ? "#22c55e" : score >= 61 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs text-gray-400">/ 100</div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result] = useState<DiagnosisResult | null>(() => readStoredDiagnosis());
  const [diagUrl] = useState(() => readStoredUrl());

  useEffect(() => {
    if (!result) {
      router.replace("/diagnosis");
    }
  }, [result, router]);

  if (!result) return null;

  const scoreLabel =
    result.overall_score >= 76 ? "良好" :
    result.overall_score >= 61 ? "改善の余地あり" : "要改善";
  const scoreLabelColor =
    result.overall_score >= 76 ? "text-green-600 bg-green-50 border-green-200" :
    result.overall_score >= 61 ? "text-yellow-600 bg-yellow-50 border-yellow-200" :
    "text-red-600 bg-red-50 border-red-200";

  const topIssues = result.issues.slice(0, 2);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)]">
      <BrandHeader
        maxWidthClassName="max-w-xl"
        action={
          <Link href="/diagnosis" className="text-sm font-medium text-[#6e6e6e] transition-colors hover:text-[#5568ff]">
            別のサイトを診断
          </Link>
        }
      />

      <main className="max-w-xl mx-auto px-4 py-12 space-y-4">
        {diagUrl && (
          <p className="text-xs text-gray-400 truncate text-center">{diagUrl}</p>
        )}

        <div className="rounded-[20px] border border-[#e8ecff] bg-white p-8 text-center shadow-[0_16px_38px_rgba(104,118,189,0.12)]">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#8d91bd]">UI/UX診断スコア</p>
          <ScoreCircle score={result.overall_score} />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${scoreLabelColor}`}>
              {scoreLabel}
            </span>
            <span className="rounded-full bg-[#f5f4ff] px-3 py-1.5 text-xs font-medium text-[#6b70a9]">
              {SITE_TYPE_LABELS[result.site_type]}
            </span>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white px-7 py-6 shadow-[0_16px_38px_rgba(104,118,189,0.10)]">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8d91bd]">総合評価</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white px-7 py-6 shadow-[0_16px_38px_rgba(104,118,189,0.10)]">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8d91bd]">主な改善ポイント</h2>
          <ul className="space-y-3">
            {topIssues.map((issue, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {issue}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white px-7 py-8 text-center shadow-[0_16px_38px_rgba(104,118,189,0.10)]">
          <p className="mb-1 text-sm text-[#5f5f5f]">詳細な分析・改善アクションを確認するには</p>
          <p className="mb-6 text-xs text-gray-400">メールアドレスを入力するとレポートURLをお送りします</p>
          <GradientLinkButton href="/form" className="flex w-full rounded-[999px] py-4 text-base">
            詳細レポートをメールで受け取る
          </GradientLinkButton>
        </div>
      </main>
    </div>
  );
}
