import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FEEDBACK_INBOX_SESSION_EVENT, getFeedbackInboxSessionToken } from "../data/feedback-inbox";

type MenuIconName = "profile" | "history" | "streak" | "community" | "support" | "feedback" | "bug" | "sun" | "moon";

function MenuGlyph({ name }: { name: MenuIconName }) {
  const paths: Record<MenuIconName, ReactNode> = {
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    history: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M3 5v4h4"/></>,
    streak: <><path d="M12 22c4.2 0 7-2.9 7-7 0-3-1.7-5.4-4.6-8.6-.3 2.4-1.6 3.6-2.7 4.1.3-3.7-1.6-6.2-3.1-7.5C8.8 7.6 5 10.8 5 15c0 4.1 2.8 7 7 7Z"/></>,
    community: <><circle cx="9" cy="8" r="3"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3.5 5"/></>,
    support: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></>,
    feedback: <><path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-5 2v-5.5A7.5 7.5 0 1 1 21 11.5Z"/><path d="M7 10h7M7 13h5"/></>,
    bug: <><path d="M8 8h8v9a4 4 0 0 1-8 0V8Z"/><path d="M10 4a2 2 0 0 1 4 0M5 10H2m20 0h-3M5 16H2m20 0h-3M7 6 5 4m12 2 2-2M12 9v8"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    moon: <><path d="M20.9 13A8.8 8.8 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></>,
  };
  return <svg className="navigation-glyph menu-glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const menuItems: { to: string; label: string; description: string; icon: MenuIconName }[] = [
  { to: "/profile", label: "Profile", description: "Your Google sign-in and account", icon: "profile" },
  { to: "/history", label: "History", description: "Return to lessons you opened", icon: "history" },
  { to: "/streak", label: "Streak", description: "See your study days on a calendar", icon: "streak" },
  { to: "/progress", label: "Progress", description: "Review lessons you have completed", icon: "history" },
  { to: "/about", label: "About us", description: "Learn about CEStudy and its purpose", icon: "community" },
  { to: "/contact", label: "Contact CEStudy", description: "Get in touch with the project", icon: "feedback" },
  { to: "/community", label: "Community", description: "Updates about student community spaces", icon: "community" },
  { to: "/support", label: "Support us", description: "Help keep CEStudy free to use", icon: "support" },
  { to: "/feedback", label: "Send feedback", description: "Share an idea or suggestion", icon: "feedback" },
  { to: "/bug-reports", label: "Report a bug", description: "Tell us when something is not working", icon: "bug" },
];

export function MenuPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [feedbackInboxUnlocked, setFeedbackInboxUnlocked] = useState(() => Boolean(getFeedbackInboxSessionToken()));

  useEffect(() => {
    const syncFeedbackInbox = () => setFeedbackInboxUnlocked(Boolean(getFeedbackInboxSessionToken()));
    window.addEventListener(FEEDBACK_INBOX_SESSION_EVENT, syncFeedbackInbox);
    syncFeedbackInbox();
    return () => window.removeEventListener(FEEDBACK_INBOX_SESSION_EVENT, syncFeedbackInbox);
  }, []);
  const visibleMenuItems = feedbackInboxUnlocked
    ? [...menuItems, { to: "/feedbacks", label: "Feedback inbox", description: "Review incoming student feedback", icon: "feedback" as const }]
    : menuItems;
  const isDark = theme === "dark";

  return (
    <div className="page-wrap menu-page">
      <section className="page-intro">
        <span className="kicker">CEStudy</span>
        <h1>Menu</h1>
        <p>Account, study history, streaks, and ways to help improve CEStudy.</p>
      </section>

      <section className="menu-account-summary" aria-label="Account status">
        <MenuGlyph name="profile" />
        <div>
          <strong>{user?.email ?? "Learning as a guest"}</strong>
          <span>{user ? "Google account connected" : "Sign in to unlock streak tracking"}</span>
        </div>
        <Link className="text-link" to="/profile">{user ? "Profile" : "Sign in"} <span aria-hidden="true">→</span></Link>
      </section>

      <nav className="menu-links-grid" aria-label="Account and help pages">
        {visibleMenuItems.map((item) => (
          <Link className="menu-link-card" key={item.to} to={item.to}>
            <span className={"menu-link-icon menu-link-icon-" + item.icon}><MenuGlyph name={item.icon} /></span>
            <span className="menu-link-copy">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
            <span className="menu-link-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>

      <section className="theme-settings-card" aria-labelledby="theme-settings-title">
        <span className="menu-link-icon theme-icon"><MenuGlyph name={isDark ? "moon" : "sun"} /></span>
        <div className="theme-settings-copy">
          <h2 id="theme-settings-title">Appearance</h2>
          <p>{isDark ? "Dark mode is on." : "Light mode is on."} Choose the display that suits you.</p>
        </div>
        <button className={"theme-toggle-switch" + (isDark ? " is-on" : "")} type="button"
          role="switch" aria-checked={isDark} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}>
          <span className="theme-toggle-thumb" />
        </button>
      </section>
    </div>
  );
}
