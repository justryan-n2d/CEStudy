import { Link } from "react-router-dom";
import { YearLevelGrid } from "../components/YearLevelGrid";

export function HomePage() {
  return (
    <>
      <section className="hero hero-home">
        <div className="hero-copy">
          <h1>Find your CE subjects.</h1>
          <p>Browse by year level or search the catalog.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/catalog">Browse subjects <span aria-hidden="true">→</span></Link>
            <Link className="button button-secondary" to="/math-foundations">Math foundations</Link>
          </div>
        </div>
        <div className="hero-brand" aria-hidden="true">
          <span className="hero-brand-ring hero-brand-ring-one" />
          <span className="hero-brand-ring hero-brand-ring-two" />
          <img src="/branding/cestudy-master-logo-transparent.svg" alt="" width={144} height={144} />
        </div>
      </section>
      <section id="year-levels" className="section-block home-years">
        <div className="section-heading">
          <div><h2>Year levels</h2></div>
          <Link className="text-link" to="/years">View all years <span aria-hidden="true">→</span></Link>
        </div>
        <YearLevelGrid />
      </section>
      <section className="home-math-entry" aria-label="Math foundations">
        <span className="math-symbol" aria-hidden="true">∑</span>
        <div className="home-math-copy">
          <h2>Math foundations</h2>
          <p>Algebra, trigonometry, geometry, and more.</p>
        </div>
        <Link className="text-link" to="/math-foundations">Explore math <span aria-hidden="true">→</span></Link>
      </section>
    </>
  );
}
