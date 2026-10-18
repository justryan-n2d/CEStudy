import { Link } from "react-router-dom";
import type { CatalogSubject } from "../types/catalog";

const labels={"coming-soon":"Coming soon","in-preparation":"In preparation","has-published-content":"Study content available"} as const;

export function SubjectCard({subject}:{subject:CatalogSubject}){
  const destination=subject.slug==="basic-algebra"||subject.availability==="has-published-content"
    ? "/study/"+subject.slug
    : "/subjects/"+subject.slug;
  return <Link className="subject-card" to={destination} aria-label={subject.title+", "+labels[subject.availability]}>
    <div className="card-topline">
      <span className="eyebrow">{subject.category==="math-foundation"?"Math foundation":subject.category==="specialization"?"Specialization":"Year-level subject"}</span>
      <span className={subject.availability==="has-published-content"?"status status-ready":subject.availability==="in-preparation"?"status status-progress":"status"}>{labels[subject.availability]}</span>
    </div>
    <h3>{subject.title}</h3>
    <p>{subject.summary}</p>
    <div className="card-meta">{subject.yearLevel?<span>Year {subject.yearLevel}{subject.semester?" · "+subject.semester:""}</span>:subject.specialization?<span>{subject.specialization}</span>:<span>Open to all year levels</span>}</div>
  </Link>;
}
