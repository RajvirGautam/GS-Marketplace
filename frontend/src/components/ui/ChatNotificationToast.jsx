import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';

const TOAST_DURATION = 5000; // ms

// ── Message preview text ───────────────────────────────────────────────────────
const getPreview = (message) => {
    if (message.type === 'offer') return `Offer: ₹${message.offerData?.amount?.toLocaleString('en-IN') ?? ''}`;
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

    const handleDismiss = (e) => {
        if (e) e.stopPropagation();
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
            className="relative w-[340px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] cursor-pointer group"
            onClick={handleReply}
        >
            {/* Black Theme Background with Subtle Cyan Tint */}
            <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md border border-zinc-800/50" />
            {/* Subtle cyan gradient overlay at the top - Changed from violet to cyan */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/15 to-transparent pointer-events-none" />
             {/* Subtle top cyan accent glow line - Changed from violet to cyan */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />


            {/* Content */}
            <div className="relative p-4">
                {/* Header */}
                <div className="flex items-center justify-between text-zinc-400 text-sm mb-3">
                    <div className="flex items-center gap-2">
                        {/* Icon - Changed color to cyan-300 */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-cyan-300">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.678 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-zinc-300 font-medium">New Message</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReply}
                            // Added slight cyan tint to hover state - Changed from violet
                            className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-cyan-900/30 text-[10px] font-medium text-zinc-200 transition-all flex items-center gap-1"
                        >
                            Reply
                        </button>
                        <button onClick={handleDismiss} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div>
                    <h3 className="text-base font-semibold text-white truncate">{senderName}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-1 leading-snug">{preview}</p>
                </div>

                {/* Progress Bar - Changed to Cyan Gradient */}
                <div className="relative h-0.5 bg-zinc-800/50 rounded-full mt-3 overflow-hidden">
                    <div
                        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                        // Changed gradient from violet/fuchsia to cyan/sky
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-sky-500 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};

// ── Toast Container (renders all toasts) ──────────────────────────────────────
const ChatNotificationToast = () => {
    const { toasts, dismissToast } = useSocket();

    if (!toasts.length) return null;

    return (
        // Positioned bottom-right
        <div
            className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none"
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