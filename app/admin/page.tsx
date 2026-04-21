"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/history";
import type { LeadEntry } from "@/lib/leads";
import { SITE_TYPE_LABELS } from "@/lib/types";

type Tab = "history" | "leads";

const TEMP_CONFIG = {
  Hot: { label: "Hot", colorClass: "bg-red-100 text-red-700" },
  Warm: { label: "Warm", colorClass: "bg-yellow-100 text-yellow-700" },
  Cold: { label: "Cold", colorClass: "bg-green-100 text-green-700" },
};

const SCORE_LABELS: Record<string, string> = {
  first_impression: "第一印象",
  information_architecture: "情報設計",
  cta_clarity: "CTA",
  trust: "信頼性",
  navigation: "ナビゲーション",
  improvement_priority: "改善優先度",
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 76 ? "text-green-600" : score >= 61 ? "text-yellow-600" : "text-red-600";
  return <span className={`text-2xl font-bold ${color}`}>{score}</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMonth(key: string) {
  const [y, m] = key.split("-");
  return `${y}年${Number(m)}月`;
}

type LeadEntryNoScreenshot = Omit<LeadEntry, "screenshot">;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("history");

  // History state
  const [historyMonths, setHistoryMonths] = useState<string[]>([]);
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Leads state
  const [leadMonths, setLeadMonths] = useState<string[]>([]);
  const [selectedLeadMonth, setSelectedLeadMonth] = useState<string | null>(null);
  const [leads, setLeads] = useState<LeadEntryNoScreenshot[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const [histRes, leadRes] = await Promise.all([
        fetch("/api/admin/history", { headers: { "x-admin-password": password } }),
        fetch("/api/admin/leads", { headers: { "x-admin-password": password } }),
      ]);
      if (histRes.status === 401) { setError("パスワードが違います"); return; }
      const [histData, leadData] = await Promise.all([histRes.json(), leadRes.json()]);
      const hMonths: string[] = histData.months ?? [];
      const lMonths: string[] = leadData.months ?? [];
      setHistoryMonths(hMonths);
      setLeadMonths(lMonths);
      setAuthed(true);
      if (hMonths.length > 0) fetchHistoryMonth(hMonths[0], password);
      if (lMonths.length > 0) fetchLeadsMonth(lMonths[0], password);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistoryMonth(month: string, pw = password) {
    setLoading(true);
    setExpanded(null);
    try {
      const res = await fetch(`/api/admin/history?month=${month}`, {
        headers: { "x-admin-password": pw },
      });
      const data = await res.json();
      setSelectedHistoryMonth(month);
      setHistory(data.history ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLeadsMonth(month: string, pw = password) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?month=${month}`, {
        headers: { "x-admin-password": pw },
      });
      const data = await res.json();
      setSelectedLeadMonth(month);
      setLeads(data.leads ?? []);
    } finally {
      setLoading(false);
    }
  }

  const activeMonths = tab === "history" ? historyMonths : leadMonths;
  const selectedMonth = tab === "history" ? selectedHistoryMonth : selectedLeadMonth;

  function handleMonthClick(m: string) {
    if (tab === "history") fetchHistoryMonth(m);
    else fetchLeadsMonth(m);
  }

  function handleRefresh() {
    if (tab === "history" && selectedHistoryMonth) fetchHistoryMonth(selectedHistoryMonth);
    else if (tab === "leads" && selectedLeadMonth) fetchLeadsMonth(selectedLeadMonth);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900">管理者ログイン</h1>
            <p className="text-gray-500 text-sm mt-1">診断履歴の閲覧には認証が必要です</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">管理者パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-gray-900"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "確認中..." : "ログイン"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-48 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setTab("history")}
            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
              tab === "history"
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            診断履歴
          </button>
          <button
            onClick={() => setTab("leads")}
            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
              tab === "leads"
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            リード一覧
          </button>
        </div>

        {/* Month list */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">月を選択</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {activeMonths.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">データなし</p>
          ) : (
            activeMonths.map((m) => (
              <button
                key={m}
                onClick={() => handleMonthClick(m)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                  selectedMonth === m
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {formatMonth(m)}
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {tab === "history" ? "診断履歴" : "リード一覧"}
              {selectedMonth ? ` — ${formatMonth(selectedMonth)}` : ""}
            </h1>
            <p className="text-sm text-gray-500">
              {tab === "history" ? `${history.length}件` : `${leads.length}件`}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading || !selectedMonth}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
          >
            {loading ? "読込中..." : "🔄 更新"}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {!selectedMonth ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">👈</div>
              <p>月を選択してください</p>
            </div>
          ) : loading ? (
            <div className="text-center py-20 text-gray-400">読み込み中...</div>
          ) : tab === "history" ? (
            history.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p>この月の履歴はありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry) => {
                  const tc = TEMP_CONFIG[entry.lead_temperature];
                  const isOpen = expanded === entry.id;
                  return (
                    <div key={entry.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <button
                        className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                        onClick={() => setExpanded(isOpen ? null : entry.id)}
                      >
                        <div className="shrink-0 w-14 text-center">
                          <ScoreBadge score={entry.overall_score} />
                          <div className="text-xs text-gray-400">/ 100</div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tc.colorClass}`}>
                              {tc.label}
                            </span>
                            {entry.lead_tags.map((tag) => (
                              <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm font-medium text-gray-800 truncate">{entry.url}</p>
                          <p className="text-xs text-gray-400">{formatDate(entry.timestamp)}</p>
                        </div>

                        <span className="text-gray-400 shrink-0 text-xs">{isOpen ? "▲" : "▼"}</span>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">スコア内訳</p>
                              <div className="space-y-1 text-sm">
                                {Object.entries(entry.scores).map(([k, v]) => (
                                  <div key={k} className="flex justify-between">
                                    <span className="text-gray-600">{SCORE_LABELS[k] ?? k}</span>
                                    <span className="font-medium text-gray-800">{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">改善点</p>
                              <ul className="space-y-1">
                                {entry.issues.map((issue, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex gap-1.5">
                                    <span className="text-red-400 shrink-0">!</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">最優先改善</p>
                              <p className="text-sm font-medium text-gray-800 mb-1">{entry.top_priority_fix.title}</p>
                              <p className="text-xs text-gray-500 leading-relaxed">{entry.top_priority_fix.suggestion}</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">総合評価</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{entry.summary}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Leads tab */
            leads.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p>この月のリードはありません</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">日時</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">会社名</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">担当者</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">メール</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">サイト種別</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">スコア</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">診断URL</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => {
                      const score = lead.result.overall_score;
                      const scoreColor =
                        score >= 76 ? "text-green-600" : score >= 61 ? "text-yellow-600" : "text-red-600";
                      const siteLabel =
                        SITE_TYPE_LABELS[lead.result.site_type] ?? lead.result.site_type;
                      return (
                        <tr
                          key={lead.token}
                          className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                            i % 2 === 0 ? "" : "bg-gray-50/30"
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {formatDate(lead.timestamp)}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800">{lead.company}</td>
                          <td className="px-4 py-3 text-gray-600">{lead.name}</td>
                          <td className="px-4 py-3 text-gray-600">
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-indigo-600 hover:underline"
                            >
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                              {siteLabel}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-right font-bold ${scoreColor}`}>{score}</td>
                          <td className="px-4 py-3 max-w-[180px]">
                            <a
                              href={lead.diagnosedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-indigo-600 truncate block text-xs"
                            >
                              {lead.diagnosedUrl}
                            </a>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a
                              href={`/detail?token=${lead.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:underline font-medium"
                            >
                              詳細 →
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
