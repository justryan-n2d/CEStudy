import { Link } from "react-router-dom";

const configuredEmail = import.meta.env.VITE_CESTUDY_CONTACT_EMAIL?.trim() || "cestudy00@gmail.com";
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail);

export function ContactPage() {
  return (
    <div className="page-wrap contact-wrap">
      <section className="page-intro">
        <h1>Contact CEStudy</h1>
        <p>Choose the right way to reach the CEStudy team.</p>
      </section>

      <section className="contact-primary-card">
        <span className="contact-icon" aria-hidden="true">✉</span>
        <div className="contact-card-copy">
          <h2>Direct contact</h2>
          {isValidEmail ? (
            <a className="text-link" href={`mailto:${configuredEmail}`}>{configuredEmail}</a>
          ) : (
            <p className="setup-note">The CEStudy contact email has not been configured yet.</p>
          )}
        </div>
      </section>

      <div className="contact-options-grid">
        <article className="contact-option-card">
          <h2>Support CEStudy</h2>
          <p>Help keep the reviewer available to students.</p>
          <Link className="text-link" to="/support">View support options <span aria-hidden="true">→</span></Link>
        </article>
        <article className="contact-option-card">
          <h2>Report a bug</h2>
          <p>Send a bug report through Gmail with a prepared subject.</p>
          <Link className="text-link" to="/bug-reports">Report a bug <span aria-hidden="true">→</span></Link>
        </article>
        <article className="contact-option-card">
          <h2>Send feedback</h2>
          <p>Share an idea, correction, or accessibility issue privately.</p>
          <Link className="text-link" to="/feedback">Send feedback <span aria-hidden="true">→</span></Link>
        </article>
      </div>
    </div>
  );
}
