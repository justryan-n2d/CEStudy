import { Link } from "react-router-dom";

export function PrivacyPage() {
  return (
    <div className="page-wrap privacy-page">
      <section className="page-intro">
        <span className="kicker">Privacy</span>
        <h1>Privacy notice</h1>
        <p>Last updated October 23, 2026. This notice describes the current CEStudy website.</p>
      </section>

      <div className="privacy-content">
        <section aria-labelledby="privacy-browse-title">
          <h2 id="privacy-browse-title">Browsing and study progress</h2>
          <p>You can browse the public engineering catalog without creating an account. Recently opened lesson history and completed-lesson progress stay in this browser on this device. Streak activity is also stored locally, separately under the signed-in Supabase user ID. Appearance preferences stay on this device. None of this activity is stored in a student account database or synced across devices. Clearing this site's browser storage can remove local history, progress, streak records, and appearance preferences.</p>
        </section>

        <section aria-labelledby="privacy-google-title">
          <h2 id="privacy-google-title">Optional Google sign-in and account sessions</h2>
          <p>Google sign-in is optional. If you choose to sign in, Google provides basic account information, such as your email address, through Supabase Auth so CEStudy can identify the signed-in account and show your profile. CEStudy does not require an account to browse the public study library.</p>
          <p>CEStudy keeps an authentication session in this browser so you can stay signed in between page visits. Use the Sign out control on your profile to end the current browser session; this does not sign out other browsers or devices. Signing out does not erase local lesson history, completed-lesson progress, appearance preferences, or any streak history recorded for your device and account ID. A new device starts without this browser's local activity.</p>
        </section>

        <section aria-labelledby="privacy-feedback-title">
          <h2 id="privacy-feedback-title">Feedback and support confirmations</h2>
          <p>The Feedback form sends the category and message you enter to CEStudy's private backend, which stores it in the maintainer's feedback inbox. The form does not ask for your name or email. Only the authorized CEStudy maintainer can read these messages. Support confirmations store the payment provider you selected, your optional note, and your confirmation that you sent support. CEStudy does not automatically verify payments.</p>
          <p>Messages are kept in the private inbox until the authorized maintainer deletes them. Please do not submit passwords, API keys, school IDs, payment credentials, or other sensitive personal information in these forms.</p>
        </section>

        <section aria-labelledby="privacy-bug-title">
          <h2 id="privacy-bug-title">Bug reports and direct email</h2>
          <p>Report a bug opens a prepared Gmail draft with the details you entered. Nothing is sent until you choose to send that email. CEStudy does not store the report from the bug-report page itself. Direct contact opens your email app; messages you choose to send are handled by your email provider and delivered to the CEStudy contact address.</p>
          <p><strong>Contact email:</strong> <a className="text-link" href="mailto:cestudy00@gmail.com">cestudy00@gmail.com</a></p>
        </section>

        <section aria-labelledby="privacy-providers-title">
          <h2 id="privacy-providers-title">Website and service providers</h2>
          <p>Cloudflare Pages hosts the website, and Supabase provides the catalog API and private message backend. These providers may process technical request and security information to operate and protect their services. Their handling of that information is subject to their own policies.</p>
        </section>

        <section aria-labelledby="privacy-choices-title">
          <h2 id="privacy-choices-title">Your choices and content corrections</h2>
          <p>You can use the site without submitting feedback or support confirmations. To request correction or deletion of a message, or to report an incorrect lesson, question, curriculum link, or copyright concern, contact CEStudy and provide enough detail to identify the item.</p>
          <div className="privacy-actions">
            <Link className="button button-primary" to="/contact">Contact CEStudy</Link>
            <Link className="button button-secondary" to="/feedback">Send feedback</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
