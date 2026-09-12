import { Link } from 'react-router-dom';
import './Home.css';
import './Content.css';
import './Gallery.css';

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80', caption: 'Plotting site, layout marking' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80', caption: 'Residential project frontage' },
  { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80', caption: 'Commercial space, ground floor' },
  { src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80', caption: 'Farm land opportunity' },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80', caption: 'Site visit, plotting phase' },
  { src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80', caption: 'Channel partner training session' },
];

export default function Gallery() {
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
        <p className="section-label">Gallery</p>
        <h1>Projects, site visits and progress.</h1>
      </section>

      <section className="gallery-grid">
        {PHOTOS.map((p, i) => (
          <div className="gallery-item" key={i}>
            <img src={p.src} alt={p.caption} />
            <p>{p.caption}</p>
          </div>
        ))}
      </section>

      <p className="gallery-note">
        Photos shown are representative. Real project photography will replace
        these once provided by management.
      </p>

      <footer className="footer">
        <span>Amrut <b>Realty</b></span>
        <p>Amrut Developers &amp; Amrut Realty — real estate since 2007.</p>
      </footer>
    </div>
  );
}