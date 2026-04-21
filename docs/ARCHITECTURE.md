# UI/UX AI診断システム — アーキテクチャドキュメント

## 概要

WebサイトのURLを入力するだけでUI/UXを自動診断し、メール経由で詳細レポートを届けながら営業リードを獲得するシステム。

## ユーザーフロー

```
/ (LP)
  ↓
/diagnosis (URL入力)
  ↓ POST /api/analyze
/result (簡易結果: スコア・サマリー・改善点2件)
  ↓
/form (メールアドレス・会社名・名前を入力)
  ↓ POST /api/lead → メール送信 + Zoho CRM登録
/thanks (メール送信完了)
  ↓ メール内リンク
/detail?token=xxxxx (詳細レポート: サーバーからトークンで取得)
  ↓
外部相談フォーム (NEXT_PUBLIC_CONSULT_URL)
```

## 画面構成

| パス | 種別 | 概要 |
|------|------|------|
| `/` | Server | ランディングページ |
| `/diagnosis` | Client | URL入力フォーム |
| `/result` | Client | 簡易結果（スコア・サマリー・改善点2件のみ） |
| `/form` | Client | リード獲得フォーム（メール必須・会社名・名前） |
| `/thanks` | Server | メール送信完了画面 |
| `/detail?token=` | Client | 詳細診断レポート（トークン認証） |
| `/admin` | Client | 管理者画面（月別履歴閲覧） |

## ページ間のデータフロー

```
/diagnosis
  → POST /api/analyze
  → localStorage.set(result, url, screenshot)
  → navigate /result

/result
  → localStorage.get(result)
  → スコア・サマリー・改善点2件を表示

/form
  → localStorage.get(result, url, screenshot)
  → POST /api/lead { email, company, name, diagnosedUrl, result, screenshot }
  → navigate /thanks

/detail?token=xxxxx
  → GET /api/detail?token=xxxxx
  → 詳細レポートを表示（localStorage不要）
```

## API設計

### POST /api/analyze

**リクエスト**
```json
{ "url": "https://example.com" }
```

**処理フロー**
1. URLバリデーション
2. `OPENAI_API_KEY` 未設定 → ダミーデータを返す（開発用）
3. HTML取得（cheerio）+ スクリーンショット・レンダリング済みテキスト（Playwright）を並列実行
4. SPA等でcheerioのテキストが200文字未満の場合、Playwrightの描画済みテキストで補完
5. OpenAI gpt-4o にテキスト + 画像を送信（サイト種別自動判定 + 診断）
   - 画像に人物が含まれ拒否された場合、テキストのみで自動リトライ
5. `.data/YYYY-MM.json` に履歴保存
6. JSON診断結果 + base64スクリーンショットを返す

**レスポンス**
```json
{
  "success": true,
  "screenshot": "<base64 JPEG>",
  "result": {
    "site_type": "corporate",
    "overall_score": 58,
    "scores": { "first_impression": 11, "information_architecture": 12, ... },
    "summary": "...",
    "strengths": ["...", "...", "..."],
    "issues": ["...", "...", "..."],
    "top_priority_fix": { "title": "...", "reason": "...", "suggestion": "..." },
    "lead_tags": ["CTA弱い", "信頼性不足"]
  }
}
```

### POST /api/lead

**リクエスト**
```json
{
  "email": "test@example.com",
  "company": "株式会社〇〇",
  "name": "山田太郎",
  "diagnosedUrl": "https://example.com",
  "result": { ... },
  "screenshot": "<base64 JPEG（任意）>"
}
```

**処理フロー**
1. 入力バリデーション（email・company・name・diagnosedUrl必須）
2. トークン生成（48文字hex）
3. `.data/leads/YYYY-MM.json` にリードエントリ保存
4. `SMTP_*` 設定済み → 詳細レポートURL付きメール送信
5. `ZOHO_*` 設定済み → Zoho CRM Leadsモジュールに登録
6. 未設定の場合はコンソールログのみ（開発用）

### GET /api/detail?token=xxxxx

**処理フロー**
1. トークン形式バリデーション（48文字hex）
2. `.data/leads/` を新しい月から検索
3. 該当エントリの `diagnosedUrl`, `result`, `screenshot` を返す

### GET /api/admin/history

**認証**: `x-admin-password` ヘッダーと `ADMIN_PASSWORD` 環境変数を照合

- `?month=` パラメータなし → 利用可能な月一覧を返す
- `?month=YYYY-MM` → 該当月の履歴一覧を返す

### GET /api/admin/leads

**認証**: `x-admin-password` ヘッダーと `ADMIN_PASSWORD` 環境変数を照合

- `?month=` パラメータなし → リードが存在する月一覧を返す
- `?month=YYYY-MM` → 該当月のリード一覧を返す（`screenshot` フィールドは除外）

## スコア設計

| 観点 | フィールド | 満点 |
|------|-----------|------|
| 第一印象 | `first_impression` | 20 |
| 情報設計 | `information_architecture` | 20 |
| CTAの明確さ / 導線 | `cta_clarity` | 20 |
| 信頼性 | `trust` | 15 |
| ナビゲーション | `navigation` | 15 |
| 改善優先度 | `improvement_priority` | 10 |
| **合計** | `overall_score` | **100** |

## 診断プロンプト設計

### AIペルソナ

BtoB企業サイトのUI/UX監査を専門とするシニアコンサルタント。
初回訪問者の視点（潜在顧客・求職者）で「伝達力・信頼性・行動導線」のみを評価。
デザインの好み・SEO・技術実装は評価対象外。

### サイト種別の自動判定

優先順位順に判定し、最初に該当した種別を採用する。

| 優先 | 種別 | 判定条件 |
|------|------|---------|
| 1 | `recruitment` | URL・タイトルに「採用/recruit/career/join/jobs/新卒/中途/hiring」を含む、または採用特有コンテンツがある |
| 2 | `media` | URL・タイトルに「news/media/magazine/blog/column/記事/コラム/ニュース」を含む、または記事一覧・著者情報などメディア構造がある |
| 3 | `service` | URL・タイトルに「service/product/app/tool/platform/サービス/プロダクト/ツール」を含む、または料金プラン・トライアルなどSaaS特有の要素がある |
| 4 | `brand` | ビジュアル訴求・世界観訴求が主体。URL・タイトルに「brand/story/concept/philosophy」を含む |
| 5 | `corporate` | 上記いずれにも該当しない場合のデフォルト |

### 採点スケール（各項目共通）

| 満点比 | 水準 |
|--------|------|
| 90〜100% | 業界ベンチマーク。他社が参考にすべきレベル |
| 75〜89% | 良好。基本を押さえているが改善余地がある |
| 60〜74% | 基礎はあるが明確な弱点がある（一般的なBtoBサイトの平均水準） |
| 40〜59% | 課題が多くコンバージョンに影響が出ている |
| 0〜39% | 重大な問題がある。早急な改善が必要 |

### 評価項目と判断基準

| 項目 | 満点 | 評価目的 | 高得点の条件 | 低得点の条件 |
|------|------|---------|------------|------------|
| first_impression | 20 | 5秒以内に「何の会社か・誰のためか・なぜここか」が伝わるか | 具体的キャッチコピー・ターゲット明示・差別化ポイント | 汎用的コピーのみ・抽象的ビジュアルのみ |
| information_architecture | 20 | 訪問者の思考の流れ（課題→解決→信頼→行動）に沿った構成か | 自然な流れ・2クリック以内で重要情報に到達 | 会社の言いたい順・重要情報が埋もれている |
| cta_clarity | 20 | 次の行動（問い合わせ・エントリー等）が明確・行動しやすいか | 視覚的に目立つ・具体的テキスト・適切な配置 | CTAなし/フッターのみ・曖昧テキスト・多すぎ |
| trust | 15 | 「この会社は信頼できる」と判断できる具体的根拠があるか | 数値付き実績・社名付き顧客の声・代表者情報 | 抽象的実績・匿名の声・会社情報が最小限 |
| navigation | 15 | 迷わず目的のページに到達でき、現在地を把握できるか | 6〜7項目以内・直感的ラベル・モバイル対応 | 10項目以上・社内用語・重要ページへの導線なし |
| improvement_priority | 10 | 最も優先すべき改善課題が1つ明確に特定できるか | 明確な1課題・期待効果が具体的・実行可能 | 広範すぎて優先不可・軽微で改善インパクト低 |

### 出力品質ルール

- `summary`: 初回訪問者の体験として、最重要課題と強みを100〜200文字で記述
- `strengths`: 必ず3つ。「〜なので訪問者は〜できる」という**因果形式**で記述
- `issues`: 必ず3つ。「〜がないため訪問者は〜という体験になる」という**影響形式**で記述
- `top_priority_fix`: コンバージョンへの影響が最大の1課題のみ
- `lead_tags`: 2〜4個の具体的タグ（例: 「CTA改善」「信頼性不足」「採用訴求弱」「情報過多」）

## リード温度ロジック

```
Hot  : overall_score <= 60 OR cta_clarity <= 12
Warm : overall_score 61〜75
Cold : overall_score >= 76
```

## データストレージ

```
.data/
  YYYY-MM.json          # 診断履歴（/api/analyze で保存）
  leads/
    YYYY-MM.json        # リードエントリ（/api/lead で保存）
```

**HistoryEntry**（診断履歴）
```typescript
{
  id: string;
  url: string;
  timestamp: string;
  overall_score: number;
  lead_temperature: "Hot" | "Warm" | "Cold";
  lead_tags: string[];
  summary: string;
  scores: DiagnosisScores;
  strengths: string[];
  issues: string[];
  top_priority_fix: TopPriorityFix;
}
```

**LeadEntry**（リード）
```typescript
{
  token: string;        // 詳細ページのアクセストークン（48文字hex）
  email: string;
  company: string;
  name: string;
  diagnosedUrl: string;
  timestamp: string;
  result: DiagnosisResult;
  screenshot?: string;  // base64 JPEG
}
```

## 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `OPENAI_API_KEY` | Phase2 | OpenAI APIキー。未設定時はダミーデータを返す |
| `ADMIN_PASSWORD` | 管理画面 | `/admin` へのアクセスパスワード |
| `SMTP_HOST` | メール送信 | SMTPサーバーホスト（例: smtp.gmail.com） |
| `SMTP_PORT` | メール送信 | SMTPポート（デフォルト: 587） |
| `SMTP_USER` | メール送信 | SMTPユーザー名 |
| `SMTP_PASS` | メール送信 | SMTPパスワード |
| `SMTP_FROM` | メール送信 | 送信元アドレス |
| `APP_BASE_URL` | メール送信 | 詳細URLのベースURL（例: https://yourdomain.com） |
| `NEXT_PUBLIC_CONSULT_URL` | 相談CTA | 詳細ページの「無料相談する」リンク先。未設定時は `/form` |
| `ZOHO_CLIENT_ID` | Zoho連携 | Zoho OAuthクライアントID |
| `ZOHO_CLIENT_SECRET` | Zoho連携 | Zoho OAuthクライアントシークレット |
| `ZOHO_REFRESH_TOKEN` | Zoho連携 | Zoho OAuthリフレッシュトークン |
| `ZOHO_DOMAIN` | Zoho連携 | Zohoドメイン（`com` / `jp` / `eu`）。デフォルト`com` |

## Zoho CRM フィールドマッピング

| データ | Zohoフィールド | 種別 |
|--------|--------------|------|
| 会社名 | `Company` | 標準 |
| 担当者名 | `Last_Name` | 標準 |
| メール | `Email` | 標準 |
| 診断URL | `Website` | 標準 |
| ステータス | `Lead_Status` | 標準 |
| 総合スコア | `Score_Total` | カスタム（数値） |
| CTAスコア | `Score_CTA` | カスタム（数値） |
| 第一印象スコア | `Score_First` | カスタム（数値） |
| 診断サマリー | `Summary` | カスタム（テキスト） |
| 改善点1〜3 | `Issue_1` `Issue_2` `Issue_3` | カスタム（テキスト） |
| 最優先改善 | `Top_Fix` | カスタム（テキスト） |
| リード温度 | `Lead_Temperature` | カスタム（テキスト） |
| 診断タグ | `Lead_Tags` | カスタム（テキスト） |
| 診断日時 | `Diagnosis_Date` | カスタム（datetime） |

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイル**: Tailwind CSS v4
- **AI**: OpenAI gpt-4o（vision）
- **HTML解析**: cheerio
- **スクリーンショット**: Playwright（chromium）
- **メール送信**: nodemailer（SMTP）
- **CRM**: Zoho CRM API v2
- **データ保存**: JSONファイル（`.data/`）

## 開発フェーズ

| フェーズ | 内容 | 状態 |
|---------|------|------|
| Phase 1 | UI全画面 + ダミーAPI | ✅ 完了 |
| Phase 2 | OpenAI連携 + Playwright | ✅ 完了（`OPENAI_API_KEY`設定で有効化） |
| Phase 3 | Zoho CRM連携 | ✅ 完了（`ZOHO_*`設定で有効化） |
| Phase 4 | メール導線 + トークン認証 | ✅ 完了（`SMTP_*`設定で有効化） |
| Phase 5 | 管理者画面（月別履歴） | ✅ 完了（`ADMIN_PASSWORD`設定で有効化） |
