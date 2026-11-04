import { SubjectGridSkeleton } from "../components/LoadingSkeletons";
import { UnavailableState } from "../components/UnavailableState";
import { SubjectCard } from "../components/SubjectCard";
import { useCatalog } from "../hooks/useCatalog";
import { ScrollReveal } from "../components/ScrollReveal";

export function MathFoundationsPage() {
  const { subjects, loading, error, retry } = useCatalog();
  const foundations = subjects.filter((subject) => subject.category === "math-foundation");

  return (
    <div className="page-wrap">
      <section className="page-intro"><h1>Math foundations</h1><p>Supplementary math topics for any year level.</p></section>
      <ScrollReveal className="reveal-section">
        {error
          ? <UnavailableState
              title="Math foundations unavailable"
              message="Math foundations could not be loaded. Check your connection and try again."
              onRetry={retry}
            />
          : loading
            ? <SubjectGridSkeleton label="Loading math topics…" />
            : <div className="subject-grid foundation-grid">{foundations.map((subject) => <SubjectCard key={subject.slug} subject={subject} />)}</div>}
      </ScrollReveal>
    </div>
  );
}
