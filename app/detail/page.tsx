"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { parseDiagnosisResult, type DiagnosisResult } from "@/lib/types";
import { SCORE_LABELS, SCORE_MAX, SITE_TYPE_LABELS } from "@/lib/types";
import { BrandHeader } from "@/app/components/BrandHeader";
import { gradientButtonClassName, gradientButtonStyle } from "@/app/components/GradientButton";

const CONSULT_URL = process.env.NEXT_PUBLIC_CONSULT_URL ?? "/form";

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  const barColor = pct >= 75 ? "bg-green-500" : pct >= 55 ? "bg-yellow-500" : "bg-red-500";
  const textColor = pct >= 75 ? "text-green-600" : pct >= 55 ? "text-yellow-600" : "text-red-600";
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-bold ${textColor} w-14 text-right shrink-0`}>
        {value}<span className="text-xs text-gray-400 font-normal">/{max}</span>
      </span>
    </div>
  );
}

interface DetailData {
  diagnosedUrl: string;
  result: DiagnosisResult;
  screenshot: string | null;
}

function isDetailData(value: unknown): value is DetailData {
  if (typeof value !== "object" || value === null) return false;
  const maybe = value as Record<string, unknown>;
  return typeof maybe.diagnosedUrl === "string"
    && (typeof maybe.screenshot === "string" || maybe.screenshot === null)
    && parseDiagnosisResult(maybe.result) !== null;
}

function DetailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [data, setData] = useState<DetailData | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ok">(
    token ? "loading" : "error"
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetch(`/api/detail?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((json: unknown) => {
        if (!isDetailData(json) || cancelled) throw new Error("invalid data");
        setData(json);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)]">
        <p className="text-[#6e6e6e]">読み込み中...</p>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)] px-4">
        <div className="rounded-[20px] border border-[#e8ecff] bg-white px-8 py-10 text-center shadow-[0_16px_38px_rgba(104,118,189,0.12)]">
          <p className="mx-auto mb-4 inline-flex rounded-full bg-[#f7f5ff] px-4 py-1 text-[0.82rem] font-black text-[#7266ff]">
            REPORT ERROR
          </p>
          <h1 className="mb-2 text-xl font-black tracking-[-0.04em] text-gray-900">レポートが見つかりません</h1>
          <p className="mb-6 text-sm text-[#5f5f5f]">URLが正しいかご確認ください。</p>
          <Link href="/diagnosis" className="text-sm font-medium text-[#5568ff] transition-colors hover:text-[#395ff5]">
            新しく診断する
          </Link>
        </div>
      </div>
    );
  }

  const { result, diagnosedUrl, screenshot } = data;
  const scoreColor =
    result.overall_score >= 76 ? "text-green-600" :
    result.overall_score >= 61 ? "text-yellow-500" : "text-red-500";
  const strengths = result.strengths.slice(0, 3);
  const issues = result.issues.slice(0, 3);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)]">
      <BrandHeader maxWidthClassName="max-w-3xl" />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-start gap-6 rounded-[20px] border border-[#e8ecff] bg-white p-7 shadow-[0_16px_38px_rgba(104,118,189,0.12)]">
          <div className="flex-1 min-w-0">
            <h1 className="mb-1 text-2xl font-black tracking-[-0.05em] text-gray-900">詳細分析レポート</h1>
            {diagnosedUrl && (
              <p className="text-xs text-gray-400 truncate mb-5">{diagnosedUrl}</p>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-end gap-2">
                <span className={`text-6xl font-bold leading-none ${scoreColor}`}>{result.overall_score}</span>
                <span className="text-gray-400 text-sm mb-1">/ 100</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                {SITE_TYPE_LABELS[result.site_type]}
              </span>
            </div>
          </div>
          {screenshot && (
            <div className="shrink-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm w-44 h-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/jpeg;base64,${screenshot}`}
                alt="診断対象サイト"
                className="w-full h-full object-cover object-top"
              />
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white px-7 py-6 shadow-[0_16px_38px_rgba(104,118,189,0.10)]">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-[#8d91bd]">スコア内訳</h2>
          <div className="space-y-3">
            {(Object.keys(SCORE_LABELS) as Array<keyof typeof SCORE_LABELS>).map((key) => (
              <ScoreBar key={key} label={SCORE_LABELS[key]} value={result.scores[key]} max={SCORE_MAX[key]} />
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white px-7 py-6 shadow-[0_16px_38px_rgba(104,118,189,0.10)]">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8d91bd]">良い点</h2>
          <ul className="space-y-3">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white px-7 py-6 shadow-[0_16px_38px_rgba(104,118,189,0.10)]">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8d91bd]">改善点</h2>
          <ul className="space-y-3">
            {issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{issue}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-[20px] p-7 text-white shadow-[0_18px_42px_rgba(84,98,199,0.24)]"
          style={{ background: "linear-gradient(135deg, #7d42ff 0%, #3c8dff 100%)" }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/75">最優先改善</p>
          <h2 className="mb-5 text-xl font-black tracking-[-0.04em]">{result.top_priority_fix.title}</h2>
          <div className="space-y-4">
            <div className="rounded-[16px] bg-white/12 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/75">改善理由</p>
              <p className="text-white/90 text-sm leading-relaxed">{result.top_priority_fix.reason}</p>
            </div>
            <div className="rounded-[16px] bg-white/12 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/75">具体的な改善アクション</p>
              <p className="text-white/90 text-sm leading-relaxed">{result.top_priority_fix.suggestion}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white p-8 text-center shadow-[0_16px_38px_rgba(104,118,189,0.10)]">
          <h2 className="mb-2 text-xl font-black tracking-[-0.04em] text-gray-900">無料で改善相談する</h2>
          <p className="mb-7 text-sm leading-relaxed text-[#5f5f5f]">
            診断結果をもとに、具体的な改善案をご提案します
          </p>
          <a
            href={CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${gradientButtonClassName} rounded-[999px] px-10 py-4 text-base`}
            style={gradientButtonStyle}
          >
            無料で改善相談する
          </a>
        </div>

      </main>
    </div>
  );
}

export default function DetailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)]">
        <p className="text-[#6e6e6e]">読み込み中...</p>
      </div>
    }>
      <DetailContent />
    </Suspense>
  );
}
