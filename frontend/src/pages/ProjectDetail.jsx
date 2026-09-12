import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';
import './Home.css';
import './Content.css';
import './Projects.css';

const CATEGORY_LABELS = {
  plotting: 'Plotting',
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  farm: 'Farm & Land',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | found | error
  const [form, setForm] = useState({ name: '', phone: '' });
  const [enquiryStatus, setEnquiryStatus] = useState('idle');

  useEffect(() => {
    setStatus('loading');
    api.get(`/properties/${id}`)
      .then((res) => {
        setProperty(res.data);
        setStatus('found');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  async function handleEnquiry(e) {
    e.preventDefault();
    setEnquiryStatus('sending');
    try {
      await api.post('/leads', {
        name: form.name,
        phone: form.phone,
        source: 'website',
        propertyId: id,
        notes: property ? `Enquiry for: ${property.title}` : undefined,
      });
      setEnquiryStatus('sent');
      setForm({ name: '', phone: '' });
    } catch {
      setEnquiryStatus('error');
    }
  }

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

      {status === 'loading' && (
        <section className="content-hero"><p>Loading project…</p></section>
      )}

      {status === 'error' && (
        <section className="content-hero">
          <p className="section-label">Not found</p>
          <h1>This project isn't available.</h1>
          <p className="project-detail-back-text">
            <Link to="/projects">← Back to all projects</Link>
          </p>
        </section>
      )}

      {status === 'found' && property && (
        <>
          <section className="project-detail-hero">
            <div
              className="project-detail-img"
              style={{ backgroundImage: `url(${property.photos?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'})` }}
            />
            <div className="project-detail-overlay" />
            <div className="project-detail-hero-content">
              <Link to={`/projects?category=${property.category}`} className="project-detail-back">
                ← {CATEGORY_LABELS[property.category] || property.category}
              </Link>
              <h1>{property.title}</h1>
              <p>{property.location}</p>
            </div>
          </section>

          <section className="project-detail-body">
            <div className="project-detail-main">
              <div className="project-detail-facts">
                <div>
                  <span>Price</span>
                  <strong>₹{property.priceTotal?.toLocaleString('en-IN')}</strong>
                </div>
                {property.unitSize && (
                  <div>
                    <span>Unit size</span>
                    <strong>{property.unitSize}</strong>
                  </div>
                )}
                <div>
                  <span>Category</span>
                  <strong>{CATEGORY_LABELS[property.category] || property.category}</strong>
                </div>
              </div>

              {property.amenities?.length > 0 && (
                <div className="project-detail-amenities">
                  <p className="section-label">Amenities</p>
                  <div className="values-row">
                    {property.amenities.map((a) => <span key={a}>{a}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="project-detail-enquiry">
              {enquiryStatus === 'sent' ? (
                <div className="contact-success">
                  <p>Thanks — we've got your details.</p>
                  <p>Our team will reach out about {property.title}.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleEnquiry}>
                  <p className="section-label">Enquire about this project</p>
                  <input
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                  {enquiryStatus === 'error' && <p className="contact-error">Something went wrong — please try again.</p>}
                  <button type="submit" className="btn-gold" disabled={enquiryStatus === 'sending'}>
                    {enquiryStatus === 'sending' ? 'Sending…' : 'Request a callback'}
                  </button>
                </form>
              )}
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        <span>Amrut <b>Realty</b></span>
        <p>Amrut Developers &amp; Amrut Realty — real estate since 2007.</p>
        <Link to="/legal" className="footer-legal">Privacy &amp; Terms</Link>
      </footer>
    </div>
  );
}