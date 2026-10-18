import type { PracticeQuestion as PracticeQuestionData } from "../types/study-content";
import { InlineMathText } from "./MarkdownContent";
interface Props { question: PracticeQuestionData; index: number; total: number; selectedAnswer: string | null; submitted: boolean; onSelect: (answer: string) => void; onSubmit: () => void; onNext: () => void }
export function PracticeQuestion({question,index,total,selectedAnswer,submitted,onSelect,onSubmit,onNext}:Props) {
  const isCorrect=selectedAnswer===question.correctAnswer;
  return <article className="practice-question-card">
    <div className="practice-progress"><span>Question {index+1} of {total}</span><span><InlineMathText text={question.topic} /></span></div>
    <h2><InlineMathText text={question.prompt} /></h2>
    <fieldset className="answer-options" disabled={submitted}><legend>Choose one answer</legend>
      {question.choices.map(choice=><label key={choice} className={selectedAnswer===choice?"answer-option answer-option-selected":"answer-option"}><input type="radio" name={question.id} value={choice} checked={selectedAnswer===choice} onChange={()=>onSelect(choice)}/><span><InlineMathText text={choice} /></span></label>)}
    </fieldset>
    {!submitted?<button className="button button-primary" type="button" onClick={onSubmit} disabled={!selectedAnswer}>Check answer</button>:
      <div className={isCorrect?"answer-feedback answer-correct":"answer-feedback answer-incorrect"} role="status">
        <strong>{isCorrect?"Correct.":"Not quite."}</strong>{!isCorrect&&<p>The correct answer is <strong><InlineMathText text={question.correctAnswer} /></strong>.</p>}
        <h3>Solution steps</h3><ol>{question.solutionSteps.map((step,i)=><li key={i}><InlineMathText text={step} /></li>)}</ol><p><InlineMathText text={question.explanation} /></p>
        <button className="button button-primary" type="button" onClick={onNext}>{index+1===total?"See results":"Next question"} →</button>
      </div>}
    <p className="practice-source">Source note: <InlineMathText text={question.sourceNote} /></p>
  </article>;
}
