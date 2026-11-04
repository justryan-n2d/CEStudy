import { Link } from "react-router-dom";

export function CommunityPage() {
  return (
    <div className="page-wrap community-page">
      <section className="page-intro">
        <span className="kicker">Learn together</span>
        <h1>Community Forum</h1>
        <p>A planned space for Civil Engineering students to discuss study topics and work through problems.</p>
      </section>

      <section className="state-panel community-launch-panel" aria-labelledby="community-launch-title">
        <span className="community-launch-icon" aria-hidden="true">✦</span>
        <h2 id="community-launch-title">Discussions are not open yet</h2>
        <p>This is a launch placeholder, not an active forum. Posting, replies, editing, reporting, and moderation are not available from this page.</p>
        <p>Community tools will need clear identity, publication, reporting, and access-control rules before they open.</p>
        <Link className="button button-primary" to="/feedback">Help shape the community</Link>
      </section>
    </div>
  );
}
