import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { BrandLoader } from "../components/BrandLoader";
import { PracticeQuestion } from "../components/PracticeQuestion";
import { fetchPublishedPracticeQuestions } from "../data/practice-api";
import type { PracticeQuestion as PracticeQuestionData } from "../types/study-content";

export function PracticePage() {
  const { slug } = useParams();
  const subjectSlug = slug ?? "basic-algebra";
  const [searchParams] = useSearchParams();
  const requestedTopic = searchParams.get("topic")?.trim() ?? "";
  const normalizedTopic = requestedTopic.normalize("NFKC").toLowerCase();
  const [allQuestions, setAllQuestions] = useState<PracticeQuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setAllQuestions([]);
    fetchPublishedPracticeQuestions(subjectSlug)
      .then(items => { if (active) setAllQuestions(items); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Practice questions could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [subjectSlug]);

  useEffect(() => {
    setIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
  }, [subjectSlug, normalizedTopic]);

  const questions = useMemo(() => normalizedTopic
    ? allQuestions.filter(question => question.topic.normalize("NFKC").toLowerCase() === normalizedTopic)
    : allQuestions, [allQuestions, normalizedTopic]);

  const current = questions[index];
  const complete = questions.length > 0 && index >= questions.length;
  const subjectTitle = subjectSlug === "basic-algebra"
    ? "Algebra Foundations"
    : subjectSlug.replace(/-/g, " ").replace(/^./, first => first.toUpperCase());
  const backTo = normalizedTopic ? `/catalog?q=${encodeURIComponent(requestedTopic)}` : "/math-foundations";

  function submitAnswer() {
    if (!current || !selectedAnswer || submitted) return;
    if (selectedAnswer === current.correctAnswer) setScore(value => value + 1);
    setSubmitted(true);
  }
  function nextQuestion() {
    setIndex(value => value + 1);
    setSelectedAnswer(null);
    setSubmitted(false);
  }
  function restart() {
    setIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
  }

  return <div className="page-wrap practice-wrap">
    <Link className="back-link" to={backTo}>{normalizedTopic ? "← Search results" : "← Math foundations"}</Link>
    <section className="page-intro"><span className="kicker">Practice</span><h1>{subjectTitle} practice</h1>{normalizedTopic&&<p>{requestedTopic}</p>}</section>
    {loading ? <div className="state-panel"><BrandLoader label="Loading practice…" /></div>
    : error ? <div className="state-panel state-error" role="alert"><h2>Practice unavailable</h2><p>{error}</p></div>
    : questions.length === 0 && allQuestions.length > 0 && normalizedTopic ? (
      <div className="state-panel"><h2>No questions for this topic</h2><p>Try another topic search.</p><Link className="text-link" to={`/practice/${subjectSlug}`}>View all practice questions →</Link></div>
    ) : questions.length === 0 ? <div className="state-panel review-gate"><h2>Questions coming soon</h2><p>We're reviewing these questions.</p></div>
    : complete ? <div className="state-panel review-gate" role="status"><span className="review-gate-icon" aria-hidden="true">✓</span><h2>Practice session complete</h2><p>You answered {score} out of {questions.length} questions correctly.</p><button className="button button-primary" type="button" onClick={restart}>Try again</button></div>
    : current ? <PracticeQuestion question={current} index={index} total={questions.length} selectedAnswer={selectedAnswer} submitted={submitted} onSelect={setSelectedAnswer} onSubmit={submitAnswer} onNext={nextQuestion} /> : null}
  </div>;
}
