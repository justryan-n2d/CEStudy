import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { MarkdownContent } from "../components/MarkdownContent";
import { fetchPublishedLessons } from "../data/lesson-api";
import type { SubjectLesson } from "../types/lesson-content";
import { readCompletedLessons, setLessonCompleted, type CompletedLesson } from "../data/learning-progress";
import { recordOpenedLesson } from "../data/learning-history";
import { useAuth } from "../contexts/AuthContext";

function searchText(lesson:SubjectLesson):string {
  return [lesson.title,lesson.slug,...lesson.learningObjectives,lesson.lessonMarkdown].join(" ").normalize("NFKC").toLowerCase();
}
function topicSnippet(lesson:SubjectLesson,query:string):string {
  const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if(!terms.length)return "";
  const markdownText=lesson.lessonMarkdown.replace(/^#{1,6}\s*/gm,"").replace(/[*_`>]/g,"").replace(/\s+/g," ").trim();
  const candidates=[...lesson.learningObjectives,markdownText,lesson.title,lesson.slug];
  const match=candidates.find(candidate=>terms.every(term=>candidate.toLowerCase().includes(term)));
  if(!match)return "";
  const index=Math.max(0,match.toLowerCase().indexOf(terms[0]));
  const start=Math.max(0,index-32);
  const end=Math.min(match.length,start+96);
  return `${start>0?"…":""}${match.slice(start,end).trim()}${end<match.length?"…":""}`;
}

export function StudyPage() {
  const { slug, unit } = useParams();
  const { user, loading: authLoading } = useAuth();
  const subjectSlug = slug ?? "";
  const [lessons, setLessons] = useState<SubjectLesson[]>([]);
  const [topicQuery,setTopicQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const completedScopeKey = user?.id?.trim() ? `user:${user.id}` : "guest";
  const [completedSnapshot, setCompletedSnapshot] = useState<{
    scopeKey: string;
    items: CompletedLesson[];
  }>({ scopeKey: "", items: [] });
  const completedLessons = !authLoading && completedSnapshot.scopeKey === completedScopeKey
    ? completedSnapshot.items
    : [];

  useEffect(() => {
    if (authLoading) return;
    setCompletedSnapshot({ scopeKey: completedScopeKey, items: readCompletedLessons(user?.id) });
  }, [authLoading, completedScopeKey, user?.id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setTopicQuery("");
    fetchPublishedLessons(subjectSlug)
      .then((items) => { if (active) setLessons(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Reviewer content could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [subjectSlug]);

  const selectedUnit = unit === undefined ? null : Number(unit);
  const activeLesson = useMemo(
    () => selectedUnit === null ? null : lessons.find((lesson) => lesson.unitNumber === selectedUnit) ?? null,
    [lessons, selectedUnit],
  );
  const lessonIndex = activeLesson ? lessons.findIndex((lesson) => lesson.id === activeLesson.id) : -1;
  const title = subjectSlug === "basic-algebra" ? "Algebra Foundations" : subjectSlug.replace(/-/g, " ");
  const normalizedQuery=topicQuery.trim().normalize("NFKC").toLowerCase();
  const visibleLessons=useMemo(() => {
    const queryTerms=normalizedQuery.split(/\s+/).filter(Boolean);
    return queryTerms.length===0 ? lessons : lessons.filter(lesson=>queryTerms.every(term=>searchText(lesson).includes(term)));
  }, [lessons,normalizedQuery]);
  const showActiveLesson=activeLesson!==null&&(!normalizedQuery||visibleLessons.some(lesson=>lesson.id===activeLesson.id));
  useEffect(() => {
    // Only a published lesson actually displayed to the learner belongs in history.
    if (authLoading || loading || error || !activeLesson || !showActiveLesson || activeLesson.subjectSlug !== subjectSlug) return;
    recordOpenedLesson({
      lessonId: activeLesson.id,
      subjectSlug: activeLesson.subjectSlug,
      unitNumber: activeLesson.unitNumber,
      title: activeLesson.title,
    }, new Date(), user?.id);
  }, [activeLesson, authLoading, error, loading, showActiveLesson, subjectSlug, user?.id]);

  const activeLessonCompleted = Boolean(activeLesson && completedLessons.some((item) => item.lessonId === activeLesson.id));
  const toggleLessonCompletion = () => {
    if (!activeLesson || authLoading) return;
    const next = setLessonCompleted({
      lessonId: activeLesson.id,
      subjectSlug: activeLesson.subjectSlug,
      unitNumber: activeLesson.unitNumber,
      title: activeLesson.title,
    }, !activeLessonCompleted, user?.id);
    setCompletedSnapshot({ scopeKey: completedScopeKey, items: next });
  };

  return (
    <div className="page-wrap study-page">
      <Link className="back-link" to="/catalog">← Subjects</Link>
      <section className="page-intro">
        <span className="kicker">Reviewer</span>
        <h1>{title}</h1>
        <p>Explore any topic, or follow published lessons in order when you want more structure. Guest progress and each signed-in account are stored separately in this browser.</p>
      </section>

      {loading ? <div className="state-panel"><BrandLoader label="Loading reviewer…" /></div>
      : error ? <div className="state-panel state-error" role="alert"><h2>Reviewer unavailable</h2><p>{error}</p></div>
      : lessons.length === 0 ? (
        <section className="state-panel study-empty">
          <h2>Reviewer content is being prepared</h2>
          <p>Published topics will appear here.</p>
          {subjectSlug === "basic-algebra" && <Link className="study-practice-link text-link" to="/practice/basic-algebra">Practice problems →</Link>}
        </section>
      ) : (
        <div className="study-layout">
          <aside className="study-outline" aria-label="Reviewer topics">
            <div className="study-outline-heading">
              <span className="kicker">Topics</span>
              <strong>{normalizedQuery ? `${visibleLessons.length} of ${lessons.length} topics` : `${lessons.length} topics`}</strong>
            </div>
            <label className="study-topic-search">
              <span>Find a topic</span>
              <input type="search" value={topicQuery} onChange={event=>setTopicQuery(event.target.value)} placeholder="e.g. factoring, logarithms" />
            </label>
            <details className="reviewer-topic-disclosure" open={!activeLesson || Boolean(normalizedQuery)}>
              <summary>Browse topics ({visibleLessons.length})</summary>
              <nav aria-label="Topic results">
                {visibleLessons.map((lesson) => (
                  <Link key={lesson.id} className={activeLesson?.id === lesson.id ? "study-outline-item active" : "study-outline-item"}
                    to={`/study/${subjectSlug}/${lesson.unitNumber}`} onClick={() => setTopicQuery("")}
                    aria-current={activeLesson?.id === lesson.id ? "page" : undefined}>
                    <span className="study-outline-number">{lesson.unitNumber}</span>
                    <span className="study-outline-copy">
                      <span>{lesson.title}</span>
                      {normalizedQuery&&<small>{topicSnippet(lesson,normalizedQuery)}</small>}
                    </span>
                  </Link>
                ))}
              </nav>
              {normalizedQuery&&visibleLessons.length===0&&<p className="study-no-results">No matching topics. Try another keyword.</p>}
            </details>
            {subjectSlug === "basic-algebra" && <Link className="study-practice-link text-link" to="/practice/basic-algebra">Practice problems →</Link>}
          </aside>

          {showActiveLesson && activeLesson ? (
            <article className="study-lesson">
              <div className="study-lesson-topline"><span className="status status-ready">Published topic</span><span>Unit {activeLesson.unitNumber}</span></div>
              <h2>{activeLesson.title}</h2>
              <MarkdownContent markdown={activeLesson.lessonMarkdown} />
              <div className="study-lesson-completion">
                <button
                  type="button"
                  className={activeLessonCompleted ? "button button-primary" : "button button-secondary"}
                  aria-pressed={activeLessonCompleted}
                  disabled={authLoading}
                  onClick={toggleLessonCompletion}
                >
                  {activeLessonCompleted ? "Mark as incomplete" : "Mark as complete"}
                </button>
                <p>{authLoading ? "Checking your session before saving progress." : activeLessonCompleted ? user ? "Completed and saved on this device for this account." : "Completed and saved for guest browsing on this device." : user ? "Progress for this account stays on this device." : "Guest progress stays on this device."} <Link to="/progress">View my progress</Link></p>
              </div>
              <div className="study-lesson-navigation">
                {lessonIndex > 0 ? <Link className="button button-secondary" to={`/study/${subjectSlug}/${lessons[lessonIndex - 1].unitNumber}`}>← Previous</Link> : <span />}
                {lessonIndex >= 0 && lessonIndex < lessons.length - 1
                  ? <Link className="button button-primary" to={`/study/${subjectSlug}/${lessons[lessonIndex + 1].unitNumber}`}>Next topic →</Link>
                  : subjectSlug === "basic-algebra" ? <Link className="button button-primary" to="/practice/basic-algebra">Practice problems →</Link> : null}
              </div>
            </article>
          ) : (
            <section className="study-lesson study-lesson-welcome">
              <span className="kicker">Start here</span>
              <h2>Choose a topic</h2>
              <p>Search above or select a topic from the list.</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
