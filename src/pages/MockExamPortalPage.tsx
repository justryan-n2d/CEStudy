import { Link } from "react-router-dom";

export function MockExamPortalPage() {
  return (
    <div className="page-wrap mock-exam-portal-page">
      <section className="page-intro">
        <span className="kicker">Practice workspace</span>
        <h1>Mock Exam Portal</h1>
        <p>A planned destination for eligible practice sets and clear explanations of results.</p>
      </section>

      <section className="state-panel mock-exam-portal-status" aria-labelledby="mock-exam-portal-status-title">
        <span className="mock-exam-portal-symbol" aria-hidden="true">⌛</span>
        <h2 id="mock-exam-portal-status-title">Exam sessions are not available here yet</h2>
        <p>This page is a navigation placeholder. No mock-exam session, timer, result summary, or exam-readiness score is being offered from this page.</p>
        <p>Question sets must be reviewed and published before they can be offered as an activity.</p>
        <div className="mock-exam-portal-actions">
          <Link className="button button-primary" to="/catalog">Browse subjects</Link>
          <Link className="button button-secondary" to="/practice/basic-algebra">Open current practice page</Link>
        </div>
      </section>
    </div>
  );
}
