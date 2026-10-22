import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { Link } from "react-router-dom";
import { fetchCatalogSubjects } from "../data/catalog-api";
import type { CatalogSubject, YearLevel } from "../types/catalog";

interface YearLevelDropdownProps {
  isOpen: boolean;
  isActive: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onClose: () => void;
}

const YEARS: Array<{ year: YearLevel; title: string }> = [
  { year: 1, title: "First year" },
  { year: 2, title: "Second year" },
  { year: 3, title: "Third year" },
  { year: 4, title: "Fourth year" },
];

function contentAvailabilityLabel(subject: CatalogSubject): string {
  if (subject.availability === "has-published-content") return "Study content available";
  if (subject.availability === "in-preparation") return "In preparation";
  return "Coming soon";
}

function subjectsForSemester(subjects: CatalogSubject[], semester: string) {
  return subjects.filter((subject) => (subject.semester ?? "Other subjects") === semester);
}

export function YearLevelDropdown({
  isOpen,
  isActive,
  triggerRef,
  onToggle,
  onClose,
}: YearLevelDropdownProps) {
  const [subjects, setSubjects] = useState<CatalogSubject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setLoading(true);
    setError(null);

    fetchCatalogSubjects()
      .then((items) => {
        if (!active) return;
        setSubjects(items
          .filter((item) => item.category === "year-level" && item.yearLevel !== null)
          .slice()
          .sort((left, right) => left.displayOrder - right.displayOrder));
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error
            ? reason.message
            : "The year-level subjects could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [isOpen]);

  return (
    <div className="nav-dropdown year-level-nav">
      <button
        ref={triggerRef}
        className={`nav-link nav-dropdown-trigger${isActive ? " active" : ""}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls="year-level-navigation"
        onClick={onToggle}
      >
        <span>Year Levels</span>
        <svg className="nav-dropdown-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      <div
        id="year-level-navigation"
        className={`year-level-menu${isOpen ? " is-open" : ""}`}
        role="region"
        aria-label="Year-level navigation"
        hidden={!isOpen}
      >
        <div className="navigation-panel-heading">
          <div>
            <span className="kicker">Browse by year</span>
            <h2>Find your subjects</h2>
          </div>
          <Link to="/years" onClick={onClose}>Browse all year levels</Link>
        </div>

        {loading ? (
          <p className="navigation-panel-status" role="status">Loading year-level subjects…</p>
        ) : error ? (
          <div className="navigation-panel-error" role="alert">
            <p>We could not load year-level subjects.</p>
            <p>{error}</p>
            <Link to="/catalog" onClick={onClose}>Open Subject Catalog</Link>
          </div>
        ) : (
          <div className="year-level-menu-years">
            {YEARS.map(({ year, title }) => {
              const yearSubjects = subjects.filter((subject) => subject.yearLevel === year);
              const semesters = [...new Set(yearSubjects.map((subject) => subject.semester ?? "Other subjects"))];

              return (
                <details className="year-level-menu-year" key={year}>
                  <summary>
                    <span className="year-level-menu-number">{String(year).padStart(2, "0")}</span>
                    <span className="year-level-menu-year-title">{title}</span>
                    <span className="year-level-menu-count">{yearSubjects.length} {yearSubjects.length === 1 ? "subject" : "subjects"}</span>
                  </summary>
                  <div className="year-level-menu-year-content">
                    <Link className="year-level-menu-overview" to={`/year/${year}`} onClick={onClose}>
                      Browse {title.toLowerCase()} subjects
                    </Link>
                    {semesters.length === 0 ? (
                      <p className="navigation-panel-status">No subjects are listed for this year yet.</p>
                    ) : semesters.map((semester) => (
                      <details className="year-level-menu-semester" key={semester}>
                        <summary>{semester}</summary>
                        <ul>
                          {subjectsForSemester(yearSubjects, semester).map((subject) => (
                            <li key={subject.slug}>
                              <Link to={`/subjects/${subject.slug}`} onClick={onClose}>
                                <span>{subject.title}</span>
                                <small>{contentAvailabilityLabel(subject)}</small>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        )}

        <div className="navigation-panel-footer">
          <Link to="/catalog" onClick={onClose}>Subject Catalog</Link>
          <Link to="/math-foundations" onClick={onClose}>Math Foundations</Link>
        </div>
      </div>
    </div>
  );
}
