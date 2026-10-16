import { Link } from "react-router-dom";

const years = [
  { year: 1, title: "First year" },
  { year: 2, title: "Second year" },
  { year: 3, title: "Third year" },
  { year: 4, title: "Fourth year" },
];

export function YearLevelGrid() {
  return (
    <nav className="year-grid" aria-label="Browse by year level">
      {years.map(({ year, title }) => (
        <Link className="year-card" to={`/year/${year}`} key={year} aria-label={`Browse ${title} subjects`}>
          <span className="year-number">{String(year).padStart(2, "0")}</span>
          <strong>{title}</strong>
          <span className="year-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
    </nav>
  );
}
