import { useEffect, useState } from 'react';
import api from '../api/client';
import AppShell from '../components/AppShell';
import './AdminProperties.css';

const CATEGORIES = ['plotting', 'residential', 'commercial', 'industrial', 'farm'];

const STATUS_STYLES = {
  draft: 'status-draft',
  pending_legal: 'status-pending',
  published: 'status-published',
};

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    title: '', category: 'plotting', location: '', priceTotal: '', unitSize: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishingId, setPublishingId] = useState(null);

  function loadAll() {
    api.get('/properties?all=true')
      .then((res) => setProperties(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/properties', {
        ...form,
        priceTotal: Number(form.priceTotal),
      });
      setForm({ title: '', category: 'plotting', location: '', priceTotal: '', unitSize: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(id) {
    setPublishingId(id);
    try {
      await api.post(`/properties/${id}/publish`);
      loadAll();
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <AppShell title="Properties" subtitle="Add listings and publish them once they're ready to go live.">
      <div className="props-layout">
        <form className="props-form" onSubmit={handleCreate}>
          <h2>Add a property</h2>

          <label>
            Title
            <input
              placeholder="e.g. Riverside Plots, Phase 2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label>
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </label>

          <label>
            Location
            <input
              placeholder="e.g. Pune"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </label>

          <div className="props-form-row">
            <label>
              Price total (₹)
              <input
                type="number"
                placeholder="2500000"
                value={form.priceTotal}
                onChange={(e) => setForm({ ...form, priceTotal: e.target.value })}
                required
              />
            </label>
            <label>
              Unit size
              <input
                placeholder="1200 sqft"
                value={form.unitSize}
                onChange={(e) => setForm({ ...form, unitSize: e.target.value })}
              />
            </label>
          </div>

          {error && <p className="props-error">{error}</p>}

          <button type="submit" className="btn-gold" disabled={saving}>
            {saving ? 'Adding…' : 'Add as draft'}
          </button>
        </form>

        <div className="dash-panel props-panel">
          <div className="dash-panel-header">
            <h2>All properties</h2>
          </div>

          {loading ? (
            <p className="dash-empty">Loading properties…</p>
          ) : properties.length === 0 ? (
            <p className="dash-empty">No properties yet. Add one on the left to get started.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td className="dash-source">{p.category}</td>
                    <td>{p.location}</td>
                    <td>₹{p.priceTotal?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`dash-badge ${STATUS_STYLES[p.approvalStatus] || ''}`}>
                        {p.approvalStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      {p.approvalStatus !== 'published' && (
                        <button
                          className="props-publish-btn"
                          onClick={() => handlePublish(p._id)}
                          disabled={publishingId === p._id}
                        >
                          {publishingId === p._id ? 'Publishing…' : 'Publish'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShell>
  );
}