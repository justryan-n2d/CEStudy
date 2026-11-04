import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { YearLevelDropdown } from "./YearLevelDropdown";
import { ConnectionStatusNotice } from "./ConnectionStatusNotice";
import { ThemeProvider } from "../contexts/ThemeContext";
import {
  FEEDBACK_INBOX_SESSION_EVENT,
  FEEDBACK_INBOX_UNREAD_EVENT,
  getFeedbackInboxSessionToken,
  getUnreadFeedbackCount,
} from "../data/feedback-inbox";

type GlyphName =
  | "home" | "book" | "layers" | "math" | "menu" | "close"
  | "help" | "messages" | "progress" | "bug" | "privacy" | "contact";

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
    progress: <><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 6-7"/></>,
    bug: <><path d="m8 9-2-2M16 9l2-2M8 14H4M20 14h-4M8 19l-2 2M16 19l2 2"/><path d="M9 6.5a3 3 0 0 1 6 0"/><rect x="7" y="7" width="10" height="14" rx="5"/><path d="M12 7v14"/></>,
    privacy: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    contact: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  };

  return (
    <svg className="navigation-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function SidebarLink({
  to,
  label,
  icon,
  active = false,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: GlyphName;
  active?: boolean;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      end={to === "/"}
      className={({ isActive }) => isActive || active ? "site-sidebar-link active" : "site-sidebar-link"}
    >
      <NavigationGlyph name={icon} />
      <span>{label}</span>
    </NavLink>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const mainContentRef = useRef<HTMLElement>(null);
  const previousPathRef = useRef(location.pathname);
  const sidebarTriggerRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const yearLevelTriggerRef = useRef<HTMLButtonElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [yearLevelsOpen, setYearLevelsOpen] = useState(false);
  const [feedbackInboxUnlocked, setFeedbackInboxUnlocked] = useState(() => Boolean(getFeedbackInboxSessionToken()));
  const [unreadFeedbackCount, setUnreadFeedbackCount] = useState(0);

  const closeSidebarAndRestoreFocus = useCallback(() => {
    setSidebarOpen(false);
    setYearLevelsOpen(false);
    sidebarTriggerRef.current?.focus();
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setYearLevelsOpen(false);
  }, []);

  const toggleYearLevels = useCallback(() => {
    setYearLevelsOpen((open) => !open);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setYearLevelsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;
    mainContentRef.current?.focus();
  }, [location.pathname]);

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

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusableSelector = 'button:not([disabled]), a[href], summary, [tabindex]:not([tabindex="-1"])';
    const getFocusableElements = () => Array.from(
      sidebarRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter((element) => {
      if (element.closest('[hidden], [aria-hidden="true"]')) return false;
      const collapsedDetails = element.closest("details:not([open])");
      return !collapsedDetails || (element.tagName === "SUMMARY" && element.parentElement === collapsedDetails);
    });
    getFocusableElements()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSidebarAndRestoreFocus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !sidebarRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !sidebarRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen, closeSidebarAndRestoreFocus]);

  const isCatalogContext =
    location.pathname === "/catalog" ||
    location.pathname.startsWith("/subjects/") ||
    location.pathname.startsWith("/study/") ||
    location.pathname.startsWith("/practice/");
  const isYearContext = location.pathname === "/years" || location.pathname.startsWith("/year/");

  return (
    <ThemeProvider>
      <div className="app-shell">
        <a className="skip-link" href="#main-content">Skip to main content</a>

        <header className="site-header">
          <div className="header-inner">
            <button
              ref={sidebarTriggerRef}
              className="sidebar-menu-toggle"
              type="button"
              aria-expanded={sidebarOpen}
              aria-controls="site-sidebar"
              aria-haspopup="dialog"
              aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <NavigationGlyph name={sidebarOpen ? "close" : "menu"} />
            </button>
            <Link className="brand" to="/" aria-label="CEStudy home">
              <img className="brand-logo" src="/branding/cestudy-master-logo.svg" alt="" aria-hidden="true" width={52} height={52} />
              <span className="brand-copy"><strong>CEStudy</strong><small>Civil Engineering Reviewer</small></span>
            </Link>
          </div>
        </header>

        {sidebarOpen && (
          <div className="site-sidebar-layer">
            <button
              className="site-sidebar-backdrop"
              type="button"
              aria-label="Dismiss navigation backdrop"
              onClick={closeSidebarAndRestoreFocus}
            />
            <aside
              ref={sidebarRef}
              id="site-sidebar"
              className="site-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="CEStudy navigation"
            >
              <div className="site-sidebar-heading">
                <div>
                  <span className="site-sidebar-eyebrow">CEStudy</span>
                  <h2>Navigation</h2>
                </div>
                <button
                  className="site-sidebar-close"
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={closeSidebarAndRestoreFocus}
                >
                  <NavigationGlyph name="close" />
                </button>
              </div>

              <nav className="site-sidebar-navigation" aria-label="CEStudy pages">
                <section className="site-sidebar-group" aria-labelledby="sidebar-learning-title">
                  <h3 id="sidebar-learning-title">Learning</h3>
                  <SidebarLink to="/" label="Home" icon="home" onNavigate={closeSidebar} />
                  <SidebarLink to="/catalog" label="Subject Catalog" icon="book" active={isCatalogContext} onNavigate={closeSidebar} />
                  <YearLevelDropdown
                    isOpen={yearLevelsOpen}
                    isActive={isYearContext}
                    triggerRef={yearLevelTriggerRef}
                    onToggle={toggleYearLevels}
                    onClose={closeSidebar}
                  />
                  <SidebarLink to="/math-foundations" label="Math Foundations" icon="math" onNavigate={closeSidebar} />
                </section>

                <section className="site-sidebar-group" aria-labelledby="sidebar-progress-title">
                  <h3 id="sidebar-progress-title">My learning</h3>
                  <SidebarLink to="/progress" label="Progress" icon="progress" onNavigate={closeSidebar} />
                </section>

                <section className="site-sidebar-group" aria-labelledby="sidebar-support-title">
                  <h3 id="sidebar-support-title">Help and support</h3>
                  <SidebarLink to="/about" label="About us" icon="help" onNavigate={closeSidebar} />
                  <SidebarLink to="/contact" label="Contact CEStudy" icon="contact" onNavigate={closeSidebar} />
                  <SidebarLink to="/support" label="Support us" icon="help" onNavigate={closeSidebar} />
                  <SidebarLink to="/bug-reports" label="Report a bug" icon="bug" onNavigate={closeSidebar} />
                  <SidebarLink to="/feedback" label="Send feedback" icon="messages" onNavigate={closeSidebar} />
                  <SidebarLink to="/privacy" label="Privacy notice" icon="privacy" onNavigate={closeSidebar} />
                </section>

                {feedbackInboxUnlocked && (
                  <section className="site-sidebar-group" aria-labelledby="sidebar-owner-title">
                    <h3 id="sidebar-owner-title">Owner tools</h3>
                    <SidebarLink to="/feedbacks" label="Feedback inbox" icon="messages" onNavigate={closeSidebar} />
                    {unreadFeedbackCount > 0 && <p className="site-sidebar-unread" role="status">{unreadFeedbackCount} unread feedback {unreadFeedbackCount === 1 ? "item" : "items"}</p>}
                  </section>
                )}
              </nav>

              <section className="site-sidebar-preferences" aria-labelledby="sidebar-preferences-title">
                <h3 id="sidebar-preferences-title">Preferences</h3>
                <ThemeToggle />
              </section>

              <p className="site-sidebar-footer">Independent learning for civil engineering students.</p>
            </aside>
          </div>
        )}

        <ConnectionStatusNotice />

        <main ref={mainContentRef} id="main-content" className="main-content" tabIndex={-1}>{children}</main>

        <footer className="site-footer">
          <div className="footer-inner">
            <section className="footer-brand" aria-label="About CEStudy">
              <Link className="footer-brand-name" to="/">CEStudy</Link>
              <p className="footer-copyright">© {new Date().getFullYear()} CEStudy. All rights reserved.</p>
              <p className="footer-disclaimer">Independent educational project. Not affiliated with or endorsed by CHED.</p>
            </section>
            <nav className="footer-links" aria-label="Explore CEStudy">
              <h2>Explore</h2>
              <Link to="/about">About us</Link>
              <Link to="/catalog">Subject catalog</Link>
              <Link to="/years">Year levels</Link>
              <Link to="/math-foundations">Math foundations</Link>
            </nav>
            <nav className="footer-links" aria-label="Contact and help">
              <h2>Contact and help</h2>
              <Link to="/contact">Contact CEStudy</Link>
              <Link to="/support">Support us</Link>
              <Link to="/bug-reports">Report a bug</Link>
              <Link to="/feedback">Send feedback</Link>
              <Link to="/privacy">Privacy notice</Link>
            </nav>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
