import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../utils/api';

const KYC_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSez72MQT6zyEoOXwg6CsABWrXCCCc_oO0ZdNyTwb0LrQrzm8w/viewform?usp=publish-editor';

const ArrowLeft = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const primaryBtn = {
  width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
  background: 'linear-gradient(135deg, #287b45, #58ae3f)', color: '#fff',
  fontWeight: 700, fontSize: '16px', boxShadow: '0 6px 20px rgba(40,123,69,0.3)', cursor: 'pointer',
};

const STATES = {
  Verified: {
    header: 'linear-gradient(135deg, #287b45, #58ae3f)',
    sub: 'Identity successfully verified',
    title: 'Identity Verified',
    text: 'Your identity is verified. Your account is fully active and eligible for all payouts.',
    iconBg: '#e8f5e9', icon: '✓',
  },
  Pending: {
    header: 'linear-gradient(135deg, #1565c0, #42a5f5)',
    sub: 'Verification in process',
    title: 'Verification in Process',
    text: 'We have received your KYC form. Our team is reviewing it and your status will change to Verified once it is approved.',
    iconBg: '#e3f2fd', icon: '⏳',
  },
  Rejected: {
    header: 'linear-gradient(135deg, #c62828, #ef5350)',
    sub: 'Verification rejected',
    title: 'Verification Rejected',
    text: 'We could not verify your details. Please fill the KYC form again with correct information.',
    iconBg: '#fdecea', icon: '⚠️',
  },
  Unverified: {
    header: 'linear-gradient(135deg, #d97706, #fbbf24)',
    sub: 'Verification pending',
    title: 'Verification Required',
    text: 'Fill the KYC form with your government ID details to unlock all features including payouts and investments.',
    iconBg: '#fef3c7', icon: '⚠️',
  },
};

const KYCDetails = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAppContext();
  const [opened, setOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const status = STATES[user?.kyc_status] ? user.kyc_status : 'Unverified';
  const s = STATES[status];
  const canFill = status === 'Unverified' || status === 'Rejected';

  const openForm = () => {
    window.open(KYC_FORM_URL, '_blank', 'noopener,noreferrer');
    setOpened(true);
  };

  const confirmSubmitted = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.user.submitKyc({});
      await refreshUser();
    } catch (err) {
      setError(err.message || 'Could not submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', paddingBottom: '40px' }}>
      <div style={{ background: s.header, padding: '52px 20px 32px' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft />
        </button>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>KYC &amp; Documents</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{s.sub}</p>
      </div>

      <div style={{ margin: '20px 16px 0' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>{s.icon}</div>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0d263b', marginBottom: '8px' }}>{s.title}</h3>
          <p style={{ fontSize: '14px', color: '#7a8fa0', lineHeight: 1.6 }}>{s.text}</p>
        </div>

        {canFill && (
          <>
            <button onClick={openForm} style={primaryBtn}>
              {status === 'Rejected' ? 'Fill KYC Form Again' : 'Fill KYC Form'}
            </button>
            {opened && (
              <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginTop: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '14px', color: '#5a7080', lineHeight: 1.6, marginBottom: '14px' }}>
                  After you have filled and submitted the form, tap the button below so we can start verifying your details.
                </p>
                <button onClick={confirmSubmitted} disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? 'Submitting…' : 'I have submitted the form'}
                </button>
                {error && <p style={{ color: '#c62828', fontSize: '13px', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 4px 0' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aab5be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p style={{ fontSize: '12px', color: '#aab5be' }}>Your documents are never shared with third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;
