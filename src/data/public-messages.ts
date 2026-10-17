import { supabase } from "../lib/supabase";

export type PublicMessageSubmission =
  | {
      type: "feedback";
      clientSubmissionId: string;
      category: "general" | "content" | "usability" | "accessibility" | "feature" | "other";
      message: string;
    }
  | {
      type: "support";
      clientSubmissionId: string;
      provider: "gcash" | "paypal";
      message: string;
      confirmed: true;
    };

type FunctionReply = { ok?: boolean; message?: string };

export async function submitPublicMessage(payload: PublicMessageSubmission): Promise<void> {
  if (!supabase) {
    throw new Error("Secure message sending is not configured yet. Please try again later.");
  }

  const { data, error } = await supabase.functions.invoke<FunctionReply>("submit-public-message", {
    body: payload,
  });

  if (error) {
    const context = (error as unknown as { context?: Response }).context;
    const details = context
      ? await context.clone().json().catch(() => null) as FunctionReply | null
      : null;
    if (typeof details?.message === "string" && details.message.trim()) {
      throw new Error(details.message);
    }
    throw new Error("We couldn't send this message. Check your connection and try again.");
  }

  if (!data?.ok) {
    throw new Error(data?.message || "We couldn't send this message. Please try again.");
  }
}
