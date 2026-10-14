import { Link } from "react-router-dom";
import { SubjectCard } from "../components/SubjectCard";
import { useCatalog } from "../hooks/useCatalog";
export function MathFoundationsPage(){const {subjects,loading,error}=useCatalog();const foundations=subjects.filter(s=>s.category==="math-foundation");
return <div className="page-wrap"><section className="page-intro"><span className="kicker">Available at any year level</span><h1>Math foundations and refreshers</h1><p>Review prerequisite mathematics when a CE topic gets difficult. These are learning categories, not claims that each is a standalone course required by CHED.</p></section>
<div className="math-practice-callout"><div className="math-symbol">∑</div><div><span className="kicker">First practice module</span><h2>Basic algebra</h2><p>The first question set is being prepared. Draft items remain unavailable until answers, workings, and references pass human review.</p></div><Link className="button button-primary" to="/practice/basic-algebra">Open practice area →</Link></div>
{error?<div className="state-panel state-error" role="alert">{error}</div>:loading?<div className="state-panel">Loading math topics…</div>:<div className="subject-grid foundation-grid">{foundations.map(s=><SubjectCard key={s.slug} subject={s}/>)}</div>}</div>}
