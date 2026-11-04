import type { ReactNode } from "react";

type SkeletonRegionProps = {
  label: string;
  testId: string;
  className?: string;
  children: ReactNode;
};

function SkeletonRegion({ label, testId, className = "", children }: SkeletonRegionProps) {
  return (
    <div
      className={className}
      data-skeleton={testId}
      aria-busy="true"
    >
      <span className="visually-hidden" role="status" aria-live="polite">{label}</span>
      {children}
    </div>
  );
}

function SkeletonShape({ className = "" }: { className?: string }) {
  return <span className={`skeleton-shape ${className}`} />;
}

function SubjectCardPlaceholder() {
  return (
    <article className="subject-card skeleton-subject-card" aria-hidden="true">
      <div className="card-topline">
        <SkeletonShape className="skeleton-pill skeleton-pill--small" />
        <SkeletonShape className="skeleton-pill" />
      </div>
      <SkeletonShape className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line-stack">
        <SkeletonShape className="skeleton-line" />
        <SkeletonShape className="skeleton-line skeleton-line--long" />
      </div>
      <div className="skeleton-card-meta">
        <SkeletonShape className="skeleton-line skeleton-line--short" />
      </div>
      <SkeletonShape className="skeleton-line skeleton-line--medium skeleton-card-link" />
    </article>
  );
}

function SubjectCardGrid() {
  return (
    <div className="subject-grid">
      {Array.from({ length: 6 }, (_, index) => <SubjectCardPlaceholder key={index} />)}
    </div>
  );
}

function SkeletonHeading({ className = "" }: { className?: string }) {
  return <SkeletonShape className={`skeleton-line skeleton-line--heading ${className}`} />;
}

export function SubjectGridSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} testId="subject-grid" className="subject-grid skeleton-subject-grid">
      <div aria-hidden="true">
        <SubjectCardGrid />
      </div>
    </SkeletonRegion>
  );
}

export function YearLevelSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} testId="year-level" className="year-level-skeleton">
      <div aria-hidden="true">
        {[0, 1].map((semester) => (
          <section className="section-block compact-section" key={semester}>
            <div className="section-heading">
              <div className="skeleton-section-heading">
                <SkeletonShape className="skeleton-line skeleton-line--kicker" />
                <SkeletonHeading className="skeleton-line--medium" />
              </div>
            </div>
            <SubjectCardGrid />
          </section>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function SubjectDetailSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} testId="subject-detail" className="page-wrap detail-wrap">
      <div aria-hidden="true">
        <SkeletonShape className="skeleton-line skeleton-line--back-link" />
        <section className="detail-hero skeleton-detail-hero">
          <SkeletonShape className="skeleton-line skeleton-line--kicker" />
          <SkeletonHeading className="skeleton-detail-title" />
          <div className="skeleton-line-stack skeleton-detail-summary">
            <SkeletonShape className="skeleton-line" />
            <SkeletonShape className="skeleton-line skeleton-line--long" />
          </div>
          <SkeletonShape className="skeleton-pill skeleton-detail-status" />
        </section>
        <div className="detail-columns detail-columns-single">
          <section className="detail-panel detail-classification skeleton-detail-panel">
            <SkeletonShape className="skeleton-line skeleton-line--kicker" />
            <SkeletonHeading className="skeleton-line--medium" />
            <SkeletonShape className="skeleton-line skeleton-line--long" />
            <SkeletonShape className="skeleton-line skeleton-line--medium" />
            <SkeletonShape className="skeleton-line skeleton-line--short" />
          </section>
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function StudyReaderSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} testId="study-reader" className="study-reader-skeleton">
      <div className="study-layout" aria-hidden="true">
        <aside className="study-outline skeleton-study-outline">
          <div className="study-outline-heading">
            <SkeletonShape className="skeleton-line skeleton-line--kicker" />
            <SkeletonShape className="skeleton-line skeleton-line--medium" />
          </div>
          <nav>
            {Array.from({ length: 5 }, (_, index) => (
              <div className="study-outline-item skeleton-outline-item" key={index}>
                <SkeletonShape className="skeleton-outline-number" />
                <div className="skeleton-line-stack">
                  <SkeletonShape className="skeleton-line" />
                  <SkeletonShape className="skeleton-line skeleton-line--short" />
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <article className="study-lesson skeleton-study-lesson">
          <div className="study-lesson-topline">
            <SkeletonShape className="skeleton-pill" />
            <SkeletonShape className="skeleton-line skeleton-line--short" />
          </div>
          <SkeletonHeading className="skeleton-study-title" />
          <div className="skeleton-reading-section">
            <SkeletonShape className="skeleton-line skeleton-line--heading" />
            <div className="skeleton-line-stack">
              <SkeletonShape className="skeleton-line" />
              <SkeletonShape className="skeleton-line" />
              <SkeletonShape className="skeleton-line skeleton-line--long" />
            </div>
          </div>
          <SkeletonShape className="skeleton-formula-block" />
          <div className="skeleton-reading-section">
            <SkeletonShape className="skeleton-line skeleton-line--heading" />
            {Array.from({ length: 3 }, (_, index) => (
              <div className="skeleton-worked-step" key={index}>
                <SkeletonShape className="skeleton-step-number" />
                <div className="skeleton-line-stack">
                  <SkeletonShape className="skeleton-line" />
                  <SkeletonShape className="skeleton-line skeleton-line--long" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </SkeletonRegion>
  );
}

export function PracticeQuestionSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label} testId="practice-question" className="practice-skeleton-region">
      <section className="practice-question-card" aria-hidden="true">
        <div className="practice-progress">
          <SkeletonShape className="skeleton-pill skeleton-pill--wide" />
          <SkeletonShape className="skeleton-line skeleton-line--short" />
        </div>
        <SkeletonHeading className="skeleton-practice-title" />
        <div className="skeleton-practice-prompt">
          <SkeletonShape className="skeleton-line" />
          <SkeletonShape className="skeleton-line skeleton-line--long" />
          <SkeletonShape className="skeleton-formula-inline" />
        </div>
        <div className="answer-options">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="answer-option skeleton-answer-option" key={index}>
              <SkeletonShape className="skeleton-answer-marker" />
              <SkeletonShape className="skeleton-line skeleton-line--medium" />
            </div>
          ))}
        </div>
        <div className="answer-feedback skeleton-answer-feedback">
          <SkeletonShape className="skeleton-line skeleton-line--medium" />
          <SkeletonShape className="skeleton-line" />
        </div>
      </section>
    </SkeletonRegion>
  );
}
