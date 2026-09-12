import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import './Login.css';

const ROLES = [
  { value: 'investor', label: 'Investor' },
  { value: 'jv_partner', label: 'JV Partner' },
];

export default function PartnerSignup() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'investor',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="login-page">
        <div className="login-side" />
        <div className="login-panel">
          <Link to="/" className="login-brand">Amrut <span>Realty</span></Link>
          <div className="login-card">
            <p className="login-eyebrow">Registration received</p>
            <h1>Welcome aboard</h1>
            <p className="login-sub">
              Your account has been created. Log in, then upload your KYC documents to
              complete verification before your partner dashboard unlocks.
            </p>
            <button className="btn-gold" onClick={() => navigate('/login')}>
              Go to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-side" />
      <div className="login-panel">
        <Link to="/" className="login-brand">Amrut <span>Realty</span></Link>

        <div className="login-card">
          <p className="login-eyebrow">Become a partner</p>
          <h1>Partner sign up</h1>
          <p className="login-sub">Register as an investor or JV partner to get started.</p>

          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
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
              Password
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
                required
              />
            </label>
            <label>
              I am joining as
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-gold" disabled={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <Link to="/login" className="login-back">Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  );
}