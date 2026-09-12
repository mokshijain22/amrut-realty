import { useEffect, useState } from 'react';
import api from '../api/client';
import AppShell from '../components/AppShell';
import './AdminProperties.css';

export default function AdminKyc() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  function loadAll() {
    setLoading(true);
    api.get('/users/pending-kyc')
      .then((res) => setPending(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function handleDecision(id, decision) {
    setActingId(id);
    try {
      await api.post(`/users/${id}/kyc-${decision}`);
      loadAll();
    } finally {
      setActingId(null);
    }
  }

  return (
    <AppShell title="KYC Review" subtitle="Approve or reject partner verification documents.">
      <div className="dash-panel props-panel">
        <div className="dash-panel-header">
          <h2>Pending submissions</h2>
        </div>

        {loading ? (
          <p className="dash-empty">Loading submissions…</p>
        ) : pending.length === 0 ? (
          <p className="dash-empty">No pending KYC submissions right now.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Documents</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td className="dash-source">{u.email}</td>
                  <td>
                    <span className="dash-badge status-pending">
                      {u.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    {u.kycDocs?.map((docUrl, i) => (
                      <a
                        key={docUrl}
                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${docUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginRight: 10 }}
                      >
                        Doc {i + 1}
                      </a>
                    ))}
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="props-publish-btn"
                      onClick={() => handleDecision(u._id, 'approve')}
                      disabled={actingId === u._id}
                    >
                      {actingId === u._id ? '…' : 'Approve'}
                    </button>
                    <button
                      className="props-publish-btn"
                      style={{ borderColor: '#e18888', color: '#e18888' }}
                      onClick={() => handleDecision(u._id, 'reject')}
                      disabled={actingId === u._id}
                    >
                      {actingId === u._id ? '…' : 'Reject'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}