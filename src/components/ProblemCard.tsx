import { useState } from "react";
import type { PracticeQuestion } from "../types/study-content";
import { InlineMathText } from "./InlineMathText";

type ProblemCardContent = Pick<
  PracticeQuestion,
  "prompt" | "correctAnswer" | "solutionSteps"
>;

interface ProblemCardProps {
  problem: ProblemCardContent;
  number: number;
}

export function ProblemCard({ problem, number }: ProblemCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="problem-card">
      <p className="problem-number">Problem {number}</p>
      <p className="problem-prompt">
        <InlineMathText text={problem.prompt} />
      </p>

      <details
        className="problem-solution"
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className="problem-solution-summary">
          <span className="problem-solution-arrow" aria-hidden="true">⌄</span>
          <span>{isOpen ? "Hide the solution" : "View the solution"}</span>
        </summary>

        <div className="problem-solution-content">
          <ol>
            {problem.solutionSteps.map((step, index) => (
              <li key={index}><InlineMathText text={step} /></li>
            ))}
          </ol>

          <div className="problem-answer">
            <strong>Final answer</strong>
            <p className="problem-final-answer">
              <InlineMathText text={problem.correctAnswer} />
            </p>
          </div>
        </div>
      </details>
    </article>
  );
}
