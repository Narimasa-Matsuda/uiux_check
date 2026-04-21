"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseDiagnosisResult, type DiagnosisResult } from "@/lib/types";
import { SCREENSHOT_STORAGE_KEY, STORAGE_KEY, URL_STORAGE_KEY } from "@/lib/types";

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
    <div className="min-h-screen bg-gray-50">
      <header className="py-4 px-6 bg-white border-b border-gray-100">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-indigo-600">UI/UX AI診断</Link>
          <Link href="/result" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
            ← 診断結果に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">詳細レポートをメールで受け取る</h1>
          <p className="text-sm text-gray-500">
            スコア内訳・改善ポイント・具体的なアクションをまとめたレポートをお送りします
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Score hint */}
          <div className="flex items-center gap-4 mb-7 p-4 bg-indigo-50 rounded-xl">
            <div className="text-4xl font-bold text-indigo-600 shrink-0">{result.overall_score}</div>
            <div>
              <p className="text-xs text-indigo-400 font-medium mb-0.5">あなたの診断スコア</p>
              <p className="text-sm text-indigo-700 font-semibold">
                詳細レポートで具体的な改善アクションをお届けします
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email — required */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
              />
            </div>

            {/* Company — required */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                会社名 <span className="text-red-500">*</span>
              </label>
              <input
                id="company" type="text" required
                value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="株式会社〇〇" disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
              />
            </div>

            {/* Name — required */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                id="name" type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎" disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "送信中..." : "レポートURLをメールで受け取る →"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              ご入力いただいた情報はレポート送付・改善提案以外の目的には使用しません
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
