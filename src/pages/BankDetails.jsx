import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../utils/api';

const ArrowLeft = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const fields = [
  { key: 'bankName', label: 'Bank Name', placeholder: 'e.g. HDFC Bank, SBI', type: 'text' },
  { key: 'accountName', label: 'Account Holder Name', placeholder: 'As per bank records', type: 'text' },
  { key: 'accountNumber', label: 'Account Number', placeholder: '••••••••••••', type: 'text', secret: true, inputMode: 'numeric' },
  { key: 'ifscCode', label: 'IFSC Code', placeholder: 'e.g. HDFC0001234', type: 'text', upper: true },
];

const BankDetails = () => {
  const navigate = useNavigate();
  const { updateUser } = useAppContext();

  const [form, setForm] = useState({ bankName: '', accountName: '', accountNumber: '', ifscCode: '' });
  const [maskedNumber, setMaskedNumber] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load what is already saved on the server (the account number comes back masked)
  useEffect(() => {
    api.user.getBankDetails()
      .then(({ bank_details: bd }) => {
        if (!bd) return;
        setMaskedNumber(bd.account_number_masked || '');
        setForm(f => ({ ...f, bankName: bd.bank_name || '', accountName: bd.account_name || '', ifscCode: bd.ifsc_code || '' }));
      })
      .catch(() => {});
  }, []);

  const handleChange = (key, val, upper) => setForm(f => ({ ...f, [key]: upper ? val.toUpperCase() : val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.user.saveBankDetails({
        bank_name: form.bankName,
        account_name: form.accountName,
        account_number: form.accountNumber || null,
        ifsc_code: form.ifscCode,
      });
      updateUser({ bankDetails: { bankName: form.bankName, accountName: form.accountName, ifscCode: form.ifscCode } });
      setSaved(true);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.message || 'Could not save bank details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0, #42a5f5)', padding: '52px 20px 32px' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>Bank Details</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Payout account management</p>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 16px 0' }}>

        {/* Info banner */}
        <div style={{ background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3"/>
          </svg>
          <p style={{ fontSize: '13px', color: '#1565c0', lineHeight: '1.5', margin: 0 }}>
            Your payout account receives monthly milk profits and maturity amount upon lock-in completion.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Account Details</p>
            </div>
            {fields.map((f, i) => (
              <div key={f.key} style={{ padding: '16px 20px', borderBottom: i < fields.length - 1 ? '1px solid #f0f4f2' : 'none' }}>
                <p style={{ fontSize: '11px', color: '#aab5be', marginBottom: '6px' }}>{f.label}</p>
                <input
                  type={f.type}
                  name={`bovest-bank-${f.key}`}
                  autoComplete="off"
                  inputMode={f.inputMode}
                  value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value, f.upper)}
                  placeholder={f.key === 'accountNumber' && maskedNumber ? `${maskedNumber} (leave blank to keep)` : f.placeholder}
                  required={!(f.key === 'accountNumber' && maskedNumber)}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px', fontWeight: 600, color: '#0d263b', background: 'transparent', padding: 0, WebkitTextSecurity: f.secret ? 'disc' : 'none' }}
                />
              </div>
            ))}
          </div>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '0 4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aab5be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p style={{ fontSize: '12px', color: '#aab5be' }}>Your bank details are encrypted and stored securely.</p>
          </div>

          {error && (
            <div style={{ background: '#fdecea', color: '#c62828', borderRadius: '14px', padding: '14px', textAlign: 'center', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>{error}</div>
          )}

          {saved && (
            <div style={{ background: '#e8f5e9', color: '#287b45', borderRadius: '14px', padding: '14px', textAlign: 'center', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>
              ✓ Bank details saved successfully!
            </div>
          )}

          <button type="submit" disabled={saving} style={{ opacity: saving ? 0.6 : 1, width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1565c0, #42a5f5)', color: '#fff', fontWeight: 700, fontSize: '16px', boxShadow: '0 6px 20px rgba(21,101,192,0.3)', cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save Bank Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankDetails;
