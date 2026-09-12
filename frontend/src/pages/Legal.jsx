import { Link } from 'react-router-dom';
import './Home.css';
import './Content.css';

export default function Legal() {
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
        <p className="section-label">Legal</p>
        <h1>Privacy, terms &amp; disclaimer.</h1>
      </section>

      <section className="content-body">
        <p>
          <strong>Privacy Policy.</strong> Details submitted through our
          enquiry, partner registration and contact forms are used solely to
          respond to your request and, where applicable, to manage your
          channel-partner relationship with us. We do not sell your
          information to third parties.
        </p>
        <p>
          <strong>Terms &amp; Conditions.</strong> All content on this website
          is for general information only and does not constitute a binding
          offer. Project availability, pricing and specifications are subject
          to change and final confirmation at the time of booking.
        </p>
        <p>
          <strong>Disclaimer.</strong> All project claims, approvals, RERA
          information, pricing, commission terms, and investment or return
          statements are subject to verification by our legal and compliance
          team before being published. This website does not guarantee
          returns, profits, appreciation or fixed income on any property or
          partnership. Commission and incentive structures referenced
          internally are draft planning figures until formally approved by
          management.
        </p>
      </section>

      <footer className="footer">
        <span>Amrut <b>Realty</b></span>
        <p>Amrut Developers &amp; Amrut Realty — real estate since 2007.</p>
      </footer>
    </div>
  );
}