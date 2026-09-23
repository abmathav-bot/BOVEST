import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BackIcon, CheckIcon, ShieldIcon, DocumentIcon } from '../components/Icons';

/* ── Pen-tip SVG icon ── */
const PenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const AcceptTerms = () => {
  const [step, setStep]     = useState(1);   // 1 = Terms, 2 = E-Signature
  const [agreed, setAgreed] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signTab, setSignTab] = useState('draw'); // 'draw' | 'type'
  const [typedSig, setTypedSig] = useState('');

  const canvasRef = useRef(null);
  const lastPos   = useRef(null);

  const navigate = useNavigate();
  const location  = useLocation();
  const { addInvestment } = useAppContext();

  const investmentData = location.state?.investmentData;
  const schemeName = investmentData?.scheme === 'A' ? 'Scheme A — Milk-Based' : 'Scheme B — Amount-Based';
  const amount = Number(investmentData?.amount || 0).toLocaleString('en-IN');

  /* ── Canvas setup ── */
  useEffect(() => {
    if (step !== 2 || signTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#17344b';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
  }, [step, signTab]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const pos    = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setHasSigned(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const sigReady = signTab === 'draw' ? hasSigned : typedSig.trim().length >= 2;

  const handleProceedPayment = () => {
    if (investmentData) {
      addInvestment({
        scheme:      investmentData.scheme,
        amount:      Number(investmentData.amount),
        startDate:   new Date().toISOString().split('T')[0],
        activeYears: 0,
        cows:        investmentData.scheme === 'A' ? 1 : 1,
        calves:      investmentData.scheme === 'B' ? 1 : 0,
      });
      navigate('/home', { replace: true });
    } else {
      navigate('/invest');
    }
  };

  /* ══════════════════════════════════════
     STEP 1 — TERMS
  ══════════════════════════════════════ */
  if (step === 1) return (
    <div className="auth-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <BackIcon size={22} color="#fff" />
        </button>
        <h2>Review &amp; Accept</h2>
      </div>

      <div className="glass-card">

        {/* Investment Summary */}
        <div className="terms-invest-summary">
          <DocumentIcon size={22} color="var(--bovest-green-dark)" />
          <div className="terms-inv-details">
            <p className="terms-scheme-name">{schemeName}</p>
            <p className="terms-invest-amt">₹{amount}</p>
          </div>
          <div className="terms-badge-confirmed">Confirmed</div>
        </div>

        {/* Key Terms */}
        <div className="terms-section-label">
          <ShieldIcon size={15} color="rgba(255,255,255,0.7)" />
          Key Terms &amp; Conditions
        </div>

        <div className="agreement-box">
          {[
            <>I agree to invest ₹{amount} under <strong>{schemeName}</strong> with Bovest Dairy Investment.</>,
            <>I understand the lock-in period is <strong>{investmentData?.scheme === 'A' ? '5 years' : '3 years'}</strong> with no premature withdrawal.</>,
            <>I acknowledge that returns are subject to livestock performance and market conditions.</>,
            <>All payouts will be credited to my registered bank account on or before the 5th of every month.</>,
            <>I confirm my ID and address documents submitted are genuine and valid.</>,
          ].map((text, i) => (
            <div key={i} className="term-item">
              <div className="term-check"><CheckIcon size={12} color="#287b45" /></div>
              <p>{text}</p>
            </div>
          ))}
        </div>

        {/* Investment Agreement Button */}
        <button
          onClick={() => alert('Investment Agreement PDF will be available soon.')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(169,222,141,0.25)',
            borderRadius: '14px', padding: '14px 16px', cursor: 'pointer',
            marginBottom: '18px', marginTop: '10px', transition: 'all 0.25s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'rgba(46,229,157,0.15)', border: '1px solid rgba(46,229,157,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ee59d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Investment Agreement</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>View your full agreement document</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Checkbox */}
        <label className="checkbox-container" htmlFor="agree-checkbox">
          <input id="agree-checkbox" type="checkbox" checked={agreed}
            onChange={e => setAgreed(e.target.checked)} />
          <div className="custom-checkbox">
            {agreed && <CheckIcon size={13} color="#fff" />}
          </div>
          <div className="checkbox-label">I have read and agree to all the terms &amp; conditions above.</div>
        </label>

        <button
          className="next-btn"
          disabled={!agreed}
          onClick={() => setStep(2)}
          style={{ opacity: agreed ? 1 : 0.45, cursor: agreed ? 'pointer' : 'not-allowed' }}
        >
          Confirm Investment
        </button>

        <p className="form-disclaimer" style={{ textAlign: 'center' }}>
          Secured by 256-bit encryption. Your funds are protected under SEBI guidelines.
        </p>
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     STEP 2 — E-SIGNATURE
  ══════════════════════════════════════ */
  return (
    <div className="auth-container">
      <div className="header">
        <button className="back-btn" onClick={() => setStep(1)} aria-label="Go back">
          <BackIcon size={22} color="#fff" />
        </button>
        <h2>E-Signature</h2>
      </div>

      <div className="glass-card" style={{ paddingBottom: '28px' }}>

        {/* Header info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(46,229,157,0.1)', border: '1px solid rgba(46,229,157,0.2)',
          borderRadius: '14px', padding: '14px', marginBottom: '22px',
        }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
            background: 'rgba(46,229,157,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2ee59d',
          }}>
            <PenIcon />
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>
              Digital Signature Required
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Sign below to legally authorise your investment in {schemeName}
            </p>
          </div>
        </div>

        {/* Tabs: Draw / Type */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '4px', marginBottom: '16px', gap: '4px',
        }}>
          {['draw', 'type'].map(tab => (
            <button key={tab} onClick={() => { setSignTab(tab); setHasSigned(false); setTypedSig(''); }}
              style={{
                flex: 1, padding: '9px', borderRadius: '9px', border: 'none',
                background: signTab === tab ? '#fff' : 'transparent',
                color: signTab === tab ? '#17344b' : 'rgba(255,255,255,0.55)',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: signTab === tab ? '0 2px 8px rgba(13,38,59,0.15)' : 'none',
              }}>
              {tab === 'draw' ? '✍️  Draw' : '⌨️  Type'}
            </button>
          ))}
        </div>

        {/* Draw tab */}
        {signTab === 'draw' && (
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
              Draw your signature in the box below
            </p>
            <div style={{
              background: '#fff', borderRadius: '16px', overflow: 'hidden',
              border: hasSigned ? '2px solid #2ee59d' : '2px solid rgba(255,255,255,0.15)',
              position: 'relative', transition: 'border-color 0.3s',
            }}>
              {/* Baseline guide */}
              <div style={{
                position: 'absolute', bottom: '38px', left: '16px', right: '16px',
                height: '1px', background: 'rgba(13,38,59,0.12)', pointerEvents: 'none',
              }} />
              <canvas
                ref={canvasRef}
                width={340} height={160}
                style={{ display: 'block', width: '100%', height: '160px', cursor: 'crosshair', touchAction: 'none' }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
              />
            </div>
            {/* Clear button */}
            <button onClick={clearCanvas} style={{
              marginTop: '10px', background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.45)', fontSize: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 101.414-4.222"/>
              </svg>
              Clear signature
            </button>
          </div>
        )}

        {/* Type tab */}
        {signTab === 'type' && (
          <div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
              Type your full name as your digital signature
            </p>
            <div style={{
              background: '#fff', borderRadius: '14px', overflow: 'hidden',
              border: typedSig.trim().length >= 2 ? '2px solid #2ee59d' : '2px solid rgba(255,255,255,0.15)',
              transition: 'border-color 0.3s',
            }}>
              <input
                type="text"
                placeholder="Your full name"
                value={typedSig}
                onChange={e => setTypedSig(e.target.value)}
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  padding: '20px 18px',
                  fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                  fontSize: '26px', color: '#17344b',
                  background: 'transparent',
                }}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '8px', textAlign: 'center' }}>
              Typing your name constitutes a legally binding e-signature
            </p>
          </div>
        )}

        {/* Signature confirmation note */}
        {sigReady && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(46,229,157,0.1)', border: '1px solid rgba(46,229,157,0.2)',
            borderRadius: '10px', padding: '10px 14px', marginTop: '14px',
            animation: 'pageFadeIn 0.4s ease both',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2ee59d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p style={{ fontSize: '12px', color: '#2ee59d', fontWeight: 600 }}>
              Signature captured — ready to proceed
            </p>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '22px 0' }} />

        {/* Proceed Payment */}
        <button
          disabled={!sigReady}
          onClick={handleProceedPayment}
          style={{
            width: '100%', minHeight: '54px', border: 'none', borderRadius: '28px',
            background: sigReady
              ? 'linear-gradient(110deg, #199c59, #6ed353)'
              : 'rgba(255,255,255,0.1)',
            color: sigReady ? '#fff' : 'rgba(255,255,255,0.3)',
            fontSize: '16px', fontWeight: 800, cursor: sigReady ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: sigReady ? '0 10px 24px rgba(34,177,79,0.35)' : 'none',
            transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Payment icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Proceed to Payment
        </button>

        <p className="form-disclaimer" style={{ textAlign: 'center', marginTop: '14px' }}>
          Your e-signature is legally binding under the IT Act, 2000.
        </p>
      </div>
    </div>
  );
};

export default AcceptTerms;
