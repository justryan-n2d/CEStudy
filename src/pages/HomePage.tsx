import { Link } from "react-router-dom";
import { ScrollReveal } from "../components/ScrollReveal";
import { YearLevelGrid } from "../components/YearLevelGrid";
import { HERO_IMAGE } from "../config/hero-image";
import { LearningStreakBadge } from "../components/LearningStreakBadge";

export function HomePage() {
  return (
    <>
      <section className="hero hero-home">
        <div className="hero-copy">
          <span className="kicker">Civil Engineering Reviewer</span>
          <h1>Build your CE foundation.</h1>
          <p>Find subjects, review math fundamentals, and practice step by step.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/catalog">Browse subjects <span aria-hidden="true">→</span></Link>
            <Link className="button button-secondary" to="/math-foundations">Math foundations</Link>
          </div>
        </div>
        <figure className="hero-visual">
          <img
            className="hero-photo"
            src={HERO_IMAGE.src}
            srcSet={HERO_IMAGE.srcSet}
            sizes={HERO_IMAGE.sizes}
            alt={HERO_IMAGE.alt}
            width={HERO_IMAGE.width}
            height={HERO_IMAGE.height}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <span className="hero-brand-disc" aria-hidden="true" />
          <img
            className="hero-brand-overlay"
            src="/branding/cestudy-master-logo-transparent.svg"
            alt=""
            aria-hidden="true"
            width={420}
            height={420}
            loading="eager"
            decoding="async"
          />
          <figcaption className="visually-hidden">{HERO_IMAGE.credit}</figcaption>
        </figure>
      </section>
      <ScrollReveal className="reveal-section">
        <section id="year-levels" className="section-block home-years">
          <div className="section-heading">
            <div><h2>Explore by year</h2></div>
            <Link className="text-link" to="/years">View all years <span aria-hidden="true">→</span></Link>
          </div>
          <YearLevelGrid />
        </section>
      </ScrollReveal>
      <ScrollReveal className="reveal-section" delayMs={45}>
        <section className="home-progress-entry" aria-label="Learning progress">
          <div className="home-progress-copy">
            <span className="kicker">Optional guided learning</span>
            <h2>Mark lessons as you finish them</h2>
            <p>Follow published topics in order, or explore freely. Completed lessons are saved on this device.</p>
            <LearningStreakBadge />
          </div>
          <Link className="button button-secondary" to="/progress">View my progress</Link>
        </section>
      </ScrollReveal>
      <ScrollReveal className="reveal-section" delayMs={80}>
        <section className="home-math-entry" aria-label="Math foundations">
          <span className="math-symbol" aria-hidden="true">∑</span>
          <div className="home-math-copy">
            <h2>Math foundations</h2>
            <p>Refresh algebra, trigonometry, geometry, and other prerequisites.</p>
          </div>
          <Link className="text-link" to="/math-foundations">Explore math <span aria-hidden="true">→</span></Link>
        </section>
      </ScrollReveal>
    </>
  );
}
