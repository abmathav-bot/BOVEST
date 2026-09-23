import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, PhoneIcon, UserIcon, BackIcon, CheckIcon } from '../components/Icons';
import bovestLogo from '../assets/bovest-logo.png';

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // step 1 = details, step 2 = success
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
  const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email address';
    if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit phone number';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreed) errs.agreed = 'You must accept the terms to continue';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep(2);
  };

  const strengthScore = (() => {
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strengthScore];
  const strengthColor = ['', '#e05252', '#f59e0b', '#3b82f6', '#287b45'][strengthScore];

  /* ─── Success Screen ─── */
  if (step === 2) {
    return (
      <main className="login-screen">
        <div className="login-sky" style={{ minHeight: '28dvh' }}>
          <div className="login-brand">Bovest</div>
          <div className="sky-circle sky-c1" /><div className="sky-circle sky-c2" />
        </div>
        <section className="login-card" style={{ textAlign: 'center' }}>
          <div className="success-circle">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 style={{ marginTop: 20, marginBottom: 8 }}>Account Created!</h1>
          <p className="login-subtitle" style={{ marginBottom: 28 }}>
            Welcome to Bovest, <strong>{form.fullName.split(' ')[0]}</strong>!<br/>
            Your investor account is ready. Our team will verify your details within 24 hours.
          </p>
          <button
            className="auth-action-btn"
            onClick={() => navigate('/login', { replace: true })}
          >
            Go to Login
          </button>
        </section>
      </main>
    );
  }

  /* ─── Sign Up Form ─── */
  return (
    <main className="login-screen">
      <div className="login-sky">
        <div className="login-brand">Bovest</div>
        <p>Start your dairy investment journey</p>
        <div className="sky-circle sky-c1" /><div className="sky-circle sky-c2" /><div className="sky-circle sky-c3" />
      </div>

      <section className="login-card signup-card">
        <div className="cow-badge"><img src={bovestLogo} alt="Bovest logo" /></div>

        <h1>Create Account</h1>
        <p className="login-subtitle">Join thousands of smart dairy investors</p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <label className={form.fullName ? 'filled' : ''}>
            <span className="input-icon"><UserIcon size={20} color="currentColor" /></span>
            <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} autoComplete="name" />
          </label>
          {errors.fullName && <p className="login-error">{errors.fullName}</p>}

          {/* Email */}
          <label className={form.email ? 'filled' : ''}>
            <span className="input-icon"><MailIcon /></span>
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} autoComplete="email" />
          </label>
          {errors.email && <p className="login-error">{errors.email}</p>}

          {/* Phone */}
          <label className={form.phone ? 'filled' : ''}>
            <span className="input-icon"><PhoneIcon size={20} color="currentColor" /></span>
            <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} maxLength={10} autoComplete="tel" />
          </label>
          {errors.phone && <p className="login-error">{errors.phone}</p>}

          {/* Password */}
          <label className={form.password ? 'filled' : ''}>
            <span className="input-icon"><LockIcon size={20} color="currentColor" /></span>
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button type="button" className="eye-toggle" onClick={() => setShowPass(v => !v)} aria-label="Show password">
              {showPass ? <EyeOff /> : <EyeOpen />}
            </button>
          </label>
          {form.password && (
            <div className="strength-row">
              <div className="strength-bars">
                {[1,2,3,4].map(i => (
                  <div key={i} className="strength-bar" style={{ background: i <= strengthScore ? strengthColor : '#e0e0e0' }} />
                ))}
              </div>
              <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
            </div>
          )}
          {errors.password && <p className="login-error">{errors.password}</p>}

          {/* Confirm Password */}
          <label className={form.confirmPassword ? 'filled' : ''}>
            <span className="input-icon"><LockIcon size={20} color="currentColor" /></span>
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button type="button" className="eye-toggle" onClick={() => setShowConfirm(v => !v)} aria-label="Show confirm password">
              {showConfirm ? <EyeOff /> : <EyeOpen />}
            </button>
          </label>
          {errors.confirmPassword && <p className="login-error">{errors.confirmPassword}</p>}

          {/* Terms */}
          <label className="signup-terms-row" htmlFor="signup-agree">
            <input id="signup-agree" type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(prev => ({ ...prev, agreed: '' })); }} />
            <div className="custom-checkbox-sm">
              {agreed && <CheckIcon size={11} color="#fff" />}
            </div>
            <span className="terms-text">
              I agree to Bovest&apos;s{' '}
              <span className="terms-link">Terms of Service</span> and{' '}
              <span className="terms-link">Privacy Policy</span>
            </span>
          </label>
          {errors.agreed && <p className="login-error">{errors.agreed}</p>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="signup-copy">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')}>Login</button>
        </p>
      </section>

      {/* Trust badges */}
      <div className="trust-row">
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bovest-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Secure &amp; Encrypted
        </div>
        <div className="trust-dot" />
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bovest-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          SEBI Compliant
        </div>
        <div className="trust-dot" />
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bovest-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
          Free to Join
        </div>
      </div>
    </main>
  );
}
