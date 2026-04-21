import { generateToken, removeLeadByToken, saveLeadEntry } from "@/lib/leads";
import type { LeadRequest, LeadResponse } from "@/lib/types";

function validate(body: Partial<LeadRequest>): string | null {
  if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return "有効なメールアドレスを入力してください";
  }
  if (!body.company?.trim()) return "会社名を入力してください";
  if (!body.name?.trim()) return "お名前を入力してください";
  if (!body.diagnosedUrl?.trim()) return "診断URLが見つかりません";
  if (!body.result) return "診断データが見つかりません";
  return null;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: LeadRequest = await request.json();

    const err = validate(body);
    if (err) {
      const res: LeadResponse = { success: false, message: err };
      return Response.json(res, { status: 400 });
    }

    const token = generateToken();
    const timestamp = new Date().toISOString();
    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    saveLeadEntry({
      token,
      email: body.email,
      company: body.company ?? "",
      name: body.name ?? "",
      diagnosedUrl: body.diagnosedUrl,
      timestamp,
      result: body.result,
      screenshot: body.screenshot,
    });

    const host = request.headers.get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const baseUrl = process.env.APP_BASE_URL ?? `${protocol}://${host}`;
    const detailUrl = `${baseUrl}/detail?token=${token}`;

    if (smtpConfigured) {
      try {
        const { sendDetailEmail } = await import("@/lib/email");
        await sendDetailEmail({
          to: body.email,
          name: body.name,
          detailUrl,
          score: body.result.overall_score,
          diagnosedUrl: body.diagnosedUrl,
        });
      } catch (emailErr) {
        const rolledBack = removeLeadByToken(token);
        console.error("[lead] email send failed:", emailErr);
        if (!rolledBack) {
          console.error("[lead] rollback failed for token:", token);
        }
        const res: LeadResponse = {
          success: false,
          emailSent: false,
          message: "メール送信に失敗しました。しばらくしてから再度お試しください。",
        };
        return Response.json(res, { status: 502 });
      }
    } else {
      console.log("[lead] SMTP not configured, skipping email. Detail URL:", detailUrl);
    }

    // Zoho CRM integration (if configured)
    if (
      process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
    ) {
      console.log("[lead] Zoho vars detected, attempting registration...");
      try {
        const { registerLead } = await import("@/lib/zoho");
        await registerLead(body);
        console.log("[lead] Zoho registration succeeded");
      } catch (zohoErr) {
        console.error("[lead] Zoho registration failed:", zohoErr);
      }
    } else {
      console.log("[lead] Zoho vars not set, skipping");
    }

    const res: LeadResponse = { success: true, emailSent: true };
    return Response.json(res);
  } catch (err) {
    console.error("[lead] error:", err);
    const res: LeadResponse = {
      success: false,
      emailSent: false,
      message: "送信に失敗しました",
    };
    return Response.json(res, { status: 500 });
  }
}
