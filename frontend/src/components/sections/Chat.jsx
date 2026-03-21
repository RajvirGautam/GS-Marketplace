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
const ChevronLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);
const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
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
    const isSender = sender?._id === currentUserId || sender?._id?.toString() === currentUserId?.toString();
    const isPending = offerData?.status === 'pending';

    const statusConfig = {
        pending: { 
            bg: 'rgba(234, 179, 8, 0.15)', 
            border: 'transparent', 
            text: '#FCD34D', 
            label: 'PENDING',
            glow: 'rgba(234, 179, 8, 0.2)'
        },
        accepted: { 
            bg: 'rgba(16, 185, 129, 0.15)', 
            border: 'transparent', 
            text: '#6EE7B7', 
            label: 'ACCEPTED',
            glow: 'rgba(16, 185, 129, 0.2)'
        },
        rejected: { 
            bg: 'rgba(239, 68, 68, 0.15)', 
            border: 'transparent', 
            text: '#FCA5A5', 
            label: 'DECLINED',
            glow: 'rgba(239, 68, 68, 0.2)'
        }
    };
    const sc = statusConfig[offerData?.status] || statusConfig.pending;

    return (
        <div style={{
            background: 'linear-gradient(145deg, rgba(30,30,42,0.95), rgba(20,20,28,0.95))',
            border: `1px solid rgba(255,255,255,0.08)`,
            borderTop: `2px solid ${isSender ? '#7C72FF' : '#3DD68C'}`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
            borderRadius: 20,
            padding: '16px 20px',
            width: '290px',
            marginTop: 6,
            backdropFilter: 'blur(16px)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Soft background glow based on status */}
            <div style={{
                position: 'absolute', top: -50, right: -50, width: 120, height: 120,
                background: sc.glow, borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)' }}>
                    <div style={{
                        width: 24, height: 24, borderRadius: 8, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <TagIcon />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        PRICE OFFER
                    </span>
                </div>
                <div style={{
                    background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                    fontSize: 9, fontWeight: 800, padding: '4px 8px', borderRadius: 100,
                    letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4,
                    boxShadow: `0 0 12px ${sc.glow}`
                }}>
                    {offerData?.status === 'accepted' && <CheckIcon />}
                    {offerData?.status === 'rejected' && <XIcon />}
                    {sc.label}
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1, marginBottom: 14 }}>
                <div style={{ 
                    fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 6, 
                    fontFamily: 'JetBrains Mono, monospace', letterSpacing: -1,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>
                    ₹{offerData?.amount?.toLocaleString('en-IN')}
                </div>

                {offerData?.note && (
                    <div style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        padding: '10px 14px',
                        fontSize: 13, color: 'rgba(255,255,255,0.75)',
                        lineHeight: 1.5,
                        fontStyle: 'italic',
                        position: 'relative'
                    }}>
                        <span style={{ position: 'relative', zIndex: 2 }}>"{offerData.note}"</span>
                    </div>
                )}
            </div>

            {!isSender && isPending && (
                <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
                    <button
                        onClick={() => onRespond(message._id, 'accepted')}
                        disabled={responding}
                        style={{
                            flex: 1, padding: '12px 0', borderRadius: 12, border: 'none',
                            background: 'linear-gradient(135deg, #3DD68C, #28C76F)',
                            color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(40,199,111,0.3)',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(40,199,111,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(40,199,111,0.3)'; }}
                    >
                        <CheckIcon /> ACCEPT
                    </button>
                    <button
                        onClick={() => onRespond(message._id, 'rejected')}
                        disabled={responding}
                        style={{
                            flex: 1, padding: '12px 0', borderRadius: 12,
                            background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#FCA5A5'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <XIcon /> DECLINE
                    </button>
                </div>
            )}

            {isSender && isPending && (
                <div style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.4)',
                    display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1,
                    background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#7C72FF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontWeight: 600 }}>Waiting for response...</span>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
//  Message Bubble
// ─────────────────────────────────────────────────────────────
const MessageBubble = ({ message, currentUserId, currentUser, onRespond, responding, isFirstInGroup = true, isLastInGroup = true, onImageClick }) => {
    const navigate = useNavigate();
    const isMine = message.sender?._id === currentUserId || message.sender?._id?.toString() === currentUserId?.toString();
    const isRead = message.readBy?.some(id => id.toString() !== currentUserId?.toString());

    const sentBg = 'linear-gradient(145deg, #10B981, #059669)';
    const recvBg = '#1E1E24';

    const bubbleContent = message.type === 'offer' ? (
        <OfferCard message={message} currentUserId={currentUserId} onRespond={onRespond} responding={responding} />
    ) : message.type === 'media' ? (
        <div style={{
            background: isMine ? sentBg : recvBg,
            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            overflow: 'hidden', maxWidth: 260,
            boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
        }}>
            {message.mediaType === 'image' ? (
                <div style={{ position: 'relative', display: 'block' }}>
                    <img src={message.mediaUrl} alt="media"
                        onLoad={() => {
                            if (message._optimistic) {
                                const area = document.querySelector('.messages-area');
                                if (area) area.scrollTop = area.scrollHeight;
                            }
                        }}
                        style={{ width: '100%', minHeight: 200, maxHeight: 220, objectFit: 'cover', display: 'block', cursor: message._optimistic ? 'default' : 'pointer', filter: message._optimistic ? 'brightness(0.6)' : 'none', transition: 'filter 0.2s' }}
                        onClick={() => !message._optimistic && (onImageClick ? onImageClick(message._id) : window.open(message.mediaUrl, '_blank'))} />
                    {message._optimistic && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, pointerEvents: 'none' }}>
                            <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                            <span style={{ color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, opacity: 0.9 }}>Sending...</span>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ color: isMine ? 'rgba(255,255,255,0.8)' : '#34C759' }}><PaperclipIcon /></div>
                    <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer"
                        style={{ color: isMine ? '#fff' : '#34C759', fontSize: 13, textDecoration: 'none' }}>
                        {message.mediaType === 'video' ? '📹 Video' : '📎 File'}
                    </a>
                </div>
            )}
            {message.content && (
                <div style={{ padding: '6px 14px 10px', fontSize: 13, color: '#fff' }}>{message.content}</div>
            )}
        </div>
    ) : (
        <div style={{
            background: isMine ? sentBg : recvBg,
            color: '#fff',
            padding: '10px 14px',
            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            fontSize: 14.5,
            lineHeight: 1.5,
            fontWeight: 400,
            boxShadow: isMine ? '0 4px 20px rgba(40,199,111,0.28)' : '0 2px 10px rgba(0,0,0,0.25)',
            maxWidth: 280,
        }}>
            {message.content}
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: isMine ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: 8,
            marginBottom: isLastInGroup ? 16 : 2,
            width: '100%',
        }}>
            {/* Avatar (only for receiver) */}
            {!isMine && (
                <div style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: 2, width: 30, opacity: isFirstInGroup ? 1 : 0, visibility: isFirstInGroup ? 'visible' : 'hidden' }}>
                    {isFirstInGroup && (
                        <Avatar
                            src={message.sender?.profilePicture}
                            name={message.sender?.fullName || 'User'}
                            size={30}
                        />
                    )}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', gap: 3, maxWidth: isMine ? '85%' : '72%' }}>
                {bubbleContent}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>
                        {formatTime(message.createdAt)}
                    </span>
                    {isMine && message.type !== 'offer' && (
                        isRead
                            ? <span style={{ color: 'rgba(255,255,255,0.4)' }}><DoubleCheckIcon /></span>
                            : <span style={{ color: 'rgba(255,255,255,0.28)' }}><CheckIcon /></span>
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
                width: '100%', textAlign: 'left', border: 'none',
                padding: '14px 16px',
                borderRadius: '20px',
                marginBottom: '10px',
                cursor: 'pointer',
                background: isActive
                    ? 'rgba(255,255,255,0.08)'
                    : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isActive ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', gap: 14,
                position: 'relative'
            }}
        >
            {/* Avatar with online dot */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar
                    src={other?.profilePicture}
                    name={other?.fullName || other?.name || 'Unknown'}
                    size={46}
                />

            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                {/* Row 1: Name + Time */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, gap: 8 }}>
                    <span style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: isUnread ? 800 : 600,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                        {other?.fullName || 'Unknown'}
                    </span>
                    <span style={{
                        color: isUnread ? '#A78BFA' : 'rgba(255,255,255,0.3)',
                        fontSize: 11, fontWeight: isUnread ? 700 : 400,
                        flexShrink: 0
                    }}>
                        {timeAgo(conv.lastMessageAt || lastMsg?.createdAt)}
                    </span>
                </div>

                {/* Row 2: Preview + Unread badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{
                        color: isUnread ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                        fontWeight: isUnread ? 600 : 400,
                        fontSize: 13,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
                    }}>
                        {preview}
                    </div>
                    {isUnread && (
                        <div style={{
                            minWidth: 22, height: 22, borderRadius: 11,
                            background: 'linear-gradient(135deg, #7C72FF, #6C63FF)',
                            color: '#fff', fontSize: 11, fontWeight: 800,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0 6px', flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(108,99,255,0.3)'
                        }}>
                            {conv.unreadCount}
                        </div>
                    )}
                </div>

                {/* Product tag if present */}
                {conv.product?.title && (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{
                            padding: '2px 8px', borderRadius: 8,
                            background: 'rgba(108,99,255,0.15)',
                            border: '1px solid rgba(108,99,255,0.25)',
                            color: '#A78BFA', fontSize: 11, fontWeight: 600,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160
                        }}>
                            {conv.product.title}
                        </div>
                        {conv.product.status === 'sold' && (
                            <div style={{
                                padding: '2px 6px', borderRadius: 6,
                                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                                color: '#F87171', fontSize: 10, fontWeight: 700
                            }}>SOLD</div>
                        )}
                    </div>
                )}
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
    // Socket Context
    const {
        socket, unreadCount, markConversationRead,
        toasts, dismissToast
    } = useSocket();

    const [conversations, setConversations] = useState([]);
    const [activeConvId, setActiveConvId] = useState(conversationId || null);

    // ── Fixes for scroll, sidebar reset & hw back nav ─────────────────────────
    useEffect(() => {
        window.scrollTo(0, 0); // Open chat page unscrolled

        const handlePopState = (e) => {
            // Hardware back on mobile -> if in inbox goes to marketplace
            if (!activeConvId && window.innerWidth <= 768) {
                navigate('/marketplace');
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeConvId, navigate]);

    // Clear mobile sidebar when changing/exiting convs
    useEffect(() => {
        setShowMobileSidebar(false);
    }, [activeConvId]);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [responding, setResponding] = useState(false);
    const [convsLoading, setConvsLoading] = useState(true);
    const [msgsLoading, setMsgsLoading] = useState(false);
    const [showInboxMenu, setShowInboxMenu] = useState(false);
    const [showNegotiator, setShowNegotiator] = useState(false);
    const [offerSending, setOfferSending] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingChat, setDeletingChat] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(null); // { file, url, type, uploadedUrl, mediaType }
    const [uploading, setUploading] = useState(false);
    const uploadPromiseRef = useRef(null); // tracks the in-progress preemptive upload
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [fullScreenImageId, setFullScreenImageId] = useState(null);

    const imageMessages = messages.filter(m => m.mediaType === 'image');
    const currentImageIndex = imageMessages.findIndex(m => m._id === fullScreenImageId);
    const currentImageMessage = currentImageIndex >= 0 ? imageMessages[currentImageIndex] : null;

    useEffect(() => {
        if (!fullScreenImageId) return;
        const handleGalleryKey = (e) => {
            if (e.key === 'Escape') setFullScreenImageId(null);
            if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
                setFullScreenImageId(imageMessages[currentImageIndex - 1]._id);
            }
            if (e.key === 'ArrowRight' && currentImageIndex < imageMessages.length - 1) {
                setFullScreenImageId(imageMessages[currentImageIndex + 1]._id);
            }
        };
        window.addEventListener('keydown', handleGalleryKey);
        return () => window.removeEventListener('keydown', handleGalleryKey);
    }, [fullScreenImageId, currentImageIndex, imageMessages]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState('direct');
    const [showThreadMenu, setShowThreadMenu] = useState(false);

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

    // ── Compress image before upload (canvas resize + JPEG re-encode) ──
    const compressImage = (file) => new Promise((resolve) => {
        if (!file.type.startsWith('image/') || file.type === 'image/gif') { resolve(file); return; }
        const img = new Image();
        const blobUrl = URL.createObjectURL(file);
        img.onload = () => {
            const MAX = 1280;
            let { width, height } = img;
            if (width > MAX || height > MAX) {
                const ratio = Math.min(MAX / width, MAX / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(blobUrl);
            canvas.toBlob(blob => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })), 'image/jpeg', 0.82);
        };
        img.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(file); };
        img.src = blobUrl;
    });

    // ── Handle file pick — compress + start upload immediately ──
    const handleFilePick = async (e) => {
        const raw = e.target.files?.[0];
        if (!raw) return;
        e.target.value = '';
        const type = raw.type.startsWith('image/') ? 'image' : raw.type.startsWith('video/') ? 'video' : 'file';
        const file = type === 'image' ? await compressImage(raw) : raw;
        const localUrl = URL.createObjectURL(file);
        setMediaPreview({ file, url: localUrl, type, uploadedUrl: null, mediaType: type });

        // Kick off Cloudinary upload right now — store the promise for handleMediaSend to await
        const promise = chatAPI.uploadMedia(file).then(res => {
            if (res.success) {
                setMediaPreview(prev => prev ? { ...prev, uploadedUrl: res.url, mediaType: res.mediaType } : prev);
                return res;
            }
        }).catch(err => { console.error('Pre-upload failed', err); return null; });
        uploadPromiseRef.current = promise;
    };

    // ── Send media — optimistic bubble first, then confirm with server ──
    const handleMediaSend = async () => {
        if (!mediaPreview || !activeConvId) return;
        setUploading(true);
        shouldScrollRef.current = true;

        const caption = inputText.trim();
        const { url: localUrl, type, mediaType, file: pendingFile } = mediaPreview;
        const pendingUpload = uploadPromiseRef.current;
        uploadPromiseRef.current = null;

        // Optimistic message shown immediately
        const optimisticId = `opt-${Date.now()}`;
        const optimisticMsg = {
            _id: optimisticId,
            clientId: optimisticId,
            type: 'media',
            content: caption,
            mediaUrl: localUrl,
            mediaType: mediaType || type,
            sender: { _id: user?.id || user?._id, fullName: user?.fullName, profilePicture: user?.profilePicture },
            createdAt: new Date().toISOString(),
            _optimistic: true,
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setMediaPreview(null);
        setInputText('');

        try {
            // Await the pre-upload (likely already done — no extra round-trip)
            const uploadRes = await Promise.resolve(pendingUpload);

            let confirmed;
            if (uploadRes?.success) {
                // Fast path: upload done, just create the message record
                const res = await chatAPI.sendMediaMessage(activeConvId, uploadRes.url, uploadRes.mediaType, caption);
                confirmed = res.success ? res.message : null;
            } else {
                // Fallback: upload + send in one shot (pre-upload failed or wasn't started)
                const res = await chatAPI.sendMedia(activeConvId, pendingFile, caption);
                confirmed = res.success ? res.message : null;
            }

            if (confirmed) {
                // Ensure clientId carries over so React key stays stable
                confirmed.clientId = optimisticId;
                
                // Preload the Cloudinary URL so the browser has it cached before we replace it
                if (confirmed.mediaType === 'image' && confirmed.mediaUrl) {
                    await new Promise(resolve => {
                        const pre = new Image();
                        pre.onload = resolve;
                        pre.onerror = resolve;
                        pre.src = confirmed.mediaUrl;
                    });
                }
                // Swap optimistic bubble with real message
                setMessages(prev => prev.map(m => m._id === optimisticId ? confirmed : m));
                
                // Delay blob destruction so React has time to render the new remote image, preventing blink
                setTimeout(() => URL.revokeObjectURL(localUrl), 1000);
                
                shouldScrollRef.current = true;
                fetchConversations();
            }
        } catch (e) {
            console.error('Failed to send media', e);
            // Remove optimistic bubble on failure and free the blob
            setMessages(prev => prev.filter(m => m._id !== optimisticId));
            URL.revokeObjectURL(localUrl);
        } finally {
            setUploading(false);
        }
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
            if (mediaPreview) {
                handleMediaSend();
            } else {
                handleSend();
            }
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
        @keyframes spin {
          to { transform: rotate(360deg); }
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
        .conv-list-body { flex: 1; overflow-y: auto; padding: 0 12px 80px 12px; position: relative; z-index: 2; }
        .conv-list-body::-webkit-scrollbar { width: 4px; }
        .conv-list-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* ── Thread ── */
        .chat-thread {
          flex: 1; display: flex; flex-direction: column;
          background: #0A0A0C;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          overflow: hidden;
        }
        .thread-header {
          padding: 14px 16px;
          background: rgba(16,16,20,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
          position: relative;
        }
        .thread-header-icon-btn {
          width: 36px; height: 36px; border-radius: 10px; border: none;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background 0.15s;
        }
        .thread-header-icon-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }
        .thread-menu-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 16px;
          background: #1C1C22;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          overflow: hidden;
          z-index: 100;
          min-width: 180px;
        }
        .thread-menu-item {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 18px;
          font-size: 14px; font-weight: 600;
          color: rgba(255,255,255,0.8);
          background: none; border: none;
          width: 100%; text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }
        .thread-menu-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .thread-menu-item + .thread-menu-item { border-top: 1px solid rgba(255,255,255,0.06); }
        .messages-area {
          flex: 1; overflow-y: auto; padding: 20px 14px 16px 14px;
          display: flex; flex-direction: column; gap: 4px;
          background: #0A0A0C;
        }
        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .input-bar {
          padding: 10px 14px 20px 14px;
          background: rgba(16,16,20,0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column; flex-shrink: 0;
        }
        .input-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 6px 6px 6px 16px;
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
        .input-field::placeholder { color: rgba(255,255,255,0.28); }

        .icon-btn {
          width: 38px; height: 38px; border-radius: 50%; border: none;
          background: transparent; cursor: pointer;
          color: rgba(255,255,255,0.45);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }

        .send-btn {
          width: 44px; height: 44px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #7C72FF, #6C63FF);
          cursor: pointer; color: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
        }
        .send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(108,99,255,0.4); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); box-shadow: none; }

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
            flex-direction: column;
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
            overflow: hidden;
          }
          .mobile-sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            flex-shrink: 0;
            background: rgba(10,10,10,0.95);
          }
          .mobile-sidebar-close {
            display: flex; align-items: center; justify-content: center;
            width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
            background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
            cursor: pointer; color: #fff;
          }
          .mobile-sidebar-scroll {
            flex: 1; overflow-y: auto; padding: 20px;
          }
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }
        @media (max-width: 768px) {
          .chat-root { position: fixed; top: 0; left: 0; right: 0; bottom: 0; height: 100dvh; z-index: 100; }
          .chat-body { padding: 0; gap: 0; flex-direction: column; padding-bottom: env(safe-area-inset-bottom); }
          .conv-list, .chat-thread, .product-sidebar { 
             width: 100%; flex: 1; border-radius: 0; border: none; border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .chat-topbar { padding: 0 16px; min-height: 60px; }
          .conv-list { display: ${activeConvId ? 'none' : 'flex'}; border-right: none; }
          .chat-thread { display: ${activeConvId ? 'flex' : 'none'}; border-radius: 0; border: none; }
          .product-sidebar.mobile-open { width: 100%; border-left: none; }
        }

        /* ── Empty states ── */
        .empty-state {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          color: rgba(255,255,255,0.15);
          background: #0A0A0C;
        }

        /* ── Media preview bar ── */
        .media-preview-bar {
          padding: 10px 16px; border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(15,15,20,0.98);
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
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

        /* ── Mobile Inbox Hero ── */
        .mobile-inbox-hero {
          display: none;
          padding: 32px 20px 28px 20px;
          background: linear-gradient(160deg, #7C72FF 0%, #6C63FF 55%, #5549DD 100%);
          flex-shrink: 0;
          border-radius: 0 0 28px 28px;
          position: relative;
          overflow: hidden;
        }
        .mobile-inbox-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .mobile-inbox-hero { display: block; }
          .chat-topbar { display: none; }
        }

        /* ── Contact Strip ── */
        .contact-strip {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 4px 0 4px 0;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .contact-strip::-webkit-scrollbar { display: none; }
        .contact-avatar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .contact-avatar-name {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
          text-align: center;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── Inbox tab row ── */
        .inbox-tab-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 16px 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          background: rgba(12,12,12,0.95);
          border-radius: 28px 28px 0 0;
          margin-top: -28px;
          position: relative;
          z-index: 3;
        }
        .inbox-tab {
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .inbox-tab-active {
          background: #FFEC40;
          color: #111;
          border-color: #FFEC40;
        }
        .inbox-tab-inactive {
          background: transparent;
          color: rgba(255,255,255,0.45);
          border-color: rgba(255,255,255,0.12);
        }
        .inbox-tab-badge {
          background: #111;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          width: 20px; height: 20px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .inbox-tab-active .inbox-tab-badge {
          background: #111;
          color: #FFEC40;
        }

        /* ── FAB ── */
        .inbox-fab {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 52px; height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6C63FF, #9C6CFF);
          border: none;
          cursor: pointer;
          color: #fff;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 300;
          box-shadow: 0 6px 24px rgba(108,99,255,0.55);
          z-index: 10;
          transition: transform 0.18s;
          line-height: 1;
        }
        .inbox-fab:hover { transform: scale(1.08); }
        @media (max-width: 768px) {
          .inbox-fab { display: flex; }
        }

        /* ── Conversation section labels ── */
        .conv-section-label {
          font-size: 11px;
          font-weight: 800;
          color: #A78BFA;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 16px 4px 8px 4px;
          border-top: 1px solid rgba(108,99,255,0.15);
          margin-top: 4px;
        }
        .conv-section-label:first-child { border-top: none; margin-top: 0; }

        /* ── Send / Rupee Button ── */
        .send-btn {
          width: 46px; height: 46px; border-radius: 50% !important; border: none;
          background: linear-gradient(135deg, #6C63FF, #9C6CFF) !important;
          cursor: pointer; color: #fff !important;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(108,99,255,0.45) !important;
          font-size: 18px; font-weight: 700;
        }
        .send-btn:hover { transform: scale(1.06); }
        .send-btn:disabled { opacity: 0.45; transform: none; }

        /* ── Emoji button ── */
        .emoji-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; padding: 0 4px;
          transition: color 0.15s;
        }
        .emoji-btn:hover { color: rgba(255,255,255,0.7); }
      `}</style>

            <div className="chat-root">
                <div className="chat-grid-bg" />

                {/* Topbar */}
                <div className="chat-topbar">
                    <button
                        onClick={() => {
                            if (showMobileSidebar) {
                                setShowMobileSidebar(false);
                            } else if (activeConvId && window.innerWidth <= 768) {
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
                    {/* ── Conversation List (Inbox) ── */}
                    <div className="conv-list">

                        {/* Sticky Header Wrapper */}
                        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#0C0C0C' }}>
                            {/* Mobile Inbox Hero Header */}
                            <div className="mobile-inbox-hero" style={{ overflow: 'hidden' }}>
                                <div style={{ position: 'relative', zIndex: 10 }}>
                                    {/* Top Row: Back (Left) | Market, Dashboard, Avatar (Right) */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <button
                                            onClick={() => navigate(-1)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                        >
                                            <ArrowLeftIcon /> Back
                                        </button>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <button
                                                onClick={() => navigate('/marketplace')}
                                                style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                            >
                                                Marketplace
                                            </button>
                                            <button
                                                onClick={() => navigate('/dashboard')}
                                                style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                            >
                                                Dashboard
                                            </button>
                                            <div style={{ marginLeft: 2 }}>
                                                <Avatar src={user?.profilePicture} name={user?.fullName || 'User'} size={32} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Content Row: Texts (Left) */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                                                Hi, {(user?.fullName || user?.name || 'there').split(' ')[0]}!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Product strip */}
                                {conversations.length > 0 && (() => {
                                    const products = conversations
                                        .filter(c => c.product)
                                        // ensure unique products
                                        .filter((c, i, arr) => arr.findIndex(x => x.product._id === c.product._id) === i)
                                        .slice(0, 7);
                                    
                                    if (products.length === 0) return null;

                                    return (
                                        <div>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 12, letterSpacing: 0.3 }}>
                                                Ongoing Negotiations
                                            </div>
                                            <div className="contact-strip">
                                                {products.map((conv, idx) => (
                                                    <div 
                                                        key={conv._id || idx} 
                                                        className="contact-avatar-item"
                                                        onClick={() => selectConversation(conv._id)}
                                                        style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                                                    >
                                                        <div style={{ position: 'relative' }}>
                                                            <img
                                                                src={conv.product?.images?.[0] || 'https://via.placeholder.com/60'}
                                                                alt={conv.product?.title || 'Product'}
                                                                style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                                            />
                                                            {conv.unreadCount > 0 && (
                                                                <div style={{
                                                                    position: 'absolute', top: -2, right: -2,
                                                                    width: 14, height: 14, borderRadius: '50%',
                                                                    background: '#EF4444',
                                                                    border: '2px solid #6C63FF', // matches original hero purple background
                                                                }} />
                                                            )}
                                                        </div>
                                                        <span className="contact-avatar-name" style={{ maxWidth: 80 }}>
                                                            {(conv.product?.title || '').slice(0, 15)}{(conv.product?.title?.length > 15 ? '...' : '')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Universal Search Box */}
                            <div style={{ padding: '20px 8px 16px 8px' }}>
                                <div className="search-bar">
                                    <SearchIcon />
                                    <input 
                                        type="text" 
                                        placeholder="Search names or products..." 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="conv-list-body" style={{ position: 'relative' }}>

                            {/* Desktop-only Product Strip */}
                            <div className="desktop-only" style={{ padding: '0 8px 16px 8px' }}>
                                {conversations.length > 0 && (() => {
                                    const products = conversations
                                        .filter(c => c.product)
                                        .filter((c, i, arr) => arr.findIndex(x => x.product._id === c.product._id) === i)
                                        .slice(0, 7);
                                    
                                    if (products.length === 0) return null;

                                    return (
                                        <div>
                                            <div style={{ fontSize: 11, color: '#A78BFA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                                                Ongoing Negotiations
                                            </div>
                                            <div className="contact-strip" style={{ marginTop: -4 }}>
                                                {products.map((conv, idx) => (
                                                    <div 
                                                        key={conv._id || idx} 
                                                        className="contact-avatar-item"
                                                        onClick={() => selectConversation(conv._id)}
                                                        style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                                                    >
                                                        <div style={{ position: 'relative' }}>
                                                            <img
                                                                src={conv.product?.images?.[0] || 'https://via.placeholder.com/60'}
                                                                alt={conv.product?.title || 'Product'}
                                                                style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                                                            />
                                                            {conv.unreadCount > 0 && (
                                                                <div style={{
                                                                    position: 'absolute', top: -2, right: -2,
                                                                    width: 12, height: 12, borderRadius: '50%',
                                                                    background: '#EF4444',
                                                                    border: '2px solid #0C0C0C',
                                                                }} />
                                                            )}
                                                        </div>
                                                        <span className="contact-avatar-name" style={{ maxWidth: 54 }}>
                                                            {(conv.product?.title || '').slice(0, 10)}{(conv.product?.title?.length > 10 ? '...' : '')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {convsLoading ? (
                                <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading…</div>
                            ) : conversations.length === 0 ? (
                                <div style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.25)' }}>
                                    <MessageBubbleIcon />
                                    <span style={{ fontSize: 13 }}>No chats yet</span>
                                </div>
                            ) : (() => {
                                const userId = user?.id || user?._id;
                                const filtered = conversations.filter(c => {
                                    const other = c.participants?.find(p => p._id !== userId && p._id?.toString() !== userId?.toString()) || c.participants?.[0];
                                    return other?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        c.product?.title?.toLowerCase().includes(searchQuery.toLowerCase());
                                });
                                const pinned = filtered.filter(c => (c.unreadCount || 0) > 0);
                                const all = filtered.filter(c => (c.unreadCount || 0) === 0);
                                return (
                                    <>
                                        {pinned.length > 0 && (
                                            <>
                                                <div className="conv-section-label">Pinned Message ({pinned.length})</div>
                                                {pinned.map(conv => (
                                                    <ConvItem
                                                        key={conv._id}
                                                        conv={conv}
                                                        currentUserId={userId}
                                                        isActive={conv._id === activeConvId}
                                                        onClick={() => selectConversation(conv._id)}
                                                    />
                                                ))}
                                            </>
                                        )}
                                        {all.length > 0 && (
                                            <>
                                                <div className="conv-section-label" style={{ marginTop: pinned.length > 0 ? 8 : 0 }}>All Message ({all.length})</div>
                                                {all.map(conv => (
                                                    <ConvItem
                                                        key={conv._id}
                                                        conv={conv}
                                                        currentUserId={userId}
                                                        isActive={conv._id === activeConvId}
                                                        onClick={() => selectConversation(conv._id)}
                                                    />
                                                ))}
                                            </>
                                        )}
                                        {pinned.length === 0 && all.length === 0 && (
                                            <div style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No conversations match your search</div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* ── Chat Thread ── */}
                    <div className="chat-thread">
                        {!activeConvId || !activeConv ? (
                            <div className="empty-state">
                                <MessageBubbleIcon />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>Select a conversation</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)', lineHeight: 1.7 }}>
                                        Or message a seller from<br />a product page to start chatting
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Thread header — glassmorphism */}
                                <div className="thread-header">
                                    {/* Back */}
                                    <button
                                        onClick={() => navigate('/chat', { replace: true })}
                                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px 8px 4px 0', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                                        title="Back to inbox"
                                    >
                                        <ArrowLeftIcon />
                                    </button>

                                    {/* Avatar + online dot */}
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        <div onClick={() => otherParticipant?._id && navigate(`/seller/${otherParticipant._id}`)} style={{ cursor: 'pointer' }}>
                                            <Avatar
                                                src={otherParticipant?.profilePicture}
                                                name={otherParticipant?.fullName || 'User'}
                                                size={40}
                                            />
                                        </div>
                                        <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#34C759', border: '2px solid #101014' }} />
                                    </div>

                                    {/* Name + subtitle */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {otherParticipant?.fullName || 'User'}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {activeConv?.product?.title || 'Online'}
                                        </div>
                                    </div>

                                    {/* Listing Info Button */}
                                    {activeConv?.product && (
                                        <button 
                                            onClick={() => setShowMobileSidebar(true)} 
                                            title="Listing Info"
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: 20, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                        >
                                            <img src={(typeof activeConv.product?.images?.[0] === 'string' ? activeConv.product?.images?.[0] : activeConv.product?.images?.[0]?.url) || 'https://via.placeholder.com/40'} alt="Product" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                        </button>
                                    )}

                                    {/* Direct Delete Button */}
                                    <button
                                        className="thread-header-icon-btn"
                                        onClick={() => setShowDeleteModal(true)}
                                        title="Delete Chat"
                                        style={{ color: '#FF453A' }}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>

                                {/* Messages — fade in once loaded & scrolled to bottom */}
                                <div className="messages-area" ref={messagesAreaRef} style={{ opacity: isScrolledToBottom ? 1 : 0, transition: 'opacity 0.25s ease-in' }}>
                                    {messages.length === 0 && !msgsLoading && isScrolledToBottom ? (
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, paddingTop: 40 }}>
                                            No messages yet. Say hi! 👋
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            const prevMsg = messages[idx - 1];
                                            const nextMsg = messages[idx + 1];

                                            const isConsecutivePrev = prevMsg && (
                                                (msg.sender?._id === prevMsg.sender?._id) || 
                                                (msg.sender?._id?.toString() === prevMsg.sender?._id?.toString())
                                            ) && (
                                                new Date(msg.createdAt) - new Date(prevMsg.createdAt) < 30 * 60 * 1000
                                            );

                                            const isConsecutiveNext = nextMsg && (
                                                (msg.sender?._id === nextMsg.sender?._id) || 
                                                (msg.sender?._id?.toString() === nextMsg.sender?._id?.toString())
                                            ) && (
                                                new Date(nextMsg.createdAt) - new Date(msg.createdAt) < 30 * 60 * 1000
                                            );

                                            return (
                                                <MessageBubble
                                                    key={msg.clientId || msg._id}
                                                    message={msg}
                                                    currentUserId={user?.id || user?._id}
                                                    currentUser={user}
                                                    onRespond={handleRespondToOffer}
                                                    responding={responding}
                                                    isFirstInGroup={!isConsecutivePrev}
                                                    isLastInGroup={!isConsecutiveNext}
                                                    onImageClick={setFullScreenImageId}
                                                />
                                            );
                                        })
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {/* + attach button outside the pill */}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Attach media"
                                            style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', fontSize: 24, fontWeight: 300, lineHeight: 1 }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                                        >
                                            +
                                        </button>
                                        <div className="input-pill" style={{ flex: 1 }}>
                                            <textarea
                                                className="input-field"
                                                placeholder="Type Message"
                                                value={inputText}
                                                onChange={e => setInputText(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                rows={1}
                                            />
                                            {/* Emoji button */}
                                            <button className="emoji-btn" title="Emoji">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                                                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                                                </svg>
                                            </button>
                                            {/* ₹ / Send purple circle */}
                                            <button
                                                className="send-btn"
                                                onClick={(inputText.trim() || mediaPreview) ? (mediaPreview ? handleMediaSend : handleSend) : () => setShowNegotiator(true)}
                                                disabled={sending || uploading}
                                                title={(inputText.trim() || mediaPreview) ? 'Send message' : 'Make a price offer'}
                                            >
                                                {uploading || sending ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                                    </svg>
                                                ) : (inputText.trim() || mediaPreview)
                                                    ? <SendIcon />
                                                    : <span style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>₹</span>
                                                }
                                            </button>
                                        </div>
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
                                {/* Sticky close header - always visible at top */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '16px 20px', flexShrink: 0,
                                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                                    position: 'sticky', top: 0,
                                    background: 'rgba(10,10,10,0.97)',
                                    zIndex: 10
                                }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Listing Info</span>
                                    <button
                                        onClick={() => setShowMobileSidebar(false)}
                                        style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: '#fff', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <XIcon />
                                    </button>
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

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
                                </div>{/* end mobile-sidebar-scroll */}
                            </div>{/* end product-sidebar */}
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

            {/* Fullscreen Image Lightbox Modal */}
            {fullScreenImageId && currentImageMessage && (
                <div 
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)',
                        display: 'flex', flexDirection: 'column',
                    }}
                >
                    {/* Top bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar src={currentImageMessage.sender?.profilePicture} name={currentImageMessage.sender?.fullName || 'User'} size={40} />
                            <div>
                                <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{currentImageMessage.sender?.fullName || 'User'}</div>
                                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{formatTime(currentImageMessage.createdAt)}</div>
                            </div>
                        </div>
                        <button
                            style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)', border: 'none',
                                color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
                            }}
                            onClick={() => setFullScreenImageId(null)}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <XIcon />
                        </button>
                    </div>

                    {/* Main Image View */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} onClick={() => setFullScreenImageId(null)}>
                        {currentImageIndex > 0 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFullScreenImageId(imageMessages[currentImageIndex - 1]._id); }}
                                style={{ position: 'absolute', left: 20, zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                            >
                                <ChevronLeftIcon />
                            </button>
                        )}

                        <img 
                            src={currentImageMessage.mediaUrl} 
                            alt="fullscreen media" 
                            style={{ 
                                maxWidth: '100%', maxHeight: '100%', 
                                objectFit: 'contain', cursor: 'default',
                                userSelect: 'none'
                            }} 
                            onClick={(e) => e.stopPropagation()}
                        />

                        {currentImageIndex < imageMessages.length - 1 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFullScreenImageId(imageMessages[currentImageIndex + 1]._id); }}
                                style={{ position: 'absolute', right: 20, zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                            >
                                <ChevronRightIcon />
                            </button>
                        )}
                    </div>

                    {/* Bottom thumbnails strip */}
                    <div style={{ padding: '20px 0', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                            {imageMessages.map((msg, idx) => (
                                <img 
                                    key={msg._id}
                                    src={msg.mediaUrl}
                                    alt="thumbnail"
                                    onClick={() => setFullScreenImageId(msg._id)}
                                    style={{
                                        width: 50, height: 50, objectFit: 'cover', borderRadius: 8, cursor: 'pointer',
                                        border: msg._id === fullScreenImageId ? '2px solid #fff' : '2px solid transparent',
                                        opacity: msg._id === fullScreenImageId ? 1 : 0.5,
                                        transition: 'all 0.2s',
                                        flexShrink: 0
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
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
