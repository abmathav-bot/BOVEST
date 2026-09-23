import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ArrowLeft = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const AadhaarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="8" cy="12" r="2.5"/>
    <line x1="13" y1="9" x2="20" y2="9"/>
    <line x1="13" y1="12" x2="20" y2="12"/>
    <line x1="13" y1="15" x2="18" y2="15"/>
  </svg>
);
const PanIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
    <line x1="6" y1="14" x2="10" y2="14"/>
    <line x1="14" y1="14" x2="18" y2="14"/>
  </svg>
);
const PassportIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <circle cx="12" cy="10" r="3"/>
    <line x1="8" y1="16" x2="16" y2="16"/>
    <line x1="9" y1="19" x2="15" y2="19"/>
  </svg>
);
const VoterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);
const LicenseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="7" cy="12" r="2"/>
    <path d="M12 9h5M12 12h4M12 15h3"/>
  </svg>
);

const docOptions = [
  { label: 'Aadhaar Card', hint: '12-digit Aadhaar number', Icon: AadhaarIcon },
  { label: 'PAN Card', hint: '10-character PAN', Icon: PanIcon },
  { label: 'Passport', hint: 'Valid Indian passport', Icon: PassportIcon },
  { label: 'Voter ID', hint: 'Election Commission ID', Icon: VoterIcon },
  { label: 'Driving License', hint: 'Valid driving licence', Icon: LicenseIcon },
];

const maskDocument = (num) => {
  if (!num || num.length <= 2) return num || '';
  return num.substring(0, 2) + 'X'.repeat(num.length - 2);
};

// ─── Upload Screen ────────────────────────────────────────────────────────────
const UploadScreen = ({ docType, onBack, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', padding: '52px 20px 32px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft />
        </button>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Upload Document</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{docType}</p>
      </div>

      <div style={{ margin: '20px 16px 0' }}>
        {/* Tips */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0d263b' }}>Upload Tips</p>
          </div>
          {['Ensure all 4 corners of the document are clearly visible.', 'Make sure the text is sharp and not blurry.', 'File size should be less than 5 MB.', 'Accepted formats: JPG, PNG, PDF'].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706', marginTop: '5px', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#5a7080', lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          style={{
            background: file ? '#f0f8ec' : dragging ? '#fef9ec' : '#fff',
            border: `2px dashed ${file ? '#287b45' : dragging ? '#d97706' : '#d0dae0'}`,
            borderRadius: '20px',
            padding: '32px 20px',
            textAlign: 'center',
            marginBottom: '20px',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('kyc-file-input').click()}
        >
          <input
            id="kyc-file-input"
            type="file"
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {preview ? (
            <div>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '12px', objectFit: 'cover', marginBottom: '12px' }} />
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#287b45' }}>✓ {file.name}</p>
              <p style={{ fontSize: '12px', color: '#7a8fa0', marginTop: '4px' }}>Tap to change</p>
            </div>
          ) : file ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#287b45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#287b45', marginBottom: '4px' }}>✓ {file.name}</p>
              <p style={{ fontSize: '12px', color: '#7a8fa0' }}>Tap to change file</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#aab5be" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0d263b', marginBottom: '6px' }}>Tap to upload</p>
              <p style={{ fontSize: '13px', color: '#9aabb5' }}>or drag & drop your {docType} here</p>
            </div>
          )}
        </div>

        <button
          onClick={() => file && onUploaded(docType)}
          disabled={!file}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
            background: file ? 'linear-gradient(135deg, #287b45, #58ae3f)' : '#e8efec',
            color: file ? '#fff' : '#aab5be',
            fontWeight: 700, fontSize: '16px',
            boxShadow: file ? '0 6px 20px rgba(40,123,69,0.3)' : 'none',
            cursor: file ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
          }}>
          Submit for Verification
        </button>
      </div>
    </div>
  );
};

// ─── Processing Screen ────────────────────────────────────────────────────────
const ProcessingScreen = ({ docType, onComplete }) => {
  const steps = [
    { label: 'Document received', done: true },
    { label: 'Scanning document', done: true },
    { label: 'Verifying identity details', done: false },
    { label: 'Cross-checking with records', done: false },
    { label: 'Finalising verification', done: false },
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 900);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0, #42a5f5)', padding: '52px 20px 40px', textAlign: 'center' }}>
        {/* Spinning ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid #fff',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>Verifying Identity</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Please wait, this takes a few seconds…</p>
      </div>

      <div style={{ margin: '24px 16px 0', flex: 1 }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Verification Steps</p>

          {steps.map((s, i) => {
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: i < steps.length - 1 ? '20px' : '0' }}>
                {/* Step icon */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: isDone ? '#e8f5e9' : isActive ? '#e3f2fd' : '#f4f7f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: isActive ? '2px solid #1565c0' : isDone ? '2px solid #287b45' : '2px solid #e0e8ec',
                  transition: 'all 0.4s',
                }}>
                  {isDone
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#287b45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                    : isActive
                      ? <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1565c0', animation: 'pulse 1s ease-in-out infinite' }} />
                      : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d0dae0' }} />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: isActive || isDone ? 700 : 500, color: isDone ? '#287b45' : isActive ? '#1565c0' : '#aab5be', transition: 'all 0.4s' }}>
                    {s.label}
                  </p>
                  {isActive && <p style={{ fontSize: '11px', color: '#1565c0', marginTop: '2px' }}>In progress…</p>}
                  {isDone && <p style={{ fontSize: '11px', color: '#287b45', marginTop: '2px' }}>Completed ✓</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '14px', padding: '14px 16px', marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5 }}>
            Do not close this screen. Verification usually completes within a few seconds.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Main KYC Screen ──────────────────────────────────────────────────────────
const KYCDetails = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAppContext();

  const [screen, setScreen] = useState('main'); // main | upload | processing
  const [selectedDoc, setSelectedDoc] = useState(null);

  const kyc = user.kyc || { status: 'Unverified' };
  const isVerified = kyc.status === 'Verified';

  const handleVerificationComplete = () => {
    updateUser({
      kyc: {
        status: 'Verified',
        documentType: selectedDoc,
        documentNumber: 'AB' + Math.random().toString().slice(2, 10).toUpperCase(),
      }
    });
    setScreen('main');
  };

  if (screen === 'upload') {
    return <UploadScreen docType={selectedDoc} onBack={() => setScreen('main')} onUploaded={() => setScreen('processing')} />;
  }
  if (screen === 'processing') {
    return <ProcessingScreen docType={selectedDoc} onComplete={handleVerificationComplete} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', paddingBottom: '40px' }}>
      {/* Dynamic header */}
      <div style={{
        background: isVerified
          ? 'linear-gradient(135deg, #287b45, #58ae3f)'
          : 'linear-gradient(135deg, #d97706, #fbbf24)',
        padding: '52px 20px 32px',
      }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>KYC & Documents</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
              {isVerified ? 'Identity successfully verified' : 'Verification pending'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 16px 0' }}>
        {/* Status Banner */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            {isVerified
              ? <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#287b45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                </div>
              : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>⚠️</div>
            }
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0d263b', marginBottom: '8px' }}>
            {isVerified ? 'Identity Verified' : 'Verification Required'}
          </h3>
          <p style={{ fontSize: '14px', color: '#7a8fa0', lineHeight: 1.6 }}>
            {isVerified
              ? 'Your identity is verified. Your account is fully active and eligible for all payouts.'
              : 'Submit a valid government ID to unlock all features including payouts and investments.'}
          </p>
          {isVerified && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e8f5e9', padding: '6px 14px', borderRadius: '20px', marginTop: '12px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2ee59d', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#287b45' }}>Active & Verified</span>
            </div>
          )}
        </div>

        {isVerified ? (
          /* Verified Details Card */
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Verification Details</p>
            </div>
            {[
              { label: 'Document Type', val: kyc.documentType, mono: false },
              { label: 'Document Number', val: maskDocument(kyc.documentNumber), mono: true },
              { label: 'Status', badge: true },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #f0f4f2' : 'none' }}>
                <p style={{ fontSize: '14px', color: '#5a7080' }}>{row.label}</p>
                {row.badge
                  ? <span style={{ background: '#e8f5e9', color: '#287b45', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>✓ Verified</span>
                  : <p style={{ fontSize: row.mono ? '15px' : '14px', fontWeight: 700, color: '#0d263b', letterSpacing: row.mono ? '2px' : 'normal' }}>{row.val}</p>
                }
              </div>
            ))}
          </div>
        ) : (
          /* Document Chooser */
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Choose Document Type</p>
            </div>
            {docOptions.map((doc, i) => (
              <button
                key={doc.label}
                onClick={() => { setSelectedDoc(doc.label); setScreen('upload'); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '16px 20px', background: 'none', border: 'none',
                  borderBottom: i < docOptions.length - 1 ? '1px solid #f0f4f2' : 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <doc.Icon />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#0d263b', marginBottom: '2px' }}>{doc.label}</p>
                  <p style={{ fontSize: '12px', color: '#9aabb5' }}>{doc.hint}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d0dae0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            ))}
          </div>
        )}

        {/* Security note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aab5be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p style={{ fontSize: '12px', color: '#aab5be' }}>Your documents are encrypted and never shared with third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;
