import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userAPI } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../ui/Avatar';

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

/* ── Icons ── */
const VerifiedBadge = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#00D9FF" opacity="0.15" />
        <circle cx="12" cy="12" r="10" stroke="#00D9FF" strokeWidth="1.8" />
        <path d="M7.5 12l3 3 5.5-5.5" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LogOutIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const CamIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const SpinnerIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
);

/* ────────────────────────────────────────── */
const MyAccount = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Initialise from the user object (which now has year + branch from the fixed schema)
    const [year, setYear] = useState(user?.year ?? '');
    const [branch, setBranch] = useState(user?.branch ?? '');

    // Avatar: prefer profilePicture → google picture → null (shows initials)
    const resolvedAvatar = user?.profilePicture || null;
    const [avatarSrc, setAvatarSrc] = useState(resolvedAvatar);

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    /* ── Avatar upload ── */
    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // reset so same file can be picked again

        if (!file) return;
        if (!file.type.startsWith('image/')) { showToast('error', 'Please select an image file.'); return; }
        if (file.size > 5 * 1024 * 1024) { showToast('error', 'Image must be under 5 MB.'); return; }

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setAvatarSrc(localUrl);

        // Convert to base64 and upload to Cloudinary via backend
        try {
            setUploading(true);
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = ev => resolve(ev.target.result);
                reader.onerror = () => reject(new Error('File read failed'));
                reader.readAsDataURL(file);
            });

            const res = await userAPI.uploadAvatar(base64);
            if (res.success) {
                setAvatarSrc(res.profilePicture); // switch from blob URL to Cloudinary URL
                updateUser(res.user);
                showToast('success', 'Avatar updated!');
            } else {
                throw new Error(res.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Avatar upload error:', err);
            setAvatarSrc(resolvedAvatar); // revert preview
            showToast('error', 'Avatar upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    /* ── Save year + branch ── */
    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {};
            if (year !== '') payload.year = year;
            if (branch !== '') payload.branch = branch;

            const res = await userAPI.updateProfile(payload);
            if (res.success) {
                updateUser(res.user);
                showToast('success', 'Profile updated!');
            } else {
                throw new Error(res.error || 'Update failed');
            }
        } catch (err) {
            console.error('Profile update error:', err);
            showToast('error', 'Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    /* ── Shared styles ── */
    const card = {
        background: 'rgba(255,255,255,0.025)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
    };
    const fieldLabel = {
        fontSize: 11, fontWeight: 700,
        color: 'rgba(255,255,255,0.4)',
        display: 'block', marginBottom: 7,
        textTransform: 'uppercase', letterSpacing: '1px',
    };
    const selectSt = {
        width: '100%',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 8, padding: '11px 14px',
        fontSize: 14, color: '#fff',
        cursor: 'pointer', outline: 'none',
        fontFamily: 'Manrope, sans-serif',
        transition: 'border-color 0.15s',
    };

    return (
        <>
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toast-in { from { opacity:0;transform:translateY(-8px)} to { opacity:1;transform:translateY(0)} }
        .ma-toast { animation: toast-in 0.25s ease; }
        .ma-avatar:hover .ma-cam { opacity:1 !important; }
        .ma-select:focus { border-color: rgba(0,217,255,0.5) !important; }
      `}</style>

            <div style={{ maxWidth: 640, margin: '0 auto' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>My Account</h1>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Manage your photo and profile details</div>
                    </div>

                    <button onClick={handleLogout} style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: 8, padding: '9px 18px',
                        fontSize: 13, fontWeight: 700, color: '#EF4444',
                        cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
                    }}>
                        <LogOutIcon /> Logout
                    </button>
                </div>

                {/* ── Toast ── */}
                {toast && (
                    <div className="ma-toast" style={{
                        marginBottom: 18, padding: '12px 16px', borderRadius: 10,
                        fontSize: 13, fontWeight: 600,
                        background: toast.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        color: toast.type === 'success' ? '#10B981' : '#EF4444',
                    }}>
                        {toast.type === 'success' ? '✓ ' : '⚠ '}{toast.msg}
                    </div>
                )}

                {/* ── Avatar + Identity ── */}
                <div style={{ ...card, padding: '36px 28px', marginBottom: 16, textAlign: 'center' }}>

                    {/* Avatar ring */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <div className="ma-avatar" onClick={handleAvatarClick}
                            style={{ position: 'relative', width: 102, height: 102, cursor: uploading ? 'wait' : 'pointer' }}>

                            {/* Circle */}
                            <div style={{
                                width: 102, height: 102, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid rgba(255,255,255,0.14)',
                                overflow: 'hidden', userSelect: 'none',
                            }}>
                                <Avatar
                                    src={avatarSrc}
                                    name={user?.fullName || user?.name || user?.email}
                                    size={102}
                                    style={{ fontSize: '32px', fontWeight: '800' }}
                                />
                            </div>

                            {/* Hover overlay */}
                            <div className="ma-cam" style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: uploading ? 1 : 0, transition: 'opacity 0.2s',
                                pointerEvents: 'none',
                            }}>
                                {uploading
                                    ? <SpinnerIcon />
                                    : <CamIcon />
                                }
                            </div>

                            {/* Camera badge */}
                            <div style={{
                                position: 'absolute', bottom: 2, right: 2,
                                width: 28, height: 28, borderRadius: '50%',
                                background: 'linear-gradient(135deg,#00D9FF,#7C3AED)',
                                border: '2.5px solid #0A0A0A',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none',
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </div>

                            <input ref={fileInputRef} type="file" accept="image/*"
                                style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                    </div>

                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginBottom: 18, letterSpacing: '0.5px' }}>
                        {uploading ? 'Uploading…' : 'Click to change photo · Max 5 MB'}
                    </div>

                    {/* Name + verified */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 21, fontWeight: 800, color: '#fff' }}>{user?.fullName || 'Student'}</span>
                        {user?.isVerified && <VerifiedBadge size={20} />}
                    </div>

                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{user?.email}</div>

                    {user?.enrollmentNumber && (
                        <span style={{
                            display: 'inline-block',
                            fontSize: 11, color: '#00D9FF',
                            fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                            background: 'rgba(0,217,255,0.07)',
                            border: '1px solid rgba(0,217,255,0.18)',
                            borderRadius: 6, padding: '3px 10px', marginBottom: 10,
                        }}>
                            {user.enrollmentNumber}
                        </span>
                    )}

                    {user?.isVerified && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)',
                                borderRadius: 20, padding: '4px 14px',
                                fontSize: 11, fontWeight: 700, color: '#00D9FF',
                            }}>
                                <VerifiedBadge size={13} /> Verified Student
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Editable Fields ── */}
                <div style={{ ...card, padding: '24px 28px', marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 20 }}>
                        Profile Details
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 4 }}>
                        {/* Full Name — read only, spans both cols */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={fieldLabel}>
                                Full Name &nbsp;<span style={{ fontSize: 10, textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>· not editable</span>
                            </label>
                            <div style={{
                                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 8, padding: '11px 14px',
                                fontSize: 14, color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed',
                            }}>
                                {user?.fullName || '—'}
                            </div>
                        </div>

                        {/* Year */}
                        <div>
                            <label style={fieldLabel}>Year</label>
                            <select
                                className="ma-select"
                                value={year}
                                onChange={e => setYear(Number(e.target.value))}
                                style={selectSt}
                            >
                                <option value="" disabled style={{ background: '#111' }}>Select year…</option>
                                {YEARS.map(y => (
                                    <option key={y.value} value={y.value} style={{ background: '#111' }}>{y.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Branch */}
                        <div>
                            <label style={fieldLabel}>Branch</label>
                            <select
                                className="ma-select"
                                value={branch}
                                onChange={e => setBranch(e.target.value)}
                                style={selectSt}
                            >
                                <option value="" disabled style={{ background: '#111' }}>Select branch…</option>
                                {BRANCHES.map(b => (
                                    <option key={b.value} value={b.value} style={{ background: '#111' }}>{b.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Save button ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleSave}
                        disabled={saving || uploading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: (saving || uploading) ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#00D9FF,#7C3AED)',
                            border: 'none', borderRadius: 8,
                            padding: '12px 32px',
                            fontSize: 14, fontWeight: 700,
                            color: (saving || uploading) ? 'rgba(255,255,255,0.35)' : '#fff',
                            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                            fontFamily: 'Manrope, sans-serif',
                            opacity: (saving || uploading) ? 0.7 : 1,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {saving ? <><SpinnerIcon /> Saving…</> : <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            Save Changes
                        </>}
                    </button>
                </div>

            </div>
        </>
    );
};

export default MyAccount;
