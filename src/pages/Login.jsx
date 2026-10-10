import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LockIcon } from '../components/Icons';
import bovestLogo from '../assets/bovest-logo.png';

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [form, setForm] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.userId.trim() || !form.password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.userId.trim(), form.password);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-screen">
      <div className="login-sky">
        <div className="login-brand">Bovest</div>
        <p>Grow with confidence</p>
        <div className="sky-circle sky-c1" />
        <div className="sky-circle sky-c2" />
        <div className="sky-circle sky-c3" />
      </div>

      <section className="login-card">
        <div className="cow-badge"><img src={bovestLogo} alt="Bovest logo" /></div>

        <h1>Welcome Back</h1>
        <p className="login-subtitle">Login to your Bovest investor account</p>

        <form onSubmit={submit} noValidate>
          <label className={form.userId ? 'filled' : ''}>
            <span className="input-icon"><UserIcon /></span>
            <input
              aria-label="Email"
              placeholder="Email Address"
              autoComplete="email"
              type="email"
              value={form.userId}
              onChange={e => setForm({ ...form, userId: e.target.value })}
            />
          </label>

          <label className={form.password ? 'filled' : ''}>
            <span className="input-icon"><LockIcon size={20} color="currentColor" /></span>
            <input
              aria-label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" className="eye-toggle" onClick={() => setShowPass(v => !v)} aria-label="Toggle password visibility">
              {showPass ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          {/* Forgot Password — navigates to dedicated page */}
          <div className="forgot-row">
            <button
              type="button"
              className="forgot-link"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : 'Login'}
          </button>
        </form>

        {/* Sign Up — navigates to dedicated page */}
        <p className="signup-copy">
          Don&apos;t have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </p>
      </section>

      {/* Trust badges */}
      <div className="trust-row">
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bovest-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Secure Login
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
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          24/7 Support
        </div>
      </div>
    </main>
  );
}
