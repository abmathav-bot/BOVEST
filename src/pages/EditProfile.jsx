import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../utils/api';

const ArrowLeft = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aab5be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const EditProfile = () => {
  const navigate = useNavigate();
 const { user, updateUser, refreshUser } = useAppContext();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const [preview, setPreview] = useState(user?.avatar_url || null);
const [avatarFile, setAvatarFile] = useState(null);
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');
  const handlePhotoChange = (e) => {
  const file = e.target.files?.[0];

  if (!file || !file.type.startsWith('image/')) return;

  if (file.size > 5 * 1024 * 1024) {
    setError('Please choose an image smaller than 5 MB.');
    return;
  }

  setAvatarFile(file);
  setPreview(URL.createObjectURL(file));
  setError('');
};

  const gradients = [
    ['#287b45', '#58ae3f'], ['#1565c0', '#42a5f5'],
    ['#7c3aed', '#a78bfa'], ['#d97706', '#fbbf24'],
  ];
  const [g1, g2] = gradients[avatarKey % gradients.length];

  const handleSave = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');

  try {
    const updates = { name };

    if (avatarFile) {
      const result = await api.user.uploadAvatar(avatarFile);
      updates.avatar_url = result.avatar_url;
    }

    await api.user.updateProfile(updates);

    updateUser(updates);
    await refreshUser();

    setSaved(true);
    setTimeout(() => navigate('/profile'), 1000);
  } catch (err) {
    setError(err.message || 'Unable to save profile changes.');
  } finally {
    setSaving(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f5', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d263b, #1a4163)',
        padding: '52px 20px 28px',
        position: 'relative',
      }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft />
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '84px', height: '84px', borderRadius: '50%',
            background: preview ? `url(${preview}) center/cover` : `linear-gradient(135deg, ${g1}, ${g2})`,
            border: '4px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            transition: 'background 0.4s',
          }}>
            {!preview && (
              <svg viewBox="0 0 80 80" fill="none" width="64" height="64">
                <circle cx="40" cy="30" r="13" fill="white" opacity="0.9"/>
                <ellipse cx="40" cy="60" rx="20" ry="13" fill="white" opacity="0.9"/>
              </svg>
            )}
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            onClick={() => document.getElementById('avatar-upload').click()}
            style={{ marginTop: '12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', color: '#fff', fontWeight: 600, fontSize: '13px', padding: '6px 18px', cursor: 'pointer' }}>
            Change Photo
          </button>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, marginTop: '12px', marginBottom: '2px' }}>{user.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{user.investor_id || `BOV-${String(user.id).padStart(4, '0')}`}</p>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ margin: '20px 16px 0' }}>
        <form onSubmit={handleSave}>

          {/* Section: Personal Info */}
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personal Info</p>
            </div>

            {/* Investor ID (locked) */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#aab5be', marginBottom: '4px' }}>Investor ID</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0d263b' }}>{user.investor_id || `BOV-${String(user.id).padStart(4, '0')}`}</p>
                </div>
                <LockIcon />
              </div>
            </div>

            {/* Editable Name */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <p style={{ fontSize: '11px', color: '#aab5be', marginBottom: '6px' }}>Full Name</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px', fontWeight: 600, color: '#0d263b', background: 'transparent', padding: 0 }}
                placeholder="Enter your name"
              />
            </div>

            {/* Mobile (locked) */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#aab5be', marginBottom: '4px' }}>Mobile Number</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#888' }}>{user.mobile}</p>
                </div>
                <LockIcon />
              </div>
              <p style={{ fontSize: '11px', color: '#c0cbd3', marginTop: '4px' }}>Contact support to change</p>
            </div>

            {/* Email (locked) */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#aab5be', marginBottom: '4px' }}>Email ID</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#888' }}>{user.email}</p>
                </div>
                <LockIcon />
              </div>
              <p style={{ fontSize: '11px', color: '#c0cbd3', marginTop: '4px' }}>Contact support to change</p>
            </div>
          </div>

          {/* Section: Security */}
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f2' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#aab5be', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Security</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#0d263b' }}>Change Password</p>
                  <p style={{ fontSize: '12px', color: '#aab5be' }}>Reset via forgot password</p>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d0dae0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {saved && (
            <div style={{ background: '#e8f5e9', color: '#287b45', borderRadius: '14px', padding: '14px', textAlign: 'center', fontWeight: 700, fontSize: '14px', marginBottom: '16px' }}>
              ✓ Profile saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #287b45, #58ae3f)', color: '#fff', fontWeight: 700, fontSize: '16px', boxShadow: '0 6px 20px rgba(40,123,69,0.3)', cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
