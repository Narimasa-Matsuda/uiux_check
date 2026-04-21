import type { AnalyzeRequest, AnalyzeResponse, DiagnosisResult } from "@/lib/types";

const DUMMY_RESULT: DiagnosisResult = {
  site_type: "corporate",
  overall_score: 62,
  scores: {
    first_impression: 12,
    information_architecture: 13,
    cta_clarity: 11,
    trust: 10,
    navigation: 10,
    improvement_priority: 6,
  },
  summary:
    "全体的にシンプルなデザインで情報は伝わりますが、訪問者が行動を起こすための動線が不明確です。特にCTAボタンの視認性とファーストビューの訴求力に改善余地があります。信頼性を高める要素（実績・お客様の声）を追加することで、コンバージョン率の向上が期待できます。",
  strengths: [
    "シンプルで読みやすいレイアウト構成",
    "明確な見出し階層で情報が整理されている",
    "ページの読み込み速度が速く、ユーザー体験を損なっていない",
  ],
  issues: [
    "ファーストビューにCTAボタンが見当たらず、行動を促すきっかけが少ない",
    "お客様の声・実績などの信頼性を高める要素が不足している",
    "スマートフォン表示でのボタンが小さく、タップしにくい可能性がある",
  ],
  top_priority_fix: {
    title: "ファーストビューにCTAを追加する",
    reason:
      "訪問者の70%以上がファーストビューだけでページを離脱します。最初に目に入るエリアに明確な行動喚起がないと、そのままページを去ってしまいます。",
    suggestion:
      'ヒーローセクションに「今すぐ無料相談」「資料ダウンロード」などのCTAボタンを目立つ色（例：オレンジ・緑）で配置してください。ボタンテキストには数字や限定性を含めると効果的です（例：「3分で無料診断」）。',
  },
  lead_tags: ["CTA弱い", "信頼性不足", "UI改善余地あり"],
};

function isValidUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: AnalyzeRequest = await request.json();
    const { url } = body;

    if (!url || !isValidUrl(url)) {
      const res: AnalyzeResponse = { success: false, message: "有効なURLを入力してください" };
      return Response.json(res, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      const res: AnalyzeResponse = { success: true, result: DUMMY_RESULT };
      return Response.json(res);
    }

    const { extractPageData, diagnoseWithAI } = await import("@/lib/analyze");
    const { takeScreenshot } = await import("@/lib/screenshot");

    const [pageData, screenshotResult] = await Promise.all([
      extractPageData(url).catch((err) => {
        console.error("[analyze] page fetch failed:", err);
        return null;
      }),
      takeScreenshot(url).catch((err) => {
        console.error("[analyze] screenshot failed:", err);
        return { screenshot: null, renderedText: null };
      }),
    ]);

    if (!pageData) {
      const res: AnalyzeResponse = {
        success: false,
        message: "ページを取得できませんでした。URLが正しいか確認してください。",
      };
      return Response.json(res, { status: 422 });
    }

    // SPAなどでcheerioのテキストが薄い場合はPlaywrightの描画済みテキストで補完
    const THIN_THRESHOLD = 200;
    if (screenshotResult?.renderedText && pageData.bodyText.length < THIN_THRESHOLD) {
      console.log("[analyze] thin HTML detected, using rendered text from Playwright");
      pageData.bodyText = screenshotResult.renderedText;
    }

    const result = await diagnoseWithAI(pageData, screenshotResult?.screenshot ?? null);

    const { saveHistory } = await import("@/lib/history");
    saveHistory(url, result);

    const res: AnalyzeResponse = {
      success: true,
      result,
      ...(screenshotResult?.screenshot ? { screenshot: screenshotResult.screenshot } : {}),
    };
    return Response.json(res);
  } catch (err) {
    console.error("[analyze] error:", err);
    const res: AnalyzeResponse = { success: false, message: "診断できませんでした" };
    return Response.json(res, { status: 500 });
  }
}
