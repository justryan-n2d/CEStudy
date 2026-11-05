import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StudyReaderSkeleton } from "../components/LoadingSkeletons";
import { UnavailableState } from "../components/UnavailableState";
import { MarkdownContent } from "../components/MarkdownContent";
import { fetchPublishedLessons } from "../data/lesson-api";
import { getRelatedLessons } from "../data/lesson-recommendations";
import type { SubjectLesson } from "../types/lesson-content";

function searchText(lesson: SubjectLesson): string {
  return [lesson.title, lesson.slug, ...lesson.learningObjectives, lesson.lessonMarkdown].join(" ").normalize("NFKC").toLowerCase();
}

function topicSnippet(lesson: SubjectLesson, query: string): string {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return "";
  const markdownText = lesson.lessonMarkdown.replace(/^#{1,6}\s*/gm, "").replace(/[*_`>]/g, "").replace(/\s+/g, " ").trim();
  const candidates = [...lesson.learningObjectives, markdownText, lesson.title, lesson.slug];
  const match = candidates.find((candidate) => terms.every((term) => candidate.toLowerCase().includes(term)));
  if (!match) return "";
  const index = Math.max(0, match.toLowerCase().indexOf(terms[0]));
  const start = Math.max(0, index - 32);
  const end = Math.min(match.length, start + 96);
  return `${start > 0 ? "…" : ""}${match.slice(start, end).trim()}${end < match.length ? "…" : ""}`;
}

export function StudyPage() {
  const { slug, unit } = useParams();
  const subjectSlug = slug ?? "";
  const [lessons, setLessons] = useState<SubjectLesson[]>([]);
  const [topicQuery, setTopicQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = () => setRetryCount((current) => current + 1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setLessons([]);
    setTopicQuery("");
    fetchPublishedLessons(subjectSlug)
      .then((items) => { if (active) setLessons(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Reviewer content could not be loaded. Check your connection and try again.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [subjectSlug, retryCount]);

  const selectedUnit = unit === undefined ? null : Number(unit);
  const activeLesson = useMemo(
    () => selectedUnit === null ? null : lessons.find((lesson) => lesson.unitNumber === selectedUnit) ?? null,
    [lessons, selectedUnit],
  );
  const title = subjectSlug === "basic-algebra" ? "Algebra Foundations" : subjectSlug.replace(/-/g, " ");
  const normalizedQuery = topicQuery.trim().normalize("NFKC").toLowerCase();
  const visibleLessons = useMemo(() => {
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
    return queryTerms.length === 0 ? lessons : lessons.filter((lesson) => queryTerms.every((term) => searchText(lesson).includes(term)));
  }, [lessons, normalizedQuery]);
  const showActiveLesson = activeLesson !== null && (!normalizedQuery || visibleLessons.some((lesson) => lesson.id === activeLesson.id));
  const recommendedLessons = useMemo(
    () => activeLesson ? getRelatedLessons(activeLesson, lessons, 3) : [],
    [activeLesson, lessons],
  );

  return (
    <div className="page-wrap study-page">
      <Link className="back-link" to="/catalog">← Subjects</Link>
      <section className="page-intro">
        <span className="kicker">Reviewer</span>
        <h1>{title}</h1>
        <p>Explore any topic, or follow published lessons in order when you want more structure.</p>
      </section>

      {loading
        ? <StudyReaderSkeleton label="Loading reviewer…" />
        : error
          ? <UnavailableState
              title="Reviewer unavailable"
              message="Reviewer content could not be loaded. Check your connection and try again."
              onRetry={retry}
            />
          : lessons.length === 0
            ? <section className="state-panel study-empty">
                <h2>Reviewer content is being prepared</h2>
                <p>Published topics will appear here.</p>
                {subjectSlug === "basic-algebra" && <Link className="study-practice-link text-link" to="/practice/basic-algebra">Practice problems →</Link>}
              </section>
            : <div className="study-layout">
                <aside className="study-outline" aria-label="Reviewer topics">
                  <div className="study-outline-heading">
                    <span className="kicker">Topics</span>
                    <strong>{normalizedQuery ? `${visibleLessons.length} of ${lessons.length} topics` : `${lessons.length} topics`}</strong>
                  </div>
                  <label className="study-topic-search">
                    <span>Find a topic</span>
                    <input type="search" value={topicQuery} onChange={(event) => setTopicQuery(event.target.value)} placeholder="e.g. factoring, logarithms" />
                  </label>
                  <details className="reviewer-topic-disclosure" open={!activeLesson || Boolean(normalizedQuery)}>
                    <summary>Browse topics ({visibleLessons.length})</summary>
                    <nav aria-label="Topic results">
                      {visibleLessons.map((lesson) => (
                        <Link key={lesson.id} className={activeLesson?.id === lesson.id ? "study-outline-item active" : "study-outline-item"}
                          to={`/study/${subjectSlug}/${lesson.unitNumber}`} onClick={() => setTopicQuery("")}
                          aria-current={activeLesson?.id === lesson.id ? "page" : undefined}>
                          <span className="study-outline-copy">
                            <span>{lesson.title}</span>
                            {normalizedQuery && <small>{topicSnippet(lesson, normalizedQuery)}</small>}
                          </span>
                        </Link>
                      ))}
                    </nav>
                    {normalizedQuery && visibleLessons.length === 0 && <p className="study-no-results">No matching topics. Try another keyword.</p>}
                  </details>
                  {subjectSlug === "basic-algebra" && <Link className="study-practice-link text-link" to="/practice/basic-algebra">Practice problems →</Link>}
                </aside>

                {showActiveLesson && activeLesson ? (
                  <article className="study-lesson">
                    <h2>{activeLesson.title}</h2>
                    <MarkdownContent markdown={activeLesson.lessonMarkdown} />

                    <section className="study-recommendations" aria-label="Recommended lessons">
                      <h3>Recommended lessons</h3>
                      {recommendedLessons.length > 0 ? (
                        <ul>
                          {recommendedLessons.map((lesson) => (
                            <li key={lesson.id}>
                              <Link to={`/study/${subjectSlug}/${lesson.unitNumber}`}>{lesson.title}</Link>
                              {lesson.learningObjectives[0] && <p>{lesson.learningObjectives[0]}</p>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="study-recommendations-empty">No related lessons are available yet.</p>
                      )}
                    </section>
                  </article>
                ) : (
                  <section className="study-lesson study-lesson-welcome">
                    <span className="kicker">Start here</span>
                    <h2>Choose a topic</h2>
                    <p>Search above or select a topic from the list.</p>
                  </section>
                )}
              </div>}
    </div>
  );
}
