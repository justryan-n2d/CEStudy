import { Link } from "react-router-dom";

const contactEmail = "cestudy00@gmail.com";

export function PrivacyPage() {
  return (
    <div className="page-wrap privacy-page">
      <Link className="back-link" to="/">← CEStudy</Link>
      <section className="page-intro">
        <span className="kicker">Transparency</span>
        <h1>Privacy notice</h1>
        <p>How CEStudy handles optional Google sign-in, study data, and messages.</p>
        <p className="privacy-updated">Last updated: October 19, 2026</p>
      </section>

      <div className="privacy-content">
        <section aria-labelledby="privacy-browse-title">
          <h2 id="privacy-browse-title">Browsing and study progress</h2>
          <p>You can browse the public engineering catalog without creating an account. In the current website, completed-lesson progress and study-day history stay in your browser on this device. They are not synced to CEStudy's servers or across devices. Clearing this site's browser storage can remove that local data.</p>
        </section>

        <section aria-labelledby="privacy-google-title">
          <h2 id="privacy-google-title">Google sign-in</h2>
          <p>Google sign-in is optional and is used to unlock your learning streak. Supabase Auth handles the sign-in session, and CEStudy may display the Google account email returned by the authentication service. Signing in does not create server-side study progress or enable cross-device syncing.</p>
        </section>

        <section aria-labelledby="privacy-browser-data-title">
          <h2 id="privacy-browser-data-title">Study data stored in this browser</h2>
          <p>History, completed lessons, streak activity, and appearance preferences are stored in this browser. Streak activity is kept under the signed-in Supabase user ID in browser storage. These records are not currently synced across devices or saved to CEStudy's database. Clearing this site's browser storage may remove them.</p>
        </section>

        <section aria-labelledby="privacy-feedback-title">
          <h2 id="privacy-feedback-title">Feedback and support confirmations</h2>
          <p>The Feedback form sends the category and message you enter to CEStudy's private backend, which stores it in the maintainer's feedback inbox. The form does not ask for your name or email. Only the authorized CEStudy maintainer can read these messages. Support confirmations store the payment provider you selected, your optional note, and your confirmation that you sent support. CEStudy does not automatically verify payments.</p>
          <p>Messages are kept in the private inbox until the authorized maintainer deletes them. Please do not submit passwords, API keys, school IDs, payment credentials, or other sensitive personal information in these forms.</p>
        </section>

        <section aria-labelledby="privacy-bug-title">
          <h2 id="privacy-bug-title">Bug reports and direct email</h2>
          <p>Report a bug opens a prepared Gmail draft with the details you entered. Nothing is sent until you choose to send that email. CEStudy does not store the report from the bug-report page itself. Direct contact opens your email app; messages you choose to send are handled by your email provider and delivered to CEStudy.</p>
          <p><strong>Contact email:</strong> <a className="text-link" href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
        </section>

        <section aria-labelledby="privacy-providers-title">
          <h2 id="privacy-providers-title">Website and service providers</h2>
          <p>Cloudflare Pages hosts the website, and Supabase provides authentication, the catalog API, and the private message backend. These providers may process technical request and security information to operate and protect their services. Their handling of that information is subject to their own policies.</p>
        </section>

        <section aria-labelledby="privacy-choices-title">
          <h2 id="privacy-choices-title">Your choices and content corrections</h2>
          <p>You can continue browsing without signing in, sign out from your Profile page, and clear device-local study data through your browser settings. To request correction or deletion of a message, or to report an incorrect lesson, question, curriculum link, or copyright concern, contact CEStudy and provide enough detail to identify the item. There is currently no self-service page for deleting submitted messages or an account.</p>
          <div className="privacy-actions">
            <Link className="button button-primary" to="/contact">Contact CEStudy</Link>
            <Link className="button button-secondary" to="/feedback">Send feedback</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
