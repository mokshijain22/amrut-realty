import { Link } from 'react-router-dom';
import './Home.css';
import './Content.css';

export default function About() {
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
        <p className="section-label">About us</p>
        <h1>A real-estate perspective built since 2007.</h1>
      </section>

      <section className="content-body">
        <p>
          Amrut Developers &amp; Amrut Realty brings a long-term real-estate
          perspective built through experience since 2007. Our focus is to
          identify and develop property opportunities across residential,
          commercial and plotting segments, with an emphasis on location,
          usability, customer confidence and long-term value.
        </p>
        <p>
          Our approach combines traditional relationship-driven real estate
          with modern digital communication. Through our website, customers
          can discover projects, understand property options, request a site
          visit and connect with our team. Channel partners can also access
          information and participate in the company's sales network.
        </p>
      </section>

      <section className="content-strip">
        <div><strong>2007</strong><span>Where our journey began</span></div>
        <div><strong>6</strong><span>Regions and growing</span></div>
        <div><strong>4</strong><span>Property segments</span></div>
      </section>

      <footer className="footer">
        <span>Amrut <b>Realty</b></span>
        <p>Amrut Developers &amp; Amrut Realty — real estate since 2007.</p>
        <Link to="/legal" className="footer-legal">Privacy &amp; Terms</Link>
      </footer>
    </div>
  );
}