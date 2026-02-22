import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';

// ─────────────────────────────────────────────────────────────
//  SVG Icons
// ─────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
);
const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
const PaperclipIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);
const DollarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);
const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const ImageIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);
const MessageBubbleIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const TagIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
const timeAgo = (date) => {
    if (!date) return '';
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
};

const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const qs = (n) => document.querySelector(n);

// ─────────────────────────────────────────────────────────────
//  Price Negotiator Modal
// ─────────────────────────────────────────────────────────────
const PriceNegotiatorModal = ({ onClose, onSubmit, productPrice, sending }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
        onSubmit(Number(amount), note);
    };

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.negotiatorModal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.modalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={styles.modalIconWrap}><DollarIcon /></div>
                        <div>
                            <div style={styles.modalTitle}>Make an Offer</div>
                            <div style={styles.modalSub}>
                                {productPrice ? `Listed at ₹${productPrice}` : 'Propose your price'}
                            </div>
                        </div>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}><XIcon /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Amount field */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Your Offer Price</label>
                        <div style={styles.priceInput}>
                            <span style={styles.currencyBadge}>₹</span>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                style={styles.priceInputField}
                                autoFocus
                                min="1"
                            />
                            {productPrice && amount && (
                                <span style={{
                                    fontSize: 11,
                                    color: Number(amount) < productPrice ? '#10B981' : '#EF4444',
                                    fontFamily: 'JetBrains Mono, monospace',
                                    whiteSpace: 'nowrap',
                                    marginRight: 8
                                }}>
                                    {Number(amount) < productPrice
                                        ? `↓ ${Math.round((1 - Number(amount) / productPrice) * 100)}% off`
                                        : `↑ +${Math.round((Number(amount) / productPrice - 1) * 100)}%`}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Note field */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Note to seller <span style={{ opacity: 0.4 }}>(optional)</span></label>
                        <textarea
                            placeholder="Why should they accept? Pickup today, student price, etc."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={3}
                            style={styles.noteTextarea}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending || !amount}
                        style={{
                            ...styles.submitBtn,
                            opacity: sending || !amount ? 0.5 : 1,
                            cursor: sending || !amount ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {sending ? 'Sending…' : '💸 Send Offer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Offer Card (inside message thread)
// ─────────────────────────────────────────────────────────────
const OfferCard = ({ message, currentUserId, onRespond, responding }) => {
    const { offerData, sender } = message;
    const isSender = sender._id === currentUserId || sender._id?.toString() === currentUserId?.toString();
    const isPending = offerData?.status === 'pending';

    const statusColors = {
        pending: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
        accepted: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)', text: '#10B981' },
        rejected: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)', text: '#EF4444' }
    };
    const sc = statusColors[offerData?.status] || statusColors.pending;

    return (
        <div style={{
            background: 'rgba(0,217,255,0.05)',
            border: '1.5px solid rgba(0,217,255,0.25)',
            borderRadius: 12,
            padding: '14px 16px',
            maxWidth: 300,
            marginTop: 2
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ background: 'rgba(0,217,255,0.15)', borderRadius: 6, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <TagIcon />
                    <span style={{ fontSize: 10, color: '#00D9FF', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>PRICE OFFER</span>
                </div>
                <div style={{
                    marginLeft: 'auto',
                    background: sc.bg,
                    border: `1px solid ${sc.border}`,
                    color: sc.text,
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: 0.8,
                    padding: '3px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase'
                }}>
                    {offerData?.status}
                </div>
            </div>

            <div style={{ fontSize: 28, fontWeight: 800, color: '#00D9FF', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                ₹{offerData?.amount?.toLocaleString()}
            </div>

            {offerData?.note && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 12, lineHeight: 1.5 }}>
                    "{offerData.note}"
                </div>
            )}

            {!isSender && isPending && (
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => onRespond(message._id, 'accepted')}
                        disabled={responding}
                        style={{
                            flex: 1, padding: '8px 0', borderRadius: 8,
                            background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                            color: '#10B981', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
                        }}
                    >
                        <CheckIcon /> Accept
                    </button>
                    <button
                        onClick={() => onRespond(message._id, 'rejected')}
                        disabled={responding}
                        style={{
                            flex: 1, padding: '8px 0', borderRadius: 8,
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
                            color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
                        }}
                    >
                        <XIcon /> Decline
                    </button>
                </div>
            )}

            {isSender && isPending && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Waiting for response…</div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Message Bubble
// ─────────────────────────────────────────────────────────────
const MessageBubble = ({ message, currentUserId, onRespond, responding }) => {
    const isMine = message.sender?._id === currentUserId || message.sender?._id?.toString() === currentUserId?.toString();

    return (
        <div style={{
            display: 'flex',
            flexDirection: isMine ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: 8,
            marginBottom: 8,
        }}>
            {/* Avatar */}
            {!isMine && (
                <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#0A0A0A',
                    flexShrink: 0,
                    overflow: 'hidden'
                }}>
                    {message.sender?.profilePicture
                        ? <img src={message.sender.profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : getInitials(message.sender?.fullName)}
                </div>
            )}

            <div style={{ maxWidth: '68%', display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', gap: 2 }}>
                {message.type === 'offer' ? (
                    <OfferCard message={message} currentUserId={currentUserId} onRespond={onRespond} responding={responding} />
                ) : message.type === 'media' ? (
                    <div style={{
                        background: isMine ? 'linear-gradient(135deg, rgba(0,217,255,0.2), rgba(124,58,237,0.2))' : 'rgba(255,255,255,0.06)',
                        border: isMine ? '1px solid rgba(0,217,255,0.25)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        overflow: 'hidden',
                        maxWidth: 260,
                    }}>
                        {message.mediaType === 'image' ? (
                            <img
                                src={message.mediaUrl}
                                alt="media"
                                style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                                onClick={() => window.open(message.mediaUrl, '_blank')}
                            />
                        ) : (
                            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ color: '#00D9FF' }}><PaperclipIcon /></div>
                                <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#00D9FF', fontSize: 13, textDecoration: 'none' }}>
                                    {message.mediaType === 'video' ? '📹 Video' : '📎 File'}
                                </a>
                            </div>
                        )}
                        {message.content && (
                            <div style={{ padding: '8px 12px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{message.content}</div>
                        )}
                    </div>
                ) : (
                    <div style={{
                        background: isMine ? 'linear-gradient(135deg, #00D9FF, #0099CC)' : 'rgba(255,255,255,0.07)',
                        color: isMine ? '#0A0A0A' : 'rgba(255,255,255,0.9)',
                        padding: '10px 14px',
                        borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        fontSize: 14,
                        lineHeight: 1.5,
                        fontWeight: isMine ? 500 : 400,
                        border: isMine ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: isMine ? '0 4px 16px rgba(0,217,255,0.2)' : 'none',
                    }}>
                        {message.content}
                    </div>
                )}

                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    {formatTime(message.createdAt)}
                </span>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Conversation List Item
// ─────────────────────────────────────────────────────────────
const ConvItem = ({ conv, currentUserId, isActive, onClick }) => {
    const other = conv.participants?.find(p => p._id !== currentUserId && p._id?.toString() !== currentUserId?.toString())
        || conv.participants?.[0];

    const lastMsg = conv.lastMessage;
    const preview = !lastMsg ? 'No messages yet'
        : lastMsg.type === 'offer' ? '💰 Price offer'
            : lastMsg.type === 'media' ? '📎 Media'
                : lastMsg.content?.slice(0, 40) || '…';

    return (
        <button
            onClick={onClick}
            style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(0,217,255,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid #00D9FF' : '2px solid transparent',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 12
            }}
        >
            {/* Avatar */}
            <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#0A0A0A', flexShrink: 0,
                overflow: 'hidden'
            }}>
                {other?.profilePicture
                    ? <img src={other.profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : getInitials(other?.fullName)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, truncate: true }}>
                        {other?.fullName || 'Unknown'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                        {timeAgo(conv.lastMessageAt)}
                    </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.product?.title && <span style={{ color: 'rgba(0,217,255,0.5)', marginRight: 4 }}>{conv.product.title}</span>}
                    {preview}
                </div>
            </div>
        </button>
    );
};

// ─────────────────────────────────────────────────────────────
//  Main Chat Component
// ─────────────────────────────────────────────────────────────
const Chat = () => {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const { user } = useAuth();

    const [conversations, setConversations] = useState([]);
    const [activeConvId, setActiveConvId] = useState(conversationId || null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [responding, setResponding] = useState(false);
    const [convsLoading, setConvsLoading] = useState(true);
    const [msgsLoading, setMsgsLoading] = useState(false);
    const [showNegotiator, setShowNegotiator] = useState(false);
    const [offerSending, setOfferSending] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(null); // { file, url, type }
    const [uploading, setUploading] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const pollRef = useRef(null);
    const shouldScrollRef = useRef(false); // true only when we explicitly want to jump to bottom

    // Derived: active conversation object
    const activeConv = conversations.find(c => c._id === activeConvId);
    const otherParticipant = activeConv?.participants?.find(
        p => p._id !== user?._id && p._id?.toString() !== user?._id?.toString()
    ) || activeConv?.participants?.[0];

    // ── Fetch conversations ──
    const fetchConversations = useCallback(async () => {
        try {
            const res = await chatAPI.getConversations();
            if (res.success) setConversations(res.conversations || []);
        } catch (e) {
            console.error('Failed to fetch conversations', e);
        } finally {
            setConvsLoading(false);
        }
    }, []);

    // ── Fetch messages for active conversation ──
    const fetchMessages = useCallback(async (convId) => {
        if (!convId) return;
        try {
            const res = await chatAPI.getMessages(convId);
            if (res.success) {
                setMessages(res.messages || []);
            }
        } catch (e) {
            console.error('Failed to fetch messages', e);
        }
    }, []);

    // ── Initial load ──
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // ── Load messages on conversation change ──
    useEffect(() => {
        if (!activeConvId) return;
        setMsgsLoading(true);
        shouldScrollRef.current = true; // jump to bottom on initial load
        fetchMessages(activeConvId).finally(() => setMsgsLoading(false));

        // Start polling
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(() => {
            fetchMessages(activeConvId);
            fetchConversations();
        }, 3000);

        return () => clearInterval(pollRef.current);
    }, [activeConvId, fetchMessages, fetchConversations]);

    // ── Sync URL param ──
    useEffect(() => {
        if (conversationId) setActiveConvId(conversationId);
    }, [conversationId]);

    // ── Scroll to bottom (only when near bottom or explicitly triggered) ──
    useEffect(() => {
        const area = messagesAreaRef.current;
        if (!area) return;
        if (shouldScrollRef.current) {
            // Explicit jump (conversation switch or message sent by us)
            messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
            shouldScrollRef.current = false;
        } else {
            // Poll update: only scroll if already near the bottom
            const distFromBottom = area.scrollHeight - area.scrollTop - area.clientHeight;
            if (distFromBottom < 150) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages]);

    // ── Send text message ──
    const handleSend = async () => {
        if (!inputText.trim() || !activeConvId || sending) return;
        const text = inputText.trim();
        setInputText('');
        setSending(true);
        shouldScrollRef.current = true; // scroll to bottom after sending
        try {
            const res = await chatAPI.sendMessage(activeConvId, text);
            if (res.success) {
                setMessages(prev => [...prev, res.message]);
                fetchConversations();
            }
        } catch (e) {
            console.error('Failed to send message', e);
            setInputText(text); // restore on failure
        } finally {
            setSending(false);
        }
    };

    // ── Send media ──
    const handleMediaSend = async () => {
        if (!mediaPreview || !activeConvId) return;
        setUploading(true);
        shouldScrollRef.current = true; // scroll to bottom after sending media
        try {
            const res = await chatAPI.sendMedia(activeConvId, mediaPreview.file);
            if (res.success) {
                setMessages(prev => [...prev, res.message]);
                setMediaPreview(null);
                fetchConversations();
            }
        } catch (e) {
            console.error('Failed to send media', e);
        } finally {
            setUploading(false);
        }
    };

    // ── Handle file pick ──
    const handleFilePick = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file';
        setMediaPreview({ file, url, type });
        e.target.value = '';
    };

    // ── Send offer ──
    const handleSendOffer = async (amount, note) => {
        if (!activeConvId) return;
        setOfferSending(true);
        try {
            const res = await chatAPI.sendOffer(activeConvId, amount, note);
            if (res.success) {
                setMessages(prev => [...prev, res.message]);
                setShowNegotiator(false);
                fetchConversations();
            }
        } catch (e) {
            console.error('Failed to send offer', e);
        } finally {
            setOfferSending(false);
        }
    };

    // ── Respond to offer ──
    const handleRespondToOffer = async (messageId, status) => {
        setResponding(true);
        try {
            const res = await chatAPI.respondToOffer(messageId, status);
            if (res.success) {
                setMessages(prev => prev.map(m => m._id === messageId ? res.message : m));
            }
        } catch (e) {
            console.error('Failed to respond to offer', e);
        } finally {
            setResponding(false);
        }
    };

    // ── Enter key to send ──
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ── Select conversation ──
    const selectConversation = (convId) => {
        setActiveConvId(convId);
        navigate(`/chat/${convId}`, { replace: true });
        setMessages([]);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .chat-root {
          font-family: 'Manrope', sans-serif;
          background: #0A0A0A;
          color: #E4E4E7;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .chat-grid-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.02) 59px, rgba(255,255,255,0.02) 60px),
            repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.02) 59px, rgba(255,255,255,0.02) 60px);
        }

        .chat-topbar {
          display: flex; align-items: center; gap: 12px;
          padding: 0 20px;
          height: 56px;
          background: rgba(10,10,10,0.9);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          position: relative; z-index: 50; flex-shrink: 0;
        }

        .chat-body {
          display: flex; flex: 1; overflow: hidden; position: relative; z-index: 10;
        }

        /* ── Conv list ── */
        .conv-list {
          width: 300px; flex-shrink: 0;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column;
          background: rgba(12,12,12,0.8);
          overflow: hidden;
        }
        .conv-list-header {
          padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.07);
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: space-between;
        }
        .conv-list-body { flex: 1; overflow-y: auto; }
        .conv-list-body::-webkit-scrollbar { width: 4px; }
        .conv-list-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* ── Thread ── */
        .chat-thread {
          flex: 1; display: flex; flex-direction: column;
          background: rgba(10,10,10,0.6);
          overflow: hidden;
        }
        .thread-header {
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(12,12,12,0.8);
          backdrop-filter: blur(20px);
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
        }
        .messages-area {
          flex: 1; overflow-y: auto; padding: 20px;
          display: flex; flex-direction: column; gap: 2;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        .input-bar {
          padding: 12px 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(12,12,12,0.9);
          backdrop-filter: blur(20px);
          display: flex; align-items: flex-end; gap: 10; flex-shrink: 0;
        }
        .input-field {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 14px;
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          resize: none;
          outline: none;
          min-height: 44px;
          max-height: 120px;
          transition: border-color 0.15s;
          line-height: 1.5;
        }
        .input-field:focus { border-color: rgba(0,217,255,0.4); }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }

        .icon-btn {
          width: 44px; height: 44px; border-radius: 10px; border: none;
          background: rgba(255,255,255,0.06); cursor: pointer;
          color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }

        .send-btn {
          width: 44px; height: 44px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #00D9FF, #0099CC);
          cursor: pointer; color: #0A0A0A;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(0,217,255,0.4); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .offer-btn {
          width: 44px; height: 44px; border-radius: 10px; border: none;
          background: rgba(124,58,237,0.2);
          border: 1px solid rgba(124,58,237,0.35);
          cursor: pointer; color: #a78bfa;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .offer-btn:hover { background: rgba(124,58,237,0.35); }

        /* ── Empty states ── */
        .empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16;
          color: rgba(255,255,255,0.2);
        }

        /* ── Media preview bar ── */
        .media-preview-bar {
          padding: 10px 16px; border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(15,15,15,0.95);
          display: flex; align-items: center; gap: 12; flex-shrink: 0;
        }

        /* Scrollbar for conv list */
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
      `}</style>

            <div className="chat-root">
                <div className="chat-grid-bg" />

                {/* Topbar */}
                <div className="chat-topbar">
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 10px', borderRadius: 8, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                        <ArrowLeftIcon /> Dashboard
                    </button>
                    <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D9FF', boxShadow: '0 0 6px #00D9FF' }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Messages</span>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Body */}
                <div className="chat-body">
                    {/* ── Conversation List ── */}
                    <div className="conv-list">
                        <div className="conv-list-header">
                            <span>Conversations</span>
                            <span style={{ color: '#00D9FF' }}>{conversations.length}</span>
                        </div>

                        <div className="conv-list-body">
                            {convsLoading ? (
                                <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading…</div>
                            ) : conversations.length === 0 ? (
                                <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.25)' }}>
                                    <MessageBubbleIcon />
                                    <span style={{ fontSize: 13 }}>No conversations yet</span>
                                    <span style={{ fontSize: 11, lineHeight: 1.6 }}>Message a seller from<br />any product page to start</span>
                                </div>
                            ) : (
                                conversations.map(conv => (
                                    <ConvItem
                                        key={conv._id}
                                        conv={conv}
                                        currentUserId={user?._id}
                                        isActive={conv._id === activeConvId}
                                        onClick={() => selectConversation(conv._id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* ── Chat Thread ── */}
                    <div className="chat-thread">
                        {!activeConvId || !activeConv ? (
                            <div className="empty-state">
                                <MessageBubbleIcon />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Select a conversation</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', lineHeight: 1.7 }}>
                                        Or message a seller from<br />a product page to start chatting
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Thread header */}
                                <div className="thread-header">
                                    <div style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 700, color: '#0A0A0A', flexShrink: 0,
                                        overflow: 'hidden'
                                    }}>
                                        {otherParticipant?.profilePicture
                                            ? <img src={otherParticipant.profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : getInitials(otherParticipant?.fullName)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{otherParticipant?.fullName || 'User'}</div>
                                        {activeConv?.product && (
                                            <div style={{ fontSize: 11, color: 'rgba(0,217,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <TagIcon />
                                                <span>{activeConv.product.title}</span>
                                                {activeConv.product.price && (
                                                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>· ₹{activeConv.product.price}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {activeConv?.product?.images?.[0] && (
                                        <img
                                            src={activeConv.product.images[0]}
                                            alt="product"
                                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
                                        />
                                    )}
                                </div>

                                {/* Messages */}
                                <div className="messages-area" ref={messagesAreaRef}>
                                    {msgsLoading && messages.length === 0 ? (
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, paddingTop: 40 }}>
                                            Loading messages…
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, paddingTop: 40 }}>
                                            No messages yet. Say hi! 👋
                                        </div>
                                    ) : (
                                        messages.map(msg => (
                                            <MessageBubble
                                                key={msg._id}
                                                message={msg}
                                                currentUserId={user?._id}
                                                onRespond={handleRespondToOffer}
                                                responding={responding}
                                            />
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Media preview bar */}
                                {mediaPreview && (
                                    <div className="media-preview-bar">
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            {mediaPreview.type === 'image' ? (
                                                <img src={mediaPreview.url} alt="preview" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }} />
                                            ) : (
                                                <div style={{ width: 56, height: 56, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <PaperclipIcon />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setMediaPreview(null)}
                                                style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#EF4444', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                        <div style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                            {mediaPreview.file.name}
                                            <div style={{ fontSize: 10, marginTop: 2, color: 'rgba(255,255,255,0.3)' }}>
                                                {(mediaPreview.file.size / 1024).toFixed(0)} KB
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleMediaSend}
                                            disabled={uploading}
                                            className="send-btn"
                                            style={{ opacity: uploading ? 0.5 : 1 }}
                                        >
                                            {uploading ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                </svg>
                                            ) : (
                                                <SendIcon />
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Input Bar */}
                                <div className="input-bar">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFilePick}
                                        style={{ display: 'none' }}
                                        accept="image/*,video/mp4,application/pdf"
                                    />
                                    <button
                                        className="icon-btn"
                                        onClick={() => fileInputRef.current?.click()}
                                        title="Attach media"
                                    >
                                        <PaperclipIcon />
                                    </button>
                                    <button
                                        className="offer-btn"
                                        onClick={() => setShowNegotiator(true)}
                                        title="Make a price offer"
                                    >
                                        <DollarIcon />
                                    </button>
                                    <textarea
                                        className="input-field"
                                        placeholder="Type a message…"
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                    />
                                    <button
                                        className="send-btn"
                                        onClick={handleSend}
                                        disabled={!inputText.trim() || sending}
                                        title="Send message"
                                    >
                                        <SendIcon />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Price Negotiator Modal */}
            {showNegotiator && (
                <PriceNegotiatorModal
                    onClose={() => setShowNegotiator(false)}
                    onSubmit={handleSendOffer}
                    productPrice={activeConv?.product?.price}
                    sending={offerSending}
                />
            )}
        </>
    );
};

// ─────────────────────────────────────────────────────────────
//  Modal styles (defined out of render to avoid re-creation)
// ─────────────────────────────────────────────────────────────
const styles = {
    modalOverlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999, padding: 20
    },
    negotiatorModal: {
        background: 'linear-gradient(145deg, #111111, #0d0d0d)',
        border: '1px solid rgba(124,58,237,0.35)',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.1)',
        display: 'flex', flexDirection: 'column', gap: 20
    },
    modalHeader: {
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
    },
    modalIconWrap: {
        width: 40, height: 40, borderRadius: 10,
        background: 'rgba(124,58,237,0.2)',
        border: '1px solid rgba(124,58,237,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#a78bfa'
    },
    modalTitle: { fontSize: 16, fontWeight: 700, color: '#fff' },
    modalSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
    closeBtn: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.4)', padding: 4, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 0.15s'
    },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
    fieldLabel: { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3 },
    priceInput: {
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: '1.5px solid rgba(124,58,237,0.3)',
        borderRadius: 10, overflow: 'hidden',
        transition: 'border-color 0.15s'
    },
    currencyBadge: {
        padding: '0 14px', fontSize: 18, fontWeight: 700, color: '#a78bfa',
        background: 'rgba(124,58,237,0.15)', borderRight: '1px solid rgba(124,58,237,0.2)',
        height: 48, display: 'flex', alignItems: 'center', flexShrink: 0,
        fontFamily: 'JetBrains Mono, monospace'
    },
    priceInputField: {
        flex: 1, border: 'none', background: 'transparent',
        padding: '0 14px', height: 48,
        color: '#fff', fontSize: 20, fontWeight: 700,
        outline: 'none', fontFamily: 'JetBrains Mono, monospace',
        minWidth: 0
    },
    noteTextarea: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '12px 14px',
        color: 'rgba(255,255,255,0.8)', fontSize: 13,
        fontFamily: 'Manrope, sans-serif',
        outline: 'none', resize: 'none',
        lineHeight: 1.6, transition: 'border-color 0.15s'
    },
    submitBtn: {
        padding: '13px 0', borderRadius: 10, border: 'none',
        background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
        color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        transition: 'all 0.15s', letterSpacing: 0.3,
        boxShadow: '0 4px 16px rgba(124,58,237,0.35)'
    }
};

export default Chat;
