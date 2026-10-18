import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { MarkdownContent } from "../components/MarkdownContent";
import { fetchPublishedLessons } from "../data/lesson-api";
import type { SubjectLesson } from "../types/lesson-content";

export function StudyPage() {
  const { slug, unit } = useParams();
  const subjectSlug = slug ?? "";
  const [lessons, setLessons] = useState<SubjectLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchPublishedLessons(subjectSlug)
      .then((items) => { if (active) setLessons(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Lessons could not be loaded.");
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

  return (
    <div className="page-wrap study-page">
      <Link className="back-link" to={`/subjects/${subjectSlug}`}>← Back to subject</Link>
      <section className="page-intro">
        <span className="kicker">CEStudy lessons</span>
        <h1>{title}</h1>
        <p>Read the published lessons in sequence. Practice questions are available separately when approved for learners.</p>
      </section>

      {loading ? <div className="state-panel"><BrandLoader label="Loading published lessons…" /></div>
      : error ? <div className="state-panel state-error" role="alert"><h2>Lessons unavailable</h2><p>{error}</p></div>
      : lessons.length === 0 ? (
        <section className="state-panel study-empty">
          <span className="study-empty-mark" aria-hidden="true">Aa</span>
          <h2>Lessons are being prepared</h2>
          <p>Lesson drafts remain private while they are reviewed. Published lessons will appear here in the approved order.</p>
          {subjectSlug === "basic-algebra" && <Link className="button button-secondary" to="/practice/basic-algebra">Open published practice</Link>}
          <Link className="button button-primary" to="/math-foundations">Browse math foundations</Link>
        </section>
      ) : (
        <div className="study-layout">
          <aside className="study-outline" aria-label="Published lesson list">
            <div className="study-outline-heading">
              <span className="kicker">Course outline</span>
              <strong>{lessons.length} published {lessons.length === 1 ? "lesson" : "lessons"}</strong>
            </div>
            <nav>
              {lessons.map((lesson) => (
                <Link key={lesson.id} className={activeLesson?.id === lesson.id ? "study-outline-item active" : "study-outline-item"}
                  to={`/study/${subjectSlug}/${lesson.unitNumber}`} aria-current={activeLesson?.id === lesson.id ? "page" : undefined}>
                  <span className="study-outline-number">{lesson.unitNumber}</span>
                  <span>{lesson.title}</span>
                </Link>
              ))}
            </nav>
            {subjectSlug === "basic-algebra" && <Link className="button button-secondary study-practice-link" to="/practice/basic-algebra">Practice questions</Link>}
          </aside>

          {activeLesson ? (
            <article className="study-lesson">
              <div className="study-lesson-topline"><span className="status status-ready">Published lesson</span><span>Unit {activeLesson.unitNumber}</span></div>
              <h2>{activeLesson.title}</h2>
              <section className="study-objectives"><h3>What you will learn</h3><ul>{activeLesson.learningObjectives.map((objective, index) => <li key={index}>{objective}</li>)}</ul></section>
              <MarkdownContent markdown={activeLesson.lessonMarkdown} />
              <div className="study-lesson-navigation">
                {lessonIndex > 0 ? <Link className="button button-secondary" to={`/study/${subjectSlug}/${lessons[lessonIndex - 1].unitNumber}`}>← Previous lesson</Link> : <span />}
                {lessonIndex >= 0 && lessonIndex < lessons.length - 1
                  ? <Link className="button button-primary" to={`/study/${subjectSlug}/${lessons[lessonIndex + 1].unitNumber}`}>Next lesson →</Link>
                  : subjectSlug === "basic-algebra" ? <Link className="button button-primary" to="/practice/basic-algebra">Start practice →</Link> : null}
              </div>
            </article>
          ) : (
            <section className="study-lesson study-lesson-welcome">
              <span className="kicker">Start here</span>
              <h2>Follow the course outline</h2>
              <p>Choose a lesson from the list. Each lesson is shown only after an authorized maintainer publishes it.</p>
              {subjectSlug === "basic-algebra" && <Link className="button button-primary" to={`/study/${subjectSlug}/${lessons[0].unitNumber}`}>Start first published lesson →</Link>}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
