import { Link } from 'react-router-dom';
import './Home.css';
import './Content.css';

const VALUES = ['Trust', 'Transparency', 'Relationship', 'Quality', 'Professionalism', 'Long-term thinking'];

export default function Vision() {
  return (
    <div className="home">
      <header className="nav nav-scrolled">
        <Link to="/" className="nav-brand">Amrut <span>Realty</span></Link>
        <nav className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/vision">Vision &amp; Mission</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
        <Link to="/login" className="nav-cta">Partner login</Link>
      </header>

      <section className="content-hero">
        <p className="section-label">Vision &amp; mission</p>
        <h1>What we're building toward.</h1>
      </section>

      <section className="content-columns">
        <div className="content-column">
          <p className="content-column-label">Vision</p>
          <p>
            To build a trusted real-estate brand known for quality
            opportunities, transparent communication and lasting
            relationships.
          </p>
        </div>
        <div className="content-column">
          <p className="content-column-label">Mission</p>
          <p>
            To create accessible property opportunities, strengthen customer
            service and build a professional partner network.
          </p>
        </div>
      </section>

      <section className="content-values">
        <p className="section-label">Core values</p>
        <div className="values-row">
          {VALUES.map((v) => <span key={v}>{v}</span>)}
        </div>
      </section>

      <footer className="footer">
        <span>Amrut <b>Realty</b></span>
        <p>Amrut Developers &amp; Amrut Realty — real estate since 2007.</p>
        <Link to="/legal" className="footer-legal">Privacy &amp; Terms</Link>
      </footer>
    </div>
  );
}