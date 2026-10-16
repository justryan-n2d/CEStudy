import { Link } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { SubjectCard } from "../components/SubjectCard";
import { useCatalog } from "../hooks/useCatalog";
export function MathFoundationsPage(){const {subjects,loading,error}=useCatalog();const foundations=subjects.filter(s=>s.category==="math-foundation");
return <div className="page-wrap"><section className="page-intro"><h1>Math foundations</h1><p>Review prerequisite math topics. These categories supplement the curriculum and are not a universal CHED course sequence.</p></section>
<div className="math-practice-callout"><div className="math-symbol" aria-hidden="true">∑</div><div><span className="kicker">Practice</span><h2>Basic algebra</h2><p>Questions appear after human review.</p></div><Link className="button button-primary" to="/practice/basic-algebra">Open practice →</Link></div>
{error?<div className="state-panel state-error" role="alert">{error}</div>:loading?<div className="state-panel"><BrandLoader label="Loading math topics…"/></div>:<div className="subject-grid foundation-grid">{foundations.map(s=><SubjectCard key={s.slug} subject={s}/>)}</div>}</div>}
