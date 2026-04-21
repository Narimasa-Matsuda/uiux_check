import type { LeadRequest, LeadTemperature } from "./types";
import { getLeadTemperature } from "./types";

interface ZohoTokenResponse {
  access_token: string;
}

async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN || "",
    client_id: process.env.ZOHO_CLIENT_ID || "",
    client_secret: process.env.ZOHO_CLIENT_SECRET || "",
    grant_type: "refresh_token",
  });

  const res = await fetch(`https://accounts.zoho.${process.env.ZOHO_DOMAIN || "com"}/oauth/v2/token`, {
    method: "POST",
    body: params,
  });

  if (!res.ok) {
    throw new Error(`Zoho token error: ${res.status}`);
  }

  const data: ZohoTokenResponse = await res.json();
  return data.access_token;
}

function buildLeadPayload(lead: LeadRequest, temperature: LeadTemperature) {
  const { result } = lead;
  return {
    data: [
      {
        Company: lead.company ?? "",
        Last_Name: lead.name ?? "",
        Email: lead.email,
        Website: lead.diagnosedUrl,
        Score_Total: result.overall_score,
        Score_CTA: result.scores.cta_clarity,
        Score_First: result.scores.first_impression,
        Summary: result.summary,
        Issue_1: result.issues[0] || "",
        Issue_2: result.issues[1] || "",
        Issue_3: result.issues[2] || "",
        Top_Fix: result.top_priority_fix.title,
        Lead_Temperature: temperature,
        Lead_Tags: result.lead_tags.join(", "),
        Lead_Status: "新規",
        Diagnosis_Date: new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00"),
      },
    ],
  };
}

export async function registerLead(lead: LeadRequest): Promise<void> {
  const temperature = getLeadTemperature(lead.result);
  const accessToken = await getAccessToken();
  const payload = buildLeadPayload(lead, temperature);

  const domain = process.env.ZOHO_DOMAIN || "com";
  const res = await fetch(`https://www.zohoapis.${domain}/crm/v2/Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await res.text();
  console.log("[zoho] status:", res.status, "body:", responseBody);

  if (!res.ok) {
    throw new Error(`Zoho CRM error: ${res.status} ${responseBody}`);
  }

  // Zoho returns 200/202 even on field-level errors
  const json = JSON.parse(responseBody);
  const firstItem = json?.data?.[0];
  if (firstItem?.status === "error") {
    throw new Error(`Zoho field error: ${JSON.stringify(firstItem)}`);
  }
}
