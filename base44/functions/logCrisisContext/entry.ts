/**
 * Silent crisis-context audit (server-side only).
 *
 * - Persists append-only `SafetyEvent` rows for monitoring (hash + metadata in `notes`;
 *   full message body remains on `Message` rows when the client saved the chat there).
 * - Optionally sets `Message.risk_level` when a persisted `message_id` is supplied.
 *
 * Deploy: register this function in Base44 as `logCrisisContext` (same folder name).
 * Requires `SafetyEvent` entity in the app schema (already present in this repo).
 */
import { createClientFromRequest } from "npm:@base44/sdk@0.8.27";

type Severity = "low" | "medium" | "high" | "critical";
type RiskLevel = "none" | "elevated" | "acute";

const ACUTE_TERMS = [
  "zelfmoord",
  "suicide",
  "suïcide",
  "zelf doden",
  "me dood",
  "dood willen",
  "niet meer leven",
  "einde maken",
  "geen zin om te leven",
  "alles beëindigen",
  "afscheid nemen van iedereen",
];

const ELEVATED_TERMS = [
  "zelfbeschadiging",
  "zelf verwonden",
  "snijden",
  "pillen om te",
  "overdos",
  "geen uitweg",
  "hopeloos",
  "het niet meer aankunnen",
  "pijn doen aan mezelf",
  "wil me pijn doen",
];

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function triageContent(content: string): { flags: string[]; severity: Severity; riskLevel: RiskLevel } {
  const lower = content.toLowerCase();
  const flags: string[] = [];
  for (const t of ACUTE_TERMS) {
    if (lower.includes(t)) flags.push(`acute:${t}`);
  }
  for (const t of ELEVATED_TERMS) {
    if (lower.includes(t)) flags.push(`elevated:${t}`);
  }
  let severity: Severity = "low";
  if (flags.some((f) => f.startsWith("acute:"))) severity = "critical";
  else if (flags.some((f) => f.startsWith("elevated:"))) severity = "high";
  else if (flags.length) severity = "medium";

  let riskLevel: RiskLevel = "none";
  if (severity === "critical" || severity === "high") riskLevel = "acute";
  else if (severity === "medium") riskLevel = "elevated";

  return { flags, severity, riskLevel };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const conversation_id = body.conversation_id as string | undefined;
    const message_id = body.message_id as string | undefined;
    const role = body.role as string | undefined;
    const content = typeof body.content === "string" ? body.content : "";

    if (!conversation_id || !role) {
      return Response.json({ error: "invalid_body" }, { status: 400 });
    }

    const { flags, severity, riskLevel } = triageContent(content);
    const hash = await sha256hex(content);
    const notes = JSON.stringify({
      conversation_id,
      message_id: message_id ?? null,
      role,
      ts: new Date().toISOString(),
      content_length: content.length,
      content_sha256: hash,
      crisis_flags: flags,
    });

    await base44.entities.SafetyEvent.create({
      userId: user.id,
      eventType: "chat_crisis_audit",
      severity,
      notes,
    });

    if (message_id && riskLevel !== "none") {
      await base44.entities.Message.update(message_id, { risk_level: riskLevel }).catch(() => {});
    }

    return Response.json({ ok: true, severity, riskLevel });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return Response.json({ error: msg }, { status: 500 });
  }
});
