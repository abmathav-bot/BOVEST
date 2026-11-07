import React from 'react';

/**
 * InstallPWAModal
 * Props:
 *   open          – boolean
 *   onClose       – () => void
 *   onInstall     – () => void  (triggers native prompt on Android)
 *   isIOS         – boolean
 *   installPrompt – the deferred event (null on iOS)
 */
export default function InstallPWAModal({ open, onClose, onInstall, isIOS, installPrompt }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(13,38,59,0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 0 0 0',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '28px 28px 0 0',
          padding: '28px 24px 40px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 -8px 48px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.1)',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#e0e8ea', margin: '0 auto 20px' }} />

        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <img
            src="/bovest-logo.png"
            alt="Bovest"
            style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'contain', border: '1.5px solid #eaf1ee', background: '#f8fbf9' }}
          />
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0d263b', marginBottom: '2px' }}>
              Install Bovest
            </h2>
            <p style={{ fontSize: '12px', color: '#7a8fa0' }}>
              Smart Dairy Investments
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div style={{ background: '#f4faf6', borderRadius: '16px', padding: '14px 16px', marginBottom: '20px' }}>
          {[
            { icon: '⚡', text: 'Faster access — works like a native app' },
            { icon: '🔔', text: 'Get notified about milk profits & updates' },
            { icon: '📴', text: 'View portfolio even when offline' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px' }}>{icon}</span>
              <p style={{ fontSize: '13px', color: '#3a5060', fontWeight: 500 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* iOS Steps */}
        {isIOS ? (
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0d263b', marginBottom: '12px' }}>
              📱 To install on iPhone / iPad:
            </p>
            {[
              { step: '1', text: 'Tap the Share button', sub: 'The box with an arrow at the bottom of Safari' },
              { step: '2', text: 'Scroll and tap "Add to Home Screen"', sub: 'Look for the + icon option' },
              { step: '3', text: 'Tap "Add" at the top right', sub: 'Bovest will appear on your home screen' },
            ].map(({ step, text, sub }) => (
              <div key={step} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#287b45,#58ae3f)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '13px', fontWeight: 800,
                }}>
                  {step}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0d263b' }}>{text}</p>
                  <p style={{ fontSize: '11px', color: '#9aabb5' }}>{sub}</p>
                </div>
              </div>
            ))}
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '16px', marginTop: '8px',
                borderRadius: '16px', border: 'none',
                background: 'linear-gradient(135deg,#287b45,#58ae3f)',
                color: '#fff', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(40,123,69,0.3)',
              }}
            >
              Got it!
            </button>
          </div>
        ) : (
          /* Android / Desktop — native prompt */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={onInstall}
              disabled={!installPrompt}
              style={{
                width: '100%', padding: '16px',
                borderRadius: '16px', border: 'none',
                background: installPrompt
                  ? 'linear-gradient(135deg,#287b45,#58ae3f)'
                  : '#c8d8cc',
                color: '#fff', fontWeight: 700, fontSize: '15px',
                cursor: installPrompt ? 'pointer' : 'default',
                boxShadow: installPrompt ? '0 4px 16px rgba(40,123,69,0.3)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {installPrompt ? 'Install Now' : 'Already installed or not supported'}
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '16px', border: '1px solid #e0eae5',
                background: 'transparent', color: '#7a8fa0',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              }}
            >
              Maybe Later
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
      `}</style>
    </div>
  );
}
