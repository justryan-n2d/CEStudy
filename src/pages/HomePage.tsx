import { Link } from "react-router-dom";
import { ScrollReveal } from "../components/ScrollReveal";
import { YearLevelGrid } from "../components/YearLevelGrid";

const bridgeImage = "https://images.unsplash.com/photo-1637078846596-0efb09c121f2?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=78&w=";

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
            src={`${bridgeImage}1200`}
            srcSet={`${bridgeImage}640 640w, ${bridgeImage}960 960w, ${bridgeImage}1200 1200w, ${bridgeImage}1600 1600w`}
            sizes="(max-width: 680px) calc(100vw - 28px), (max-width: 1120px) 48vw, 540px"
            alt="Aerial view of a bridge crossing a river, illustrating civil engineering infrastructure"
            width={1600}
            height={1200}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="visually-hidden">Bridge infrastructure photo by Juan Coronel on Unsplash.</figcaption>
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
