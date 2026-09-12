import { useEffect, useState } from 'react';
import api from '../api/client';
import AppShell from '../components/AppShell';
import './AdminProperties.css';

const STAFF_ROLES = ['executive', 'sub_admin', 'investor', 'jv_partner'];

const ROLE_LABELS = {
  sub_admin: 'Sub Admin',
  executive: 'Executive',
  investor: 'Investor',
  jv_partner: 'JV Partner',
};

const ROLE_STYLES = {
  super_admin: 'status-published',
  sub_admin: 'status-pending',
  executive: 'status-draft',
  investor: 'status-pending',
  jv_partner: 'status-draft',
};

const PARTNER_ROLES = ['investor', 'jv_partner'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'executive', preApprove: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function loadAll() {
    api.get('/users')
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/auth/staff', form);
      setForm({ name: '', email: '', phone: '', password: '', role: 'executive', preApprove: false });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title="Users" subtitle="Create agents and sub-admins.">
      <div className="props-layout">
        <form className="props-form" onSubmit={handleCreate}>
          <h2>Add a user</h2>

          <label>
            Name
            <input
              placeholder="e.g. Rohan Deshmukh"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="rohan@amrutrealty.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label>
            Phone
            <input
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>

          <label>
            Temporary password
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          <label>
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </label>

          {PARTNER_ROLES.includes(form.role) && (
            <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={form.preApprove}
                onChange={(e) => setForm({ ...form, preApprove: e.target.checked })}
                style={{ width: 'auto' }}
              />
              Pre-approve KYC (skip document review)
            </label>
          )}

          {error && <p className="props-error">{error}</p>}

          <button type="submit" className="btn-gold" disabled={saving}>
            {saving ? 'Creating…' : 'Create user'}
          </button>
        </form>

        <div className="dash-panel props-panel">
          <div className="dash-panel-header">
            <h2>All staff</h2>
          </div>

          {loading ? (
            <p className="dash-empty">Loading users…</p>
          ) : users.length === 0 ? (
            <p className="dash-empty">No staff users yet. Add one on the left to get started.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Rank / KYC</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td className="dash-source">{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`dash-badge ${ROLE_STYLES[u.role] || ''}`}>
                        {u.role?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{PARTNER_ROLES.includes(u.role) ? (u.kycStatus || 'pending') : u.rank}</td>
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