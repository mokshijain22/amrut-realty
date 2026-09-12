import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.get('/leads').then((res) => setLeads(res.data)).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={logout}>Log out</button>
      </div>
      <p>
        Role: <strong>{user?.role}</strong> · Rank: <strong>{user?.rank}</strong>
      </p>

      <h3>Leads</h3>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{lead.name}</td>
                <td>{lead.phone}</td>
                <td>{lead.status}</td>
                <td>{lead.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
