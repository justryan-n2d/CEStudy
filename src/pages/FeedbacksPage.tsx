import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FormEvent } from "react";
import {
  FEEDBACK_INBOX_SESSION_EVENT, getFeedbackInboxSessionToken, getUnreadFeedbackCount,
  listFeedbackMessages, lockFeedbackInbox, markFeedbackMessageRead, unlockFeedbackInbox,
  setFeedbackMessagePinned, deleteFeedbackMessage,
} from "../data/feedback-inbox";
import type { FeedbackRecord } from "../data/feedback-inbox";

function readableDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
function categoryLabel(category: string): string {
  const labels: Record<string, string> = { general: "General feedback", content: "Content correction", usability: "Website usability", accessibility: "Accessibility", feature: "Feature request", other: "Other" };
  return labels[category] ?? "Feedback";
}

type FeedbackIconName = "more" | "pin" | "trash";
function FeedbackIcon({ name }: { name: FeedbackIconName }) {
  return <svg className="feedback-action-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {name === "more" ? <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>
      : name === "pin" ? <><path d="m16 3 5 5-4 1-4 4-1 4-3-3-3-3 4-1 4-4z"/><path d="M12 17v4"/></>
      : <><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 10v6M14 10v6"/></>}
  </svg>;
}

export function FeedbacksPage() {
  const [unlocked, setUnlocked] = useState(() => Boolean(getFeedbackInboxSessionToken()));
  const [passphrase, setPassphrase] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [messages, setMessages] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setUnlocked(Boolean(getFeedbackInboxSessionToken()));
    window.addEventListener(FEEDBACK_INBOX_SESSION_EVENT, sync);
    return () => window.removeEventListener(FEEDBACK_INBOX_SESSION_EVENT, sync);
  }, []);

  const loadInbox = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [page, unread] = await Promise.all([listFeedbackMessages(0, 25), getUnreadFeedbackCount()]);
      setMessages(page.messages); setHasMore(page.hasMore); setUnreadCount(unread); setSelectedId(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Feedback messages could not be loaded.");
      if (!getFeedbackInboxSessionToken()) setUnlocked(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (unlocked) void loadInbox(); }, [unlocked, loadInbox]);

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (unlocking) return;
    setUnlocking(true); setUnlockError("");
    try { await unlockFeedbackInbox(passphrase); setPassphrase(""); setUnlocked(true); }
    catch (reason) { setUnlockError(reason instanceof Error ? reason.message : "The inbox could not be unlocked."); }
    finally { setUnlocking(false); }
  }

  async function handleOpenMessage(message: FeedbackRecord) {
    setSelectedId(current => current === message.id ? null : message.id);
    setError("");
    if (!message.read_at) {
      try {
        await markFeedbackMessageRead(message.id);
        setMessages(current => current.map(item => item.id === message.id ? { ...item, read_at: new Date().toISOString() } : item));
        setUnreadCount(current => Math.max(0, current - 1));
      } catch (reason) { setError(reason instanceof Error ? reason.message : "This feedback could not be marked as read."); }
    }
  }

  async function handleTogglePin(message: FeedbackRecord) {
    setOpenMenuId(null); setPendingActionId(message.id); setError("");
    try {
      await setFeedbackMessagePinned(message.id, !message.is_pinned);
      await loadInbox();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This feedback could not be updated.");
    } finally { setPendingActionId(null); }
  }

  async function handleDelete(message: FeedbackRecord) {
    setOpenMenuId(null);
    if (!window.confirm("Delete this feedback permanently? This cannot be undone.")) return;
    setPendingActionId(message.id); setError("");
    try {
      await deleteFeedbackMessage(message.id);
      await loadInbox();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This feedback could not be deleted.");
    } finally { setPendingActionId(null); }
  }

  async function handleLoadOlder() {
    if (loadingOlder || !hasMore) return;
    setLoadingOlder(true); setError("");
    try {
      const page = await listFeedbackMessages(messages.length, 25);
      setMessages(current => [...current, ...page.messages]); setHasMore(page.hasMore);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Older feedback could not be loaded."); }
    finally { setLoadingOlder(false); }
  }

  function handleLock() {
    lockFeedbackInbox(); setMessages([]); setUnreadCount(0); setSelectedId(null); setUnlocked(false);
  }

  if (!unlocked) return (
    <div className="page-wrap form-page-wrap feedback-inbox-wrap">
      <section className="page-intro"><span className="kicker">Private area</span><h1>Feedbacks</h1><p>This inbox is only for the CEStudy owner. Visitor messages remain anonymous.</p></section>
      <form className="surface-form feedback-inbox-unlock" onSubmit={handleUnlock}>
        <h2>Unlock feedback inbox</h2>
        <label className="form-field"><span>Owner access key</span>
          <input type="password" value={passphrase} onChange={event => setPassphrase(event.target.value)} autoComplete="off" maxLength={1024} required disabled={unlocking} placeholder="Enter your private access key" />
        </label>
        {unlockError && <p className="inline-status inline-status-error" role="alert">{unlockError}</p>}
        <button className="button button-primary" type="submit" disabled={unlocking || !passphrase.trim()}>
          {unlocking ? <><span className="loading-spinner" aria-hidden="true" /> Unlocking...</> : "Unlock inbox"}
        </button>
        <p className="field-hint">The app does not store the access key. The owner session lasts 30 minutes.</p>
      </form>
    </div>
  );

  return (
    <div className="page-wrap feedback-inbox-wrap">
      <section className="page-intro feedback-inbox-heading">
        <div><span className="kicker">Owner-only</span><h1>Feedbacks</h1><p>{unreadCount} unread {unreadCount === 1 ? "message" : "messages"}. Visitors appear as Anonymous until CEStudy accounts exist.</p></div>
        <div className="feedback-inbox-actions">
          <Link className="button button-secondary" to="/owner/content-review">Review lessons and questions</Link>
          <button className="button button-secondary" type="button" onClick={() => void loadInbox()} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
          <button className="button button-secondary" type="button" onClick={handleLock}>Lock inbox</button>
        </div>
      </section>
      {error && <p className="inline-status inline-status-error" role="alert">{error}</p>}
      {loading ? <div className="state-panel feedback-inbox-state" role="status"><span className="loading-spinner" aria-hidden="true" /> Loading feedback...</div>
      : messages.length === 0 ? <div className="state-panel feedback-inbox-state"><h2>No feedback yet</h2><p>New anonymous messages will appear here with the date and time they were sent.</p></div>
      : <section className="feedback-inbox-layout" aria-label="Feedback messages">
        <div className="feedback-message-list">{messages.map(message => {
          const selected = selectedId === message.id, unread = !message.read_at;
          return <article key={message.id} className={"feedback-message-card" + (selected ? " selected" : "") + (unread ? " unread" : "") + (openMenuId === message.id ? " has-open-feedback-menu" : "")}>
            <div className="feedback-message-topline">
              <button type="button" className="feedback-message-summary" onClick={() => void handleOpenMessage(message)} aria-expanded={selected}>
                <span className="feedback-message-heading"><span className="feedback-message-anonymous">Anonymous</span>{unread && <span className="feedback-message-new">New</span>}</span>
                <strong>{categoryLabel(message.category)}</strong><span className="feedback-message-preview">{message.message}</span>
                <time dateTime={message.created_at}>{readableDate(message.created_at)}</time>
              </button>
              <div className="feedback-message-controls">
                {message.is_pinned && <span className="feedback-pin-indicator" title="Pinned" aria-label="Pinned feedback"><FeedbackIcon name="pin" /></span>}
                <button className="feedback-message-more" type="button" aria-label="More feedback actions" aria-haspopup="menu"
                  aria-expanded={openMenuId === message.id} disabled={pendingActionId !== null}
                  onClick={() => setOpenMenuId(current => current === message.id ? null : message.id)}>
                  <FeedbackIcon name="more" />
                </button>
                {openMenuId === message.id && <div className="feedback-action-menu" role="menu" aria-label="Feedback actions">
                  <button type="button" role="menuitem" disabled={pendingActionId !== null} onClick={() => void handleTogglePin(message)}>
                    <FeedbackIcon name="pin" />{message.is_pinned ? "Unpin" : "Pin"}
                  </button>
                  <button type="button" role="menuitem" className="feedback-delete-action" disabled={pendingActionId !== null} onClick={() => void handleDelete(message)}>
                    <FeedbackIcon name="trash" />Delete
                  </button>
                </div>}
              </div>
            </div>
            {selected && <div className="feedback-message-detail"><p>{message.message}</p><small>Sent {readableDate(message.created_at)}</small></div>}
          </article>;
        })}</div>
        {hasMore && <div className="feedback-inbox-more"><button className="button button-secondary" type="button" onClick={() => void handleLoadOlder()} disabled={loadingOlder}>{loadingOlder ? "Loading..." : "Load older feedback"}</button></div>}
      </section>}
    </div>
  );
}
