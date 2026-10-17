// Private owner-only inbox. The access key and database key exist only in server secrets.
const DEFAULT_ALLOWED_ORIGINS = ["https://cestudy.pages.dev", "https://design-white-blue-responsive.cestudy.pages.dev", "http://localhost:5173"];
const MAX_BODY_BYTES = 8_000, TOKEN_TTL_SECONDS = 30 * 60, TOKEN_HEADER = "x-feedback-inbox-token";
type RecordValue = Record<string, unknown>;
type FeedbackRow = { id: string; category: string; message: string; created_at: string; read_at: string | null };

function allowedOrigins(): string[] {
  const raw = Deno.env.get("ALLOWED_ORIGINS")?.trim();
  return [...new Set(raw ? raw.split(",").map(s => s.trim()).filter(Boolean) : DEFAULT_ALLOWED_ORIGINS)];
}
function respond(request: Request, status: number, body: RecordValue) {
  const headers: Record<string, string> = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Pragma": "no-cache", Vary: "Origin" };
  const origin = request.headers.get("origin");
  if (origin && allowedOrigins().includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "authorization, apikey, x-client-info, content-type, x-feedback-inbox-token";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(JSON.stringify(body), { status, headers });
}
function isRecord(value: unknown): value is RecordValue { return typeof value === "object" && value !== null && !Array.isArray(value); }
function clean(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function ownerKey() {
  const value = Deno.env.get("FEEDBACK_INBOX_ACCESS_KEY")?.trim() ?? "";
  if (value.length < 32) throw new Error("owner_key_missing");
  return value;
}
function serviceKey() {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (legacy) return legacy;
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (raw) { try { const value = (JSON.parse(raw) as RecordValue).default; if (typeof value === "string" && value.trim()) return value.trim(); } catch { /* fail closed */ } }
  throw new Error("service_key_missing");
}
function baseUrl() {
  const value = Deno.env.get("SUPABASE_URL")?.trim();
  if (!value) throw new Error("supabase_url_missing");
  return value.replace(/\/$/, "");
}
async function rest(path: string, method: string, body?: unknown, prefer?: string, range?: string): Promise<Response> {
  const key = serviceKey(), headers: Record<string, string> = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  if (prefer) headers.Prefer = prefer;
  if (range) headers.Range = range;
  return fetch(`${baseUrl()}/rest/v1/${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
}
async function digest(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}
function callerIdentity(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",").map(x => x.trim()).find(Boolean);
  return req.headers.get("cf-connecting-ip")?.trim() || req.headers.get("x-real-ip")?.trim() || forwarded || "unidentified-client";
}
async function rateLimitUnlock(req: Request) {
  const key = serviceKey(), identityHash = await digest(`${callerIdentity(req)}:${key}`);
  const res = await rest("rpc/consume_public_submission_rate_limit", "POST", { p_identity_hash: identityHash, p_form_type: "inbox_auth", p_max_submissions: 5, p_window_seconds: 900 });
  if (!res.ok) throw new Error("unlock_rate_limit_unavailable");
  const row = (await res.json() as Array<{ allowed: boolean; retry_after_seconds: number }>)[0];
  if (!row || typeof row.allowed !== "boolean") throw new Error("unlock_rate_limit_invalid");
  return { allowed: row.allowed, retryAfter: Math.max(0, Number(row.retry_after_seconds) || 0) };
}
function constantTimeEqual(expected: string, provided: string): boolean {
  const a = new TextEncoder().encode(expected), b = new TextEncoder().encode(provided);
  let diff = a.length ^ b.length;
  for (let i = 0, max = Math.max(a.length, b.length); i < max; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}
function b64url(bytes: Uint8Array): string {
  let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function fromB64url(value: string): Uint8Array {
  const text = value.replace(/-/g, "+").replace(/_/g, "/"), padded = text + "=".repeat((4 - text.length % 4) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}
async function hmacKey(key: string) { return crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]); }
async function createToken(key: string) {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ sub: "cestudy-feedback-owner", exp, nonce: crypto.randomUUID() })));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(key), new TextEncoder().encode(payload));
  return { token: `${payload}.${b64url(new Uint8Array(signature))}`, expiresAt: new Date(exp * 1000).toISOString() };
}
async function verifyToken(token: string, key: string): Promise<boolean> {
  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length) return false;
  try {
    if (!await crypto.subtle.verify("HMAC", await hmacKey(key), fromB64url(signature), new TextEncoder().encode(payload))) return false;
    const claims = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as RecordValue, now = Math.floor(Date.now() / 1000);
    return claims.sub === "cestudy-feedback-owner" && typeof claims.exp === "number" && claims.exp > now && claims.exp <= now + TOKEN_TTL_SECONDS + 60 && typeof claims.nonce === "string";
  } catch { return false; }
}
function exactCount(range: string | null): number | null {
  const match = range?.match(/\/(\d+|\*)$/);
  if (!match || match[1] === "*") return null;
  const count = Number(match[1]); return Number.isFinite(count) ? count : null;
}
async function listFeedback(offset: number, limit: number) {
  const query = new URLSearchParams({ select: "id,category,message,created_at,read_at", order: "created_at.desc", offset: String(offset), limit: String(limit) });
  const res = await rest(`feedback_messages?${query.toString()}`, "GET", undefined, "count=exact", `${offset}-${offset + limit - 1}`);
  if (!res.ok) throw new Error("feedback_list_failed");
  const messages = await res.json() as FeedbackRow[], total = exactCount(res.headers.get("content-range"));
  return { messages, hasMore: total === null ? messages.length === limit : offset + messages.length < total };
}
async function unreadCount() {
  const query = new URLSearchParams({ select: "id", read_at: "is.null" });
  const res = await rest(`feedback_messages?${query.toString()}`, "GET", undefined, "count=exact", "0-0");
  if (!res.ok) throw new Error("feedback_count_failed");
  const total = exactCount(res.headers.get("content-range"));
  return total ?? (await res.json() as Array<{ id: string }>).length;
}
async function markRead(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error("bad_feedback_id");
  const query = new URLSearchParams({ id: `eq.${id}`, read_at: "is.null" });
  const res = await rest(`feedback_messages?${query.toString()}`, "PATCH", { read_at: new Date().toISOString() }, "return=minimal");
  if (!res.ok) throw new Error("feedback_read_update_failed");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (!origin || !allowedOrigins().includes(origin)) return respond(req, 403, { ok: false, message: "This origin is not allowed." });
  if (req.method === "OPTIONS") return new Response("ok", { headers: respond(req, 200, { ok: true }).headers });
  if (req.method !== "POST") return respond(req, 405, { ok: false, message: "Method not allowed." });
  if (Number(req.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return respond(req, 413, { ok: false, message: "The request is too large." });
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return respond(req, 413, { ok: false, message: "The request is too large." });
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return respond(req, 400, { ok: false, message: "Invalid request body." }); }
    if (!isRecord(body)) return respond(req, 400, { ok: false, message: "Invalid request body." });
    const action = clean(body.action);
    let key: string;
    try { key = ownerKey(); serviceKey(); baseUrl(); }
    catch { return respond(req, 503, { ok: false, message: "The private feedback inbox is not configured. Add FEEDBACK_INBOX_ACCESS_KEY to the Supabase Edge Function secrets first." }); }
    if (action === "unlock") {
      let rate: { allowed: boolean; retryAfter: number };
      try { rate = await rateLimitUnlock(req); }
      catch { return respond(req, 503, { ok: false, message: "Owner access is temporarily unavailable. Try again later." }); }
      if (!rate.allowed) return respond(req, 429, { ok: false, message: "Too many unlock attempts. Wait 15 minutes before trying again." });
      const provided = typeof body.passphrase === "string" ? body.passphrase : "";
      if (provided.length > 1024 || !constantTimeEqual(key, provided)) return respond(req, 401, { ok: false, message: "The owner access key is incorrect." });
      return respond(req, 200, { ok: true, ...await createToken(key) });
    }
    if (!await verifyToken(req.headers.get(TOKEN_HEADER) ?? "", key)) return respond(req, 401, { ok: false, message: "Owner session expired. Unlock the feedback inbox again." });
    if (action === "unread-count") {
      try { return respond(req, 200, { ok: true, unreadCount: await unreadCount() }); }
      catch { return respond(req, 503, { ok: false, message: "Unread feedback count could not be loaded. Please refresh." }); }
    }
    if (action === "list") {
      const offset = Number(body.offset ?? 0), limit = Number(body.limit ?? 25);
      if (!Number.isInteger(offset) || offset < 0 || offset > 100000 || !Number.isInteger(limit) || limit < 1 || limit > 50) return respond(req, 400, { ok: false, message: "Invalid feedback page request." });
      try { return respond(req, 200, { ok: true, ...await listFeedback(offset, limit) }); }
      catch { return respond(req, 503, { ok: false, message: "Feedback messages could not be loaded. Please try again." }); }
    }
    if (action === "mark-read") {
      try { await markRead(clean(body.id)); return respond(req, 200, { ok: true }); }
      catch { return respond(req, 400, { ok: false, message: "This feedback could not be marked as read." }); }
    }
    return respond(req, 400, { ok: false, message: "Unsupported feedback inbox action." });
  } catch {
    return respond(req, 503, { ok: false, message: "The private feedback inbox is temporarily unavailable." });
  }
});
