import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { MarkdownContent } from "../components/MarkdownContent";
import {
  CONTENT_REVIEW_SESSION_EVENT,
  fetchContentReviewBundle,
  getContentReviewSessionToken,
  lockContentReview,
  unlockContentReview,
  updateContentReviewStatus,
  type ContentEdits,
  type ContentReviewBundle,
  type ReviewAction,
} from "../data/content-review-api";
import type { ContentStatus, ReviewPracticeQuestion, SubjectLesson } from "../types/lesson-content";

type ReviewTab = "lessons" | "questions";
const statusLabels: Record<ContentStatus, string> = {
  draft: "Draft",
  "needs-review": "Needs review",
  verified: "Verified by maintainer",
  published: "Published",
  "correction-required": "Correction required",
  retired: "Retired",
};
function statusClass(status: ContentStatus): string {
  if (status === "published") return "status status-ready";
  if (status === "verified") return "status status-verified";
  if (status === "needs-review" || status === "correction-required") return "status status-progress";
  return "status";
}
function activeLesson(bundle: ContentReviewBundle | null, id: string | null): SubjectLesson | null {
  return bundle?.lessons.find((lesson) => lesson.id === id) ?? null;
}
function activeQuestion(bundle: ContentReviewBundle | null, id: string | null): ReviewPracticeQuestion | null {
  return bundle?.questions.find((question) => question.id === id) ?? null;
}
function splitLines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export function ContentReviewPage() {
  const [unlocked, setUnlocked] = useState(() => Boolean(getContentReviewSessionToken()));
  const [passphrase, setPassphrase] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [bundle, setBundle] = useState<ContentReviewBundle | null>(null);
  const [tab, setTab] = useState<ReviewTab>("lessons");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonObjectives, setEditLessonObjectives] = useState("");
  const [editLessonMarkdown, setEditLessonMarkdown] = useState("");
  const [editLessonSourceNote, setEditLessonSourceNote] = useState("");
  const [editQuestionTopic, setEditQuestionTopic] = useState("");
  const [editQuestionPrompt, setEditQuestionPrompt] = useState("");
  const [editQuestionChoices, setEditQuestionChoices] = useState("");
  const [editQuestionAnswer, setEditQuestionAnswer] = useState("");
  const [editQuestionSteps, setEditQuestionSteps] = useState("");
  const [editQuestionExplanation, setEditQuestionExplanation] = useState("");
  const [editQuestionSourceNote, setEditQuestionSourceNote] = useState("");

  const lesson = activeLesson(bundle, selectedLessonId);
  const question = activeQuestion(bundle, selectedQuestionId);
  const current = tab === "lessons" ? lesson : question;
  const items = tab === "lessons" ? bundle?.lessons ?? [] : bundle?.questions ?? [];
  const hasUnsavedEdits = Boolean(
    current && (current.status === "needs-review" || current.status === "correction-required")
      && (tab === "lessons" && "lessonMarkdown" in current
        ? editLessonTitle.trim() !== current.title
          || JSON.stringify(splitLines(editLessonObjectives)) !== JSON.stringify(current.learningObjectives)
          || editLessonMarkdown !== current.lessonMarkdown
          || editLessonSourceNote.trim() !== current.sourceNote
        : tab === "questions" && "correctAnswer" in current
          ? editQuestionTopic.trim() !== current.topic
            || editQuestionPrompt.trim() !== current.prompt
            || JSON.stringify(splitLines(editQuestionChoices)) !== JSON.stringify(current.choices)
            || editQuestionAnswer.trim() !== current.correctAnswer
            || JSON.stringify(splitLines(editQuestionSteps)) !== JSON.stringify(current.solutionSteps)
            || editQuestionExplanation.trim() !== current.explanation
            || editQuestionSourceNote.trim() !== current.sourceNote
          : false),
  );

  const counts = useMemo(() => {
    const all = [...(bundle?.lessons ?? []), ...(bundle?.questions ?? [])];
    return {
      total: all.length,
      pending: all.filter((item) => item.status === "needs-review" || item.status === "correction-required" || item.status === "draft").length,
      verified: all.filter((item) => item.status === "verified").length,
      published: all.filter((item) => item.status === "published").length,
    };
  }, [bundle]);

  const loadBundle = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await fetchContentReviewBundle();
      setBundle(next);
      setSelectedLessonId((currentId) => currentId && next.lessons.some((item) => item.id === currentId)
        ? currentId
        : next.lessons.find((item) => item.status !== "published")?.id ?? next.lessons[0]?.id ?? null);
      setSelectedQuestionId((currentId) => currentId && next.questions.some((item) => item.id === currentId)
        ? currentId
        : next.questions.find((item) => item.status !== "published")?.id ?? next.questions[0]?.id ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Content review could not be loaded.");
      if (!getContentReviewSessionToken()) setUnlocked(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const sync = () => setUnlocked(Boolean(getContentReviewSessionToken()));
    window.addEventListener(CONTENT_REVIEW_SESSION_EVENT, sync);
    return () => window.removeEventListener(CONTENT_REVIEW_SESSION_EVENT, sync);
  }, []);

  useEffect(() => { if (unlocked) void loadBundle(); }, [unlocked, loadBundle]);

  useEffect(() => {
    setReviewNotes(current?.reviewNotes ?? "");
    setReviewConfirmed(false);
    setNotice("");
    if (tab === "lessons" && current && "lessonMarkdown" in current) {
      setEditLessonTitle(current.title);
      setEditLessonObjectives(current.learningObjectives.join("\n"));
      setEditLessonMarkdown(current.lessonMarkdown);
      setEditLessonSourceNote(current.sourceNote);
    }
    if (tab === "questions" && current && "correctAnswer" in current) {
      setEditQuestionTopic(current.topic);
      setEditQuestionPrompt(current.prompt);
      setEditQuestionChoices(current.choices.join("\n"));
      setEditQuestionAnswer(current.correctAnswer);
      setEditQuestionSteps(current.solutionSteps.join("\n"));
      setEditQuestionExplanation(current.explanation);
      setEditQuestionSourceNote(current.sourceNote);
    }
  }, [tab, current]);

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (unlocking) return;
    setUnlocking(true);
    setUnlockError("");
    try {
      await unlockContentReview(passphrase);
      setPassphrase("");
      setUnlocked(true);
    } catch (reason) {
      setUnlockError(reason instanceof Error ? reason.message : "Content review could not be unlocked.");
    } finally { setUnlocking(false); }
  }

  function handleLock() {
    lockContentReview();
    setBundle(null);
    setReviewNotes("");
    setReviewConfirmed(false);
    setUnlocked(false);
    setNotice("");
    setError("");
  }

  function buildContentEdits(): ContentEdits {
    if (tab === "lessons") {
      return {
        title: editLessonTitle.trim(),
        learningObjectives: splitLines(editLessonObjectives),
        lessonMarkdown: editLessonMarkdown,
        sourceNote: editLessonSourceNote.trim(),
      };
    }
    return {
      topic: editQuestionTopic.trim(),
      prompt: editQuestionPrompt.trim(),
      choices: splitLines(editQuestionChoices),
      correctAnswer: editQuestionAnswer.trim(),
      solutionSteps: splitLines(editQuestionSteps),
      explanation: editQuestionExplanation.trim(),
      sourceNote: editQuestionSourceNote.trim(),
    };
  }

  async function runAction(action: ReviewAction) {
    if (!current || busy) return;
    if (action !== "save-edits" && hasUnsavedEdits) {
      setError("Save your edits before changing this item's review status.");
      return;
    }
    if (action === "verify" && !reviewConfirmed) {
      setError(tab === "lessons"
        ? "Confirm that you reviewed the lesson before marking it verified."
        : "Confirm that you reviewed the prompt, choices, answer, and solution before marking it verified.");
      return;
    }
    if (action === "request-correction" && reviewNotes.trim().length < 8) {
      setError("Add a correction note with at least 8 characters.");
      return;
    }
    if (action === "publish" && !window.confirm("Publish this item to the student-facing CEStudy site? Published lessons or questions become visible to learners.")) return;
    if (action === "return-to-review" && current.status === "published"
      && !window.confirm("Remove this item from the student-facing site and return it to review?")) return;

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await updateContentReviewStatus(
        tab === "lessons" ? "lesson" : "question",
        current.id,
        action,
        reviewNotes,
        action === "save-edits" ? buildContentEdits() : undefined,
      );
      await loadBundle();
      setReviewConfirmed(false);
      setNotice(
        action === "verify" ? "Marked verified. It is still private until you publish it."
          : action === "request-correction" ? "Sent back for correction. It remains unpublished."
            : action === "save-edits" ? "Edits saved. The item remains unpublished and in the review queue."
              : action === "publish"
                ? result.catalogAvailabilitySync
                  ? "Published. The public catalog status was refreshed."
                  : "Published, but the public catalog status could not be refreshed. Check the catalog before announcing availability."
                : "Returned to review. It is no longer visible to learners.",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The review action failed.");
    } finally { setBusy(false); }
  }

  if (!unlocked) {
    return (
      <div className="page-wrap form-page-wrap content-review-wrap">
        <section className="page-intro"><span className="kicker">Owner-only</span><h1>Content review</h1><p>Review Algebra Foundations lessons and practice questions before students can access them.</p></section>
        <form className="surface-form content-review-unlock" onSubmit={handleUnlock}>
          <span className="status status-progress">Private review</span>
          <h2>Unlock content review</h2>
          <p className="field-hint">Use the same private owner access key as the CEStudy feedback inbox. The key is checked by a server-side Edge Function and is not saved in this page.</p>
          <label className="form-field"><span>Owner access key</span>
            <input type="password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)}
              autoComplete="current-password" maxLength={1024} required disabled={unlocking}
              placeholder="Enter your private access key" />
          </label>
          {unlockError && <p className="inline-status inline-status-error" role="alert">{unlockError}</p>}
          <button className="button button-primary" type="submit" disabled={unlocking || !passphrase.trim()}>
            {unlocking ? <><span className="loading-spinner" aria-hidden="true" /> Unlocking…</> : "Unlock review"}
          </button>
          <p className="field-hint">The owner session stays in memory for up to 30 minutes. Lock the page when finished.</p>
        </form>
      </div>
    );
  }

  return (
    <div className="page-wrap content-review-wrap">
      <div className="content-review-header">
        <div>
          <span className="kicker">Owner tools · private</span>
          <h1>Algebra Foundations review</h1>
          <p>Review each lesson and question yourself. Items stay private until you mark them verified and deliberately publish them.</p>
        </div>
        <div className="content-review-header-actions">
          <button className="button button-secondary" type="button" onClick={() => void loadBundle()} disabled={loading || busy}>Refresh</button>
          <button className="button button-secondary" type="button" onClick={handleLock}>Lock review</button>
        </div>
      </div>

      <section className="review-summary-strip" aria-label="Content review counts">
        <div><strong>{counts.total}</strong><span>Total items</span></div>
        <div><strong>{counts.pending}</strong><span>Need review</span></div>
        <div><strong>{counts.verified}</strong><span>Verified, private</span></div>
        <div><strong>{counts.published}</strong><span>Published</span></div>
      </section>

      <p className="inline-status inline-status-warning content-review-policy">
        Publishing makes the item student-visible. Verify the math, all answer choices, solution steps, explanation, and source/originality notes before you publish.
      </p>
      {error && <p className="inline-status inline-status-error" role="alert">{error}</p>}
      {notice && <p className="inline-status inline-status-success" role="status">{notice}</p>}

      <div className="content-review-tabs" role="tablist" aria-label="Review content type">
        <button type="button" role="tab" aria-selected={tab === "lessons"} className={tab === "lessons" ? "active" : ""}
          onClick={() => { setTab("lessons"); setError(""); setNotice(""); }}>Lessons <span>{bundle?.lessons.length ?? 0}</span></button>
        <button type="button" role="tab" aria-selected={tab === "questions"} className={tab === "questions" ? "active" : ""}
          onClick={() => { setTab("questions"); setError(""); setNotice(""); }}>Practice questions <span>{bundle?.questions.length ?? 0}</span></button>
      </div>

      {loading && !bundle ? <div className="state-panel"><BrandLoader label="Loading private drafts…" /></div>
      : <div className="content-review-layout">
        <aside className="content-review-list" aria-label={tab === "lessons" ? "Lesson drafts" : "Practice question drafts"}>
          {items.length === 0 ? <p className="field-hint">No items were returned for this tab.</p>
          : items.map((item) => {
            const selectedId = tab === "lessons" ? selectedLessonId : selectedQuestionId;
            const itemTitle = tab === "lessons" ? (item as SubjectLesson).title : (item as ReviewPracticeQuestion).topic;
            const itemSub = tab === "lessons" ? `Unit ${(item as SubjectLesson).unitNumber}` : `Question ${(item as ReviewPracticeQuestion).displayOrder}`;
            return <button key={item.id} type="button"
              className={`content-review-list-item${selectedId === item.id ? " active" : ""}`}
              onClick={() => {
                if (tab === "lessons") setSelectedLessonId(item.id); else setSelectedQuestionId(item.id);
                setError(""); setNotice("");
              }}>
              <span className="content-review-list-top"><small>{itemSub}</small><span className={statusClass(item.status)}>{statusLabels[item.status]}</span></span>
              <strong>{itemTitle}</strong>
              {tab === "questions" && <span className="content-review-question-preview">{(item as ReviewPracticeQuestion).prompt}</span>}
            </button>;
          })}
        </aside>

        <section className="content-review-detail" aria-label="Selected content item">
          {!current ? <div className="state-panel"><h2>Select an item</h2><p>Choose an item from the list to view it and record your review.</p></div>
          : <>
            <div className="review-detail-heading">
              <div><span className="kicker">{tab === "lessons" ? `Unit ${(current as SubjectLesson).unitNumber}` : "Practice question"}</span>
                <h2>{tab === "lessons" ? (current as SubjectLesson).title : (current as ReviewPracticeQuestion).topic}</h2></div>
              <span className={statusClass(current.status)}>{statusLabels[current.status]}</span>
            </div>

            {lesson && tab === "lessons" ? <>
              <section className="review-detail-card"><h3>Lesson preview</h3><MarkdownContent markdown={editLessonMarkdown || lesson.lessonMarkdown} /></section>
              {(current.status === "needs-review" || current.status === "correction-required") && (
                <section className="review-edit-fields">
                  <h3>Edit lesson content</h3>
                  <p className="field-hint">You can correct the title, objectives, lesson text, and source note. Save keeps the lesson private and in review.</p>
                  <label className="form-field"><span>Lesson title</span><input value={editLessonTitle} onChange={(event) => setEditLessonTitle(event.target.value)} maxLength={180} disabled={busy} /></label>
                  <label className="form-field"><span>Learning objectives <small>One objective per line, 1 to 8</small></span><textarea value={editLessonObjectives} onChange={(event) => setEditLessonObjectives(event.target.value)} rows={4} maxLength={3200} disabled={busy} /></label>
                  <label className="form-field"><span>Lesson text <small>Markdown subset supported in the preview</small></span><textarea value={editLessonMarkdown} onChange={(event) => setEditLessonMarkdown(event.target.value)} rows={18} maxLength={20000} disabled={busy} /></label>
                  <label className="form-field"><span>Source / attribution note</span><textarea value={editLessonSourceNote} onChange={(event) => setEditLessonSourceNote(event.target.value)} rows={3} maxLength={1200} disabled={busy} /></label>
                </section>
              )}
              <p className="review-source-note"><strong>Source / review note:</strong> {lesson.sourceNote}</p>
            </> : question && tab === "questions" ? <>
              <section className="review-detail-card"><h3>Question prompt</h3><p>{question.prompt}</p></section>
              <section className="review-detail-card"><h3>Choices</h3><ol type="A">{question.choices.map((choice, index) => <li key={index}>{choice}</li>)}</ol></section>
              {(current.status === "needs-review" || current.status === "correction-required") && (
                <section className="review-edit-fields">
                  <h3>Edit practice question</h3>
                  <p className="field-hint">Use one choice per line. The correct answer must exactly match one of the choices. Save keeps the question private and in review.</p>
                  <label className="form-field"><span>Topic</span><input value={editQuestionTopic} onChange={(event) => setEditQuestionTopic(event.target.value)} maxLength={120} disabled={busy} /></label>
                  <label className="form-field"><span>Question prompt</span><textarea value={editQuestionPrompt} onChange={(event) => setEditQuestionPrompt(event.target.value)} rows={4} maxLength={1200} disabled={busy} /></label>
                  <label className="form-field"><span>Answer choices <small>One per line, 2 to 8 unique choices</small></span><textarea value={editQuestionChoices} onChange={(event) => setEditQuestionChoices(event.target.value)} rows={6} maxLength={2500} disabled={busy} /></label>
                  <label className="form-field"><span>Correct answer <small>Must match a choice exactly</small></span><input value={editQuestionAnswer} onChange={(event) => setEditQuestionAnswer(event.target.value)} maxLength={240} disabled={busy} /></label>
                  <label className="form-field"><span>Worked solution steps <small>One step per line, 1 to 12</small></span><textarea value={editQuestionSteps} onChange={(event) => setEditQuestionSteps(event.target.value)} rows={6} maxLength={12000} disabled={busy} /></label>
                  <label className="form-field"><span>Explanation</span><textarea value={editQuestionExplanation} onChange={(event) => setEditQuestionExplanation(event.target.value)} rows={4} maxLength={1000} disabled={busy} /></label>
                  <label className="form-field"><span>Source / attribution note</span><textarea value={editQuestionSourceNote} onChange={(event) => setEditQuestionSourceNote(event.target.value)} rows={3} maxLength={500} disabled={busy} /></label>
                </section>
              )}
              <details className="review-answer-details">
                <summary>Show answer key and solution</summary>
                <div className="review-answer-body">
                  <p><strong>Correct answer:</strong> {question.correctAnswer}</p>
                  <h3>Worked steps</h3><ol>{question.solutionSteps.map((step, index) => <li key={index}>{step}</li>)}</ol>
                  <h3>Explanation</h3><p>{question.explanation}</p>
                  <p className="review-source-note"><strong>Source note:</strong> {question.sourceNote}</p>
                </div>
              </details>
            </> : null}

            {current.status !== "retired" && <section className="review-action-panel">
              <label className="form-field"><span>Private review notes <small>(stored for this item only)</small></span>
                <textarea value={reviewNotes} onChange={(event) => setReviewNotes(event.target.value)} rows={3} maxLength={4000}
                  placeholder="Add corrections or notes for your next review." disabled={busy} />
              </label>
              {current.status === "draft" && <button className="button button-secondary" type="button" onClick={() => void runAction("return-to-review")} disabled={busy}>Move to review queue</button>}
              {(current.status === "needs-review" || current.status === "correction-required") && <>
                <button className="button button-secondary" type="button" onClick={() => void runAction("save-edits")} disabled={busy}>
                  {busy ? "Saving edits…" : "Save edits, keep unpublished"}
                </button>
              </>}
              {current.status === "needs-review" && <>
                {hasUnsavedEdits && <p className="field-hint" role="status">You have unsaved changes. Save edits before marking this item verified or requesting corrections.</p>}
                <label className="review-confirm-check"><input type="checkbox" checked={reviewConfirmed} onChange={(event) => setReviewConfirmed(event.target.checked)} disabled={busy} />
                  <span>{tab === "lessons" ? "I reviewed this lesson against the approved syllabus." : "I checked the prompt, choices, correct answer, and worked solution."}</span>
                </label>
                <div className="review-action-buttons">
                  <button className="button button-primary" type="button" onClick={() => void runAction("verify")} disabled={busy || !reviewConfirmed || hasUnsavedEdits}>Mark verified</button>
                  <button className="button button-secondary" type="button" onClick={() => void runAction("request-correction")} disabled={busy || hasUnsavedEdits || reviewNotes.trim().length < 8}>Request corrections</button>
                </div>
              </>}

              {current.status === "verified" && <>
                <p className="field-hint">Verified means you reviewed this item. It is still private until you publish it.</p>
                <div className="review-action-buttons">
                  <button className="button button-primary" type="button" onClick={() => void runAction("publish")} disabled={busy}>Publish to students</button>
                  <button className="button button-secondary" type="button" onClick={() => void runAction("return-to-review")} disabled={busy}>Return to review</button>
                  <button className="button button-secondary" type="button" onClick={() => void runAction("request-correction")} disabled={busy || reviewNotes.trim().length < 8}>Request corrections</button>
                </div>
              </>}
              {current.status === "published" && <>
                <p className="field-hint">This item is visible to students. Returning it to review removes it from the public API.</p>
                <div className="review-action-buttons">
                  <button className="button button-secondary" type="button" onClick={() => void runAction("return-to-review")} disabled={busy}>Unpublish and review again</button>
                  <button className="button button-secondary" type="button" onClick={() => void runAction("request-correction")} disabled={busy || reviewNotes.trim().length < 8}>Request corrections and hide</button>
                </div>
              </>}
            </section>}
          </>}
        </section>
      </div>}

      <div className="content-review-footer"><Link className="text-link" to="/math-foundations">View student-facing math foundations →</Link><span>Draft content is never included in the student API.</span></div>
    </div>
  );
}
