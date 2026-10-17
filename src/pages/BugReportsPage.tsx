import { useMemo, useState } from "react";
import type { FormEvent } from "react";

const bugReportEmail = import.meta.env.VITE_BUG_REPORT_EMAIL?.trim() ?? "";
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bugReportEmail);

export function buildGmailComposeUrl(input: {
  recipient: string;
  summary: string;
  page: string;
  observed: string;
  expected: string;
  steps: string;
}) {
  const subject = `CEStudy bug report: ${input.summary.trim() || "Bug report"}`;
  const body = [
    "Hello CEStudy team,",
    "",
    "I found a bug in CEStudy.",
    "",
    `Summary: ${input.summary.trim() || "Not provided"}`,
    `Page or feature: ${input.page.trim() || "Not provided"}`,
    "",
    "What happened:",
    input.observed.trim() || "Not provided",
    "",
    "What I expected:",
    input.expected.trim() || "Not provided",
    "",
    "Steps to reproduce:",
    input.steps.trim() || "Not provided",
    "",
    "Sent from the CEStudy bug report page.",
  ].join("\n");
  const params = new URLSearchParams({ view: "cm", fs: "1", su: subject, body });
  if (input.recipient.trim()) params.set("to", input.recipient.trim());
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function BugReportsPage() {
  const [summary, setSummary] = useState("");
  const [page, setPage] = useState("");
  const [observed, setObserved] = useState("");
  const [expected, setExpected] = useState("");
  const [steps, setSteps] = useState("");
  const composeUrl = useMemo(() => buildGmailComposeUrl({
    recipient: isValidEmail ? bugReportEmail : "",
    summary,
    page,
    observed,
    expected,
    steps,
  }), [summary, page, observed, expected, steps]);

  return (
    <div className="page-wrap form-page-wrap">
      <section className="page-intro">
        <h1>Report a bug</h1>
        <p>Describe the problem. Gmail will open with a prepared report for you to review and send.</p>
      </section>

      <form className="surface-form" onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValidEmail) return;
        window.open(composeUrl, "_blank", "noopener,noreferrer");
      }}>
        <label className="form-field">
          <span>Short summary <span className="required-mark" aria-hidden="true">*</span></span>
          <input value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={120} required placeholder="What went wrong?" />
          <small className="field-hint">This becomes the email subject: <strong>CEStudy bug report: {summary.trim() || "Bug report"}</strong></small>
        </label>

        <label className="form-field">
          <span>Page or feature</span>
          <input value={page} onChange={(event) => setPage(event.target.value)} maxLength={250} placeholder="For example, Subject catalog" />
        </label>

        <label className="form-field">
          <span>What happened? <span className="required-mark" aria-hidden="true">*</span></span>
          <textarea value={observed} onChange={(event) => setObserved(event.target.value)} required rows={3} maxLength={2000} placeholder="Describe the problem you saw." />
        </label>

        <label className="form-field">
          <span>What did you expect?</span>
          <textarea value={expected} onChange={(event) => setExpected(event.target.value)} rows={3} maxLength={2000} placeholder="Describe what should have happened." />
        </label>

        <label className="form-field">
          <span>Steps to reproduce</span>
          <textarea value={steps} onChange={(event) => setSteps(event.target.value)} rows={3} maxLength={2000} placeholder="1. Open a page... 2. Select..." />
        </label>

        {!isValidEmail && (
          <p className="inline-status inline-status-warning" role="status">
            The recipient Gmail address has not been configured yet. Your report will not be sent until the destination is added.
          </p>
        )}

        <button className="button button-primary" type="submit" disabled={!isValidEmail}>
          Open Gmail draft <span aria-hidden="true">↗</span>
        </button>
        <p className="field-hint">The report is sent only when you review and send it from Gmail. CEStudy does not store this report on this page.</p>
      </form>
    </div>
  );
}
