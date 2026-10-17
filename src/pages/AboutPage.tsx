import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="page-wrap about-wrap">
      <section className="page-intro about-intro">
        <span className="kicker">About the project</span>
        <h1>About CEStudy</h1>
        <p>A student-focused civil engineering reviewer built to make it easier to find what to study next, one topic at a time.</p>
      </section>
      <section className="about-purpose" aria-labelledby="about-purpose-title">
        <span className="kicker">Why CEStudy exists</span>
        <h2 id="about-purpose-title">Make the next study step clearer.</h2>
        <p>Civil Engineering covers many subjects and depends on strong math foundations. CEStudy brings subject browsing, year-level guides, and prerequisite math topics into one accessible place, designed to work smoothly on both phones and computers.</p>
      </section>
      <section aria-labelledby="about-principles-title">
        <div className="about-section-heading">
          <span className="kicker">How we work</span>
          <h2 id="about-principles-title">Useful first. Clear about what is ready.</h2>
          <p>CEStudy is being built gradually. These principles guide what appears and how it is presented.</p>
        </div>
        <div className="about-principles">
          <article className="about-principle">
            <span className="about-principle-number">01</span>
            <h3>Easy to navigate</h3>
            <p>Find subjects by year level, search the catalog, or review math prerequisites without digging through nested menus.</p>
          </article>
          <article className="about-principle">
            <span className="about-principle-number">02</span>
            <h3>Accuracy before volume</h3>
            <p>Subject placements are presented as a guide, not a universal course sequence. Practice questions appear only after review and publication by an authorized maintainer.</p>
          </article>
          <article className="about-principle">
            <span className="about-principle-number">03</span>
            <h3>Improved with feedback</h3>
            <p>Corrections, accessibility issues, and practical suggestions help determine what should be improved next.</p>
          </article>
        </div>
      </section>
      <section className="about-independence" aria-labelledby="about-independence-title">
        <span className="kicker">Independence and sources</span>
        <h2 id="about-independence-title">An independent learning resource</h2>
        <p>CEStudy is an independent educational project. It is not affiliated with or endorsed by the Commission on Higher Education (CHED). Curriculum references are starting points; students should confirm course sequence and requirements with their own university.</p>
      </section>
      <section className="about-next" aria-labelledby="about-next-title">
        <div>
          <h2 id="about-next-title">Help make CEStudy better</h2>
          <p>Send a suggestion, report a problem, or contact the project.</p>
        </div>
        <div className="about-next-links">
          <Link className="button button-primary" to="/feedback">Send feedback</Link>
          <Link className="button button-secondary" to="/bug-reports">Report a bug</Link>
          <Link className="button button-secondary" to="/contact">Contact</Link>
        </div>
      </section>
    </div>
  );
}
