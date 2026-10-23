import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  clearLessonProgress,
  readCompletedLessons,
  readLearningActivityDays,
  type CompletedLesson,
} from "../data/learning-progress";

function subjectLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ProgressPage() {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<CompletedLesson[]>(readCompletedLessons);
  const activityDays = readLearningActivityDays(user?.id);

  const clearProgress = () => {
    const confirmation = user
      ? "Clear completed lessons and this account's streak saved on this device?"
      : "Clear completed lessons saved in this browser?";
    if (!window.confirm(confirmation)) return;
    clearLessonProgress(user?.id);
    setCompletedLessons([]);
  };

  const sortedLessons = [...completedLessons].sort(
    (a, b) => b.completedAt.localeCompare(a.completedAt),
  );

  return (
    <div className="page-wrap progress-page">
      <Link className="back-link" to="/catalog">← Subject library</Link>
      <section className="page-intro">
        <span className="kicker">My progress</span>
        <h1>Your learning progress</h1>
        <p>Completed lessons stay in this browser on this device. When signed in, streak days are stored locally under your Google account ID. Neither syncs across devices.</p>
      </section>

      <nav className="progress-shortcuts" aria-label="Learning activity pages">
        <Link className="button button-secondary" to="/history">Lesson history</Link>
        <Link className="button button-secondary" to="/streak">Streak calendar</Link>
      </nav>

      {sortedLessons.length === 0 ? (
        <section className="state-panel progress-empty">
          <h2>No completed lessons yet</h2>
          <p>Open a published lesson and mark it complete to track your learning progress.</p>
          <Link className="button button-primary" to="/catalog">Browse the library</Link>
          {user && activityDays.length > 0 && (
            <button type="button" className="button button-secondary" onClick={clearProgress}>Clear progress and streak</button>
          )}
        </section>
      ) : (
        <section className="progress-list-section" aria-label="Completed lessons">
          <div className="progress-list-heading">
            <div>
              <strong>{sortedLessons.length}</strong>
              <span>{sortedLessons.length === 1 ? "completed lesson" : "completed lessons"}</span>
            </div>
            <button type="button" className="button button-secondary" onClick={clearProgress}>
              {user ? "Clear progress and streak" : "Clear progress"}
            </button>
          </div>
          <ul className="progress-list">
            {sortedLessons.map((lesson) => (
              <li className="progress-list-item" key={lesson.lessonId}>
                <div>
                  <span className="progress-subtitle">{subjectLabel(lesson.subjectSlug)} · Unit {lesson.unitNumber}</span>
                  <h2>{lesson.title}</h2>
                  <span className="progress-complete-label">Completed on this device</span>
                </div>
                <Link className="text-link" to={`/study/${lesson.subjectSlug}/${lesson.unitNumber}`}>Open lesson <span aria-hidden="true">→</span></Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
