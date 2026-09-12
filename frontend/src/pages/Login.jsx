import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      const staffRoles = ['super_admin', 'sub_admin', 'executive'];
      const partnerRoles = ['investor', 'jv_partner'];
      if (staffRoles.includes(loggedInUser.role)) navigate('/dashboard');
      else if (partnerRoles.includes(loggedInUser.role)) navigate('/partner');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-side" />
      <div className="login-panel">
        <Link to="/" className="login-brand">Amrut <span>Realty</span></Link>

        <div className="login-card">
          <p className="login-eyebrow">Partner &amp; team access</p>
          <h1>Welcome back</h1>
          <p className="login-sub">Log in to manage leads, properties and your commission dashboard.</p>

          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-gold" disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="login-sub" style={{ marginTop: 18, marginBottom: 0 }}>
            New partner? <Link to="/partner-signup" style={{ color: 'var(--gold-light)' }}>Sign up here</Link>
          </p>
          <Link to="/" className="login-back">← Back to homepage</Link>
        </div>
      </div>
    </div>
  );
}