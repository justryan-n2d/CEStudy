import { Link } from "react-router-dom";

const RESOURCE_SECTIONS = [
  {
    id: "formula-sheets",
    title: "Formula Sheets",
    description: "Formula references organized by subject, including notation and units where verified.",
  },
  {
    id: "problem-sets",
    title: "Problem Sets with Solutions",
    description: "Reviewed practice sets and worked solutions, organized by topic.",
  },
  {
    id: "video-tutorials",
    title: "Video Tutorials",
    description: "Curated video lessons linked to subjects and topics.",
  },
] as const;

export function ReviewMaterialsPage() {
  return (
    <div className="page-wrap review-materials-page">
      <section className="page-intro">
        <span className="kicker">Study resources</span>
        <h1>Review Materials Hub</h1>
        <p>Find reference materials and worked examples by subject. Resource availability will be shown here after each item is reviewed and published.</p>
      </section>

      <section className="review-materials-page-grid" aria-label="Review material categories">
        {RESOURCE_SECTIONS.map((section, index) => (
          <article className="review-materials-page-card" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
            <div className="review-materials-page-card-top">
              <span className="review-materials-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="status">Not available yet</span>
            </div>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <p>{section.description}</p>
            <p className="review-materials-availability">Items appear here only after review and publication. This page does not offer downloads.</p>
          </article>
        ))}
      </section>

      <section className="inline-callout review-materials-next">
        <strong>Need to find a subject first?</strong>
        <p>Use the catalog to find subject placement, publication status, and available study content.</p>
        <Link className="button button-primary" to="/catalog">Browse Subject Catalog <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
