import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const links = [
    { to: "/catalog", label: "Subject catalog" },
    { to: "/years", label: "Year levels" },
    { to: "/math-foundations", label: "Math foundations" },
  ];
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
                className={({ isActive }) => (
                  isActive || (item.to === "/years" && location.pathname.startsWith("/year/"))
                    ? "nav-link active" : "nav-link"
                )}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div><strong>CEStudy</strong></div>
          <p className="footer-note">Independent educational project. Not affiliated with or endorsed by CHED.</p>
        </div>
      </footer>
    </div>
  );
}
