import { BrandLoader } from "../components/BrandLoader";
import { SubjectCard } from "../components/SubjectCard";
import { useCatalog } from "../hooks/useCatalog";
import { ScrollReveal } from "../components/ScrollReveal";

export function MathFoundationsPage() {
  const { subjects, loading, error } = useCatalog();
  const foundations = subjects.filter(subject => subject.category === "math-foundation");
  return (
    <div className="page-wrap">
      <section className="page-intro"><h1>Math foundations</h1><p>Supplementary math topics for any year level.</p></section>
      <ScrollReveal className="reveal-section">
        {error ? <div className="state-panel state-error" role="alert">{error}</div>
          : loading ? <div className="state-panel"><BrandLoader label="Loading math topics…" /></div>
          : <div className="subject-grid foundation-grid">{foundations.map(subject => <SubjectCard key={subject.slug} subject={subject} />)}</div>}
      </ScrollReveal>
    </div>
  );
}
