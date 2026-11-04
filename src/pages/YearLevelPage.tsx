import { Link, useParams } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { useCatalog } from "../hooks/useCatalog";
import { SubjectCard } from "../components/SubjectCard";
import { CurriculumNotice } from "../components/CurriculumNotice";
import { ScrollReveal } from "../components/ScrollReveal";

const titles: Record<string, string> = {
  "1": "First year", "2": "Second year", "3": "Third year", "4": "Fourth year",
};
export function YearLevelPage() {
  const { year } = useParams();
  const { subjects, loading, error } = useCatalog();
  if (!titles[year ?? ""]) return <div className="page-wrap state-panel"><h1>Year level not found</h1><Link to="/catalog">Browse all subjects</Link></div>;

  const list = subjects.filter(subject => subject.category === "year-level" && subject.yearLevel === Number(year));
  const semesters = [...new Set(list.map(subject => subject.semester ?? "Other subjects"))];
  return (
    <div className="page-wrap">
      <section className="page-intro">
        <Link className="back-link" to="/catalog">← All subjects</Link>
        <span className="kicker">Year {year}</span><h1>{titles[year ?? ""]}</h1>
        <p>This follows the CHED sample as a guide, not a universal sequence. Check your university curriculum for exact placements.</p>
      </section>
      <CurriculumNotice />
      {error ? <div className="state-panel state-error" role="alert">{error}</div>
        : loading ? <div className="state-panel"><BrandLoader label="Loading subjects…" /></div>
        : list.length === 0 ? <div className="state-panel"><h2>No listed subjects yet</h2><Link to="/catalog">Browse the full catalog</Link></div>
        : semesters.map((semester, index) => (
          <ScrollReveal className="reveal-section" key={semester} delayMs={Math.min(index * 55, 165)}>
            <section className="section-block compact-section">
              <div className="section-heading"><div><span className="kicker">Sample placement</span><h2>{semester}</h2></div></div>
              <div className="subject-grid">{list.filter(subject => (subject.semester ?? "Other subjects") === semester).map(subject => <SubjectCard key={subject.slug} subject={subject} />)}</div>
            </section>
          </ScrollReveal>
        ))}
      <ScrollReveal className="reveal-section">
        <div className="inline-callout"><strong>Want to refresh prerequisites?</strong><p>Math foundations are available regardless of your current year.</p><Link to="/math-foundations" className="text-link">Open math foundations →</Link></div>
      </ScrollReveal>
    </div>
  );
}
