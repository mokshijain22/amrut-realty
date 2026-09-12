import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AppShell.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Leads', icon: '◆' },
  { to: '/admin/properties', label: 'Properties', icon: '▢' },
];

export default function AppShell({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="shell">
      <aside className="shell-sidebar">
        <Link to="/" className="shell-brand">Amrut <span>Realty</span></Link>
        <nav className="shell-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`shell-nav-link ${location.pathname === item.to ? 'is-active' : ''}`}
            >
              <span className="shell-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="shell-user">
          <div className="shell-user-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
          <div className="shell-user-info">
            <strong>{user?.name}</strong>
            <span>{user?.role}{user?.rank ? ` · ${user.rank}` : ''}</span>
          </div>
        </div>
        <button className="shell-logout" onClick={logout}>Log out</button>
      </aside>

      <main className="shell-main">
        <header className="shell-header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </header>
        <div className="shell-content">{children}</div>
      </main>
    </div>
  );
}