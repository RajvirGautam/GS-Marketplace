import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { chatAPI } from '../../services/api';
import Avatar from '../ui/Avatar';

// ─────────────────────────────────────────────────────────────
//  SVG Icons
// ─────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
);
const InfoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
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
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);
const MicrophoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
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
const DoubleCheckIcon = () => (
    <svg width="18" height="12" viewBox="0 0 28 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left tick */}
        <polyline points="1 7 5 11 11 3" />
        {/* Right tick (offset 8px to the right) */}
        <polyline points="9 7 13 11 19 3" />
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
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
//  Delete Confirm Modal
// ─────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ onClose, onConfirm, deleting }) => {
    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.negotiatorModal} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ ...styles.modalIconWrap, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#EF4444' }}>
                            <TrashIcon />
                        </div>
                        <div>
                            <div style={styles.modalTitle}>Delete Conversation</div>
                            <div style={styles.modalSub}>This action cannot be undone.</div>
                        </div>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}><XIcon /></button>
                </div>

                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.5 }}>
                    Are you sure you want to permanently delete this conversation and all its messages?
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        style={{
                            flex: 1, padding: '12px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', transition: 'background 0.2s'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        style={{
                            flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
                            background: 'rgba(239, 68, 68, 0.8)', color: '#fff', fontSize: 13, fontWeight: 700,
                            cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.5 : 1,
                            transition: 'background 0.2s'
                        }}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const OfferCard = ({ message, currentUserId, onRespond, responding }) => {
    const { offerData, sender } = message;
    const isSender = sender._id === currentUserId || sender._id?.toString() === currentUserId?.toString();
    const isPending = offerData?.status === 'pending';

    const statusColors = {
        pending: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', text: '#FBBF24', label: 'PENDING' },
        accepted: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#34D399', label: 'ACCEPTED' },
        rejected: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#F87171', label: 'DECLINED' }
    };
    const sc = statusColors[offerData?.status] || statusColors.pending;

    return (
        <div style={{
            background: isSender ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${isSender ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: 16,
            padding: '16px 20px',
            width: '280px',
            marginTop: 4,
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)' }}>
                    <TagIcon />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                        Offer
                    </span>
                </div>
                <div style={{
                    background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                    fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
                    letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4
                }}>
                    {offerData?.status === 'accepted' && <CheckIcon />}
                    {offerData?.status === 'rejected' && <XIcon />}
                    {sc.label}
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace', letterSpacing: -0.5 }}>
                    ₹{offerData?.amount?.toLocaleString('en-IN')}
                </div>

                {offerData?.note && (
                    <div style={{
                        fontSize: 13, color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.5, marginBottom: 16,
                        borderLeft: `2px solid rgba(255,255,255,0.2)`,
                        paddingLeft: 10, fontStyle: 'italic'
                    }}>
                        "{offerData.note}"
                    </div>
                )}
            </div>

            {!isSender && isPending && (
                <div style={{ display: 'flex', gap: 8, marginTop: (offerData?.note ? 0 : 16), position: 'relative', zIndex: 1 }}>
                    <button
                        onClick={() => onRespond(message._id, 'accepted')}
                        disabled={responding}
                        style={{
                            flex: 1, padding: '10px 0', borderRadius: 10,
                            background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff'; }}
                    >
                        <CheckIcon /> Accept
                    </button>
                    <button
                        onClick={() => onRespond(message._id, 'rejected')}
                        disabled={responding}
                        style={{
                            flex: 1, padding: '10px 0', borderRadius: 10,
                            background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
                    >
                        <XIcon /> Decline
                    </button>
                </div>
            )}

            {isSender && isPending && (
                <div style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: (offerData?.note ? 0 : 12),
                    display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1
                }}>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'rgba(255,255,255,0.8)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Waiting for response...
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Message Bubble
// ─────────────────────────────────────────────────────────────
const MessageBubble = ({ message, currentUserId, onRespond, responding }) => {
    const navigate = useNavigate();
    const isMine = message.sender?._id === currentUserId || message.sender?._id?.toString() === currentUserId?.toString();

    return (
        <div style={{
            display: 'flex',
            flexDirection: isMine ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: 8,
            marginBottom: 8,
            width: '100%',
        }}>
            {/* Avatar */}
            {!isMine && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <div
                        onClick={(e) => { e.stopPropagation(); message.sender?._id && navigate(`/seller/${message.sender._id}`); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Avatar
                            src={message.sender?.profilePicture}
                            name={message.sender?.fullName || message.sender?.name || 'User'}
                            size={30}
                        />
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', maxWidth: 44, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {((message.sender?.fullName) || '').split(' ')[0] || 'User'}
                    </div>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                        {formatTime(message.createdAt)}
                    </span>
                    {isMine && message.type !== 'offer' && (
                        message.readBy?.some(id => id.toString() !== currentUserId?.toString()) ? (
                            <span style={{ color: '#00D9FF' }} title="Read">
                                <DoubleCheckIcon />
                            </span>
                        ) : (
                            <span style={{ color: 'rgba(255,255,255,0.4)' }} title="Sent">
                                <CheckIcon />
                            </span>
                        )
                    )}
                </div>
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

    const isUnread = !isActive && conv.unreadCount > 0;

    return (
        <button
            onClick={onClick}
            style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '12px 16px',
                borderRadius: '16px',
                marginBottom: '8px',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 12,
                position: 'relative'
            }}
        >
            {/* Avatar */}
            <Avatar
                src={other?.profilePicture}
                name={other?.fullName || other?.name || 'Unknown'}
                size={42}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
                {/* Row 1: Name • ProductName (scrollable) + Time */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <span style={{
                            color: isUnread ? '#fff' : 'rgba(255,255,255,0.9)',
                            fontSize: 14,
                            fontWeight: isUnread ? 800 : 600,
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}>
                            {other?.fullName || 'Unknown'}
                        </span>
                        {conv.product?.title && (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 6px', flexShrink: 0, fontSize: 13 }}>•</span>
                                <span className="marquee-wrap" style={{ color: 'inherit' }} title={conv.product.title}>
                                    <span
                                        className="marquee-inner"
                                        style={{
                                            color: isUnread ? '#00D9FF' : 'rgba(0,217,255,0.6)',
                                            fontSize: 12,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {/* Duplicate the span for a seamless cyclic CSS scroll */}
                                        <span style={{ paddingRight: '20px' }}>{conv.product.title}</span>
                                        <span aria-hidden="true" style={{ paddingRight: '20px' }}>{conv.product.title}</span>
                                    </span>
                                </span>
                            </>
                        )}
                        {isUnread && (
                            <div style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: '#00D9FF', boxShadow: '0 0 8px #00D9FF',
                                marginLeft: 6, flexShrink: 0
                            }} />
                        )}
                    </div>
                    <span style={{
                        color: isUnread ? '#00D9FF' : 'rgba(255,255,255,0.3)',
                        fontSize: 10, fontWeight: isUnread ? 700 : 400,
                        fontFamily: 'JetBrains Mono, monospace', flexShrink: 0
                    }}>
                        {timeAgo(conv.lastMessageAt || lastMsg?.createdAt)}
                    </span>
                </div>

                {/* Row 2: Message preview */}
                <div style={{
                    color: isUnread ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                    fontWeight: isUnread ? 600 : 400,
                    fontSize: 12,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
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
    const { socket, markConversationRead } = useSocket();

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingChat, setDeletingChat] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(null); // { file, url, type }
    const [uploading, setUploading] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const pollRef = useRef(null);
    const shouldScrollRef = useRef(false); // true only when we explicitly want to jump to bottom

    // Derived: active conversation object
    const activeConv = conversations.find(c => c._id === activeConvId);
    const otherParticipant = activeConv?.participants?.find(
        p => p._id !== (user?.id || user?._id) && p._id?.toString() !== (user?.id || user?._id)?.toString()
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
    const fetchMessages = useCallback(async (convId, updateConvList = false) => {
        if (!convId) return;
        try {
            const res = await chatAPI.getMessages(convId);
            if (res.success) {
                setMessages(res.messages || []);
                // After fetching messages (which marks them as read server-side):
                if (updateConvList) {
                    fetchConversations();      // refresh conv list unread dots
                    markConversationRead();    // sync the global chat badge in navbar
                }
            }
        } catch (e) {
            console.error('Failed to fetch messages', e);
        }
    }, [fetchConversations, markConversationRead]);

    // ── Initial load ──
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // ── Real-time: receive new messages via socket ──
    useEffect(() => {
        if (!socket || !activeConvId) return;
        const handleNewMessage = ({ conversationId: convId, message }) => {
            if (convId === activeConvId) {
                // Append the message directly — no need to poll
                setMessages(prev => {
                    if (prev.some(m => m._id === message._id)) return prev; // dedupe
                    return [...prev, message];
                });
                shouldScrollRef.current = true;
                // Mark it read immediately since we're looking at this convo
                markConversationRead();
            }
            // Always refresh conversation list so preview/time update
            fetchConversations();
        };

        const handleMessagesRead = ({ conversationId: convId, readByUserId }) => {
            if (convId === activeConvId) {
                setMessages(prev => prev.map(msg => {
                    if (!msg.readBy.includes(readByUserId)) {
                        return { ...msg, readBy: [...msg.readBy, readByUserId] };
                    }
                    return msg;
                }));
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, activeConvId, fetchConversations, markConversationRead]);

    // ── Load messages on conversation change ──
    useEffect(() => {
        if (!activeConvId) return;
        setMsgsLoading(true);
        setIsScrolledToBottom(false);
        // Pass true so that after marking messages as read, conversations are refreshed (clears unread dot)
        fetchMessages(activeConvId, true).finally(() => setMsgsLoading(false));

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
        setActiveConvId(conversationId || null);
    }, [conversationId]);

    // ── Scroll to bottom (only when near bottom or explicitly triggered) ──
    useLayoutEffect(() => {
        const area = messagesAreaRef.current;
        if (!area) return;

        if (!isScrolledToBottom) {
            if (!msgsLoading || messages.length > 0) {
                area.scrollTop = area.scrollHeight;
                setIsScrolledToBottom(true);
            }
            return;
        }

        if (shouldScrollRef.current) {
            // Explicit jump (conversation switch or message sent by us)
            area.scrollTop = area.scrollHeight;
            shouldScrollRef.current = false;
        } else {
            // Poll update: only scroll if already near the bottom
            const distFromBottom = area.scrollHeight - area.scrollTop - area.clientHeight;
            if (distFromBottom < 150) {
                area.scrollTo({ top: area.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages, isScrolledToBottom, msgsLoading]);

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

    // ── Delete Conversation ──
    const handleDeleteConversation = async () => {
        if (!activeConvId) return;
        setDeletingChat(true);
        try {
            const res = await chatAPI.deleteConversation(activeConvId);
            if (res.success) {
                setConversations(prev => prev.filter(c => c._id !== activeConvId));
                setActiveConvId(null);
                setMessages([]);
                setShowDeleteModal(false);
                navigate('/chat', { replace: true });
            }
        } catch (e) {
            console.error('Failed to delete conversation', e);
        } finally {
            setDeletingChat(false);
        }
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
        setIsScrolledToBottom(false);
        // On mobile: push a history entry so browser "back" goes to inbox (/chat) not the previous app route
        if (window.innerWidth <= 768) {
            window.history.pushState({ chatInbox: true }, '', '/chat');
            window.history.pushState({ chatConv: convId }, '', `/chat/${convId}`);
        }
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
            repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.06) 59px, rgba(255,255,255,0.06) 60px),
            repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.06) 59px, rgba(255,255,255,0.06) 60px);
          will-change: transform;
          transform: translateZ(0);
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-wrap {
          display: inline-block;
          max-width: 120px;
          overflow: hidden;
          vertical-align: bottom;
          /* prevent the duplicate text from making the parent span taller */
          white-space: nowrap;
        }
        .marquee-inner {
          display: inline-block;
          white-space: nowrap;
          /* Linear, infinite loop, not alternating */
          animation: marquee-scroll 8s linear infinite;
          will-change: transform;
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
          padding: 20px;
          gap: 20px;
        }

        /* ── Conv list ── */
        .conv-list {
          width: 320px; flex-shrink: 0;
          display: flex; flex-direction: column;
          background: rgba(12,12,12,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          overflow: hidden;
        }
        .conv-list-header {
          padding: 20px 20px 10px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 10px 16px;
          color: rgba(255, 255, 255, 0.6);
        }
        .search-bar input {
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          width: 100%;
        }
        .search-bar input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .conv-list-body { flex: 1; overflow-y: auto; padding: 0 12px 12px 12px; }
        .conv-list-body::-webkit-scrollbar { width: 4px; }
        .conv-list-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* ── Thread ── */
        .chat-thread {
          flex: 1; display: flex; flex-direction: column;
          background: rgba(10,10,10,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
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
          padding: 16px 20px 20px 20px;
          background: transparent;
          display: flex; flex-direction: column; flex-shrink: 0;
        }
        .input-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 8px 12px;
        }
        .input-field {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          resize: none;
          outline: none;
          max-height: 80px;
          line-height: 20px;
          align-self: center;
          padding: 10px 0;
        }
        .input-field:focus { border-color: rgba(0,217,255,0.4); }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }

        .icon-btn {
          width: 40px; height: 40px; border-radius: 50%; border: none;
          background: transparent; cursor: pointer;
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
          width: 40px; height: 40px; border-radius: 50%; border: none;
          background: transparent;
          cursor: pointer; color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .offer-btn:hover { background: rgba(255,255,255,0.1); color: #a78bfa; }
        
        /* ── Product Info Sidebar ── */
        .product-sidebar {
          width: 320px; flex-shrink: 0;
          display: flex; flex-direction: column;
          background: rgba(12,12,12,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 24px;
          overflow-y: auto;
          transition: transform 0.3s ease;
        }
        .mobile-sidebar-close { display: none; }
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }

        @media (max-width: 1024px) {
          .product-sidebar { display: none; }
          .product-sidebar.mobile-open {
            display: flex;
            position: fixed;
            top: 0; right: 0; bottom: 0;
            width: 340px;
            z-index: 1000;
            background: rgba(10,10,10,0.95);
            backdrop-filter: blur(20px);
            border: none; border-left: 1px solid rgba(255,255,255,0.1);
            border-radius: 0;
            padding-top: env(safe-area-inset-top, 24px);
            padding-bottom: env(safe-area-inset-bottom, 24px);
            box-shadow: -10px 0 40px rgba(0,0,0,0.5);
            animation: slideInRight 0.3s ease-out;
          }
          .mobile-sidebar-close {
            display: flex; justify-content: flex-end; padding-bottom: 20px;
            cursor: pointer; color: rgba(255,255,255,0.6);
          }
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }
        @media (max-width: 768px) {
          .chat-root { height: 100vh; height: 100dvh; }
          .chat-body { padding: 0; gap: 0; flex-direction: column; padding-bottom: env(safe-area-inset-bottom); }
          .conv-list, .chat-thread, .product-sidebar { 
             width: 100%; border-radius: 0; border: none; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .chat-topbar { padding: 0 16px; min-height: 60px; }
          .conv-list { display: ${activeConvId ? 'none' : 'flex'}; border-right: none; }
          .chat-thread { display: ${activeConvId ? 'flex' : 'none'}; border-radius: 0; border: none; }
          .product-sidebar.mobile-open { width: 100%; border-left: none; }
        }

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

        /* Navigation Buttons */
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }
        @media (max-width: 768px) {
          .nav-btn-text { display: none; }
          .nav-btn { padding: 8px; border-radius: 8px; }
          .conversation-count { display: none !important; }
        }

        /* Scrollbar for conv list */
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
      `}</style>

            <div className="chat-root">
                <div className="chat-grid-bg" />

                {/* Topbar */}
                <div className="chat-topbar">
                    <button
                        onClick={() => {
                            if (activeConvId && window.innerWidth <= 768) {
                                navigate('/chat', { replace: true });
                            } else {
                                navigate(-1);
                            }
                        }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 10px', borderRadius: 8, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                        <ArrowLeftIcon /> Back
                    </button>
                    <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D9FF', boxShadow: '0 0 6px #00D9FF' }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Messages</span>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => navigate('/marketplace')}
                                className="nav-btn"
                                title="Marketplace"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                <span className="nav-btn-text">Marketplace</span>
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="nav-btn"
                                title="Dashboard"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                                <span className="nav-btn-text">Dashboard</span>
                            </button>
                        </div>
                        <div className="conversation-count" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
                            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="chat-body">
                    {/* ── Conversation List ── */}
                    <div className="conv-list">
                        <div className="conv-list-header">
                            <div className="search-bar">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="conv-list-body">
                            {convsLoading ? (
                                <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading…</div>
                            ) : conversations.length === 0 ? (
                                <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.25)' }}>
                                    <MessageBubbleIcon />
                                    <span style={{ fontSize: 13 }}>No chats yet</span>
                                </div>
                            ) : (
                                conversations.filter(c => {
                                    const other = c.participants?.find(p => p._id !== (user?.id || user?._id) && p._id?.toString() !== (user?.id || user?._id)?.toString()) || c.participants?.[0];
                                    return other?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        c.product?.title?.toLowerCase().includes(searchQuery.toLowerCase());
                                }).map(conv => (
                                    <ConvItem
                                        key={conv._id}
                                        conv={conv}
                                        currentUserId={user?.id || user?._id}
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
                                    <div
                                        onClick={() => otherParticipant?._id && navigate(`/seller/${otherParticipant._id}`)}
                                        style={{ cursor: 'pointer' }}
                                        title="View Profile"
                                    >
                                        <Avatar
                                            src={otherParticipant?.profilePicture}
                                            name={otherParticipant?.fullName || otherParticipant?.name || 'User'}
                                            size={38}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            onClick={() => otherParticipant?._id && navigate(`/seller/${otherParticipant._id}`)}
                                            style={{ fontWeight: 700, fontSize: 14, color: '#fff', cursor: 'pointer', display: 'block' }}
                                            title="View Profile"
                                        >
                                            {otherParticipant?.fullName || 'User'}
                                        </div>
                                        {activeConv?.product && (
                                            <div
                                                onClick={() => navigate(`/product/${activeConv.product._id}`, { state: { fromChat: true, conversationId: activeConvId } })}
                                                style={{ fontSize: 11, color: 'rgba(0,217,255,0.7)', display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                                                title="View Product"
                                            >
                                                <TagIcon />
                                                <span
                                                    style={{ textDecoration: 'none' }}
                                                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                                                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                                                >
                                                    {activeConv.product.title}
                                                </span>
                                                {activeConv.product.price && (
                                                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>· ₹{activeConv.product.price}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {activeConv?.product?.images?.[0] && (
                                            <img
                                                src={activeConv.product.images[0]}
                                                alt="product"
                                                onClick={() => navigate(`/product/${activeConv.product._id}`, { state: { fromChat: true, conversationId: activeConvId } })}
                                                title="View Product"
                                                style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                            />
                                        )}
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            style={{
                                                width: 36, height: 36, borderRadius: 8, border: 'none',
                                                background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                            }}
                                            title="Delete Chat"
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                        >
                                            <TrashIcon />
                                        </button>
                                        <button
                                            className="mobile-only"
                                            onClick={() => setShowMobileSidebar(true)}
                                            style={{
                                                width: 36, height: 36, borderRadius: 8, border: 'none',
                                                background: 'rgba(255, 255, 255, 0.05)', color: '#fff',
                                                alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                            }}
                                        >
                                            <InfoIcon />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages — fade in once loaded & scrolled to bottom */}
                                <div className="messages-area" ref={messagesAreaRef} style={{ opacity: isScrolledToBottom ? 1 : 0, transition: 'opacity 0.25s ease-in' }}>
                                    {messages.length === 0 && !msgsLoading && isScrolledToBottom ? (
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, paddingTop: 40 }}>
                                            No messages yet. Say hi! 👋
                                        </div>
                                    ) : (
                                        messages.map(msg => (
                                            <MessageBubble
                                                key={msg._id}
                                                message={msg}
                                                currentUserId={user?.id || user?._id}
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

                                <div className="input-bar">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFilePick}
                                        style={{ display: 'none' }}
                                        accept="image/*,video/mp4,application/pdf"
                                    />
                                    <div className="input-pill">
                                        <button
                                            className="icon-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Attach media"
                                        >
                                            <PaperclipIcon />
                                        </button>
                                        <textarea
                                            className="input-field"
                                            placeholder="Your message"
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            rows={1}
                                        />
                                        <button
                                            className="offer-btn"
                                            onClick={() => setShowNegotiator(true)}
                                            title="Make a price offer"
                                        >
                                            <DollarIcon />
                                        </button>
                                        <button className="icon-btn" title="Voice Message (Mock)">
                                            <MicrophoneIcon />
                                        </button>
                                        <button
                                            className="send-btn" style={{ background: 'transparent', color: inputText.trim() ? '#00D9FF' : 'rgba(255,255,255,0.3)', boxShadow: 'none' }}
                                            onClick={handleSend}
                                            disabled={!inputText.trim() || sending}
                                            title="Send message"
                                        >
                                            <SendIcon />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Product Info Sidebar (3rd Column) ── */}
                    {activeConvId && activeConv?.product && (
                        <>
                            {showMobileSidebar && (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }} onClick={() => setShowMobileSidebar(false)} />
                            )}
                            <div className={`product-sidebar ${showMobileSidebar ? 'mobile-open' : ''}`}>
                                <div className="mobile-sidebar-close" onClick={() => setShowMobileSidebar(false)}>
                                    <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <XIcon />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <span style={{ fontSize: 18, fontWeight: 700 }}>Listing Info</span>
                                </div>

                                <img
                                    src={activeConv.product.images?.[0] || activeConv.product.image || '/placeholder.jpg'}
                                    alt="product"
                                    style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 16, marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)' }}
                                />

                                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
                                    {activeConv.product.title}
                                </div>

                                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                    <span style={{ padding: '4px 8px', background: 'rgba(0,217,255,0.1)', color: '#00D9FF', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                                        {activeConv.product.condition || 'Used'}
                                    </span>
                                    <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                                        {activeConv.product.category || 'Product'}
                                    </span>
                                </div>

                                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 24, fontFamily: 'JetBrains Mono, monospace' }}>
                                    {activeConv.product.type === 'free' ? <span style={{ color: '#10B981' }}>FREE</span>
                                        : activeConv.product.type === 'barter' ? <span style={{ color: '#a78bfa' }}>BARTER</span>
                                            : `₹${activeConv.product.price}`}
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {/* Description */}
                                    {activeConv.product.description && (
                                        <div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Description</div>
                                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, wordBreak: 'break-word', fontWeight: 500 }}>
                                                {activeConv.product.description}
                                            </div>
                                        </div>
                                    )}

                                    {/* Highlights — always show when present */}
                                    {activeConv.product.highlights?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Highlights</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                {activeConv.product.highlights.map((h, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                                                        <span style={{ color: '#00D9FF', flexShrink: 0, marginTop: 2, fontSize: 10 }}>◆</span>
                                                        <span>{h}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Specs */}
                                    {activeConv.product.specs && (typeof activeConv.product.specs === 'object') && (
                                        <div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Specifications</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {Array.isArray(activeConv.product.specs) ? (
                                                    activeConv.product.specs.map((spec, idx) => (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>
                                                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{spec.label || spec.name || spec}</span>
                                                            <span style={{ color: '#fff', fontWeight: 600 }}>{spec.value}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    Object.entries(activeConv.product.specs).map(([key, val]) => (
                                                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>
                                                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{key}</span>
                                                            <span style={{ color: '#fff', fontWeight: 600 }}>{val}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Date Created */}
                                    {(activeConv.product.createdAt || activeConv.product.timeAgo) && (
                                        <div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Details</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Listed</span>
                                                <span style={{ color: '#fff', fontWeight: 600 }}>
                                                    {activeConv.product.createdAt ? new Date(activeConv.product.createdAt).toLocaleDateString() : activeConv.product.timeAgo}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Price Negotiator Modal */}
            {
                showNegotiator && (
                    <PriceNegotiatorModal
                        onClose={() => setShowNegotiator(false)}
                        onSubmit={handleSendOffer}
                        productPrice={activeConv?.product?.price}
                        sending={offerSending}
                    />
                )
            }

            {/* Delete Negotiator Modal */}
            {
                showDeleteModal && (
                    <DeleteConfirmModal
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteConversation}
                        deleting={deletingChat}
                    />
                )
            }
        </>
    );
};

// ─────────────────────────────────────────────────────────────
//  Modal styles (defined out of render to avoid re-creation)
// ─────────────────────────────────────────────────────────────
const styles = {
    modalOverlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999, padding: 20,
        animation: 'fadeIn 0.2s ease-out'
    },
    negotiatorModal: {
        background: '#0a0a0a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        padding: 32,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 32px 64px rgba(0,0,0,0.8)',
        display: 'flex', flexDirection: 'column', gap: 24,
        position: 'relative',
        overflow: 'hidden'
    },
    modalHeader: {
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        position: 'relative', zIndex: 1
    },
    modalIconWrap: {
        width: 48, height: 48, borderRadius: 14,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff'
    },
    modalTitle: { fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: -0.5 },
    modalSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
    closeBtn: {
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
        color: 'rgba(255,255,255,0.6)', width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', marginTop: 4
    },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 },
    fieldLabel: { fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.3 },
    priceInput: {
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 14, overflow: 'hidden',
        transition: 'all 0.2s'
    },
    currencyBadge: {
        padding: '0 20px', fontSize: 20, fontWeight: 700, color: '#fff',
        background: 'rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.1)',
        height: 56, display: 'flex', alignItems: 'center', flexShrink: 0,
        fontFamily: 'JetBrains Mono, monospace'
    },
    priceInputField: {
        flex: 1, border: 'none', background: 'transparent',
        padding: '0 16px', height: 56,
        color: '#fff', fontSize: 24, fontWeight: 800,
        outline: 'none', fontFamily: 'JetBrains Mono, monospace',
        minWidth: 0, letterSpacing: -0.5
    },
    noteTextarea: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 14, padding: '16px',
        color: '#fff', fontSize: 14,
        fontFamily: 'Manrope, sans-serif',
        outline: 'none', resize: 'none',
        lineHeight: 1.6, transition: 'all 0.2s'
    },
    submitBtn: {
        padding: '16px 0', borderRadius: 14, border: 'none',
        background: '#fff',
        color: '#000', fontSize: 15, fontWeight: 800, cursor: 'pointer',
        transition: 'all 0.2s', letterSpacing: 0.5, textTransform: 'uppercase',
        boxShadow: '0 4px 12px rgba(255,255,255,0.2)',
        marginTop: 8, position: 'relative', zIndex: 1
    }
};

export default Chat;
