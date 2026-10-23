import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { LearningStreakBadge } from "../components/LearningStreakBadge";
import {
  clearLessonProgress,
  readCompletedLessons,
  LEARNING_ACTIVITY_CHANGED_EVENT,
  readLearningActivityDays,
  type CompletedLesson,
} from "../data/learning-progress";

function subjectLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ProgressPage() {
  const { user } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<CompletedLesson[]>(readCompletedLessons);
  const [activityDays, setActivityDays] = useState<string[]>(() => readLearningActivityDays(user?.id));

  useEffect(() => {
    const refreshActivityDays = () => setActivityDays(readLearningActivityDays(user?.id));
    refreshActivityDays();
    window.addEventListener(LEARNING_ACTIVITY_CHANGED_EVENT, refreshActivityDays);
    return () => window.removeEventListener(LEARNING_ACTIVITY_CHANGED_EVENT, refreshActivityDays);
  }, [user?.id]);

  const clearProgress = () => {
    if (!window.confirm("Clear lesson progress on this device and streak activity for the signed-in account?")) return;
    clearLessonProgress(user?.id);
    setCompletedLessons([]);
    setActivityDays([]);
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
        <p>Review the published lessons you have completed. Progress is saved in this browser on this device only, not synced to an account.</p>
      </section>

      <LearningStreakBadge activityDays={activityDays} />

      {sortedLessons.length === 0 ? (
        <section className="state-panel progress-empty">
          <h2>No completed lessons yet</h2>
          <p>Open a published lesson and mark it complete to keep track of your learning.</p>
          <Link className="button button-primary" to="/catalog">Browse the library</Link>
          {activityDays.length > 0 && (
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
            <button type="button" className="button button-secondary" onClick={clearProgress}>Clear progress and streak</button>
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
