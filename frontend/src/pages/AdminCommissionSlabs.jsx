import { useEffect, useState } from 'react';
import api from '../api/client';
import AppShell from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import './AdminProperties.css';

const CATEGORIES = ['plotting', 'flats', 'commercial', 'roi', 'investor_referral'];

function formatCategory(c) {
  return c.replace(/_/g, ' ');
}

export default function AdminCommissionSlabs() {
  const { user } = useAuth();
  const [slabs, setSlabs] = useState([]);
  const [form, setForm] = useState({
    category: 'plotting', thresholdAmount: '', ratePercent: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  function loadAll() {
    api.get('/commission-slabs')
      .then((res) => setSlabs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/commission-slabs', {
        ...form,
        thresholdAmount: Number(form.thresholdAmount),
        ratePercent: Number(form.ratePercent),
      });
      setForm({ category: 'plotting', thresholdAmount: '', ratePercent: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slab');
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove(id) {
    setApprovingId(id);
    try {
      await api.post(`/commission-slabs/${id}/approve`);
      loadAll();
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <AppShell
      title="Commission Slabs"
      subtitle="New slabs stay unapproved until a super admin signs off — nothing here goes live until then."
    >
      <div className="props-layout">
        <form className="props-form" onSubmit={handleCreate}>
          <h2>Add a slab</h2>

          <label>
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{formatCategory(c)}</option>
              ))}
            </select>
          </label>

          <div className="props-form-row">
            <label>
              Threshold amount (₹)
              <input
                type="number"
                placeholder="1200000"
                value={form.thresholdAmount}
                onChange={(e) => setForm({ ...form, thresholdAmount: e.target.value })}
                required
              />
            </label>
            <label>
              Rate (%)
              <input
                type="number"
                step="0.1"
                placeholder="4"
                value={form.ratePercent}
                onChange={(e) => setForm({ ...form, ratePercent: e.target.value })}
                required
              />
            </label>
          </div>

          {error && <p className="props-error">{error}</p>}

          <button type="submit" className="btn-gold" disabled={saving}>
            {saving ? 'Adding…' : 'Add slab (unapproved)'}
          </button>
        </form>

        <div className="dash-panel props-panel">
          <div className="dash-panel-header">
            <h2>All slabs</h2>
          </div>

          {loading ? (
            <p className="dash-empty">Loading slabs…</p>
          ) : slabs.length === 0 ? (
            <p className="dash-empty">No slabs yet. Add one on the left to get started.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Threshold</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((s) => (
                  <tr key={s._id}>
                    <td className="dash-source">{formatCategory(s.category)}</td>
                    <td>₹{s.thresholdAmount?.toLocaleString('en-IN')}</td>
                    <td>{s.ratePercent}%</td>
                    <td>
                      <span className={`dash-badge ${s.approvedByManagement ? 'status-published' : 'status-pending'}`}>
                        {s.approvedByManagement ? 'approved' : 'pending approval'}
                      </span>
                    </td>
                    <td>
                      {!s.approvedByManagement && user?.role === 'super_admin' && (
                        <button
                          className="props-publish-btn"
                          onClick={() => handleApprove(s._id)}
                          disabled={approvingId === s._id}
                        >
                          {approvingId === s._id ? 'Approving…' : 'Approve'}
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