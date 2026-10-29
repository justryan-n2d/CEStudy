import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getLearningStreak } from "../data/learning-streak";
import {
  formatLocalDateKey,
  LEARNING_ACTIVITY_CHANGED_EVENT,
  learningActivityStorageKey,
  readLearningActivityDays,
} from "../data/learning-progress";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function StreakPage() {
  const { user, loading } = useAuth();
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [activityVersion, setActivityVersion] = useState(0);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    const refresh = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string }>).detail;
      if (detail?.userId && detail.userId !== userId) return;
      setActivityVersion((version) => version + 1);
    };
    const refreshFromStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === learningActivityStorageKey(userId)) {
        setActivityVersion((version) => version + 1);
      }
    };
    window.addEventListener(LEARNING_ACTIVITY_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refreshFromStorage);
    return () => {
      window.removeEventListener(LEARNING_ACTIVITY_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refreshFromStorage);
    };
  }, [user?.id]);

  const activityDays = user?.id ? readLearningActivityDays(user.id) : [];
  const activitySet = new Set(activityDays);
  const streak = getLearningStreak(activityDays);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const monthLabel = visibleMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = formatLocalDateKey(new Date());
  const days = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    if (index < firstWeekday) return null;
    return index - firstWeekday + 1;
  });

  const shiftMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedDayKey(null);
  };

  if (loading) {
    return (
      <div className="page-wrap streak-page">
        <section className="state-panel" role="status">
          <h1>Checking your streak</h1>
          <p>CEStudy is checking the active session before showing account-specific study days.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrap streak-page" data-activity-version={activityVersion}>
      <Link className="back-link" to="/profile">← Account profile</Link>
      <section className="page-intro">
        <span className="kicker">Keep building your habit</span>
        <h1>Streak calendar</h1>
        <p>A streak day is recorded when you mark a published lesson complete while signed in. A visit alone does not count.</p>
      </section>

      <section className={"streak-summary-card" + (streak.currentStreak > 0 ? " is-active" : "")} aria-label="Current streak summary">
        <span className="streak-summary-flame" aria-hidden="true">🔥</span>
        <div>
          <span className="streak-summary-label">Current streak</span>
          <strong>{streak.currentStreak} {streak.currentStreak === 1 ? "day" : "days"}</strong>
          <p>{streak.currentStreak > 0
            ? streak.completedToday ? "You completed a lesson today. Keep it going." : "Complete a lesson today to keep it going."
            : user ? "Complete a published lesson to start your streak." : "Sign in to view your streak history."}</p>
        </div>
      </section>

      {!user && (
        <section className="state-panel streak-locked-panel">
          <h2>Unlock your streak</h2>
          <p>Sign in with Google to save study days separately for your account on this device. Cross-device syncing is not available. The library remains public.</p>
          <Link className="button button-primary" to="/login?next=%2Fstreak">Sign in with Google</Link>
        </section>
      )}

      <section className="streak-calendar-card" aria-labelledby="streak-calendar-title">
        <div className="streak-calendar-heading">
          <div>
            <h2 id="streak-calendar-title">Streak calendar</h2>
            <p>Study days are highlighted in green.</p>
          </div>
          <div className="streak-month-controls" aria-label="Calendar month controls">
            <button type="button" className="calendar-month-button" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
            <strong aria-live="polite">{monthLabel}</strong>
            <button type="button" className="calendar-month-button" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
          </div>
        </div>
        <div className="streak-calendar-grid" role="group" aria-label={monthLabel + " study calendar"}>
          {WEEKDAYS.map((weekday) => <span className="streak-calendar-weekday" key={weekday}>{weekday}</span>)}
          {days.map((day, index) => {
            if (day === null) return <span className="streak-calendar-blank" key={"blank-" + index} aria-hidden="true" />;
            const date = new Date(year, month, day);
            const dateKey = formatLocalDateKey(date);
            const hasActivity = Boolean(user?.id) && activitySet.has(dateKey);
            const isToday = dateKey === todayKey;
            const fullDate = date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
            return (
              <button type="button" key={dateKey}
                className={"streak-calendar-day" + (hasActivity ? " is-active" : "") + (isToday ? " is-today" : "") + (selectedDayKey === dateKey ? " is-selected" : "")}
                aria-label={fullDate + ", " + (hasActivity ? "study day" : "no study recorded")}
                aria-pressed={selectedDayKey === dateKey}
                onClick={() => setSelectedDayKey(dateKey)}
                title={"Show study status for " + fullDate}>
                {day}
              </button>
            );
          })}
        </div>
        {user && activityDays.length === 0 && <p className="streak-calendar-empty">No study days have been recorded yet. Open a published lesson and mark it complete while signed in to start your streak.</p>}
        {!user && <p className="streak-calendar-empty">Sign in to view your streak history. Dates stay blank until this account has recorded study days.</p>}
        {selectedDayKey && <p className="streak-day-detail" role="status">{(() => {
          const [selectedYear, selectedMonth, selectedDay] = selectedDayKey.split("-").map(Number);
          const selectedLabel = new Date(selectedYear, selectedMonth - 1, selectedDay).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
          return activitySet.has(selectedDayKey) && user
            ? "Study activity recorded for " + selectedLabel + "."
            : "No study activity recorded for " + selectedLabel + ".";
        })()}</p>}
      </section>

      <section className="streak-calendar-legend" aria-label="Calendar legend">
        <span><i className="streak-legend-dot is-active" aria-hidden="true" /> Study day</span>
        <span><i className="streak-legend-dot is-today" aria-hidden="true" /> Today</span>
      </section>
    </div>
  );
}
