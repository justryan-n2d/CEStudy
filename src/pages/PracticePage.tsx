import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { PracticeQuestion } from "../components/PracticeQuestion";
import { fetchPublishedPracticeQuestions } from "../data/practice-api";
import type { PracticeQuestion as PracticeQuestionData } from "../types/study-content";

export function PracticePage() {
  const [questions,setQuestions]=useState<PracticeQuestionData[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [index,setIndex]=useState(0);
  const [selectedAnswer,setSelectedAnswer]=useState<string|null>(null);
  const [submitted,setSubmitted]=useState(false);
  const [score,setScore]=useState(0);

  useEffect(()=>{let active=true;
    fetchPublishedPracticeQuestions("basic-algebra").then(items=>{if(active)setQuestions(items)})
      .catch((reason:unknown)=>{if(active)setError(reason instanceof Error?reason.message:"Practice questions could not be loaded.")})
      .finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[]);

  const current=questions[index];
  const complete=questions.length>0&&index>=questions.length;
  function submitAnswer(){if(!current||!selectedAnswer||submitted)return;if(selectedAnswer===current.correctAnswer)setScore(v=>v+1);setSubmitted(true)}
  function nextQuestion(){setIndex(v=>v+1);setSelectedAnswer(null);setSubmitted(false)}
  function restart(){setIndex(0);setSelectedAnswer(null);setSubmitted(false);setScore(0)}

  return <div className="page-wrap practice-wrap"><Link className="back-link" to="/math-foundations">← Math foundations</Link>
    <section className="page-intro"><span className="kicker">Mathematics foundations</span><h1>Basic algebra practice</h1><p>Answer each question, check your work, and read the worked steps. This session is not saved between visits.</p></section>
    {loading?<div className="state-panel"><BrandLoader label="Checking for published questions…"/></div>
    :error?<div className="state-panel state-error" role="alert"><h2>Practice set unavailable</h2><p>{error}</p></div>
    :questions.length===0?<div className="state-panel review-gate"><span className="review-gate-icon" aria-hidden="true">✓</span><h2>Practice questions are being reviewed</h2><p>Draft questions are kept private. They appear here only after a human reviewer checks the answers, calculations, solution steps, and references, and an authorized maintainer publishes them.</p><p>No student progress is saved in this version, and there is no student-facing AI tutor.</p><Link className="button button-secondary" to="/catalog">Browse the subject catalog</Link></div>
    :complete?<div className="state-panel review-gate" role="status"><span className="review-gate-icon" aria-hidden="true">✓</span><h2>Practice session complete</h2><p>You answered {score} out of {questions.length} questions correctly.</p><button className="button button-primary" type="button" onClick={restart}>Try again</button><Link className="button button-secondary" to="/math-foundations">Explore more math topics</Link></div>
    :current?<PracticeQuestion question={current} index={index} total={questions.length} selectedAnswer={selectedAnswer} submitted={submitted} onSelect={setSelectedAnswer} onSubmit={submitAnswer} onNext={nextQuestion}/>:null}
  </div>;
}
