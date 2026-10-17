// Public feedback/support intake. This function deliberately permits anonymous
// POSTs; CORS, strict validation, private DB grants/RLS, and DB-backed rate limits
// are the protections. Recipients are server-configured and never accepted from the client.
const DEFAULT_ALLOWED_ORIGINS = [
  "https://cestudy.pages.dev",
  "https://design-white-blue-responsive.cestudy.pages.dev",
  "http://localhost:5173",
];
const MAX_BODY_BYTES = 12_000;

type RecordValue = Record<string, unknown>;
type SubmissionType = "feedback" | "support";
type TableRow = RecordValue & { id: string; notification_status: "pending" | "sent" | "failed" };

function jsonResponse(request: Request, status: number, body: RecordValue, extraHeaders: Record<string, string> = {}) {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    ...extraHeaders,
  };
  if (isAllowedOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}

function allowedOrigins(): string[] {
  const raw = Deno.env.get("ALLOWED_ORIGINS")?.trim();
  const values = raw ? raw.split(",").map((value) => value.trim()).filter(Boolean) : DEFAULT_ALLOWED_ORIGINS;
  return [...new Set(values)];
}

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (allowedOrigins().includes(origin)) return true;
  try {
    const parsed = new URL(origin);
    return parsed.protocol === "https:"
      && parsed.port === ""
      && parsed.origin === origin
      && /^[a-f0-9]{8}\.cestudy\.pages\.dev$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function serviceRoleKey(): string {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (legacy) return legacy;
  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeys) {
    try {
      const parsed = JSON.parse(secretKeys) as Record<string, unknown>;
      const value = parsed.default;
      if (typeof value === "string" && value.trim()) return value.trim();
    } catch {
      // Fail closed below.
    }
  }
  throw new Error("server_key_missing");
}

type NotificationConfig = { apiKey: string; from: string; recipients: string[] };

function notificationConfig(): NotificationConfig | null {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim() ?? "";
  const from = Deno.env.get("RESEND_FROM_EMAIL")?.trim() ?? "";
  const recipients = (Deno.env.get("ADMIN_NOTIFICATION_RECIPIENTS")?.trim() || "cestudy00@gmail.com")
    .split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!apiKey || !from || recipients.length < 1 || recipients.length > 10 ||
      recipients.some((email) => !emailRegex.test(email))) {
    return null;
  }
  return { apiKey, from, recipients: [...new Set(recipients)] };
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

async function digest(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function clientIdentity(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwarded?.split(",").map((part) => part.trim()).filter(Boolean)[0];
  return request.headers.get("cf-connecting-ip")?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || firstForwardedIp
    || "unidentified-client";
}

function supabaseBaseUrl(): string {
  const value = Deno.env.get("SUPABASE_URL")?.trim();
  if (!value) throw new Error("supabase_url_missing");
  return value.replace(/\/$/, "");
}

async function privateRest(path: string, method: string, body?: unknown, prefer?: string): Promise<Response> {
  const key = serviceRoleKey();
  const headers: Record<string, string> = {
    "apikey": key,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers["Prefer"] = prefer;
  return await fetch(`${supabaseBaseUrl()}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function consumeRateLimit(type: SubmissionType, request: Request): Promise<{ allowed: boolean; retryAfter: number }> {
  const key = serviceRoleKey();
  const fingerprint = await digest(`${clientIdentity(request)}:${key}`);
  const limit = type === "feedback" ? 5 : 3;
  const response = await privateRest("rpc/consume_public_submission_rate_limit", "POST", {
    p_identity_hash: fingerprint,
    p_form_type: type,
    p_max_submissions: limit,
    p_window_seconds: 3600,
  });
  if (!response.ok) throw new Error("rate_limit_unavailable");
  const rows = await response.json() as Array<{ allowed: boolean; retry_after_seconds: number }>;
  const row = rows[0];
  if (!row || typeof row.allowed !== "boolean") throw new Error("rate_limit_invalid_response");
  return { allowed: row.allowed, retryAfter: Number(row.retry_after_seconds) || 0 };
}

async function getSubmission(table: string, clientSubmissionId: string): Promise<TableRow | null> {
  const query = new URLSearchParams({ client_submission_id: `eq.${clientSubmissionId}`, select: "*" });
  const response = await privateRest(`${table}?${query.toString()}`, "GET");
  if (!response.ok) throw new Error("submission_lookup_failed");
  const rows = await response.json() as TableRow[];
  return rows[0] ?? null;
}

async function createOrGetSubmission(table: string, payload: RecordValue, clientSubmissionId: string): Promise<TableRow> {
  const query = new URLSearchParams({ on_conflict: "client_submission_id" });
  const response = await privateRest(
    `${table}?${query.toString()}`,
    "POST",
    payload,
    "resolution=ignore-duplicates,return=representation",
  );
  if (!response.ok) throw new Error("submission_store_failed");
  const rows = await response.json() as TableRow[];
  if (rows[0]) return rows[0];
  const existing = await getSubmission(table, clientSubmissionId);
  if (!existing) throw new Error("submission_store_failed");
  return existing;
}

async function sendNotification(
  config: NotificationConfig,
  type: SubmissionType,
  row: TableRow,
): Promise<void> {
  const isFeedback = type === "feedback";
  const subject = isFeedback
    ? `CEStudy feedback: ${String(row.category)}`
    : `CEStudy support confirmation: ${String(row.provider)}`;
  const message = isFeedback ? String(row.message) : String(row.sender_message ?? "");
  const senderName = isFeedback ? String(row.sender_name ?? "") : "";
  const senderEmail = isFeedback ? String(row.sender_email ?? "") : "";
  const details = isFeedback
    ? [
        ["Type", String(row.category)],
        ["Name", senderName || "Not provided"],
        ["Reply email", senderEmail || "Not provided"],
        ["Received", String(row.created_at)],
      ]
    : [
        ["Payment method", String(row.provider)],
        ["User confirmation", "The sender says they completed support. Payment is not independently verified."],
        ["Optional message", message || "Not provided"],
        ["Received", String(row.created_at)],
      ];
  const text = [
    "A private CEStudy submission was received.",
    "",
    ...details.map(([label, value]) => `${label}: ${value}`),
    "",
    isFeedback ? "Message:" : "Support note:",
    message || "No message included.",
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#24384b"><h2>${escapeHtml(subject)}</h2><dl>${details.map(([label,value]) => `<dt><strong>${escapeHtml(label)}</strong></dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl><h3>${isFeedback ? "Message" : "Support note"}</h3><pre style="white-space:pre-wrap;font:inherit;background:#f7f9fc;padding:12px;border-radius:8px">${escapeHtml(message || "No message included.")}</pre><p style="font-size:12px;color:#637487">This notice was sent only to the server-configured CEStudy notification recipients.</p></div>`;

  for (const recipient of config.recipients) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `cestudy/${type}/${String(row.client_submission_id)}/${recipient}`,
      },
      body: JSON.stringify({ from: config.from, to: [recipient], subject, text, html }),
    });
    if (!response.ok) throw new Error("notification_provider_failed");
  }
}

async function setNotificationStatus(table: string, clientSubmissionId: string, status: "sent" | "failed") {
  const query = new URLSearchParams({ client_submission_id: `eq.${clientSubmissionId}` });
  const response = await privateRest(`${table}?${query.toString()}`, "PATCH", {
    notification_status: status,
    notification_sent_at: status === "sent" ? new Date().toISOString() : null,
  }, "return=minimal");
  if (!response.ok) throw new Error("notification_status_update_failed");
}

function validateSubmission(body: RecordValue):
  | { ok: true; type: "feedback"; id: string; payload: RecordValue }
  | { ok: true; type: "support"; id: string; payload: RecordValue }
  | { ok: false; message: string } {
  const id = cleanString(body.clientSubmissionId);
  if (!validUuid(id)) return { ok: false, message: "This message could not be prepared. Refresh the page and try again." };

  if (body.type === "feedback") {
    // Feedback remains anonymous until CEStudy accounts or an explicit contact flow exist.
    // Ignore client-provided identity fields so a modified browser cannot attach them.
    const name = "";
    const email = "";
    const category = cleanString(body.category);
    const message = cleanString(body.message);
    const categories = ["general", "content", "usability", "accessibility", "feature", "other"];
    if (name.length > 80 || email.length > 254 ||
        (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
        !categories.includes(category) || message.length < 10 || message.length > 4000) {
      return { ok: false, message: "Check the feedback fields and try again." };
    }
    return {
      ok: true,
      type: "feedback",
      id,
      payload: { client_submission_id: id, sender_name: name || null, sender_email: email || null, category, message, notification_status: "pending" },
    };
  }

  if (body.type === "support") {
    const provider = cleanString(body.provider);
    const message = cleanString(body.message);
    if (!["gcash", "paypal"].includes(provider) || body.confirmed !== true || message.length > 500) {
      return { ok: false, message: "Confirm the support details and try again." };
    }
    return {
      ok: true,
      type: "support",
      id,
      payload: {
        client_submission_id: id,
        provider,
        sender_message: message || null,
        user_confirmed_payment: true,
        payment_status: "user-confirmed-unverified",
        notification_status: "pending",
      },
    };
  }
  return { ok: false, message: "Unsupported message type." };
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ ok: false, message: "This origin is not allowed." }), {
      status: 403,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Vary": "Origin" },
    });
  }
  const cors: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
  if (origin) cors["Access-Control-Allow-Origin"] = origin;

  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return jsonResponse(request, 405, { ok: false, message: "Method not allowed." }, cors);
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) return jsonResponse(request, 413, { ok: false, message: "The message is too large." }, cors);

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return jsonResponse(request, 413, { ok: false, message: "The message is too large." }, cors);
    }
    const body: unknown = JSON.parse(raw);
    if (!isRecord(body)) return jsonResponse(request, 400, { ok: false, message: "Invalid request body." }, cors);
    const validated = validateSubmission(body);
    if (!validated.ok) return jsonResponse(request, 400, { ok: false, message: validated.message }, cors);

    let config: NotificationConfig | null;
    try {
      config = notificationConfig();
      serviceRoleKey();
      supabaseBaseUrl();
    } catch {
      return jsonResponse(request, 503, { ok: false, message: "Secure message storage is not configured yet. Please try again later." }, cors);
    }
    // Feedback can be saved to the private inbox without email. Support confirmations
    // still require a configured email notification channel.
    if (validated.type === "support" && !config) {
      return jsonResponse(request, 503, { ok: false, message: "Support notifications are not configured yet. Please try again later." }, cors);
    }

    const table = validated.type === "feedback" ? "feedback_messages" : "support_confirmations";
    const rate = await consumeRateLimit(validated.type, request);
    if (!rate.allowed) {
      return jsonResponse(request, 429, { ok: false, message: "Too many submissions. Please wait before trying again." }, { ...cors, "Retry-After": String(rate.retryAfter) });
    }

    const row = await createOrGetSubmission(table, validated.payload, validated.id);
    if (row.notification_status === "sent") {
      return jsonResponse(request, 200, { ok: true, message: "Submission was already sent." }, cors);
    }
    if (validated.type === "feedback" && !config) {
      // The message is stored privately; the inbox unread badge is the primary alert.
      return jsonResponse(request, 200, { ok: true, message: "Message sent." }, cors);
    }
    try {
      if (!config) throw new Error("notification_config_missing");
      await sendNotification(config, validated.type, row);
      await setNotificationStatus(table, validated.id, "sent");
    } catch {
      await setNotificationStatus(table, validated.id, "failed").catch(() => null);
      if (validated.type === "feedback") {
        // Email is a best-effort alert, so do not report failure after private storage succeeded.
        return jsonResponse(request, 200, { ok: true, message: "Message sent." }, cors);
      }
      return jsonResponse(request, 502, {
        ok: false,
        message: "Your support confirmation was saved privately, but the authorized inbox could not be notified. Please try again. Your submission has been kept.",
      }, cors);
    }
    return jsonResponse(request, 200, { ok: true, message: "Message sent." }, cors);
  } catch {
    return jsonResponse(request, 503, { ok: false, message: "This form is temporarily unavailable. Please try again later." }, cors);
  }
});
