import { supabase } from "../lib/supabase";

export const FEEDBACK_INBOX_SESSION_EVENT = "cestudy-feedback-inbox-session";
export type FeedbackCategory = "general" | "content" | "usability" | "accessibility" | "feature" | "other";
export type FeedbackRecord = { id: string; category: FeedbackCategory; message: string; created_at: string; read_at: string | null };
type InboxReply = { ok?: boolean; message?: string; token?: string; expiresAt?: string; messages?: FeedbackRecord[]; unreadCount?: number; hasMore?: boolean };

let activeToken: string | null = null;
let activeTokenExpiresAt = 0;

function notifySessionChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(FEEDBACK_INBOX_SESSION_EVENT));
}
export function getFeedbackInboxSessionToken(): string | null {
  if (!activeToken || Date.now() >= activeTokenExpiresAt) {
    if (activeToken) clearFeedbackInboxSession();
    return null;
  }
  return activeToken;
}
export function clearFeedbackInboxSession() {
  activeToken = null;
  activeTokenExpiresAt = 0;
  notifySessionChange();
}
async function throwFunctionError(error: unknown, ownerAction: boolean): Promise<never> {
  const context = error && typeof error === "object" ? (error as { context?: Response }).context : undefined;
  let message = "";
  if (context) {
    const body = await context.clone().json().catch(() => null) as { message?: unknown } | null;
    if (typeof body?.message === "string" && body.message.trim()) message = body.message.trim();
  }
  if (ownerAction && context?.status === 401) clearFeedbackInboxSession();
  if (message) throw new Error(message);
  if (context?.status === 429) throw new Error("Too many unlock attempts. Wait before trying again.");
  throw new Error("The feedback inbox is temporarily unavailable. Check your connection and try again.");
}
async function invokeInbox(body: Record<string, unknown>, ownerAction: boolean): Promise<InboxReply> {
  if (!supabase) throw new Error("The feedback inbox service is not configured yet.");
  const token = ownerAction ? getFeedbackInboxSessionToken() : null;
  if (ownerAction && !token) throw new Error("Your owner session has expired. Unlock the inbox again.");
  const { data, error } = await supabase.functions.invoke<InboxReply>("feedback-inbox-admin", {
    body, ...(token ? { headers: { "x-feedback-inbox-token": token } } : {}),
  });
  if (error) await throwFunctionError(error, ownerAction);
  if (!data?.ok) throw new Error(data?.message || "The feedback inbox request failed. Please try again.");
  return data;
}
export async function unlockFeedbackInbox(passphrase: string): Promise<void> {
  if (!passphrase.trim()) throw new Error("Enter the owner access key.");
  const result = await invokeInbox({ action: "unlock", passphrase }, false);
  const expiry = result.expiresAt ? new Date(result.expiresAt).getTime() : 0;
  if (!result.token || !Number.isFinite(expiry) || expiry <= Date.now()) throw new Error("The inbox service returned an invalid access session.");
  activeToken = result.token;
  activeTokenExpiresAt = expiry;
  notifySessionChange();
}
export function lockFeedbackInbox() { clearFeedbackInboxSession(); }
export async function listFeedbackMessages(offset = 0, limit = 25): Promise<{ messages: FeedbackRecord[]; hasMore: boolean }> {
  const result = await invokeInbox({ action: "list", offset, limit }, true);
  return { messages: result.messages ?? [], hasMore: result.hasMore === true };
}
export async function getUnreadFeedbackCount(): Promise<number> {
  const result = await invokeInbox({ action: "unread-count" }, true);
  return Math.max(0, Math.floor(Number(result.unreadCount) || 0));
}
export async function markFeedbackMessageRead(id: string): Promise<void> {
  await invokeInbox({ action: "mark-read", id }, true);
}
