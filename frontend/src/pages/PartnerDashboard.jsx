import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import './PartnerDashboard.css';

const STATUS_LABEL = {
  pending: 'Under review',
  approved: 'Verified',
  rejected: 'Rejected — please re-upload',
};

export default function PartnerDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please select at least one file.');
      return;
    }
    setError('');
    setSuccess(false);
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('docs', f));
      await api.post('/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setFiles([]);
      if (refreshUser) refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="partner-page">
      <header className="partner-header">
        <Link to="/" className="login-brand">Amrut <span>Realty</span></Link>
        <button className="shell-logout" onClick={logout}>Log out</button>
      </header>

      <div className="partner-card">
        <p className="login-eyebrow">
          {user?.role === 'jv_partner' ? 'JV Partner' : 'Investor'} dashboard
        </p>
        <h1>Welcome, {user?.name}</h1>

        <div className={`partner-status partner-status-${user?.kycStatus || 'pending'}`}>
          KYC status: <strong>{STATUS_LABEL[user?.kycStatus] || 'Not submitted'}</strong>
        </div>

        {user?.kycStatus === 'approved' ? (
          <p className="login-sub">
            You're verified. Leads, sales, and commission statements will appear here once
            those are enabled for your account.
          </p>
        ) : (
          <>
            <p className="login-sub">
              Upload a government ID and address proof (JPG, PNG, or PDF, max 5MB each) to
              complete verification.
            </p>
            <form onSubmit={handleUpload} className="partner-upload-form">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
              {error && <p className="login-error">{error}</p>}
              {success && <p className="partner-success">Documents submitted for review.</p>}
              <button type="submit" className="btn-gold" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Submit documents'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}