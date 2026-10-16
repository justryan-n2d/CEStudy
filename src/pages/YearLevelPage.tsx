import { Link,useParams } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { useCatalog } from "../hooks/useCatalog";
import { SubjectCard } from "../components/SubjectCard";
import { CurriculumNotice } from "../components/CurriculumNotice";
const titles:Record<string,string>={"1":"First year","2":"Second year","3":"Third year","4":"Fourth year"};
export function YearLevelPage(){const {year}=useParams();const {subjects,loading,error}=useCatalog();if(!titles[year??""])return <div className="page-wrap state-panel"><h1>Year level not found</h1><Link to="/catalog">Browse all subjects</Link></div>;
const list=subjects.filter(s=>s.category==="year-level"&&s.yearLevel===Number(year));const semesters=[...new Set(list.map(s=>s.semester??"Other subjects"))];
return <div className="page-wrap"><section className="page-intro"><Link className="back-link" to="/catalog">← All subjects</Link><span className="kicker">Year {year}</span><h1>{titles[year??""]}</h1><p>This follows the CHED sample as a guide, not a universal sequence. Check your university curriculum for exact placements.</p></section><CurriculumNotice/>
{error?<div className="state-panel state-error" role="alert">{error}</div>:loading?<div className="state-panel"><BrandLoader label="Loading subjects…"/></div>:list.length===0?<div className="state-panel"><h2>No listed subjects yet</h2><Link to="/catalog">Browse the full catalog</Link></div>:semesters.map(sem=><section className="section-block compact-section" key={sem}><div className="section-heading"><div><span className="kicker">Sample placement</span><h2>{sem}</h2></div></div><div className="subject-grid">{list.filter(s=>(s.semester??"Other subjects")===sem).map(s=><SubjectCard key={s.slug} subject={s}/>)}</div></section>)}
<div className="inline-callout"><strong>Want to refresh prerequisites?</strong><p>Math foundations are available regardless of your current year.</p><Link to="/math-foundations" className="text-link">Open math foundations →</Link></div></div>}
