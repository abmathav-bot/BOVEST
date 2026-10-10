import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BackIcon, SchemeIcon, RupeeIcon, PhoneIcon,
  IDIcon, LocationIcon, UploadIcon, ChevronRight
} from '../components/Icons';

const schemes = [
  {
    value: 'A',
    label: 'Scheme A — Milk-Based',
    desc: '5-year lock-in. Daily milk profits shared with investor.',
    color: '#287b45',
    bg: '#e8f5e9',
  },
];

const InvestmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ scheme: 'A', amount: '', phone: '', address: '' });
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleFile = (e) => {
    if (e.target.files[0]) setFileName(e.target.files[0].name);
  };

  const validate = () => {
    const errs = {};
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) < 5000)
      errs.amount = 'Minimum investment is ₹5,000';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone))
      errs.phone = 'Enter a valid 10-digit phone number';
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    navigate('/accept-terms', {
      state: { investmentData: { ...formData, idProofFilename: fileName } },
    });
  };

  const selectedScheme = schemes.find(s => s.value === formData.scheme);

  return (
    <div className="auth-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <BackIcon size={22} color="#fff" />
        </button>
        <h2>New Investment</h2>
      </div>

      <div className="glass-card">
        {/* Scheme Selector */}
        <p className="form-section-label">Select Scheme</p>
        <div className="scheme-options">
          {schemes.map(s => (
            <button
              key={s.value}
              type="button"
              className={`scheme-option ${formData.scheme === s.value ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, scheme: s.value })}
              style={formData.scheme === s.value ? { borderColor: s.color, background: s.bg } : {}}
            >
              <div className="scheme-opt-header">
                <SchemeIcon size={18} color={formData.scheme === s.value ? s.color : '#888'} />
                <span style={{ color: formData.scheme === s.value ? s.color : '#555' }}>{s.label}</span>
                {formData.scheme === s.value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={s.color} stroke="none">
                    <circle cx="12" cy="12" r="12"/>
                    <polyline points="7 12 10 15 17 9" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <p className="scheme-opt-desc">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Scheme highlight */}
        <div className="scheme-highlight" style={{ borderLeftColor: selectedScheme.color }}>
          <p style={{ color: selectedScheme.color, fontWeight: 600, fontSize: 13 }}>
            {selectedScheme.value === 'A' ? 'Expected Return: ₹2,800–₹3,400/mo per cow' : 'Fixed Monthly Payout: 2.5% per month'}
          </p>
        </div>

        {/* Amount */}
        <p className="form-section-label" style={{ marginTop: 20 }}>Investment Details</p>

        <div className={`input-field ${errors.amount ? 'input-error' : ''}`}>
          <span className="field-icon"><RupeeIcon size={20} color="#287b45" /></span>
          <input
            type="number"
            name="amount"
            placeholder="Investment Amount (min. ₹5,000)"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        {errors.amount && <p className="field-error">{errors.amount}</p>}

        {formData.amount && !errors.amount && (
          <div className="amount-preview">
            Estimated monthly return:&nbsp;
            <strong>₹{Math.round(Number(formData.amount) * (selectedScheme.value === 'A' ? 0.028 : 0.025)).toLocaleString('en-IN')}</strong>
          </div>
        )}

        <div className={`input-field ${errors.phone ? 'input-error' : ''}`}>
          <span className="field-icon"><PhoneIcon size={20} color="#287b45" /></span>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (10 digits)"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
          />
        </div>
        {errors.phone && <p className="field-error">{errors.phone}</p>}

        {/* ID Proof */}
        <div className="input-field">
          <span className="field-icon"><IDIcon size={20} color="#287b45" /></span>
          <input type="text" placeholder="ID Proof (Aadhar / PAN)" value={fileName} readOnly style={{ cursor: 'pointer' }} />
          <label className="upload-label" title="Upload document">
            <UploadIcon size={17} color="#287b45" />
            <span>Upload</span>
            <input type="file" hidden accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} />
          </label>
        </div>

        <div className="input-field">
          <span className="field-icon" style={{ alignSelf: 'flex-start', paddingTop: 2 }}><LocationIcon size={20} color="#287b45" /></span>
          <textarea
            rows="2"
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <button className="next-btn" onClick={handleNext}>
          Continue
          <ChevronRight size={20} color="#fff" />
        </button>

        <p className="form-disclaimer">
          By continuing, you agree to Bovest&apos;s investment terms. Funds are secured under SEBI regulations.
        </p>
      </div>
    </div>
  );
};

export default InvestmentForm;
