import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BrandLoader } from "../components/BrandLoader";
import { CurriculumNotice } from "../components/CurriculumNotice";
import { ScrollReveal } from "../components/ScrollReveal";
import { SubjectCard } from "../components/SubjectCard";
import { fetchCatalogSubjects } from "../data/catalog-api";
import type { CatalogSubject } from "../types/catalog";

const labels = {
  "ched-common-course": "CHED sample curriculum: common course",
  "ched-specialized-course": "CHED sample curriculum: specialized professional course",
  "supplementary-math-foundation": "Supplementary mathematics foundation",
  "additional-ce-review-topic": "Additional CE review topic",
} as const;

export function SubjectPage() {
  const { slug } = useParams();
  const [subject, setSubject] = useState<CatalogSubject | null>(null);
  const [related, setRelated] = useState<CatalogSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchCatalogSubjects()
      .then((items) => {
        if (!active) return;
        const found = items.find((item) => item.slug === slug);
        setSubject(found ?? null);
        setRelated(found
          ? items.filter((item) => item.slug !== found.slug
            && ((Boolean(found.specialization) && item.specialization === found.specialization)
              || item.category === found.category)).slice(0, 3)
          : []);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "The subject could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return <div className="page-wrap"><BrandLoader label="Loading subject…" /></div>;
  }
  if (error) {
    return (
      <div className="page-wrap state-panel state-error" role="alert">
        <h1>Subject unavailable</h1>
        <p>{error}</p>
        <Link to="/catalog">Return to catalog</Link>
      </div>
    );
  }
  if (!subject) {
    return (
      <div className="page-wrap state-panel">
        <h1>Subject not found</h1>
        <p>This subject may have moved or the address may be incorrect.</p>
        <Link to="/catalog">Return to catalog</Link>
      </div>
    );
  }

  const status = subject.availability === "has-published-content"
    ? "Study content available"
    : subject.availability === "in-preparation"
      ? "Content in preparation"
      : "Coming soon";

  return (
    <div className="page-wrap detail-wrap">
      <Link className="back-link" to="/catalog">← Back to subject catalog</Link>
      <section className="detail-hero">
        <span className="kicker">
          {subject.category === "math-foundation" ? "Mathematics foundation" : subject.specialization ?? "Civil Engineering"}
        </span>
        <h1>{subject.title}</h1>
        <p className="detail-summary">{subject.summary}</p>
        <span className={
          subject.availability === "has-published-content" ? "status status-ready"
            : subject.availability === "in-preparation" ? "status status-progress"
              : "status"
        }>{status}</span>
      </section>

      <ScrollReveal className="reveal-section">
        <div className="detail-columns detail-columns-single">
          <section className="detail-panel detail-classification">
            <span className="kicker">Course classification</span>
            <h2>{labels[subject.classification]}</h2>
            {subject.yearLevel && (
              <p><strong>Typical placement:</strong> Year {subject.yearLevel}{subject.semester ? ` · ${subject.semester}` : ""}</p>
            )}
            {subject.specialization && <p><strong>Specialization:</strong> {subject.specialization}</p>}
            <p>{subject.sourceNote}</p>
            {subject.sourceReference.startsWith("http") && (
              <a className="text-link" href={subject.sourceReference} target="_blank" rel="noreferrer">
                Open curriculum source ↗
              </a>
            )}
          </section>
        </div>
      </ScrollReveal>

      <CurriculumNotice />

      {subject.slug === "basic-algebra" && (
        <ScrollReveal className="reveal-section" delayMs={40}>
          <section className="study-entry-panel" aria-labelledby="algebra-study-heading">
            <div>
              <span className="kicker">Study path</span>
              <h2 id="algebra-study-heading">Algebra Foundations lessons</h2>
              <p>Start with the readiness review, then follow the College Algebra lessons in order. Only lessons and questions you have reviewed and published appear to students.</p>
            </div>
            <div className="study-entry-actions">
              <Link className="button button-primary" to="/study/basic-algebra">Open lessons →</Link>
              <Link className="button button-secondary" to="/practice/basic-algebra">Practice questions</Link>
            </div>
          </section>
        </ScrollReveal>
      )}

      {related.length > 0 && (
        <ScrollReveal className="reveal-section" delayMs={60}>
          <section className="section-block">
            <div className="section-heading">
              <div><span className="kicker">Keep learning</span><h2>Related subjects and topics</h2></div>
            </div>
            <div className="subject-grid">
              {related.map((item) => <SubjectCard subject={item} key={item.slug} />)}
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
}
