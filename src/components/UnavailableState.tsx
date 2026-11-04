import { useId } from "react";
import type { ReactNode } from "react";
import "./UnavailableState.css";

type UnavailableStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
  headingLevel?: "h1" | "h2" | "h3";
  secondaryAction?: ReactNode;
};

export function UnavailableState({
  title,
  message,
  onRetry,
  headingLevel = "h2",
  secondaryAction,
}: UnavailableStateProps) {
  const id = useId();
  const Heading = headingLevel;

  return (
    <section
      className="state-panel state-error unavailable-state"
      role="alert"
      aria-labelledby={`unavailable-title-${id}`}
      aria-describedby={`unavailable-message-${id}`}
    >
      <span
        className="unavailable-state__illustration"
        aria-hidden="true"
        data-testid="unavailable-state-illustration"
      />
      <Heading id={`unavailable-title-${id}`}>{title}</Heading>
      <p id={`unavailable-message-${id}`}>{message}</p>
      <button className="button button-primary" type="button" onClick={onRetry}>
        Retry
      </button>
      {secondaryAction ? <div className="unavailable-state__secondary-action">{secondaryAction}</div> : null}
    </section>
  );
}
