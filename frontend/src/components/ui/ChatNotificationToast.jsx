import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';

const TOAST_DURATION = 5000; // ms

// ── Mini avatar ───────────────────────────────────────────────────────────────
const Avatar = ({ user, size = 36 }) => {
    const initial = (user?.fullName || user?.name || '?').charAt(0).toUpperCase();
    return user?.profilePicture ? (
        <img
            src={user.profilePicture}
            alt={user.fullName}
            style={{ width: size, height: size }}
            className="rounded-full object-cover flex-shrink-0 ring-2 ring-white/10"
        />
    ) : (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-white/10"
        >
            {initial}
        </div>
    );
};

// ── Message preview text ───────────────────────────────────────────────────────
const getPreview = (message) => {
    if (message.type === 'offer') return `💰 Offer: ₹${message.offerData?.amount?.toLocaleString('en-IN') ?? ''}`;
    if (message.type === 'media') {
        if (message.mediaType === 'image') return '📷 Image';
        if (message.mediaType === 'video') return '🎥 Video';
        return '📎 File';
    }
    return message.content || '…';
};

// ── Single Toast Card ─────────────────────────────────────────────────────────
const ToastCard = ({ toast, onDismiss }) => {
    const navigate = useNavigate();
    const { markConversationRead } = useSocket();
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    // Entrance animation
    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    // Auto-dismiss countdown
    useEffect(() => {
        startTimeRef.current = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
            setProgress(remaining);
            if (remaining <= 0) {
                handleDismiss();
            } else {
                timerRef.current = requestAnimationFrame(tick);
            }
        };
        timerRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(timerRef.current);
    }, []);

    const handleDismiss = () => {
        cancelAnimationFrame(timerRef.current);
        setExiting(true);
        setTimeout(() => onDismiss(toast.id), 350);
    };

    const handleReply = () => {
        handleDismiss();
        markConversationRead();
        navigate(`/chat/${toast.conversationId}`);
    };

    const sender = toast.message?.sender;
    const preview = getPreview(toast.message);
    const senderName = sender?.fullName || sender?.name || 'Someone';

    return (
        <div
            style={{
                transform: visible && !exiting ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
                opacity: visible && !exiting ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
                willChange: 'transform, opacity'
            }}
            className="relative w-[340px] rounded-2xl overflow-hidden shadow-2xl"
        >
            {/* Glass background */}
            <div className="absolute inset-0 bg-[#0d0d14]/90 backdrop-blur-2xl border border-white/10" />

            {/* Gradient accent line top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />

            {/* Content */}
            <div className="relative p-4">
                {/* Header row */}
                <div className="flex items-start gap-3">
                    <Avatar user={sender} size={40} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-sm font-bold text-white truncate">{senderName}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Live pulse dot */}
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                                </span>
                                <button
                                    onClick={handleDismiss}
                                    className="ml-1 p-0.5 rounded-full text-white/40 hover:text-white/80 transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Label */}
                        <div className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest mb-1">
                            New Message
                        </div>

                        {/* Message preview */}
                        <p className="text-sm text-white/70 truncate leading-snug">{preview}</p>
                    </div>
                </div>

                {/* Reply button */}
                <button
                    onClick={handleReply}
                    className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white text-xs font-bold tracking-wide hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 10 4 15 9 20" />
                        <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                    </svg>
                    Reply
                </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
                <div
                    style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                />
            </div>
        </div>
    );
};

// ── Toast Container (renders all toasts) ──────────────────────────────────────
const ChatNotificationToast = () => {
    const { toasts, dismissToast } = useSocket();

    if (!toasts.length) return null;

    return (
        <div
            className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none"
            aria-live="polite"
        >
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastCard toast={toast} onDismiss={dismissToast} />
                </div>
            ))}
        </div>
    );
};

export default ChatNotificationToast;
