import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bovestLogo from '../assets/bovest-logo.png';

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

const OTPInput = ({ value, onChange }) => {
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const arr = value.split('');
      arr[idx] = '';
      // also focus prev
      const prev = document.getElementById(`otp-${idx - 1}`);
      if (prev) prev.focus();
      onChange(arr.join('').replace(/\s/g, ''));
      return;
    }
    if (!/\d/.test(e.key)) return;
    const arr = value.split('').concat(Array(6).fill('')).slice(0, 6);
    arr[idx] = e.key;
    const next = document.getElementById(`otp-${idx + 1}`);
    if (next) next.focus();
    onChange(arr.join('').slice(0, 6));
  };

  return (
    <div className="otp-grid">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          className="otp-box"
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={() => {}}
          onKeyDown={e => handleKey(e, i)}
        />
      ))}
    </div>
  );
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password, 4=done
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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

  const startResendTimer = () => {
    setResendTimer(30);
    const iv = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(iv); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError('Enter a valid email address'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    startResendTimer();
    setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { setOtpError('Enter the 6-digit OTP'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPass.length < 8) { setPassError('Password must be at least 8 characters'); return; }
    if (newPass !== confirmPass) { setPassError('Passwords do not match'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep(4);
  };

  /* ── Step indicators ── */
  const steps = ['Email', 'Verify OTP', 'New Password'];
  const stepBar = (
    <div className="fp-steps">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`fp-step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
            <div className="fp-step-dot">
              {step > i + 1 ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (i + 1)}
            </div>
            <span className="fp-step-label">{s}</span>
          </div>
          {i < 2 && <div className={`fp-step-line ${step > i + 1 ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <main className="login-screen">
      <div className="login-sky" style={{ minHeight: '26dvh' }}>
        <div className="login-brand">Bovest</div>
        <p>Account Recovery</p>
        <div className="sky-circle sky-c1" /><div className="sky-circle sky-c2" />
      </div>

      <section className="login-card">
        <div className="cow-badge"><img src={bovestLogo} alt="Bovest logo" /></div>

        {/* ─── Step 4: Success ─── */}
        {step === 4 && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div className="success-circle" style={{ margin: '0 auto 18px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 style={{ marginBottom: 8 }}>Password Reset!</h1>
            <p className="login-subtitle" style={{ marginBottom: 28 }}>
              Your password has been successfully updated.<br/>You can now log in with your new password.
            </p>
            <button className="auth-action-btn" onClick={() => navigate('/login', { replace: true })}>
              Back to Login
            </button>
          </div>
        )}

        {/* ─── Steps 1–3 ─── */}
        {step < 4 && (
          <>
            <h1>Forgot Password</h1>
            <p className="login-subtitle" style={{ marginBottom: 18 }}>
              {step === 1 && "Enter your registered email to receive a reset OTP"}
              {step === 2 && `We sent a 6-digit OTP to ${email}`}
              {step === 3 && "Create a strong new password for your account"}
            </p>

            {stepBar}

            {/* Step 1 — Email */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} noValidate>
                <label className={email ? 'filled' : ''}>
                  <span className="input-icon"><MailIcon /></span>
                  <input
                    type="email"
                    placeholder="Registered Email Address"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                    autoComplete="email"
                  />
                </label>
                {emailError && <p className="login-error">{emailError}</p>}

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? <span className="login-spinner" /> : 'Send OTP'}
                </button>
              </form>
            )}

            {/* Step 2 — OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} noValidate>
                <p className="otp-hint">Enter the 6-digit code sent to your email</p>
                <OTPInput value={otp} onChange={setOtp} />
                {otpError && <p className="login-error" style={{ textAlign: 'center' }}>{otpError}</p>}

                <div className="resend-row">
                  {resendTimer > 0 ? (
                    <span className="resend-timer">Resend OTP in {resendTimer}s</span>
                  ) : (
                    <button type="button" className="resend-btn" onClick={() => { startResendTimer(); }}>
                      Resend OTP
                    </button>
                  )}
                </div>

                <button type="submit" className="login-submit-btn" disabled={loading || otp.length < 6}>
                  {loading ? <span className="login-spinner" /> : 'Verify OTP'}
                </button>

                <button type="button" className="fp-back-link" onClick={() => { setStep(1); setOtp(''); setOtpError(''); }}>
                  ← Change email
                </button>
              </form>
            )}

            {/* Step 3 — New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} noValidate>
                <label className={newPass ? 'filled' : ''}>
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="New Password"
                    value={newPass}
                    onChange={e => { setNewPass(e.target.value); setPassError(''); }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="eye-toggle" onClick={() => setShowNew(v => !v)}>
                    {showNew ? <EyeOff /> : <EyeOpen />}
                  </button>
                </label>

                <label className={confirmPass ? 'filled' : ''}>
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); setPassError(''); }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="eye-toggle" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </label>

                {passError && <p className="login-error">{passError}</p>}

                <div className="password-tips">
                  {[
                    { check: newPass.length >= 8, label: 'At least 8 characters' },
                    { check: /[A-Z]/.test(newPass), label: 'One uppercase letter' },
                    { check: /[0-9]/.test(newPass), label: 'One number' },
                    { check: /[^A-Za-z0-9]/.test(newPass), label: 'One special character' },
                  ].map(({ check, label }) => (
                    <div key={label} className="pass-tip">
                      <div className="pass-tip-dot" style={{ background: check ? '#287b45' : '#ddd' }} />
                      <span style={{ color: check ? '#287b45' : '#aaa' }}>{label}</span>
                    </div>
                  ))}
                </div>

                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? <span className="login-spinner" /> : 'Reset Password'}
                </button>
              </form>
            )}
          </>
        )}

        <p className="signup-copy" style={{ marginTop: 18 }}>
          Remember your password?{' '}
          <button type="button" onClick={() => navigate('/login')}>Login</button>
        </p>
      </section>
    </main>
  );
}
