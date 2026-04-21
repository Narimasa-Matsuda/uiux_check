import { getLeadMonths, getLeadsByMonth } from "@/lib/leads";

function checkAuth(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return request.headers.get("x-admin-password") === password;
}

export async function GET(request: Request): Promise<Response> {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return Response.json({ error: "Invalid month format" }, { status: 400 });
    }
    const leads = getLeadsByMonth(month);
    return Response.json({ month, leads });
  }

  const months = getLeadMonths();
  return Response.json({ months });
}
