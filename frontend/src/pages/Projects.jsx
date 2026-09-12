import { Link, useSearchParams } from 'react-router-dom';
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

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = category ? `?category=${category}` : '';
    api.get(`/properties${query}`)
      .then((res) => setProperties(res.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [category]);

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
        <p className="section-label">Projects</p>
        <h1>{category ? CATEGORY_LABELS[category] || 'Projects' : 'All projects'}</h1>
      </section>

      <section className="category-filter">
        <Link to="/projects" className={!category ? 'is-active' : ''}>All</Link>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <Link
            key={key}
            to={`/projects?category=${key}`}
            className={category === key ? 'is-active' : ''}
          >
            {label}
          </Link>
        ))}
      </section>

      <section className="projects-grid">
        {loading ? (
          <p className="projects-empty">Loading projects…</p>
        ) : properties.length === 0 ? (
          <p className="projects-empty">
            No published projects in this category yet. Check back soon, or get in touch for details on what's coming up.
          </p>
        ) : (
          properties.map((p) => (
            <Link to={`/projects/${p._id}`} className="project-card" key={p._id}>
              <div
                className="project-card-img"
                style={{ backgroundImage: `url(${p.photos?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80'})` }}
              />
              <div className="project-card-body">
                <p className="project-card-category">{CATEGORY_LABELS[p.category] || p.category}</p>
                <h3>{p.title}</h3>
                <p className="project-card-location">{p.location}</p>
                <p className="project-card-price">₹{p.priceTotal?.toLocaleString('en-IN')}</p>
              </div>
            </Link>
          ))
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