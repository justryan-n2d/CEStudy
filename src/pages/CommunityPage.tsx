import { Link } from "react-router-dom";

export function CommunityPage() {
  return (
    <div className="page-wrap community-page">
      <Link className="back-link" to="/menu">← Menu</Link>
      <section className="page-intro">
        <span className="kicker">Learn together</span>
        <h1>CEStudy community</h1>
        <p>A place for civil engineering students to exchange study tips and help each other learn is on the roadmap.</p>
      </section>
      <section className="community-launch-panel">
        <span className="community-launch-icon" aria-hidden="true">✦</span>
        <h2>Community spaces are being prepared</h2>
        <p>Community discussions are not open yet. You can still help shape CEStudy by sharing what would make studying easier for you.</p>
        <Link className="button button-primary" to="/feedback">Send feedback</Link>
      </section>
    </div>
  );
}
