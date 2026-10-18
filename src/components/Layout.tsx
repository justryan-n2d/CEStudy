import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FEEDBACK_INBOX_SESSION_EVENT, FEEDBACK_INBOX_UNREAD_EVENT, getFeedbackInboxSessionToken, getUnreadFeedbackCount } from "../data/feedback-inbox";
import { useAuth } from "../contexts/AuthContext";
import { LearningStreakBadge } from "./LearningStreakBadge";

type GlyphName = "home" | "book" | "layers" | "math" | "menu" | "close" | "help" | "messages";

function NavigationGlyph({ name }: { name: GlyphName }) {
  const paths: Record<GlyphName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/></>,
    book: <><path d="M12 7v14"/><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23z"/><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5A2.5 2.5 0 0 1 21 23z"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
    math: <><path d="M7 4h10"/><path d="M7 20h10"/><path d="M16 4 8 20"/><path d="M6 9h4"/><path d="M14 15h4"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    close: <><path d="m6 6 12 12"/><path d="M18 6 6 18"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.4 1.3-2 1.7-2 3.4"/><path d="M12 17.5h.01"/></>,
    messages: <><path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-5 2v-5.5A7.5 7.5 0 1 1 21 11.5Z"/><path d="M7 10h7M7 13h5"/></>,
  };
  return <svg className="navigation-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const [feedbackInboxUnlocked, setFeedbackInboxUnlocked] = useState(() => Boolean(getFeedbackInboxSessionToken()));
  const [unreadFeedbackCount, setUnreadFeedbackCount] = useState(0);
  const links = [
    { to: "/catalog", label: "Subject catalog" },
    { to: "/years", label: "Year levels" },
    { to: "/math-foundations", label: "Math foundations" },
  ];
  const menuPaths = ["/profile", "/login", "/history", "/streak", "/progress", "/community", "/support", "/feedback", "/feedbacks", "/bug-reports", "/contact", "/about"];
  const mobileLinks = [
    { to: "/", label: "Home", name: "home" as const, active: location.pathname === "/" },
    { to: "/catalog", label: "Subjects", name: "book" as const, active: location.pathname === "/catalog" || location.pathname.startsWith("/subjects/") || location.pathname.startsWith("/practice/") || location.pathname.startsWith("/study/") },
    { to: "/years", label: "Years", name: "layers" as const, active: location.pathname === "/years" || location.pathname.startsWith("/year/") },
    { to: "/math-foundations", label: "Math", name: "math" as const, active: location.pathname === "/math-foundations" },
    { to: "/menu", label: "Menu", name: "menu" as const, active: location.pathname === "/menu" || menuPaths.includes(location.pathname) },
  ];

  useEffect(() => {
    const syncSession = () => setFeedbackInboxUnlocked(Boolean(getFeedbackInboxSessionToken()));
    window.addEventListener(FEEDBACK_INBOX_SESSION_EVENT, syncSession);
    syncSession();
    return () => window.removeEventListener(FEEDBACK_INBOX_SESSION_EVENT, syncSession);
  }, []);

  useEffect(() => {
    if (!feedbackInboxUnlocked) {
      setUnreadFeedbackCount(0);
      return;
    }
    let active = true;
    const refreshCount = async () => {
      try {
        const count = await getUnreadFeedbackCount();
        if (active) setUnreadFeedbackCount(count);
      } catch {
        if (active && !getFeedbackInboxSessionToken()) setFeedbackInboxUnlocked(false);
      }
    };
    void refreshCount();
    const interval = window.setInterval(() => void refreshCount(), 15_000);
    const onFocus = () => void refreshCount();
    const onVisibilityChange = () => { if (!document.hidden) void refreshCount(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener(FEEDBACK_INBOX_UNREAD_EVENT, onFocus);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener(FEEDBACK_INBOX_UNREAD_EVENT, onFocus);
    };
  }, [feedbackInboxUnlocked]);

return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="CEStudy home">
            <img className="brand-logo" src="/branding/cestudy-master-logo.svg" alt="" aria-hidden="true" width={52} height={52} />
            <span className="brand-copy"><strong>CEStudy</strong><small>Civil Engineering Reviewer</small></span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => isActive || (item.to === "/years" && location.pathname.startsWith("/year/")) ? "nav-link active" : "nav-link"}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active account-nav-link" : "nav-link account-nav-link"}>
              {user ? "Account" : "Sign in"}
            </NavLink>
            {feedbackInboxUnlocked && (
              <NavLink to="/feedbacks" className={({ isActive }) => isActive ? "nav-link active feedbacks-nav-link" : "nav-link feedbacks-nav-link"}>
                <span className="feedbacks-nav-icon"><NavigationGlyph name="messages" />{unreadFeedbackCount > 0 && <span className="feedback-unread-dot" role="status" aria-label="Unread feedback" />}</span>
                <span>Feedbacks</span>
              </NavLink>
            )}
          </nav>
<LearningStreakBadge />
        </div>
      </header>
      <main id="main-content" className="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <section className="footer-brand" aria-label="About CEStudy">
            <Link className="footer-brand-name" to="/">CEStudy</Link>
            <p className="footer-copyright">© {new Date().getFullYear()} CEStudy. All rights reserved.</p>
            <p className="footer-disclaimer">Independent educational project. Not affiliated with or endorsed by CHED.</p>
          </section>
          <nav className="footer-links" aria-label="Explore CEStudy">
            <h2>Explore</h2><Link to="/about">About us</Link><Link to="/catalog">Subject catalog</Link><Link to="/years">Year levels</Link><Link to="/math-foundations">Math foundations</Link>
          </nav>
          <nav className="footer-links" aria-label="Contact and help">
            <h2>Contact and help</h2><Link to="/contact">Contact CEStudy</Link><Link to="/support">Support us</Link><Link to="/bug-reports">Report a bug</Link><Link to="/feedback">Send feedback</Link>
          </nav>
        </div>
      </footer>
      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        {mobileLinks.map((item) => (
          <Link key={item.to} to={item.to} className={`mobile-tab${item.active ? " active" : ""}`} aria-current={item.active ? "page" : undefined}>
            <NavigationGlyph name={item.name} /><span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
