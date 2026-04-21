import { findLeadByToken } from "@/lib/leads";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || !/^[a-f0-9]{48}$/.test(token)) {
    return Response.json({ error: "Invalid token" }, { status: 400 });
  }

  const entry = await findLeadByToken(token);
  if (!entry) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    success: true,
    diagnosedUrl: entry.diagnosedUrl,
    result: entry.result,
    screenshot: entry.screenshot ?? null,
  });
}
