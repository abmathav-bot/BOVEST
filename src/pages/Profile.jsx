import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAppContext } from '../context/AppContext';
import { api } from '../utils/api';
import {
  EditIcon, BankIcon, SupportIcon, DocumentIcon,
  ShieldIcon, ChevronRight, LogoutIcon, TrendUpIcon, ReceiptIcon
} from '../components/Icons';

const settingsItems = [
  { icon: EditIcon, label: 'Edit Profile', sub: 'Update name and profile photo', color: '#287b45', path: '/edit-profile' },
  { icon: BankIcon, label: 'Bank Details', sub: 'HDFC Bank · ••••9012', color: '#1565c0', path: '/bank-details', badge: { text: 'Saved', bg: '#e3f2fd', color: '#1565c0' } },
  { icon: ShieldIcon, label: 'KYC & Documents', sub: 'PAN Card verified', color: '#7c3aed', path: '/kyc-details', badge: { text: '✓ Verified', bg: '#e8f5e9', color: '#287b45' } },
  { icon: DocumentIcon, label: 'Investment Agreement', sub: 'Terms, conditions & scheme details', color: '#0ea5e9', path: '/agreement' },
  { icon: ReceiptIcon, label: 'Invoice / Invest History', sub: 'View past investments and invoices', color: '#ec4899', path: '/invoices' },
  { icon: SupportIcon, label: 'Support', sub: '24/7 investor helpdesk', color: '#d97706', path: '/support' },
];

const Profile = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAvatarFullscreen, setIsAvatarFullscreen] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const kycVerified = user?.kyc_status === 'Verified';
  const kycInProcess = user?.kyc_status === 'Pending';

  useEffect(() => {
    api.user.getBankDetails().then(({ bank_details }) => setBankDetails(bank_details)).catch(() => setBankDetails(null));
  }, []);

  const totalInvested = user?.portfolio?.total_invested || (user?.investments || []).reduce((s, i) => s + i.amount, 0);
  const activeCows = user?.portfolio?.total_cows || (user?.investments || []).reduce((s, i) => s + (i.cows_count || i.cows || 0), 0);

  if (!user) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard-container" style={{ paddingBottom: '100px' }}>

      {/* Premium Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d263b 0%, #1a4163 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '48px 20px 32px',
        marginLeft: '-16px', marginRight: '-16px', marginTop: '-16px',
        marginBottom: '0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(46,229,157,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '-30px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          <button
            onClick={() => setIsAvatarFullscreen(true)}
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #287b45, #58ae3f)',
              border: '3px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              flexShrink: 0,
              padding: 0,
              cursor: 'pointer'
            }}
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={`${user.name}'s profile`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <svg viewBox="0 0 80 80" fill="none" width="56" height="56">
                <circle cx="40" cy="30" r="13" fill="white" opacity="0.9"/>
                <ellipse cx="40" cy="60" rx="20" ry="13" fill="white" opacity="0.9"/>
              </svg>
            )}
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{user.name}</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              ID: {user.investor_id || `BOV-${String(user.id).padStart(4, '0')}`}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(46,229,157,0.15)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(46,229,157,0.3)' }}>
              <TrendUpIcon size={12} color="#2ee59d" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2ee59d' }}>{kycVerified ? 'Verified Investor' : kycInProcess ? 'KYC In Process' : 'KYC Pending'}</span>
            </div>
          </div>
        </div>

        {/* Stats row inside hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: '0', marginTop: '24px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px 0' }}>
          {[
            { label: 'Total Invested', val: `₹${totalInvested.toLocaleString('en-IN')}` },
            null,
            { label: 'Active Cows', val: `${activeCows}` },
            null,
            { label: 'Growth', val: `+${user?.portfolio?.growth_percent ?? 0}%`, green: true },
          ].map((s, i) =>
            s === null
              ? <div key={i} style={{ background: 'rgba(255,255,255,0.1)', width: '1px' }} />
              : <div key={i} style={{ textAlign: 'center', padding: '0 8px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: s.green ? '#2ee59d' : '#fff', marginBottom: '4px' }}>{s.val}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
                </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Account Settings</p>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #eaf1ee', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
        {settingsItems.map(({ icon: Icon, label, sub, color, path, badge }, index) => {
          const isKycItem = label === 'KYC & Documents';
          const isBankItem = label === 'Bank Details';
          const displaySub = isKycItem ? (kycVerified ? 'KYC verified' : kycInProcess ? 'Verification in process' : 'Verification pending') : isBankItem ? (bankDetails ? bankDetails.bank_name + ' - ' + bankDetails.account_number_masked : 'Add your payout bank account') : sub;
          const displayBadge = isKycItem ? (kycVerified ? { text: 'Verified', bg: '#e8f5e9', color: '#287b45' } : (kycInProcess ? { text: 'In process', bg: '#e3f2fd', color: '#1565c0' } : { text: 'Pending', bg: '#fef3c7', color: '#b45309' })) : isBankItem ? (bankDetails ? { text: 'Saved', bg: '#e3f2fd', color: '#1565c0' } : null) : badge;
          return (
          <button
            key={label}
            type="button"
            onClick={() => path === '/farm-agreement.pdf'
              ? window.open(path, '_blank', 'noopener,noreferrer')
              : navigate(path)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
              padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: index < settingsItems.length - 1 ? '1px solid #f0f4f2' : 'none',
              textAlign: 'left',
            }}
          >
            <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${color}20` }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#0d263b' }}>{label}</p>
                {displayBadge && <span style={{ fontSize: '10px', fontWeight: 700, background: displayBadge.bg, color: displayBadge.color, padding: '2px 8px', borderRadius: '10px' }}>{displayBadge.text}</span>}
              </div>
              <p style={{ fontSize: '12px', color: '#9aabb5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displaySub}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d0dae0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={() => setShowLogoutConfirm(true)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          padding: '16px', borderRadius: '16px', border: '1.5px solid #fde8e8',
          background: '#fff5f5', cursor: 'pointer', color: '#e05252', fontWeight: 700, fontSize: '15px',
          boxShadow: '0 2px 8px rgba(224,82,82,0.08)',
        }}
      >
        <LogoutIcon size={18} color="#e05252" />
        Log Out
      </button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#c0cbd3', marginTop: '20px' }}>Bovest v1.0.0 • Smart Dairy Investments</p>

      <BottomNav />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '20px', backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#fff', width: '100%', maxWidth: '320px',
            borderRadius: '28px', padding: '28px 24px', textAlign: 'center',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 16px' }}>
              <LogoutIcon size={28} color="#e05252" />
            </div>
            <h3 style={{ fontSize: '20px', color: '#0d263b', marginBottom: '8px', fontWeight: 800 }}>Log Out?</h3>
            <p style={{ fontSize: '14px', color: '#7a8fa0', marginBottom: '28px', lineHeight: 1.6 }}>
              Are you sure you want to sign out of your Bovest account?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e8efec', background: 'transparent', color: '#5a7080', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#e05252', color: '#fff', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 14px rgba(224,82,82,0.3)', cursor: 'pointer' }}>
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Fullscreen Modal */}
      {isAvatarFullscreen && (
        <div
          onClick={() => setIsAvatarFullscreen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px', backdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}>
          <div style={{
            width: '280px', height: '280px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #287b45, #58ae3f)',
            border: '6px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            transform: 'scale(1)',
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={`${user.name}'s profile`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <svg viewBox="0 0 80 80" fill="none" width="220" height="220">
                <circle cx="40" cy="30" r="13" fill="white" opacity="0.9"/>
                <ellipse cx="40" cy="60" rx="20" ry="13" fill="white" opacity="0.9"/>
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
