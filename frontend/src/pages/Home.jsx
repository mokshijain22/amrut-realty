import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import api from '../api/client';
import './Home.css';

const CATEGORIES = [
  {
    name: 'Plotting',
    slug: 'plotting',
    desc: 'Farm and residential plots with clear layouts, road access, and full approvals disclosed upfront.',
    cta: 'Book a site visit',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Residential',
    slug: 'residential',
    desc: 'Homes chosen for location advantage, amenities, and long-term value.',
    cta: 'Enquire now',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Commercial',
    slug: 'commercial',
    desc: 'Business-ready spaces in locations built for footfall and growth.',
    cta: 'Get project details',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Farm & Land',
    slug: 'farm',
    desc: 'Land opportunities with complete access and usage disclosures.',
    cta: 'Request information',
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
  },
];

const LOCATIONS = ['Mumbai', 'Pune', 'Mahabaleshwar', 'Sangli', 'Kolhapur', 'New Delhi'];

const STATS = [
  { value: 18, suffix: '+', label: 'Years in real estate' },
  { value: 6, suffix: '', label: 'Regions and growing' },
  { value: 4, suffix: '', label: 'Property segments' },
  { value: 100, suffix: '%', label: 'Partner-led sales network' },
];

function useCountUp(target, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const duration = 1400;
    function tick(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return value;
}

function StatItem({ value, suffix, label, active }) {
  const count = useCountUp(value, active);
  return (
    <div className="stat">
      <strong>{count}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef(null);

  const [contactForm, setContactForm] = useState({ name: '', phone: '', propertyInterest: '' });
  const [contactStatus, setContactStatus] = useState('idle'); // idle | sending | sent | error

  async function handleContactSubmit(e) {
    e.preventDefault();
    setContactStatus('sending');
    try {
      await api.post('/leads', {
        name: contactForm.name,
        phone: contactForm.phone,
        source: 'website',
        notes: contactForm.propertyInterest ? `Interested in: ${contactForm.propertyInterest}` : undefined,
      });
      setContactStatus('sent');
      setContactForm({ name: '', phone: '', propertyInterest: '' });
    } catch (err) {
      setContactStatus('error');
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    const t = setTimeout(() => setHeroLoaded(true), 60);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <span className="nav-brand">Amrut <span>Realty</span></span>
        <nav className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/vision">Vision &amp; Mission</Link>
          <a href="#projects">Projects</a>
          <a href="#partner">Channel partner</a>
          <a href="#contact">Contact</a>
        </nav>
        <Link to="/login" className="nav-cta">Partner login</Link>
      </header>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className={`hero-content ${heroLoaded ? 'is-in' : ''}`}>
          <p className="hero-eyebrow">Building across Mumbai, Pune and beyond since 2007</p>
          <h1>
            Building trust.<br />
            <span className="hero-accent">
              Creating better opportunities.
              <svg className="hero-underline" viewBox="0 0 320 18" preserveAspectRatio="none">
                <path d="M2 12 C 80 4, 240 4, 318 10" />
              </svg>
            </span>
          </h1>
          <p className="hero-sub">
            Plotting, residential and commercial opportunities across a growing
            network of trusted locations.
          </p>
          <div className="hero-tags">
            <span>Plotting</span><span>Residential</span><span>Commercial</span><span>Farm land</span>
          </div>
          <a href="#contact" className="btn-gold">Explore projects</a>
        </div>
      </section>

      <section className="locations-strip">
        <p className="locations-label">Where we build</p>
        <div className="marquee">
          <div className="marquee-track">
            {[...LOCATIONS, ...LOCATIONS, ...LOCATIONS].map((loc, i) => (
              <span key={`${loc}-${i}`}>{loc}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="categories">
        <p className="section-label">What we build</p>
        <h2>Every kind of property, one trusted name.</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div className="category-card" key={cat.name}>
              <div
                className="category-card-img"
                style={{ backgroundImage: `url(${cat.img})` }}
              />
              <div className="category-card-overlay" />
              <div className="category-card-body">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
                <Link to={`/projects?category=${cat.slug}`}>{cat.cta} →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats" ref={statsRef}>
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} active={statsActive} />
        ))}
      </section>

      <section id="partner" className="partner-cta">
        <div className="partner-cta-img">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" alt="" />
        </div>
        <div className="partner-cta-body">
          <p className="section-label">Channel partner program</p>
          <h2>Sell with Amrut.</h2>
          <p>Structured commissions, a trained sales network, and a track record going back to 2007.</p>
          <Link to="/partner-signup" className="btn-gold">Register as a partner</Link>
        </div>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="section-label">Get in touch</p>
          <h2>Talk to our property expert</h2>
          <p>Leave your details and our team will reach out to schedule a site visit.</p>
        </div>
        {contactStatus === 'sent' ? (
          <div className="contact-success">
            <p>Thanks — we've got your details.</p>
            <p>Our team will reach out shortly to schedule your site visit.</p>
            <button className="btn-gold" onClick={() => setContactStatus('idle')}>Send another enquiry</button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              placeholder="Your name"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
            />
            <input
              placeholder="Phone number"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              required
            />
            <input
              placeholder="Which project interests you?"
              value={contactForm.propertyInterest}
              onChange={(e) => setContactForm({ ...contactForm, propertyInterest: e.target.value })}
            />
            {contactStatus === 'error' && (
              <p className="contact-error">Something went wrong — please try again.</p>
            )}
            <button type="submit" className="btn-gold" disabled={contactStatus === 'sending'}>
              {contactStatus === 'sending' ? 'Sending…' : 'Request a callback'}
            </button>
          </form>
        )}
      </section>

      <footer className="footer">
        <span>Amrut <b>Realty</b></span>
        <p>Amrut Developers &amp; Amrut Realty — real estate since 2007.</p>
        <Link to="/legal" className="footer-legal">Privacy &amp; Terms</Link>
      </footer>
    </div>
  );
}