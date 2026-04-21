import nodemailer from "nodemailer";

interface DetailEmailParams {
  to: string;
  name?: string;
  detailUrl: string;
  score: number;
  diagnosedUrl: string;
}

export async function sendDetailEmail(params: DetailEmailParams): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const displayName = params.name || "ご担当者";
  const scoreColor =
    params.score >= 76 ? "#16a34a" : params.score >= 61 ? "#d97706" : "#dc2626";

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@example.com",
    to: params.to,
    subject: `【UI/UX診断レポート】スコア ${params.score}点 — 詳細レポートのご案内`,
    html: `
<div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #374151; background: #ffffff;">
  <h2 style="color: #4f46e5; font-size: 22px; margin: 0 0 24px;">UI/UX診断レポートのご案内</h2>

  <p style="margin: 0 0 16px;">${displayName} 様</p>
  <p style="margin: 0 0 24px; line-height: 1.7;">
    UI/UX診断のご利用ありがとうございます。<br>
    診断対象：<a href="${params.diagnosedUrl}" style="color: #4f46e5;">${params.diagnosedUrl}</a>
  </p>

  <div style="background: #f0f0ff; border-radius: 12px; padding: 24px; margin: 0 0 28px; text-align: center;">
    <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">総合スコア</p>
    <p style="margin: 0; font-size: 56px; font-weight: 800; color: ${scoreColor}; line-height: 1;">${params.score}</p>
    <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">/ 100</p>
  </div>

  <p style="margin: 0 0 24px; line-height: 1.7;">
    スコア内訳・改善ポイント・最優先アクションを詳細レポートでご確認いただけます。
  </p>

  <div style="text-align: center; margin: 0 0 32px;">
    <a href="${params.detailUrl}"
       style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none;
              padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px;">
      詳細レポートを見る →
    </a>
  </div>

  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 8px;">
    ※ このリンクはあなた専用のURLです。有効期限はありません。
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p style="font-size: 12px; color: #9ca3af; margin: 0;">UI/UX AI診断ツール</p>
</div>
    `.trim(),
  });
}
