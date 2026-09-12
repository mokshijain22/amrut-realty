import { useEffect, useState } from 'react';
import api from '../api/client';

const CATEGORIES = ['plotting', 'residential', 'commercial', 'industrial', 'farm'];

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    title: '', category: 'plotting', location: '', priceTotal: '', unitSize: '',
  });
  const [error, setError] = useState('');

  function loadAll() {
    api.get('/properties?all=true').then((res) => setProperties(res.data)).catch(() => {});
  }

  useEffect(loadAll, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/properties', {
        ...form,
        priceTotal: Number(form.priceTotal),
      });
      setForm({ title: '', category: 'plotting', location: '', priceTotal: '', unitSize: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    }
  }

  async function handlePublish(id) {
    await api.post(`/properties/${id}/publish`);
    loadAll();
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Manage Properties</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: 24, display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Location" value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <input placeholder="Price Total" type="number" value={form.priceTotal}
          onChange={(e) => setForm({ ...form, priceTotal: e.target.value })} required />
        <input placeholder="Unit Size (e.g. 1200 sqft)" value={form.unitSize}
          onChange={(e) => setForm({ ...form, unitSize: e.target.value })} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Add Property (draft)</button>
      </form>

      <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
            <th>Title</th><th>Category</th><th>Location</th><th>Price</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>{p.location}</td>
              <td>₹{p.priceTotal?.toLocaleString()}</td>
              <td>{p.approvalStatus}</td>
              <td>
                {p.approvalStatus !== 'published' && (
                  <button onClick={() => handlePublish(p._id)}>Publish</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}