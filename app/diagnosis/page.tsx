"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AnalyzeResponse } from "@/lib/types";
import { STORAGE_KEY, URL_STORAGE_KEY, SCREENSHOT_STORAGE_KEY } from "@/lib/types";

export default function DiagnosisPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data: AnalyzeResponse = await res.json();

      if (!data.success || !data.result) {
        setError(data.message || "診断できませんでした。URLを確認して再度お試しください。");
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.result));
      localStorage.setItem(URL_STORAGE_KEY, url);
      if (data.screenshot) {
        localStorage.setItem(SCREENSHOT_STORAGE_KEY, data.screenshot);
      } else {
        localStorage.removeItem(SCREENSHOT_STORAGE_KEY);
      }
      router.push("/result");
    } catch {
      setError("通信エラーが発生しました。しばらく経ってから再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <header className="py-4 px-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-indigo-600">
            UI/UX AI診断
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">サイトURLを入力してください</h1>
            <p className="text-gray-500">
              診断したいサイトのURLを入力すると、AIが自動で診断します
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="mb-6">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                診断するサイトURL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  AIが診断中...（約10〜20秒）
                </>
              ) : (
                <>🚀 無料で診断する</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              クレジットカード不要・登録不要
            </p>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "📸", label: "自動スクリーンショット" },
              { icon: "🤖", label: "AI診断" },
              { icon: "📊", label: "スコア&提案" },
            ].map((item) => (
              <div key={item.label} className="bg-white/60 p-3 rounded-xl text-sm text-gray-600">
                <div className="text-2xl mb-1">{item.icon}</div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
