import { Link } from "react-router-dom";
import { ScrollReveal } from "../components/ScrollReveal";
import { YearLevelGrid } from "../components/YearLevelGrid";

export function YearLevelsPage() {
  return (
    <div className="page-wrap">
      <section className="page-intro">
        <h1>Year levels</h1>
        <p>Choose a year to view its sample subject placements.</p>
      </section>

      <ScrollReveal className="reveal-section">
        <YearLevelGrid />
      </ScrollReveal>

      <ScrollReveal className="reveal-section" delayMs={70}>
        <div className="inline-callout">
          <strong>Need prerequisite math?</strong>
          <p>Browse math topics for any year level.</p>
          <Link to="/math-foundations" className="text-link">
            Open math foundations <span aria-hidden="true">→</span>
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
