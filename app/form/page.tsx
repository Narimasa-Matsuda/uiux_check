"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseDiagnosisResult, type DiagnosisResult } from "@/lib/types";
import { SCREENSHOT_STORAGE_KEY, STORAGE_KEY, URL_STORAGE_KEY } from "@/lib/types";
import { BrandHeader } from "@/app/components/BrandHeader";
import { gradientButtonClassName, gradientButtonStyle } from "@/app/components/GradientButton";

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

function readStoredValue(key: string): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) ?? "";
}

export default function FormPage() {
  const router = useRouter();
  const [result] = useState<DiagnosisResult | null>(() => readStoredDiagnosis());
  const [diagnosedUrl] = useState(() => readStoredValue(URL_STORAGE_KEY));
  const [screenshot] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(SCREENSHOT_STORAGE_KEY);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!result) {
      router.replace("/diagnosis");
    }
  }, [result, router]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!result) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, name, diagnosedUrl, result, screenshot: screenshot || undefined }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "送信に失敗しました");
        return;
      }
      router.push("/thanks");
    } catch {
      setError("通信エラーが発生しました。しばらくしてから再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)]">
      <BrandHeader
        maxWidthClassName="max-w-xl"
        action={
          <Link href="/result" className="text-sm font-medium text-[#6e6e6e] transition-colors hover:text-[#5568ff]">
            診断結果に戻る
          </Link>
        }
      />

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-[2rem] font-black tracking-[-0.05em] text-[#252525]">詳細レポートをメールで受け取る</h1>
          <p className="text-sm leading-7 text-[#5f5f5f]">
            スコア内訳・改善ポイント・具体的なアクションをまとめたレポートをお送りします
          </p>
        </div>

        <div className="rounded-[20px] border border-[#e8ecff] bg-white p-8 shadow-[0_16px_38px_rgba(104,118,189,0.12)]">
          <div className="mb-7 flex items-center gap-4 rounded-[18px] bg-[#f5f4ff] p-4">
            <div className="shrink-0 text-4xl font-black text-[#5568ff]">{result.overall_score}</div>
            <div>
              <p className="mb-0.5 text-xs font-semibold text-[#7f83c4]">あなたの診断スコア</p>
              <p className="text-sm font-semibold text-[#4955b7]">
                詳細レポートで具体的な改善アクションをお届けします
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#535353]">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" disabled={loading}
                className="w-full rounded-[16px] border border-[#dfe4ff] px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#6f76ff] disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="company" className="mb-1.5 block text-sm font-semibold text-[#535353]">
                会社名 <span className="text-red-500">*</span>
              </label>
              <input
                id="company" type="text" required
                value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="株式会社〇〇" disabled={loading}
                className="w-full rounded-[16px] border border-[#dfe4ff] px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#6f76ff] disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[#535353]">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                id="name" type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎" disabled={loading}
                className="w-full rounded-[16px] border border-[#dfe4ff] px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#6f76ff] disabled:bg-gray-50"
              />
            </div>

            {error && (
              <div className="rounded-[16px] border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className={`${gradientButtonClassName} mt-2 flex w-full rounded-[999px] py-4 text-base`}
              style={gradientButtonStyle}
            >
              {loading ? "送信中..." : "レポートURLをメールで受け取る"}
            </button>

            <p className="text-center text-xs text-gray-400">
              ご入力いただいた情報はレポート送付・改善提案以外の目的には使用しません
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
