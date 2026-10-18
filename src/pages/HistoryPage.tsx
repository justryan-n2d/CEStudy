import { useState } from "react";
import { Link } from "react-router-dom";
import { clearLessonHistory, readLessonHistory } from "../data/learning-history";

function formatOpenedAt(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function subjectLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function HistoryPage() {
  const [history, setHistory] = useState(readLessonHistory);

  const handleClearHistory = () => {
    if (!window.confirm("Clear the lesson history saved in this browser?")) return;
    clearLessonHistory();
    setHistory([]);
  };

  return (
    <div className="page-wrap history-page">
      <Link className="back-link" to="/menu">← Menu</Link>
      <section className="page-intro">
        <span className="kicker">Recently opened</span>
        <h1>Lesson history</h1>
        <p>Return to lessons you opened recently. History is saved in this browser and can be used without signing in.</p>
      </section>

      {history.length === 0 ? (
        <section className="state-panel history-empty">
          <h2>No opened lessons yet</h2>
          <p>Published lessons you open will appear here, with the most recent lesson at the top.</p>
          <Link className="button button-primary" to="/catalog">Browse subjects</Link>
        </section>
      ) : (
        <section className="history-list-section" aria-label="Recently opened lessons">
          <div className="history-list-heading">
            <p>{history.length} {history.length === 1 ? "lesson" : "lessons"} in this browser</p>
            <button type="button" className="button button-secondary" onClick={handleClearHistory}>Clear history</button>
          </div>
          <ol className="history-list">
            {history.map((lesson) => (
              <li className="history-list-item" key={lesson.lessonId}>
                <span className="history-list-icon" aria-hidden="true">◷</span>
                <div className="history-list-copy">
                  <span className="progress-subtitle">{subjectLabel(lesson.subjectSlug)} · Unit {lesson.unitNumber}</span>
                  <h2>{lesson.title}</h2>
                  <span className="history-opened-at">Opened {formatOpenedAt(lesson.lastOpenedAt)}</span>
                </div>
                <Link className="text-link" to={lesson.path}>Open lesson <span aria-hidden="true">→</span></Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
