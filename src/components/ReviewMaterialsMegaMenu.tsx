import type { RefObject } from "react";
import { Link } from "react-router-dom";

interface ReviewMaterialsMegaMenuProps {
  isOpen: boolean;
  isActive: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onClose: () => void;
}

const RESOURCE_GROUPS = [
  {
    id: "formula-sheets",
    title: "Formula Sheets",
    description: "Subject-organized formula references, units, and notation.",
  },
  {
    id: "problem-sets",
    title: "Problem Sets with Solutions",
    description: "Worked examples and practice sets after content review.",
  },
  {
    id: "video-tutorials",
    title: "Video Tutorials",
    description: "Curated lesson videos organized by subject and topic.",
  },
] as const;

export function ReviewMaterialsMegaMenu({
  isOpen,
  isActive,
  triggerRef,
  onToggle,
  onClose,
}: ReviewMaterialsMegaMenuProps) {
  return (
    <div className="nav-dropdown review-materials-nav">
      <button
        ref={triggerRef}
        className={`nav-link nav-dropdown-trigger${isActive ? " active" : ""}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls="review-materials-navigation"
        onClick={onToggle}
      >
        <span>Review Materials Hub</span>
        <svg className="nav-dropdown-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      <div
        id="review-materials-navigation"
        className={`review-materials-menu${isOpen ? " is-open" : ""}`}
        role="region"
        aria-label="Review Materials Hub navigation"
        hidden={!isOpen}
      >
        <div className="navigation-panel-heading">
          <div>
            <span className="kicker">Study resources</span>
            <h2>Review Materials Hub</h2>
            <p>Browse by resource type. Items will be listed after review and publication.</p>
          </div>
          <Link to="/review-materials" onClick={onClose}>Browse all review materials <span aria-hidden="true">→</span></Link>
        </div>

        <div className="review-materials-menu-grid">
          {RESOURCE_GROUPS.map((group) => (
            <section className="review-materials-menu-card" key={group.id}>
              <span className="review-materials-menu-status">Coming soon</span>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <Link to={`/review-materials#${group.id}`} onClick={onClose}>
                View section <span aria-hidden="true">→</span>
              </Link>
            </section>
          ))}
        </div>

        <p className="navigation-panel-note">
          No resource is represented as downloadable until its availability and permissions are verified.
        </p>
      </div>
    </div>
  );
}
