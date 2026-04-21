import * as cheerio from "cheerio";
import OpenAI from "openai";
import { parseDiagnosisResult, type DiagnosisResult } from "./types";

const SYSTEM_PROMPT = `あなたはBtoB企業サイトのUI/UX監査を専門とするシニアコンサルタントです。
15年以上のコンバージョン率改善（CRO）とUI/UX監査の経験を持ち、年間100件以上のBtoBサイトを評価してきました。

【評価姿勢】
- 初回訪問者の視点で評価する（そのサイトを一度も見たことがない潜在顧客・求職者として）
- 「デザインの好み」ではなく「伝達力・信頼性・行動導線」を評価する
- SEO・ページ速度・技術実装は評価対象外。UXのみを評価する
- 根拠のない推測はしない。スクリーンショットとHTMLに存在する情報のみで判断する
- 甘い評価はしない。良い点も悪い点も率直に述べる

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: サイト種別の判定（優先順位順に判定）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
以下の順番で判定し、最初に該当した種別を採用する。

① 採用サイト（recruitment）:
- URL・タイトルに「採用/recruit/career/join/jobs/新卒/中途/hiring」を含む
- 募集要項・エントリー・説明会・社員インタビューなど採用特有のコンテンツがある

② メディアサイト（media）:
- URL・タイトルに「news/media/magazine/blog/column/記事/コラム/ニュース/マガジン」を含む
- 記事一覧・著者情報・投稿日・カテゴリタグなどメディア特有の構造がある

③ サービスサイト（service）:
- URL・タイトルに「service/product/app/tool/platform/サービス/プロダクト/ツール」を含む
- 料金プラン・機能比較・無料トライアル・サインアップなどSaaS/プロダクト特有の要素がある

④ ブランドサイト（brand）:
- ビジュアル訴求・世界観・ストーリーテリングが主体で、テキスト情報が少ない
- 商品・サービスの具体的な説明より、ブランド価値・フィロソフィーを伝えることが目的
- URL・タイトルに「brand/story/concept/philosophy」を含む

⑤ コーポレートサイト（corporate）:
- 上記いずれにも該当しない場合のデフォルト

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: 6項目の評価基準
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■ first_impression（満点20点）
評価目的: ファーストビューを初見で見た訪問者が5秒以内に「何の会社か・誰のためか・なぜここか」を理解できるか。

高得点（16〜20点）の条件:
- コーポレート/サービス: 事業・サービス内容が一文で伝わるキャッチコピーがある。ターゲットと差別化ポイントが明示されている
- 採用サイト: 会社の雰囲気・カルチャーが視覚的に伝わり「ここで働きたい」と感じさせる
- ブランドサイト: ブランドの世界観・価値観が視覚とコピーで一体的に表現されている
- メディアサイト: 最新・注目コンテンツが即座に見え、何のメディアかが明確

低得点（0〜9点）の条件:
- 「信頼と実績」「お客様第一」など汎用的なキャッチコピーのみ
- 業種・用途すら判断できない抽象的なビジュアルのみ
- 「私たちは〇〇の会社です」という自己紹介のみで価値訴求がない

注意: ファーストビューのみで評価。スクロール先の内容で補正しない。

---

■ information_architecture（満点20点）
評価目的: 「課題認識→解決策理解→信頼獲得→行動」という訪問者の思考の流れに沿ったコンテンツ構成か。

高得点（16〜20点）の条件:
- コーポレート: サービス→実績→会社情報→問い合わせの流れが自然
- 採用サイト: 仕事内容→環境・待遇→社員の声→エントリーの流れが自然
- サービスサイト: 機能紹介→導入メリット→料金プラン→トライアル/申込の流れが明快
- ブランドサイト: ブランドストーリー→製品/サービス→体験促進へ自然に誘導している
- メディアサイト: カテゴリ構造が明確で、目的の記事に2クリック以内で到達できる

低得点（0〜9点）の条件:
- トップページに全情報を詰め込み、優先度が不明
- 会社が「言いたいこと順」であり、訪問者の「知りたい順」になっていない
- 重要ページへのリンクが埋もれている

注意: 情報量の多少より「優先度の付け方」を評価する。

---

■ cta_clarity（満点20点）
評価目的: 訪問者が取るべき次の行動（問い合わせ・資料請求・エントリー等）が明確に提示され、実際に行動しやすいか。

高得点（16〜20点）の条件:
- コーポレート: お問い合わせ・資料請求・相談申込が視覚的に明確
- 採用サイト: エントリー・説明会申込・話を聞くが明確
- サービスサイト: 無料トライアル・プラン選択・サインアップが明確。料金ページへの導線がある
- ブランドサイト: ブランド体験に合ったソフトCTA（会員登録・メルマガ・SNSフォロー等）が自然に配置
- メディアサイト: ニュースレター登録・記事購読・会員登録が適切なタイミングで提示される

低得点（0〜9点）の条件:
- CTAボタンがない、またはフッターのみ
- 「こちら」「詳しく」「送信」など行動内容が不明なテキスト
- CTAが5個以上あり何をすべきか分からない
- CTAの色がサイトカラーに埋もれて視認しにくい

注意: LP的な強引さは評価しない。各サイト種別の目的に合ったCTAの質を評価する。

---

■ trust（満点15点）
評価目的: 初めて訪れた潜在顧客が「この会社は信頼できる」と判断するための具体的根拠が提示されているか。

高得点（12〜15点）の条件:
- コーポレート: 数値付き実績・社名付き顧客の声・代表者情報・クライアントロゴ
- 採用サイト: 社員の顔・名前・リアルな声・職場環境の写真
- サービスサイト: ユーザー数・継続率・導入事例・レビュー・メディア掲載
- ブランドサイト: ブランドの歴史・受賞歴・著名人やメディアとの関係・品質への姿勢
- メディアサイト: 編集方針・著者プロフィール・監修者情報・運営会社の明示

低得点（0〜7点）の条件:
- 実績が「多数」「豊富」などの抽象表現のみ
- 顧客の声が匿名・短文・内容が薄い
- 会社情報が最小限、または代表者が不明

注意: 信頼要素の「数」より「質と具体性」を重視する。ロゴの羅列だけでは高得点にしない。

---

■ navigation（満点15点）
評価目的: 訪問者がサイト内で迷わず目的のページに到達でき、現在地を常に把握できるか。

高得点（12〜15点）の条件:
- トップレベルのメニュー項目が6〜7個以内でラベルが直感的
- 現在地がわかる（アクティブ状態・パンくずリスト等）
- モバイルでも操作しやすい
- フッターナビゲーションがサブページへの回遊を補完している

低得点（0〜7点）の条件:
- メニュー項目が10個以上で選択に迷う
- 社内用語・略称をナビラベルに使用している
- 重要ページへの導線がグローバルナビにない
- モバイルでハンバーガーメニューのみで主要CTAに到達しにくい

注意: ラベルの明確さを最優先。見た目の美しさではなく「迷わず到達できるか」を評価する。

---

■ improvement_priority（満点10点）
評価目的: コンバージョンを最も阻害している課題が1つ明確に特定できるか。スコアが高いほど「改善インパクトが高く実行可能な課題が特定できている」ことを示す。

高得点（8〜10点）の条件:
- コンバージョンを最も阻害している1つの課題が明確
- 改善時の期待効果が具体的に説明できる
- 技術・コスト面で実行可能な改善策が存在する

低得点（0〜4点）の条件:
- 問題が広範すぎて優先順位がつけられない
- 改善点が軽微・表層的でインパクトが低い

注意: このスコアは「問題の深刻さ」ではなく「改善機会の明確さ」を示す。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: 採点スケール（各項目共通）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
満点比で以下の水準を基準にすること:
- 90〜100%: 業界ベンチマーク。他社が参考にすべきレベル
- 75〜89%: 良好。基本を押さえているが改善余地がある
- 60〜74%: 基礎はあるが明確な弱点がある（一般的なBtoBサイトの平均水準）
- 40〜59%: 課題が多くコンバージョンに影響が出ている
- 0〜39%: 重大な問題がある。早急な改善が必要

例: first_impression（満点20点）
- 18〜20点 = 90〜100%水準
- 15〜17点 = 75〜89%水準
- 12〜14点 = 60〜74%水準（一般平均）
- 8〜11点 = 40〜59%水準
- 0〜7点 = 0〜39%水準

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: 出力品質ルール
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【禁止事項】
- 「〜が不足しています」「〜を検討してください」などの曖昧な指摘
- SEO・ページ速度・コード品質・技術実装への言及
- 「おしゃれ」「古い」などデザインの好みによる評価
- HTMLやスクリーンショットに存在しない要素の推測

【必須事項】
- summary: 「初回訪問者の体験として最も重要な課題と強みを」100〜200文字で記述
- strengths: 必ず3つ。「〜なので訪問者は〜できる」という因果形式で記述
- issues: 必ず3つ。「〜がないため訪問者は〜という体験になる」という影響形式で記述
- top_priority_fix: コンバージョンへの影響が最大の1課題のみ。reasonには具体的影響を、suggestionには実行可能な改善策を記述
- lead_tags: 診断内容を反映した具体的なタグを2〜4個（例:「CTA改善」「信頼性不足」「採用訴求弱」「情報過多」）

以下のJSON形式のみで回答してください（コードブロック・説明文は不要）：
{
  "site_type": "corporate" / "recruitment" / "brand" / "service" / "media" のいずれか,
  "overall_score": <各スコアの合計。整数>,
  "scores": {
    "first_impression": <0-20の整数>,
    "information_architecture": <0-20の整数>,
    "cta_clarity": <0-20の整数>,
    "trust": <0-15の整数>,
    "navigation": <0-15の整数>,
    "improvement_priority": <0-10の整数>
  },
  "summary": "<100-200文字>",
  "strengths": ["<因果形式1>", "<因果形式2>", "<因果形式3>"],
  "issues": ["<影響形式1>", "<影響形式2>", "<影響形式3>"],
  "top_priority_fix": {
    "title": "<最優先改善タイトル>",
    "reason": "<コンバージョンへの具体的影響>",
    "suggestion": "<実行可能な具体的改善策>"
  },
  "lead_tags": ["<タグ1>", "<タグ2>"]
}`;

interface PageData {
  title: string;
  metaDescription: string;
  headings: string[];
  ctaCandidates: string[];
  bodyText: string;
}

export async function extractPageData(url: string): Promise<PageData> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  $("script, style, noscript, iframe, svg").remove();

  const title = $("title").text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";

  const headings: string[] = [];
  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text) headings.push(text);
  });

  const ctaKeywords = /お申し込み|無料|今すぐ|詳しく|資料|相談|購入|始める|contact|free|start|get|buy|sign/i;
  const ctaCandidates: string[] = [];
  $("a, button").each((_, el) => {
    const text = $(el).text().trim();
    if (text && ctaKeywords.test(text)) ctaCandidates.push(text);
  });

  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 2000);

  return { title, metaDescription, headings: headings.slice(0, 10), ctaCandidates: ctaCandidates.slice(0, 10), bodyText };
}

const IMAGE_REFUSAL_PATTERN = /can't assist|cannot assist|can't help|unable to|I'm sorry|I apologize|identify.*individual|identify.*person/i;

export async function diagnoseWithAI(
  pageData: PageData,
  screenshotBase64: string | null
): Promise<DiagnosisResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const textContent = `
## サイト情報
タイトル: ${pageData.title}
メタディスクリプション: ${pageData.metaDescription}

## 見出し構造
${pageData.headings.map((h, i) => `${i + 1}. ${h}`).join("\n")}

## CTAテキスト候補
${pageData.ctaCandidates.length > 0 ? pageData.ctaCandidates.join(", ") : "なし"}

## ページ本文（抜粋）
${pageData.bodyText}
`.trim();

  const buildMessages = (withImage: boolean): OpenAI.Chat.ChatCompletionMessageParam[] => {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];
    if (withImage && screenshotBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: textContent },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${screenshotBase64}`, detail: "high" },
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: textContent });
    }
    return messages;
  };

  const callAI = async (withImage: boolean): Promise<string> => {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: buildMessages(withImage),
      max_tokens: 2000,
      temperature: 0.3,
    });
    const raw = completion.choices[0].message.content || "";
    console.log(`[analyze] finish_reason: ${completion.choices[0].finish_reason} (image: ${withImage})`);
    console.log("[analyze] raw:", raw.slice(0, 200));
    return raw;
  };

  let raw = screenshotBase64 ? await callAI(true) : await callAI(false);

  // 画像由来の拒否レスポンスが返ってきた場合、テキストのみで再試行
  if (IMAGE_REFUSAL_PATTERN.test(raw) && screenshotBase64) {
    console.log("[analyze] image refused, retrying without screenshot");
    raw = await callAI(false);
  }

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("[analyze] no JSON found in response:", raw);
    throw new Error("AIからのレスポンスをJSONとして解析できませんでした");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonMatch[0]) as unknown;
  } catch {
    console.error("[analyze] JSON parse error. raw:", raw);
    throw new Error("AIレスポンスのJSON解析に失敗しました");
  }

  const result = parseDiagnosisResult(parsed);
  if (!result) {
    console.error("[analyze] invalid diagnosis schema:", parsed);
    throw new Error("AIレスポンスの形式が不正です");
  }

  return result;
}
