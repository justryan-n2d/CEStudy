// Owner-only content review API. Draft lesson text and question answer keys are returned only after short-lived owner-token validation.
const DEFAULT_ALLOWED_ORIGINS = [
  "https://cestudy.pages.dev",
  "https://design-white-blue-responsive.cestudy.pages.dev",
  "http://localhost:5173",
];
const MAX_BODY_BYTES = 24_000;
const TOKEN_TTL_SECONDS = 30 * 60;
const TOKEN_HEADER = "x-cestudy-content-token";
type RecordValue = Record<string, unknown>;
type ContentStatus = "draft" | "needs-review" | "verified" | "published" | "correction-required" | "retired";
type Entity = "lesson" | "question";

function allowedOrigins(): string[] {
  const raw = Deno.env.get("ALLOWED_ORIGINS")?.trim();
  return [...new Set(raw ? raw.split(",").map((value) => value.trim()).filter(Boolean) : DEFAULT_ALLOWED_ORIGINS)];
}
function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (allowedOrigins().includes(origin)) return true;
  try {
    const parsed = new URL(origin);
    return parsed.protocol === "https:" && parsed.port === "" && parsed.origin === origin
      && /^[a-f0-9]{8}\.cestudy\.pages\.dev$/i.test(parsed.hostname);
  } catch { return false; }
}
function respond(req: Request, status: number, body: RecordValue) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Vary: "Origin",
  };
  const origin = req.headers.get("origin");
  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "authorization, apikey, x-client-info, content-type, x-cestudy-content-token";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(JSON.stringify(body), { status, headers });
}
function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function clean(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function ownerKey(): string {
  const value = Deno.env.get("FEEDBACK_INBOX_ACCESS_KEY")?.trim() ?? "";
  if (value.length < 32) throw new Error("owner_key_missing");
  return value;
}
function serviceKey(): string {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (legacy) return legacy;
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (raw) {
    try {
      const value = (JSON.parse(raw) as RecordValue).default;
      if (typeof value === "string" && value.trim()) return value.trim();
    } catch { /* fail closed */ }
  }
  throw new Error("service_key_missing");
}
function baseUrl(): string {
  const value = Deno.env.get("SUPABASE_URL")?.trim();
  if (!value) throw new Error("supabase_url_missing");
  return value.replace(/\/$/, "");
}
async function rest(path: string, method: string, body?: unknown, prefer?: string): Promise<Response> {
  const key = serviceKey();
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers.Prefer = prefer;
  return fetch(`${baseUrl()}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
async function digest(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function callerIdentity(req: Request): string {
  return req.headers.get("cf-connecting-ip")?.trim()
    || req.headers.get("x-real-ip")?.trim()
    || req.headers.get("x-forwarded-for")?.split(",").map((value) => value.trim()).find(Boolean)
    || "unidentified-client";
}
async function rateLimitUnlock(req: Request): Promise<boolean> {
  const key = serviceKey();
  const identityHash = await digest(`${callerIdentity(req)}:${key}`);
  const result = await rest("rpc/consume_public_submission_rate_limit", "POST", {
    p_identity_hash: identityHash,
    p_form_type: "inbox_auth",
    p_max_submissions: 5,
    p_window_seconds: 900,
  });
  if (!result.ok) throw new Error("unlock_rate_limit_unavailable");
  const rows = await result.json() as Array<{ allowed: boolean }>;
  if (!rows[0] || typeof rows[0].allowed !== "boolean") throw new Error("unlock_rate_limit_invalid");
  return rows[0].allowed;
}
function constantTimeEqual(expected: string, provided: string): boolean {
  const a = new TextEncoder().encode(expected), b = new TextEncoder().encode(provided);
  let difference = a.length ^ b.length;
  for (let index = 0, count = Math.max(a.length, b.length); index < count; index++) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return difference === 0;
}
function b64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function fromB64url(value: string): Uint8Array {
  const text = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = text + "=".repeat((4 - text.length % 4) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}
async function hmacKey(key: string) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
async function createToken(key: string) {
  const expiry = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const payload = b64url(new TextEncoder().encode(JSON.stringify({
    sub: "cestudy-content-review-owner",
    exp: expiry,
    nonce: crypto.randomUUID(),
  })));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(key), new TextEncoder().encode(payload));
  return { token: `${payload}.${b64url(new Uint8Array(signature))}`, expiresAt: new Date(expiry * 1000).toISOString() };
}
async function verifyToken(token: string, key: string): Promise<boolean> {
  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length) return false;
  try {
    if (!await crypto.subtle.verify("HMAC", await hmacKey(key), fromB64url(signature), new TextEncoder().encode(payload))) return false;
    const claims = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as RecordValue;
    const now = Math.floor(Date.now() / 1000);
    return claims.sub === "cestudy-content-review-owner"
      && typeof claims.exp === "number" && claims.exp > now && claims.exp <= now + TOKEN_TTL_SECONDS + 60
      && typeof claims.nonce === "string";
  } catch { return false; }
}
function reviewPath(entity: Entity, id: string, select: string): string | null {
  if (entity === "lesson" && /^algebra-foundations-unit-(?:0[0-9]|1[0-2])$/.test(id)) {
    const query = new URLSearchParams({ select, id: `eq.${id}`, subject_slug: "eq.basic-algebra" });
    return `subject_lessons?${query.toString()}`;
  }
  if (entity === "question" && /^algebra-foundations-u(?:0[0-9]|1[0-2])-q[0-9]{2}$/.test(id)) {
    const query = new URLSearchParams({ select, id: `eq.${id}`, subject_slug: "eq.basic-algebra" });
    return `practice_questions?${query.toString()}`;
  }
  return null;
}
function validatedText(value: unknown, maximum: number): string {
  if (typeof value !== "string") throw new Error("invalid_content_edits");
  const result = value.trim();
  if (!result || result.length > maximum) throw new Error("invalid_content_edits");
  return result;
}
function validatedStringList(value: unknown, minimum: number, maximum: number, itemMaximum: number): string[] {
  if (!Array.isArray(value) || value.length < minimum || value.length > maximum) throw new Error("invalid_content_edits");
  const result = value.map((item) => validatedText(item, itemMaximum));
  if (new Set(result).size !== result.length) throw new Error("invalid_content_edits");
  return result;
}
function validatedContentEdits(entity: Entity, value: unknown): RecordValue {
  if (!isRecord(value)) throw new Error("invalid_content_edits");
  if (entity === "lesson") {
    return {
      title: validatedText(value.title, 180),
      learning_objectives: validatedStringList(value.learningObjectives, 1, 8, 400),
      lesson_markdown: validatedText(value.lessonMarkdown, 20000),
      source_note: validatedText(value.sourceNote, 1200),
    };
  }
  const choices = validatedStringList(value.choices, 2, 8, 240);
  const correctAnswer = validatedText(value.correctAnswer, 240);
  if (!choices.includes(correctAnswer)) throw new Error("invalid_content_edits");
  return {
    topic: validatedText(value.topic, 120),
    prompt: validatedText(value.prompt, 1200),
    choices,
    correct_answer: correctAnswer,
    solution_steps: validatedStringList(value.solutionSteps, 1, 12, 2000),
    explanation: validatedText(value.explanation, 1000),
    source_note: validatedText(value.sourceNote, 500),
  };
}
function currentStatus(value: unknown): value is ContentStatus {
  return typeof value === "string" && [
    "draft", "needs-review", "verified", "published", "correction-required", "retired",
  ].includes(value);
}
const ACTIONS: Record<string, { from: ContentStatus[]; to: ContentStatus; needsNote?: boolean }> = {
  verify: { from: ["needs-review"], to: "verified" },
  request-correction: { from: ["needs-review", "verified", "published"], to: "correction-required", needsNote: true },
  publish: { from: ["verified"], to: "published" },
  return-to-review: { from: ["verified", "published", "correction-required", "draft"], to: "needs-review" },
};
async function listReviewContent() {
  const lessonQuery = new URLSearchParams({
    select: "id,subject_slug,unit_number,slug,title,learning_objectives,lesson_markdown,source_note,status,review_notes,reviewed_at,updated_at",
    subject_slug: "eq.basic-algebra",
    order: "unit_number.asc",
    limit: "50",
  });
  const questionQuery = new URLSearchParams({
    select: "id,subject_slug,topic,prompt,choices,correct_answer,solution_steps,explanation,source_note,status,review_notes,reviewed_at,updated_at,display_order",
    subject_slug: "eq.basic-algebra",
    id: "like.algebra-foundations-*",
    order: "display_order.asc",
    limit: "100",
  });
  const [lessonsResponse, questionsResponse] = await Promise.all([
    rest(`subject_lessons?${lessonQuery.toString()}`, "GET"),
    rest(`practice_questions?${questionQuery.toString()}`, "GET"),
  ]);
  if (!lessonsResponse.ok || !questionsResponse.ok) throw new Error("review_content_load_failed");
  const [lessons, questions] = await Promise.all([lessonsResponse.json(), questionsResponse.json()]);
  if (!Array.isArray(lessons) || !Array.isArray(questions)) throw new Error("review_content_invalid");
  return { lessons, questions };
}
async function changeStatus(body: RecordValue) {
  const entity = clean(body.entity);
  const id = clean(body.id);
  const action = clean(body.actionName);
  const transition = ACTIONS[action];
  if ((entity !== "lesson" && entity !== "question") || !transition) throw new Error("invalid_review_action");
  const select = "id,status,review_notes,reviewed_at";
  const getPath = reviewPath(entity, id, select);
  if (!getPath) throw new Error("invalid_content_id");

  const currentResponse = await rest(getPath, "GET");
  if (!currentResponse.ok) throw new Error("review_content_read_failed");
  const rows = await currentResponse.json() as Array<RecordValue>;
  const current = rows[0];
  if (!current) throw new Error("review_content_not_found");
  if (!currentStatus(current.status) || !transition.from.includes(current.status)) throw new Error("review_status_conflict");

  const hasNotes = typeof body.reviewNotes === "string";
  const notes = hasNotes ? clean(body.reviewNotes) : clean(current.review_notes);
  if (notes.length > 4000 || (transition.needsNote && notes.length < 8)) throw new Error("review_note_required");
  const edits = action === "save-edits" ? validatedContentEdits(entity as Entity, body.contentEdits) : {};

  const table = entity === "lesson" ? "subject_lessons" : "practice_questions";
  const query = new URLSearchParams({
    id: `eq.${id}`,
    subject_slug: "eq.basic-algebra",
    status: `eq.${current.status}`,
  });
  const now = new Date().toISOString();
  const update: RecordValue = {
    ...edits,
    status: transition.to,
    review_notes: notes,
    reviewed_at: transition.to === "verified" ? now : (transition.to === "needs-review" && (action === "save-edits" || action === "return-to-review")) ? null : current.reviewed_at ?? null,
    updated_at: now,
  };
  const changed = await rest(`${table}?${query.toString()}`, "PATCH", update, "return=representation");
  if (!changed.ok) throw new Error("review_status_update_failed");
  const changedRows = await changed.json() as unknown;
  if (!Array.isArray(changedRows) || changedRows.length !== 1) throw new Error("review_status_conflict");

  let catalogAvailabilitySync = true;
  try { await syncCatalogAvailability(); } catch { catalogAvailabilitySync = false; }
  return { status: transition.to, catalogAvailabilitySync };
}
async function syncCatalogAvailability() {
  const [lessonsResponse, questionsResponse] = await Promise.all([
    rest("subject_lessons?select=id&subject_slug=eq.basic-algebra&status=eq.published&limit=1", "GET"),
    rest("practice_questions?select=id&subject_slug=eq.basic-algebra&status=eq.published&limit=1", "GET"),
  ]);
  if (!lessonsResponse.ok || !questionsResponse.ok) throw new Error("catalog_sync_read_failed");
  const [lessons, questions] = await Promise.all([lessonsResponse.json(), questionsResponse.json()]);
  const availability = Array.isArray(lessons) && lessons.length > 0 || Array.isArray(questions) && questions.length > 0
    ? "has-published-content" : "in-preparation";
  const query = new URLSearchParams({ slug: "eq.basic-algebra" });
  const result = await rest(`catalog_subjects?${query.toString()}`, "PATCH", { availability }, "return=minimal");
  if (!result.ok) throw new Error("catalog_sync_update_failed");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (!isAllowedOrigin(origin)) return respond(req, 403, { ok: false, message: "This origin is not allowed." });
  if (req.method === "OPTIONS") return new Response("ok", { headers: respond(req, 200, { ok: true }).headers });
  if (req.method !== "POST") return respond(req, 405, { ok: false, message: "Method not allowed." });
  if (Number(req.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return respond(req, 413, { ok: false, message: "Request body is too large." });

  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return respond(req, 413, { ok: false, message: "Request body is too large." });
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return respond(req, 400, { ok: false, message: "Invalid request body." }); }
    if (!isRecord(body)) return respond(req, 400, { ok: false, message: "Invalid request body." });
    const action = clean(body.action);
    let key: string;
    try { key = ownerKey(); serviceKey(); baseUrl(); }
    catch { return respond(req, 503, { ok: false, message: "Content review access is not configured. Check the private Edge Function secrets." }); }

    if (action === "unlock") {
      let allowed = false;
      try { allowed = await rateLimitUnlock(req); }
      catch { return respond(req, 503, { ok: false, message: "Owner access is temporarily unavailable. Try again later." }); }
      if (!allowed) return respond(req, 429, { ok: false, message: "Too many unlock attempts. Wait 15 minutes before trying again." });
      const provided = typeof body.passphrase === "string" ? body.passphrase : "";
      if (provided.length > 1024 || !constantTimeEqual(key, provided)) return respond(req, 401, { ok: false, message: "The owner access key is incorrect." });
      return respond(req, 200, { ok: true, ...await createToken(key) });
    }

    const token = req.headers.get(TOKEN_HEADER) ?? "";
    if (!await verifyToken(token, key)) return respond(req, 401, { ok: false, message: "Owner session expired. Unlock content review again." });
    if (action === "list") {
      try { return respond(req, 200, { ok: true, ...await listReviewContent() }); }
      catch { return respond(req, 503, { ok: false, message: "Draft lessons and questions could not be loaded. Try again." }); }
    }
    if (action === "review") {
      try {
        const result = await changeStatus(body);
        return respond(req, 200, { ok: true, ...result });
      } catch (error) {
        const code = error instanceof Error ? error.message : "review_action_failed";
        const status = code === "review_content_not_found" ? 404
          : code === "review_status_conflict" ? 409
          : ["invalid_review_action", "invalid_content_id", "review_note_required", "invalid_content_edits"].includes(code) ? 400 : 503;
        const message = ({
          invalid_review_action: "That review action is not allowed.",
          invalid_content_id: "The content item ID is not allowed.",
          review_note_required: "Add a short correction note before requesting changes.",
          invalid_content_edits: "Check the edited text. Required fields, lengths, unique choices, and the correct-answer match must be valid.",
          review_content_not_found: "The content item could not be found.",
          review_status_conflict: "The item's status changed. Refresh the review list and try again.",
        } as Record<string, string>)[code] ?? "The review status could not be updated. Please try again.";
        return respond(req, status, { ok: false, message });
      }
    }
    return respond(req, 400, { ok: false, message: "Unsupported content review action." });
  } catch {
    return respond(req, 503, { ok: false, message: "Content review is temporarily unavailable. Try again later." });
  }
});
