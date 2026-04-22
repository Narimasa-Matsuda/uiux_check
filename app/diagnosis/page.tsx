"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalyzeResponse } from "@/lib/types";
import { STORAGE_KEY, URL_STORAGE_KEY, SCREENSHOT_STORAGE_KEY } from "@/lib/types";
import { BrandHeader } from "@/app/components/BrandHeader";
import { gradientButtonClassName, gradientButtonStyle } from "@/app/components/GradientButton";

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
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)]">
      <BrandHeader maxWidthClassName="max-w-5xl" />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <p className="mx-auto mb-4 inline-flex rounded-full bg-[#f7f5ff] px-4 py-1">
              <span
                className="bg-clip-text text-[0.86rem] font-black text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #9a4dff 0%, #2f9bff 100%)" }}
              >
                START DIAGNOSIS
              </span>
            </p>
            <h1 className="mb-3 text-3xl font-black tracking-[-0.05em] text-[#252525]">サイトURLを入力してください</h1>
            <p className="text-[1rem] leading-7 text-[#5f5f5f]">
              診断したいサイトのURLを入力すると、AIが自動で診断します
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[20px] border border-[#e8ecff] bg-white p-8 shadow-[0_16px_38px_rgba(104,118,189,0.12)]"
          >
            <div className="mb-6">
              <label htmlFor="url" className="mb-2 block text-sm font-semibold text-[#535353]">
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
                className="w-full rounded-[16px] border border-[#dfe4ff] px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#6f76ff] disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-[16px] border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !url}
              className={`${gradientButtonClassName} flex w-full gap-3 rounded-[999px] py-4 text-lg`}
              style={gradientButtonStyle}
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
                <>無料診断を行う</>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              クレジットカード不要・登録不要
            </p>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "自動スクリーンショット" },
              { label: "AI診断" },
              { label: "スコアと提案" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[16px] border border-[#e8ecff] bg-white/80 p-4 text-sm font-medium text-[#5f5f5f] shadow-[0_10px_26px_rgba(104,118,189,0.08)]"
              >
                <div
                  className="mx-auto mb-3 h-2.5 w-16 rounded-full"
                  style={{ background: "linear-gradient(90deg, #8b46ff 0%, #2f9bff 100%)" }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
