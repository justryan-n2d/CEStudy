import { supabase } from "../lib/supabase";
import type { ContentStatus, ReviewPracticeQuestion, SubjectLesson } from "../types/lesson-content";
import { parseReviewPracticeQuestion, parseSubjectLesson } from "../types/lesson-content";

const SESSION_TTL_FALLBACK = 30 * 60 * 1000;
export const CONTENT_REVIEW_SESSION_EVENT = "cestudy-content-review-session";
export type ReviewAction = "verify" | "request-correction" | "publish" | "return-to-review" | "save-edits";

export type LessonEdits = {
  title: string;
  learningObjectives: string[];
  lessonMarkdown: string;
  sourceNote: string;
};

export type QuestionEdits = {
  topic: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  solutionSteps: string[];
  explanation: string;
  sourceNote: string;
};

export type ContentEdits = LessonEdits | QuestionEdits;

type ApiReply = {
  ok?: boolean;
  message?: string;
  token?: string;
  expiresAt?: string;
  lessons?: unknown[];
  questions?: unknown[];
  status?: ContentStatus;
  catalogAvailabilitySync?: boolean;
};

export interface ContentReviewBundle {
  lessons: SubjectLesson[];
  questions: ReviewPracticeQuestion[];
}

let activeToken: string | null = null;
let activeTokenExpiresAt = 0;

function notifySessionChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(CONTENT_REVIEW_SESSION_EVENT));
}

export function getContentReviewSessionToken(): string | null {
  if (!activeToken || Date.now() >= activeTokenExpiresAt) {
    clearContentReviewSession(false);
    return null;
  }
  return activeToken;
}

export function clearContentReviewSession(notify = true) {
  activeToken = null;
  activeTokenExpiresAt = 0;
  if (notify) notifySessionChange();
}

async function readFunctionError(error: unknown): Promise<never> {
  const candidate = error && typeof error === "object"
    ? (error as { context?: unknown }).context
    : undefined;
  const context = candidate && typeof candidate === "object" ? candidate as { status?: unknown; clone?: unknown } : undefined;
  const status = typeof context?.status === "number" ? context.status : undefined;
  let message = "";
  if (status === 401) clearContentReviewSession();
  if (typeof context?.clone === "function") {
    try {
      const cloned = (context.clone as () => unknown).call(candidate);
      if (cloned && typeof cloned === "object" && "json" in cloned && typeof (cloned as { json?: unknown }).json === "function") {
        const body = await (cloned as { json: () => Promise<unknown> }).json().catch(() => null) as { message?: unknown } | null;
        if (typeof body?.message === "string" && body.message.trim()) message = body.message.trim();
      }
    } catch {
      // Malformed error bodies should fall back to a stable client-side message.
    }
  }
  if (message) throw new Error(message);
  if (status === 401) throw new Error("Your owner session has expired. Unlock content review again.");
  if (status === 429) throw new Error("Too many unlock attempts. Wait before trying again.");
  throw new Error("Content review is temporarily unavailable. Check your connection and try again.");
}
async function invokeReview(body: Record<string, unknown>, ownerAction: boolean): Promise<ApiReply> {
  if (!supabase) throw new Error("Content review is not configured yet.");
  const token = ownerAction ? getContentReviewSessionToken() : null;
  if (ownerAction && !token) throw new Error("Your owner session expired. Unlock content review again.");

  const { data, error } = await supabase.functions.invoke<ApiReply>("content-review-admin", {
    body,
    ...(token ? { headers: { "x-cestudy-content-token": token } } : {}),
  });
  if (error) await readFunctionError(error);
  if (!data?.ok) throw new Error(data?.message || "The content review request failed.");
  return data;
}

export async function unlockContentReview(passphrase: string): Promise<void> {
  if (!passphrase.trim()) throw new Error("Enter the owner access key.");
  const result = await invokeReview({ action: "unlock", passphrase }, false);
  const expiry = result.expiresAt ? new Date(result.expiresAt).getTime() : 0;
  if (!result.token || !Number.isFinite(expiry) || expiry <= Date.now() || expiry > Date.now() + SESSION_TTL_FALLBACK + 60_000) {
    throw new Error("The content review service returned an invalid session.");
  }
  activeToken = result.token;
  activeTokenExpiresAt = expiry;
  notifySessionChange();
}

export function lockContentReview() {
  clearContentReviewSession();
}

export async function fetchContentReviewBundle(): Promise<ContentReviewBundle> {
  const result = await invokeReview({ action: "list" }, true);
  const lessons = (result.lessons ?? []).map(parseSubjectLesson).filter((item): item is SubjectLesson => item !== null);
  const questions = (result.questions ?? []).map(parseReviewPracticeQuestion).filter((item): item is ReviewPracticeQuestion => item !== null);
  return { lessons, questions };
}

export async function updateContentReviewStatus(
  entity: "lesson" | "question",
  id: string,
  actionName: ReviewAction,
  reviewNotes?: string,
  edits?: ContentEdits,
): Promise<{ status: ContentStatus; catalogAvailabilitySync: boolean }> {
  const result = await invokeReview({
    action: "review",
    entity,
    id,
    actionName,
    ...(reviewNotes !== undefined ? { reviewNotes } : {}),
    ...(edits !== undefined ? { contentEdits: edits } : {}),
  }, true);
  if (!result.status) throw new Error("The content review service returned an invalid status.");
  return { status: result.status, catalogAvailabilitySync: result.catalogAvailabilitySync !== false };
}
