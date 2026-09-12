import { Link } from 'react-router-dom';
import './Home.css';

const CATEGORIES = [
  {
    name: 'Plotting',
    desc: 'Farm and residential plots with clear layouts, road access, and full approvals disclosed upfront.',
    cta: 'Book a Site Visit',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Residential',
    desc: 'Homes chosen for location advantage, amenities, and long-term value.',
    cta: 'Enquire Now',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Commercial',
    desc: 'Business-ready spaces in locations built for footfall and growth.',
    cta: 'Get Project Details',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Farm & Land',
    desc: 'Land opportunities with complete access and usage disclosures.',
    cta: 'Request Information',
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
  },
];

const LOCATIONS = ['Mumbai', 'Pune', 'Mahabaleshwar', 'Sangli', 'Kolhapur', 'New Delhi'];

export default function Home() {
  return (
    <div className="home">
      <header className="nav">
        <span className="nav-brand">AMRUT <span>REALTY</span></span>
        <nav className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#partner">Channel Partner</a>
          <a href="#contact">Contact</a>
        </nav>
        <Link to="/login" className="nav-cta">Partner Login</Link>
      </header>

      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Since 2007 · Mumbai, Pune &amp; beyond</p>
          <h1>Real Estate,<br /><span>Done Right.</span></h1>
          <p className="hero-sub">
            Plotting, residential and commercial opportunities across a growing
            network of trusted locations.
          </p>
          <div className="hero-tags">
            <span>Plotting</span><span>Residential</span><span>Commercial</span><span>Farm Land</span>
          </div>
          <a href="#contact" className="btn-gold">Explore Projects →</a>
        </div>
      </section>

      <section className="locations-strip">
        <p className="locations-label">Where we build</p>
        <div className="locations-row">
          {LOCATIONS.map((loc) => <span key={loc}>{loc}</span>)}
        </div>
      </section>

      <section id="projects" className="categories">
        <p className="section-eyebrow">What we build</p>
        <h2>Every kind of property, one trusted name.</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div className="category-card" key={cat.name} style={{ backgroundImage: `url(${cat.img})` }}>
              <div className="category-card-overlay" />
              <div className="category-card-body">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
                <a href="#contact">{cat.cta} →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats">
        <div><strong>18+</strong><span>Years in real estate</span></div>
        <div><strong>6</strong><span>Regions and growing</span></div>
        <div><strong>4</strong><span>Property segments</span></div>
        <div><strong>100%</strong><span>Partner-led sales network</span></div>
      </section>

      <section id="partner" className="partner-cta">
        <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" alt="" />
        <div className="partner-cta-body">
          <p className="section-eyebrow">Channel Partner Program</p>
          <h2>Sell with Amrut.</h2>
          <p>Structured commissions, a trained sales network, and a track record going back to 2007.</p>
          <a href="#contact" className="btn-gold">Register as a Partner →</a>
        </div>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="section-eyebrow">Get in touch</p>
          <h2>Talk to our property expert</h2>
          <p>Leave your details and our team will reach out to schedule a site visit.</p>
        </div>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Your name" required />
          <input placeholder="Phone number" required />
          <input placeholder="Which project interests you?" />
          <button type="submit" className="btn-gold">Request a Callback</button>
        </form>
      </section>

      <footer className="footer">
        <span>AMRUT <b>REALTY</b></span>
        <p>Amrut Developers &amp; Amrut Realty — real estate since 2007.</p>
      </footer>
    </div>
  );
}