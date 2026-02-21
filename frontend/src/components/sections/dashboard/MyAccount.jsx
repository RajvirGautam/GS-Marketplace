import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userAPI } from '../../../services/api';

const BRANCHES = [
    { label: 'Computer Science', value: 'CS' },
    { label: 'Information Technology', value: 'IT' },
    { label: 'Electronics & Comm.', value: 'ECE' },
    { label: 'Electrical', value: 'EE' },
    { label: 'Mechanical', value: 'Mech' },
    { label: 'Civil', value: 'Civil' },
    { label: 'Electronics & Instrumentation', value: 'EI' },
    { label: 'Chemical', value: 'Chem' },
];

const YEARS = [
    { label: '1st Year', value: 1 },
    { label: '2nd Year', value: 2 },
    { label: '3rd Year', value: 3 },
    { label: '4th Year', value: 4 },
];

const VerifiedBadge = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#00D9FF" opacity="0.15" />
        <circle cx="12" cy="12" r="10" stroke="#00D9FF" strokeWidth="1.5" />
        <path d="M8 12l3 3 5-5" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CameraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const SaveIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const MyAccount = () => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef(null);

    const [year, setYear] = useState(user?.year ?? '');
    const [branch, setBranch] = useState(user?.branch ?? '');
    const [avatarPreview, setAvatarPreview] = useState(user?.profilePicture || null);
    const [avatarBase64, setAvatarBase64] = useState(null); // only set if user chose a new image
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', msg }

    const initials = user?.fullName
        ? user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showToast('error', 'Please select an image file.');
            return;
        }
        // Limit to 2MB
        if (file.size > 2 * 1024 * 1024) {
            showToast('error', 'Image must be under 2MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            setAvatarPreview(ev.target.result);
            setAvatarBase64(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = { year, branch };
            if (avatarBase64) payload.profilePicture = avatarBase64;

            const res = await userAPI.updateProfile(payload);
            if (res.success) {
                updateUser(res.user);
                setAvatarBase64(null); // reset "new image" flag
                showToast('success', 'Profile updated successfully!');
            } else {
                showToast('error', res.error || 'Update failed.');
            }
        } catch (err) {
            showToast('error', 'Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: 600 }}>
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>My Account</h1>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                    Manage your profile picture and personal details
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div style={{
                    marginBottom: 20,
                    padding: '12px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: toast.type === 'success' ? '#10B981' : '#EF4444',
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Avatar Card */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1.5px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '28px 24px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
            }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                        onClick={handleAvatarClick}
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: '50%',
                            background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #00D9FF, #7C3AED)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            fontWeight: 800,
                            color: '#0A0A0A',
                            cursor: 'pointer',
                            border: '2.5px solid rgba(255,255,255,0.12)',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s',
                            position: 'relative',
                        }}
                        title="Click to change avatar"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            initials
                        )}
                        {/* Hover overlay */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.45)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: '#fff',
                        }}
                            className="avatar-overlay"
                        >
                            <CameraIcon />
                        </div>
                    </div>
                    {/* Camera badge */}
                    <button
                        onClick={handleAvatarClick}
                        style={{
                            position: 'absolute',
                            bottom: 2, right: 2,
                            width: 26, height: 26,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
                            border: '2px solid #0A0A0A',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                        title="Upload photo"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                {/* Name + verified */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.fullName || 'Student'}
                        </span>
                        {user?.isVerified && (
                            <span title="Verified account" style={{ flexShrink: 0 }}>
                                <VerifiedBadge />
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                        {user?.email}
                    </div>
                    {user?.enrollmentNumber && (
                        <div style={{ fontSize: 11, color: '#00D9FF', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                            {user.enrollmentNumber}
                        </div>
                    )}
                    {user?.isVerified && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            marginTop: 8,
                            background: 'rgba(0,217,255,0.1)',
                            border: '1px solid rgba(0,217,255,0.25)',
                            borderRadius: 20,
                            padding: '3px 10px',
                            fontSize: 11, fontWeight: 700, color: '#00D9FF'
                        }}>
                            <VerifiedBadge />
                            Verified Student
                        </div>
                    )}
                </div>
            </div>

            {/* Editable Fields Card */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1.5px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '24px',
                marginBottom: 16,
            }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 20 }}>
                    Profile Details
                </div>

                <div style={{ display: 'grid', gap: 18 }}>
                    {/* Full Name — read only */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                            Full Name <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>(not editable)</span>
                        </label>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 8,
                            padding: '11px 14px',
                            fontSize: 14,
                            color: 'rgba(255,255,255,0.5)',
                            cursor: 'not-allowed',
                        }}>
                            {user?.fullName || '—'}
                        </div>
                    </div>

                    {/* Year — editable */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                            Year
                        </label>
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 8,
                                padding: '11px 14px',
                                fontSize: 14,
                                color: '#fff',
                                cursor: 'pointer',
                                outline: 'none',
                                fontFamily: 'Manrope, sans-serif',
                                appearance: 'auto',
                            }}
                        >
                            <option value="" disabled style={{ background: '#111' }}>Select year...</option>
                            {YEARS.map(y => (
                                <option key={y.value} value={y.value} style={{ background: '#111' }}>
                                    {y.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Branch — editable */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                            Branch
                        </label>
                        <select
                            value={branch}
                            onChange={e => setBranch(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 8,
                                padding: '11px 14px',
                                fontSize: 14,
                                color: '#fff',
                                cursor: 'pointer',
                                outline: 'none',
                                fontFamily: 'Manrope, sans-serif',
                                appearance: 'auto',
                            }}
                        >
                            <option value="" disabled style={{ background: '#111' }}>Select branch...</option>
                            {BRANCHES.map(b => (
                                <option key={b.value} value={b.value} style={{ background: '#111' }}>
                                    {b.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: saving ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #00D9FF, #7C3AED)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 28px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: saving ? 'rgba(255,255,255,0.4)' : '#0A0A0A',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontFamily: 'Manrope, sans-serif',
                    transition: 'all 0.2s',
                }}
            >
                <SaveIcon />
                {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <style>{`
        div:has(> .avatar-overlay):hover .avatar-overlay {
          opacity: 1 !important;
        }
      `}</style>
        </div>
    );
};

export default MyAccount;
