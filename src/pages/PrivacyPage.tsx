import { Link } from "react-router-dom";

const contactEmail = "cestudy00@gmail.com";

export function PrivacyPage() {
  return (
    <div className="page-wrap privacy-page">
      <Link className="back-link" to="/">← CEStudy</Link>
      <section className="page-intro">
        <span className="kicker">Transparency</span>
        <h1>Privacy notice</h1>
        <p>How CEStudy handles sign-in, study data, and messages.</p>
        <p className="privacy-updated">Last updated: October 18, 2026</p>
      </section>

      <div className="privacy-sections">
        <section className="privacy-section">
          <h2>Browsing the library</h2>
          <p>You can browse CEStudy's public subject catalog and available learning content without signing in. An account is not required to read public pages.</p>
        </section>

        <section className="privacy-section">
          <h2>Google sign-in</h2>
          <p>Google sign-in is optional. In the current version, it is used to unlock your learning streak. Supabase Auth handles the sign-in session, and CEStudy may display the Google account email returned by the authentication service. Signing in does not enable cross-device study-data syncing.</p>
        </section>

        <section className="privacy-section">
          <h2>Study data stored in this browser</h2>
          <p>History, completed lessons, streak activity, and appearance preferences are stored in this browser. Streak activity is kept under the signed-in Supabase user ID in browser storage. These records are not currently synced across devices or saved to CEStudy's database. Clearing this site's browser storage may remove them.</p>
        </section>

        <section className="privacy-section">
          <h2>Feedback and support</h2>
          <p>When you submit feedback or a support confirmation, the message is sent to CEStudy and stored in its private backend. Access is restricted to authorized CEStudy maintainers. Support confirmations are self-reported; CEStudy does not automatically verify a payment. Please do not include passwords, student IDs, payment details, or other sensitive information in message fields.</p>
        </section>

        <section className="privacy-section">
          <h2>Bug reports and email</h2>
          <p>The bug-report page opens a prepared Gmail draft for you to review. A report is sent only if you choose to send that email. CEStudy does not save the unsent Gmail draft through the bug-report page itself.</p>
        </section>

        <section className="privacy-section">
          <h2>Service providers and security</h2>
          <p>CEStudy uses Cloudflare Pages to host the website and Supabase for authentication and database services. Those services process the requests needed to load the website, sign in, or submit messages. CEStudy uses database access controls and security checks, but no internet service can be guaranteed risk-free. Service providers may process technical data according to their own terms and policies.</p>
        </section>

        <section className="privacy-section">
          <h2>Your choices and contact</h2>
          <p>You can continue browsing without signing in, sign out of your Google session from your Profile page, and clear device-local study data through your browser settings. For questions or requests about a message you submitted, contact CEStudy so the request can be reviewed manually. There is currently no self-service page for deleting submitted messages or an authenticated account.</p>
          <p><a className="text-link" href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
        </section>
      </div>
    </div>
  );
}
