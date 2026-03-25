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
        solidColor: '#3B82F6', // Blue
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
        solidColor: '#10B981', // Emerald
        label: 'Deal Done',
        navTarget: () => '/dashboard?tab=deals',
    },
    offer_rejected: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
        solidColor: '#EF4444', // Red
        label: 'Offer Declined',
        navTarget: () => '/dashboard?tab=negotiations',
    },
    new_message: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        solidColor: '#8B5CF6', // Purple
        label: 'Message',
        navTarget: (meta) => meta?.conversationId ? `/chat/${meta.conversationId}` : '/chat',
    },
    deal_done: {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        solidColor: '#F59E0B', // Amber
        label: 'Deal Confirmed',
        navTarget: () => '/dashboard?tab=deals',
    },
};

// ── Time ago helper ───────────────────────────────────────────────────────────
function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ── Group same-conversation message notifications into one card ────────────────
function groupNotifications(notifs) {
    const grouped = [];
    const seen = {}; 

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
            className={`notif-item-card ${notif.isRead ? '' : 'unread'}`}
        >
            {/* Icon bubble */}
            <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: cfg.solidColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
                position: 'relative'
            }}>
                {cfg.icon}
                {/* Stacked count badge on icon */}
                {isStacked && (
                    <span style={{
                        position: 'absolute', top: -4, right: -4,
                        minWidth: 16, height: 16, borderRadius: 8,
                        background: '#1A1A1A',
                        border: `2px solid ${cfg.solidColor}`,
                        color: cfg.solidColor,
                        fontSize: 10, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        lineHeight: 1
                    }}>
                        {notif.count > 9 ? '9+' : notif.count}
                    </span>
                )}
            </div>

            {/* Text Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginRight: 6 }}>
                        {isStacked ? `${notif.count} Messages` : cfg.label}
                    </span>
                    {!notif.isRead && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.solidColor, flexShrink: 0 }} />
                    )}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, marginBottom: 4 }}>
                    {notif.title}
                </div>
                {notif.body && (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {notif.body}
                    </div>
                )}
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6, fontWeight: 600 }}>
                    {timeAgo(notif.createdAt)}
                </div>
            </div>

            {/* Delete button (only visible on hover through CSS) */}
            <button
                onClick={handleDelete}
                className="notif-delete-btn"
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

    // Onboarding: open/close via custom events
    useEffect(() => {
        const openHandler = () => setOpen(true);
        const closeHandler = () => setOpen(false);
        window.addEventListener('onboarding:open-notifications', openHandler);
        window.addEventListener('onboarding:close-notifications', closeHandler);
        return () => {
            window.removeEventListener('onboarding:open-notifications', openHandler);
            window.removeEventListener('onboarding:close-notifications', closeHandler);
        };
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
                        minWidth: 16, height: 16, borderRadius: '50%',
                        background: '#EF4444',
                        color: '#fff', fontSize: 10, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 3px',
                    }}>
                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="notif-dropdown">
                    {/* Header */}
                    <div className="notif-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: 0.2 }}>
                                Notifications
                            </span>
                            {unreadNotifCount > 0 && (
                                <span style={{
                                    fontSize: 12, fontWeight: 800, padding: '3px 10px',
                                    borderRadius: 12, background: 'rgba(255,255,255,0.1)',
                                    color: '#fff'
                                }}>
                                    {unreadNotifCount} New
                                </span>
                            )}
                        </div>
                        {unreadNotifCount > 0 && (
                            <button
                                onClick={markAllNotifsRead}
                                className="notif-mark-read"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="notif-list custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <BellSVG />
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>You're all caught up!</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 220 }}>New offers, deals, and messages will appear here.</div>
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
                        <div className="notif-footer">
                            Notifications automatically clear after 30 days
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .notif-dropdown {
                    position: absolute;
                    top: calc(100% + 14px);
                    right: 0;
                    width: 360px;
                    max-height: 80vh;
                    background: #121212; /* Solid minimal dark background */
                    border: 1px solid rgba(255, 255, 255, 0.08); /* Clean thin border */
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                    display: flex;
                    flex-direction: column;
                    z-index: 10000;
                    animation: notifSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                    font-family: 'Manrope', sans-serif;
                }

                .notif-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 24px 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    flex-shrink: 0;
                }

                .notif-mark-read {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 700;
                    padding: 6px 10px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .notif-mark-read:hover {
                    color: #fff;
                    background: rgba(255, 255, 255, 0.08);
                }

                .notif-list {
                    overflow-y: auto;
                    flex: 1;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .notif-item-card {
                    display: flex;
                    gap: 14px;
                    padding: 16px;
                    border-radius: 16px;
                    cursor: pointer;
                    position: relative;
                    transition: background 0.15s ease;
                    border: none;
                    background: transparent;
                }
                .notif-item-card.unread {
                    background: rgba(255, 255, 255, 0.03); /* slight solid boost for unread */
                }
                .notif-item-card:hover {
                    background: rgba(255, 255, 255, 0.06) !important;
                }

                .notif-delete-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: rgba(255,255,255,0.2);
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .notif-item-card:hover .notif-delete-btn {
                    color: rgba(255,255,255,0.6);
                }
                .notif-delete-btn:hover {
                    color: #EF4444 !important;
                    background: rgba(239, 68, 68, 0.1);
                    border-radius: 50%;
                }

                .notif-footer {
                    padding: 14px;
                    text-align: center;
                    font-size: 11px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.3);
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    flex-shrink: 0;
                }

                @media (max-width: 768px) {
                    .notif-dropdown {
                        position: fixed;
                        top: 72px; /* Clears top header/notch */
                        left: 12px;
                        right: 12px;
                        width: auto;
                        max-height: calc(100vh - 120px);
                        border-radius: 24px;
                        box-shadow: 0 40px 100px rgba(0, 0, 0, 1);
                    }
                    .notif-delete-btn {
                        color: rgba(255,255,255,0.4); /* Always visible on mobile */
                    }
                }

                @keyframes notifSlideIn {
                    0% { opacity: 0; transform: translateY(-8px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;
