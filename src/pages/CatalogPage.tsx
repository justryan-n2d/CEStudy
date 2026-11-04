import { useMemo, useState } from "react";
import { CatalogFilters } from "../components/CatalogFilters";
import { SubjectGridSkeleton } from "../components/LoadingSkeletons";
import { UnavailableState } from "../components/UnavailableState";
import { CurriculumNotice } from "../components/CurriculumNotice";
import { SubjectCard } from "../components/SubjectCard";
import { ScrollReveal } from "../components/ScrollReveal";
import { useCatalog } from "../hooks/useCatalog";

export function CatalogPage() {
  const { subjects, loading, error, retry } = useCatalog();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [classification, setClassification] = useState("");
  const [availability, setAvailability] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subjects.filter((subject) => {
      const matchesQuery = !q || [subject.title, subject.summary, ...subject.aliases, subject.specialization ?? ""]
        .join(" ").toLowerCase().includes(q);
      const matchesYear = !year || (year === "none" ? subject.yearLevel === null : String(subject.yearLevel) === year);
      return matchesQuery && matchesYear
        && (!category || subject.category === category)
        && (!classification || subject.classification === classification)
        && (!availability || subject.availability === availability);
    });
  }, [subjects, query, year, category, classification, availability]);

  const clearFilters = () => {
    setYear("");
    setCategory("");
    setClassification("");
    setAvailability("");
  };
  const clear = () => {
    setQuery("");
    clearFilters();
  };

  return (
    <div className="page-wrap">
      <section className="page-intro"><h1>Subject catalog</h1></section>
      <ScrollReveal className="reveal-section">
        <CatalogFilters
          query={query} onQueryChange={setQuery}
          year={year} onYearChange={setYear}
          category={category} onCategoryChange={setCategory}
          classification={classification} onClassificationChange={setClassification}
          availability={availability} onAvailabilityChange={setAvailability}
          onClear={clearFilters}
        />
      </ScrollReveal>
      <ScrollReveal className="reveal-section" delayMs={60}>
        <div className="results-heading">
          <h2>{loading ? "Loading subjects…" : "Subjects and topics"}</h2>
          <span role="status" aria-live="polite" aria-atomic="true">
            {loading ? "" : filtered.length + " result" + (filtered.length === 1 ? "" : "s")}
          </span>
        </div>
        {error
          ? <UnavailableState
              title="Catalog unavailable"
              message="The subject catalog could not be loaded. Check your connection and try again."
              onRetry={retry}
            />
          : loading
            ? <SubjectGridSkeleton label="Loading the subject catalog…" />
            : filtered.length
              ? <div className="subject-grid">{filtered.map((subject) => <SubjectCard key={subject.slug} subject={subject} />)}</div>
              : <div className="state-panel">
                  <h3>No subjects found</h3>
                  <p>Try another search or clear one or more filters.</p>
                  <button className="button button-secondary" type="button" onClick={clear}>Reset search and filters</button>
                </div>}
      </ScrollReveal>
      <CurriculumNotice />
    </div>
  );
}
