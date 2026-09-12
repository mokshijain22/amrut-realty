import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/AppShell';
import './Dashboard.css';

const STATUS_STYLES = {
  new: 'status-new',
  contacted: 'status-contacted',
  site_visit_scheduled: 'status-scheduled',
  site_visit_done: 'status-done',
  booked: 'status-booked',
  lost: 'status-lost',
};

function formatStatus(status) {
  return status?.replace(/_/g, ' ') || '—';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leads')
      .then((res) => setLeads(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const newCount = leads.filter((l) => l.status === 'new').length;
  const bookedCount = leads.filter((l) => l.status === 'booked').length;

  return (
    <AppShell title={`Welcome, ${user?.name || ''}`} subtitle="Here's what's happening with your leads.">
      <div className="dash-stats">
        <div className="dash-stat">
          <span>Total leads</span>
          <strong>{leads.length}</strong>
        </div>
        <div className="dash-stat">
          <span>New</span>
          <strong>{newCount}</strong>
        </div>
        <div className="dash-stat">
          <span>Booked</span>
          <strong>{bookedCount}</strong>
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-header">
          <h2>Leads</h2>
        </div>

        {loading ? (
          <p className="dash-empty">Loading leads…</p>
        ) : leads.length === 0 ? (
          <p className="dash-empty">No leads yet. New enquiries from the website will show up here.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td className="dash-source">{lead.source}</td>
                  <td>
                    <span className={`dash-badge ${STATUS_STYLES[lead.status] || ''}`}>
                      {formatStatus(lead.status)}
                    </span>
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