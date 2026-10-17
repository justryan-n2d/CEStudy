import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "../components/Modal";
import { submitPublicMessage } from "../data/public-messages";

const categories = [
  { value: "general", label: "General feedback" },
  { value: "content", label: "Content correction" },
  { value: "usability", label: "Website usability" },
  { value: "accessibility", label: "Accessibility" },
  { value: "feature", label: "Feature request" },
  { value: "other", label: "Other" },
] as const;

function newSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, character => {
    const random = Math.floor(Math.random() * 16);
    return (character === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}

export function FeedbackPage() {
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("general");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const submissionId = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    submissionId.current ??= newSubmissionId();

    try {
      await submitPublicMessage({
        type: "feedback",
        clientSubmissionId: submissionId.current,
        category,
        message: message.trim(),
      });
      setCategory("general");
      setMessage("");
      submissionId.current = null;
      setSuccessOpen(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-wrap form-page-wrap">
      <section className="page-intro">
        <h1>Feedback</h1>
        <p>Send feedback privately and anonymously. Accounts are not required.</p>
      </section>

      <form className="surface-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Feedback type</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
            {categories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Message <span className="required-mark" aria-hidden="true">*</span></span>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={10} maxLength={4000} rows={7} placeholder="What should we know?" />
          <small className="field-hint">{message.length}/4000 characters</small>
        </label>

        {error && <p className="inline-status inline-status-error" role="alert">{error}</p>}
        <button className="button button-primary" type="submit" disabled={sending}>
          {sending ? <><span className="loading-spinner" aria-hidden="true" /> Sending message...</> : "Send message"}
        </button>
        <p className="field-hint">Feedback is not public. Only addresses authorized by CEStudy receive the message notification.</p>
      </form>

      {successOpen && (
        <Modal title="message sent!" onClose={() => setSuccessOpen(false)} className="success-modal">
          <span className="success-mark" aria-hidden="true">✓</span>
          <p>Your feedback has been delivered to the authorized CEStudy inbox.</p>
          <button className="button button-primary" type="button" onClick={() => setSuccessOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}
