import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';

// ── Notification type config ──────────────────────────────────────────────────
const TYPE_CONFIG = {
    new_offer: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        accentColor: '#818cf8',
        bgColor: 'rgba(99,102,241,0.12)',
        borderColor: 'rgba(99,102,241,0.35)',
        label: 'New Offer',
        navTarget: () => '/dashboard?tab=negotiations',
    },
    offer_accepted: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        accentColor: '#34d399',
        bgColor: 'rgba(16,185,129,0.1)',
        borderColor: 'rgba(16,185,129,0.3)',
        label: 'Deal Done',
        navTarget: () => '/dashboard?tab=deals',
    },
    offer_rejected: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
        accentColor: '#f87171',
        bgColor: 'rgba(239,68,68,0.08)',
        borderColor: 'rgba(239,68,68,0.25)',
        label: 'Offer Declined',
        navTarget: () => '/dashboard?tab=negotiations',
    },
    new_message: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        accentColor: '#22d3ee',
        bgColor: 'rgba(34,211,238,0.08)',
        borderColor: 'rgba(34,211,238,0.2)',
        label: 'Message',
        navTarget: (meta) => meta?.conversationId ? `/chat/${meta.conversationId}` : '/chat',
    },
    deal_done: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        accentColor: '#fbbf24',
        bgColor: 'rgba(251,191,36,0.08)',
        borderColor: 'rgba(251,191,36,0.25)',
        label: 'Deal Confirmed',
        navTarget: () => '/dashboard?tab=deals',
    },
};

// ── Time ago helper ───────────────────────────────────────────────────────────
function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ── Group same-conversation message notifications into one card ────────────────
// Returns a new array where all new_message notifs sharing a conversationId are
// collapsed into a single entry. The entry keeps the newest notif's data but
// adds a `count` field for how many were stacked and `stackedIds` so we can
// mark/delete them all at once. Non-message notifs pass through unchanged.
function groupNotifications(notifs) {
    const grouped = [];
    const seen = {}; // conversationId → index in `grouped`

    for (const n of notifs) {
        const convId = n.meta?.conversationId;
        if (n.type === 'new_message' && convId) {
            const key = convId.toString();
            if (key in seen) {
                const existing = grouped[seen[key]];
                existing.count = (existing.count || 1) + 1;
                existing.stackedIds = existing.stackedIds || [existing._id];
                existing.stackedIds.push(n._id);
                // Keep tracked as unread if any of the stacked are unread
                if (!n.isRead) existing.isRead = false;
                // Keep the latest timestamp
                if (new Date(n.createdAt) > new Date(existing.createdAt)) {
                    existing.createdAt = n.createdAt;
                    existing.title = n.title; // use the latest sender name
                }
            } else {
                seen[key] = grouped.length;
                grouped.push({ ...n, count: 1 });
            }
        } else {
            grouped.push(n);
        }
    }
    return grouped;
}

// ── Single Notification Card ──────────────────────────────────────────────────
const NotifCard = ({ notif, onRead, onDelete, onClose }) => {
    const navigate = useNavigate();
    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.new_message;
    const isStacked = notif.count && notif.count > 1;

    const handleClick = () => {
        // Mark all stacked notifications read, or just the single one
        const ids = notif.stackedIds || [notif._id];
        ids.forEach(id => { if (!notif.isRead) onRead(id); });
        onClose();
        const target = cfg.navTarget(notif.meta);
        const [path, qs] = target.split('?');
        navigate(path + (qs ? `?${qs}` : ''));
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        const ids = notif.stackedIds || [notif._id];
        ids.forEach(id => onDelete(id));
    };

    return (
        <div
            onClick={handleClick}
            style={{
                display: 'flex',
                gap: 12,
                padding: '12px 14px',
                cursor: 'pointer',
                background: notif.isRead ? 'transparent' : cfg.bgColor,
                borderLeft: `3px solid ${notif.isRead ? 'rgba(255,255,255,0.06)' : cfg.accentColor}`,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background 0.2s',
                position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.background = cfg.bgColor}
            onMouseLeave={e => e.currentTarget.style.background = notif.isRead ? 'transparent' : cfg.bgColor}
        >
            {/* Icon bubble */}
            <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: `${cfg.accentColor}18`,
                border: `1px solid ${cfg.borderColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: cfg.accentColor,
                position: 'relative',
            }}>
                {cfg.icon}
                {/* Stacked count badge on icon */}
                {isStacked && (
                    <span style={{
                        position: 'absolute', top: -5, right: -5,
                        minWidth: 16, height: 16, borderRadius: 8,
                        background: cfg.accentColor,
                        color: '#000',
                        fontSize: 9, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 3px',
                        boxShadow: `0 0 6px ${cfg.accentColor}88`,
                    }}>
                        {notif.count > 9 ? '9+' : notif.count}
                    </span>
                )}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.5px',
                        textTransform: 'uppercase', color: cfg.accentColor,
                    }}>
                        {isStacked ? `${notif.count} Messages` : cfg.label}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginLeft: 8 }}>
                        {timeAgo(notif.createdAt)}
                    </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: notif.isRead ? 400 : 600, color: notif.isRead ? 'rgba(255,255,255,0.55)' : '#f1f5f9', lineHeight: 1.4, marginBottom: 2 }}>
                    {notif.title}
                </div>
                {notif.body && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                        {notif.body}
                    </div>
                )}
            </div>

            {/* Unread dot */}
            {!notif.isRead && (
                <div style={{
                    position: 'absolute', top: 14, right: 36,
                    width: 6, height: 6, borderRadius: '50%',
                    background: cfg.accentColor,
                    boxShadow: `0 0 6px ${cfg.accentColor}`,
                }} />
            )}

            {/* Delete button */}
            <button
                onClick={handleDelete}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.2)', padding: '2px 4px',
                    fontSize: 14, lineHeight: 1, alignSelf: 'flex-start',
                    transition: 'color 0.15s',
                    flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                title="Dismiss"
            >✕</button>
        </div>
    );
};

// ── Bell Icon SVG ─────────────────────────────────────────────────────────────
const BellSVG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

// ── Main NotificationBell component ──────────────────────────────────────────
/**
 * @param {{ dark?: boolean }} props
 * `dark` = true  → Marketplace / Dashboard style (dark bg, white text)
 * `dark` = false → Home Navbar style (glassmorphic, indigo tones)
 */
const NotificationBell = ({ dark = true }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const { notifications, unreadNotifCount, markNotifRead, markAllNotifsRead, deleteNotif } = useSocket();

    // Click outside to close
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const buttonClass = dark
        ? 'btn-glass' // Marketplace / Dashboard glass button style
        : 'p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-indigo-800 dark:text-slate-200 ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-colors';

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(v => !v)}
                className={buttonClass}
                title="Notifications"
                style={dark ? { padding: '9px 12px', position: 'relative' } : { position: 'relative' }}
            >
                <BellSVG />
                {unreadNotifCount > 0 && (
                    <span style={{
                        position: 'absolute', top: -4, right: -4,
                        minWidth: 17, height: 17, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #c026d3, #ef4444)',
                        boxShadow: '0 0 8px rgba(192,38,211,0.55)',
                        color: '#fff', fontSize: 9, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 3px',
                        animation: 'pulse 2s infinite',
                    }}>
                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: 370,
                    maxHeight: 460,
                    background: '#0c0c14',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    boxShadow: '0 24px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 9999,
                    animation: 'notifSlideIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px 12px',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', letterSpacing: 0.2 }}>
                                Notifications
                            </span>
                            {unreadNotifCount > 0 && (
                                <span style={{
                                    fontSize: 10, fontWeight: 800, padding: '2px 7px',
                                    borderRadius: 20, background: 'rgba(99,102,241,0.2)',
                                    color: '#a78bfa', border: '1px solid rgba(99,102,241,0.3)',
                                }}>
                                    {unreadNotifCount} new
                                </span>
                            )}
                        </div>
                        {unreadNotifCount > 0 && (
                            <button
                                onClick={markAllNotifsRead}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: 11, color: '#818cf8', fontWeight: 600,
                                    padding: '2px 0',
                                }}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {notifications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)' }}>
                                <div style={{ fontSize: 32, marginBottom: 10 }}>🔔</div>
                                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>You're all caught up!</div>
                                <div style={{ fontSize: 11 }}>New offers, deals, and messages will appear here.</div>
                            </div>
                        ) : (
                            groupNotifications(notifications).map(n => (
                                <NotifCard
                                    key={n.stackedIds ? n.stackedIds[0] : n._id}
                                    notif={n}
                                    onRead={markNotifRead}
                                    onDelete={deleteNotif}
                                    onClose={() => setOpen(false)}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div style={{
                            padding: '10px 16px',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            textAlign: 'center',
                            flexShrink: 0,
                            background: 'rgba(0,0,0,0.3)',
                        }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 0.5 }}>
                                Notifications auto-clear after 30 days
                            </span>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes notifSlideIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;
