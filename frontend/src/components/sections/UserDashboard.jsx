import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, offerAPI, dealAPI } from '../../services/api';
import AddProductModal from './AddProductModal';
import EditProductModal from './dashboard/EditProductModal';
import MyAccount from './dashboard/MyAccount';

const HeartFilledIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);


// Icons (keeping original - they're good!)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const MoreVert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const ArrowUp = ({ color = "currentColor" }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);


// Donut Chart Component
const DonutChart = ({ data, size = 180 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const cx = size / 2, cy = size / 2, radius = size * 0.38, strokeWidth = size * 0.18;
  let cumulative = 0;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((seg, i) => {
        const pct = seg.value / total;
        const offset = circumference * (1 - pct);
        const rotation = (cumulative / total) * 360 - 90;
        cumulative += seg.value;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(${rotation} ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="22" fontWeight="800">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">
        Items Listed
      </text>
    </svg>
  );
};


// Mini Line Chart
const MiniLineChart = ({ data, width = 280, height = 100, color = "#00D9FF" }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#profitGrad)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
};

// ─── Confetti Celebration ────────────────────────────────────────────────────
const ConfettiOverlay = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00D9FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#fff'];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 80,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      rotate: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
      size: 7 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      opacity: 1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // gravity
        p.rotate += p.rotSpeed;
        if (p.y > canvas.height * 0.7) p.opacity -= 0.02;
        if (p.opacity <= 0) return;
        alive++;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotate * Math.PI) / 180);
        if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      if (alive > 0) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
};
// ─────────────────────────────────────────────────────────────────────────────

// ── DEAL HISTORY MODAL ────────────────────────────────────────────────────────
const DealHistoryModal = ({ deal, onClose, currentUserId }) => {
  if (!deal) return null;

  const fmt = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const isSeller = (typeof deal.seller === 'object' ? deal.seller?._id : deal.seller)?.toString() === currentUserId;
  const otherParty = isSeller ? deal.buyer : deal.seller;
  const otherName = typeof otherParty === 'object' ? otherParty?.fullName : '—';

  // Build timeline steps from available timestamps
  const steps = [
    {
      icon: '💬',
      label: deal.source === 'chat' ? 'Price negotiated via Chat' : 'Offer Submitted',
      desc: deal.source === 'chat'
        ? `A price of ₹${deal.agreedPrice} was negotiated in chat`
        : `An offer of ₹${deal.agreedPrice} was submitted${isSeller ? ` by ${otherName}` : ` to ${otherName}`}`,
      time: deal.createdAt,
      color: '#00D9FF',
      done: true,
    },
    {
      icon: '✅',
      label: 'Offer Accepted',
      desc: deal.source === 'chat'
        ? `Agreed price locked via chat negotiation`
        : `${isSeller ? 'You accepted' : `${otherName} accepted`} the offer — deal was created`,
      time: deal.createdAt,
      color: '#10B981',
      done: true,
    },
    {
      icon: '🤝',
      label: 'Deal Opened',
      desc: `Both parties committed — agreed price ₹${deal.agreedPrice}`,
      time: deal.createdAt,
      color: '#7C3AED',
      done: true,
    },
    {
      icon: '📦',
      label: 'Sale Confirmed',
      desc: `Item handed over and deal sealed as sold`,
      time: deal.dealStatus === 'sold' ? deal.updatedAt : null,
      color: '#F59E0B',
      done: deal.dealStatus === 'sold',
    },
    {
      icon: '⭐',
      label: 'Review Submitted',
      desc: deal.review?.rating
        ? `Rated ${deal.review.rating}/5${deal.review.comment ? ` — "${deal.review.comment.slice(0, 60)}${deal.review.comment.length > 60 ? '…' : ''}"` : ''}`
        : isSeller ? 'Waiting for buyer to leave a review' : "You haven't reviewed this deal yet",
      time: deal.review?.submittedAt || null,
      color: '#EC4899',
      done: !!deal.review?.submittedAt,
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: 'rgba(14,14,14,0.95)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,217,255,0.08), rgba(124,58,237,0.08))',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '20px 20px 16px',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, color: 'rgba(255,255,255,0.5)',
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 14, lineHeight: 1,
            }}
          >✕</button>

          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#00D9FF', marginBottom: 10 }}>
            📋 Deal History
          </div>

          {/* Product row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img
              src={deal.product?.images?.[0] || '/placeholder.jpg'}
              alt=""
              style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {deal.product?.title}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                {isSeller ? `Buyer: ${otherName}` : `Seller: ${otherName}`}
                {typeof otherParty === 'object' && otherParty?.branch ? ` · ${otherParty.branch.toUpperCase()}` : ''}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 14, fontWeight: 800, color: '#00D9FF',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>₹{deal.agreedPrice}</span>
                {deal.product?.price && deal.agreedPrice !== deal.product.price && (
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>₹{deal.product.price}</span>
                )}
                <span style={{
                  fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                  textTransform: 'uppercase', letterSpacing: 1, padding: '2px 7px',
                  borderRadius: 4, border: '1px solid rgba(16,185,129,0.3)',
                  background: 'rgba(16,185,129,0.1)', color: '#10B981'
                }}>SOLD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>
            Order Timeline
          </div>
          <div style={{ position: 'relative' }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 14, position: 'relative', paddingBottom: idx < steps.length - 1 ? 24 : 0 }}>
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 15, top: 32, bottom: 0,
                    width: 1,
                    background: step.done && steps[idx + 1]?.done
                      ? `linear-gradient(to bottom, ${step.color}60, ${steps[idx + 1].color}30)`
                      : 'rgba(255,255,255,0.07)',
                  }} />
                )}
                {/* Icon dot */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: step.done ? `${step.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${step.done ? step.color + '55' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                  opacity: step.done ? 1 : 0.4,
                  boxShadow: step.done ? `0 0 12px ${step.color}25` : 'none',
                  position: 'relative', zIndex: 1,
                }}>
                  {step.icon}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, paddingTop: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: step.done ? '#fff' : 'rgba(255,255,255,0.3)',
                    }}>{step.label}</div>
                    {step.time && (
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {fmt(step.time)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: step.done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)', marginTop: 3, lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────


// Main Component
const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, toggleSavedId } = useAuth();

  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarActive, _setSidebarActive] = useState(
    () => sessionStorage.getItem('dash_tab') || 'Overview'
  );
  // Wrapper that also persists to sessionStorage
  const setSidebarActive = (tab) => {
    sessionStorage.setItem('dash_tab', tab);
    _setSidebarActive(tab);
  };
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const glowRef = useRef(null);
  const [offersReceived, setOffersReceived] = useState([]);
  const [offersSent, setOffersSent] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [deals, setDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [dealsSubTab, setDealsSubTab] = useState('negotiations');
  const [reviewState, setReviewState] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [dealHistoryOpen, setDealHistoryOpen] = useState(null); // holds the deal object to show

  // Robust current-user ID — works whether auth returns id or _id
  const currentUserId = (user?._id || user?.id || '').toString();

  // Mouse glow effect
  useEffect(() => {
    let animationFrameId;
    const handler = (e) => {
      if (glowRef.current) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.background = `radial-gradient(800px circle at ${e.clientX}px ${e.clientY}px, rgba(0,217,255,0.06) 0%, transparent 50%)`;
          }
        });
      }
    };
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchSavedProducts = async () => {
    try {
      setSavedLoading(true);
      const res = await productAPI.getSaved();
      if (res.success) setSavedProducts(res.products || []);
      else setSavedProducts([]);
    } catch (e) {
      setSavedProducts([]);
    } finally {
      setSavedLoading(false);
    }
  };

  // Fetch when tab becomes active
  useEffect(() => {
    if (sidebarActive === 'Saved Products') fetchSavedProducts();
    if (sidebarActive === 'My Deals' || sidebarActive === 'Overview') {
      fetchDeals();
      fetchOffers();
    }
  }, [sidebarActive]);

  const fetchOffers = async () => {
    try {
      setOffersLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        offerAPI.getReceived(),
        offerAPI.getSent()
      ]);
      if (receivedRes.success) setOffersReceived(receivedRes.offers);
      if (sentRes.success) setOffersSent(sentRes.offers);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setOffersLoading(false);
    }
  };

  const handleOfferStatus = async (offerId, status) => {
    try {
      const res = await offerAPI.updateStatus(offerId, status);
      if (res.success) {
        fetchOffers();
        // If accepted, a new Deal was created on backend — refresh deals too
        if (status === 'accepted') fetchDeals();
      }
    } catch (err) {
      console.error('Error updating offer status:', err);
    }
  };

  const fetchDeals = async () => {
    try {
      setDealsLoading(true);
      const res = await dealAPI.getAll();
      if (res.success) setDeals(res.deals);
      else setDeals([]);
    } catch (err) {
      console.error('Error fetching deals:', err);
      setDeals([]);
    } finally {
      setDealsLoading(false);
    }
  };

  const handleConfirmSold = async (dealId) => {
    try {
      const res = await dealAPI.confirmSold(dealId);
      if (res.success) {
        fetchDeals();
        // Fire confetti celebration
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
      }
    } catch (err) {
      console.error('Error confirming sold:', err);
    }
  };

  const handleSubmitReview = async (dealId) => {
    const r = reviewState[dealId] || {};
    if (!r.rating) return;
    try {
      setReviewState(prev => ({ ...prev, [dealId]: { ...r, submitting: true } }));
      const res = await dealAPI.submitReview(dealId, r.rating, r.comment || '');
      if (res.success) {
        fetchDeals();
        setReviewState(prev => ({ ...prev, [dealId]: {} }));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewState(prev => ({ ...prev, [dealId]: { ...r, submitting: false } }));
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [listingsRes, analyticsRes] = await Promise.all([
        productAPI.getMyListings(),
        productAPI.getAnalytics()
      ]);
      if (listingsRes.success) setListings(listingsRes.products || []);
      else setListings([]);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setListings([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.fullName || "User";

  const stats = analytics || {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    soldListings: listings.filter(l => l.status === 'sold').length,
    pendingListings: listings.filter(l => l.status === 'pending').length,
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalSaves: listings.reduce((sum, l) => sum + (l.saves || 0), 0),
    totalRevenue: listings.filter(l => l.status === 'sold').reduce((sum, l) => sum + (l.price || 0), 0)
  };

  const filteredListings = activeTab === 'all' ? listings : listings.filter(l => l.status === activeTab);

  const handleDelete = (id) => { setDeleteItemId(id); setShowDeleteModal(true); };
  const confirmDelete = async () => {
    try {
      const response = await productAPI.delete(deleteItemId);
      if (response.success) {
        setListings(listings.filter(l => l._id !== deleteItemId));
        setShowDeleteModal(false);
        setDeleteItemId(null);
        fetchDashboardData();
      }
    } catch (error) { console.error('Error deleting:', error); }
  };
  const handleMarkAsSold = async (productId) => {
    try {
      const response = await productAPI.update(productId, { status: 'sold' });
      if (response.success) {
        setListings(listings.map(l => l._id === productId ? { ...l, status: 'sold' } : l));
        fetchDashboardData();
      }
    } catch (error) { console.error('Error:', error); }
  };
  const handleViewProduct = (productId) => navigate(`/product/${productId}`);
  const handleEditProduct = (product) => { setEditingProduct(product); setIsEditProductOpen(true); };

  const getProductImage = (product) => product.images?.[0] || '/placeholder.jpg';
  const getPriceDisplay = (product) => {
    if (product.type === 'free') return 'FREE';
    if (product.type === 'barter') return 'BARTER';
    return `₹${product.price || 0}`;
  };
  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Recently';
    const days = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      sold: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return (
      <span className={`px-2 py-1 text-[10px] mono font-bold uppercase border ${styles[status] || styles.active}`}>
        {status}
      </span>
    );
  };

  const donutData = stats.categoryBreakdown && stats.categoryBreakdown.length > 0
    ? stats.categoryBreakdown.map((item, idx) => ({
      label: item.label,
      value: item.count,
      color: ['#00D9FF', '#7C3AED', '#F59E0B', '#10B981', '#EF4444', '#EC4899'][idx % 6]
    }))
    : [
      { label: 'Electronics', value: 5, color: '#00D9FF' },
      { label: 'Books', value: 3, color: '#7C3AED' },
      { label: 'Clothes', value: 2, color: '#F59E0B' },
      { label: 'Others', value: 1, color: '#10B981' },
    ];

  // Real engagement data: views+saves per listing, chronological
  const engagementData = (() => {
    const sorted = [...listings].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const points = sorted.map(l => (l.views || 0) + (l.saves || 0));
    // Need at least 2 points for a line; pad or return fallback
    if (points.length === 0) return [0, 0];
    if (points.length === 1) return [0, points[0]];
    return points;
  })();

  // ── ACTIVITY: real per-listing + offer/deal events ──
  const activityItems = (() => {
    const all = [];

    // Each listing: "New listing" event + "Marked as sold" event
    listings.forEach(l => {
      all.push({
        text: `"${l.title}" new listing`,
        ts: new Date(l.createdAt),
        time: getTimeAgo(l.createdAt),
        color: '#00D9FF'
      });
      if (l.status === 'sold') {
        all.push({
          text: `"${l.title}" marked as sold`,
          ts: new Date(l.updatedAt || l.createdAt),
          time: getTimeAgo(l.updatedAt || l.createdAt),
          color: '#10B981'
        });
      }
    });

    // Offers sent by me
    offersSent.forEach(o => {
      const title = o.product?.title || 'a product';
      const toName = o.seller?.fullName || o.seller?.username || 'seller';
      all.push({
        text: `Price offer of \u20b9${o.offerPrice} sent to ${toName} for "${title}"`,
        ts: new Date(o.createdAt),
        time: getTimeAgo(o.createdAt),
        color: '#00D9FF'
      });
    });

    // Incoming pending offers
    offersReceived.filter(o => o.status === 'pending').forEach(o => {
      const title = o.product?.title || 'your listing';
      const fromName = o.buyer?.fullName || o.buyer?.username || 'buyer';
      all.push({
        text: `${fromName} offered \u20b9${o.offerPrice} for "${title}"`,
        ts: new Date(o.createdAt),
        time: getTimeAgo(o.createdAt),
        color: '#F59E0B'
      });
    });

    // Accepted negotiations
    [...offersReceived, ...offersSent].filter(o => o.status === 'accepted').forEach(o => {
      const title = o.product?.title || 'a product';
      all.push({
        text: `Negotiation accepted \u2014 \u20b9${o.offerPrice} for "${title}"`,
        ts: new Date(o.updatedAt || o.createdAt),
        time: getTimeAgo(o.updatedAt || o.createdAt),
        color: '#10B981'
      });
    });

    // Rejected offers
    [...offersReceived, ...offersSent].filter(o => o.status === 'rejected').forEach(o => {
      const title = o.product?.title || 'a product';
      all.push({
        text: `Offer rejected for "${title}"`,
        ts: new Date(o.updatedAt || o.createdAt),
        time: getTimeAgo(o.updatedAt || o.createdAt),
        color: '#EF4444'
      });
    });

    // Completed deals
    deals.filter(d => d.status === 'completed').forEach(d => {
      const title = d.product?.title || 'a product';
      all.push({
        text: `Deal done \u2014 "${title}" sold for \u20b9${d.finalPrice || d.agreedPrice}`,
        ts: new Date(d.updatedAt || d.createdAt),
        time: getTimeAgo(d.updatedAt || d.createdAt),
        color: '#10B981'
      });
    });

    // Active deals
    deals.filter(d => d.status !== 'completed').forEach(d => {
      const title = d.product?.title || 'a product';
      all.push({
        text: `Deal in progress for "${title}" at \u20b9${d.agreedPrice}`,
        ts: new Date(d.createdAt),
        time: getTimeAgo(d.createdAt),
        color: '#7C3AED'
      });
    });

    // Sort all events newest-first, take top 4
    all.sort((a, b) => b.ts - a.ts);
    const items = all.slice(0, 4);

    if (items.length === 0) items.push({ text: 'No activity yet', time: 'Add your first listing!', color: 'rgba(255,255,255,0.2)' });
    return items;
  })();

  // ── QUICK STATS: real computed metrics ──
  const quickStatsItems = (() => {
    const sellThrough = stats.totalListings > 0
      ? Math.round((stats.soldListings / stats.totalListings) * 100)
      : 0;
    const avgViews = stats.totalListings > 0
      ? Math.round(stats.totalViews / stats.totalListings)
      : 0;
    const saveRate = stats.totalViews > 0
      ? ((stats.totalSaves / stats.totalViews) * 100).toFixed(1)
      : '0.0';
    const healthyListings = listings.filter(l => l.status === 'active').length;
    return [
      { icon: '📈', label: 'Sell-through rate', value: `${sellThrough}%`, sub: `${stats.soldListings}/${stats.totalListings} sold`, color: '#00D9FF' },
      { icon: '👁', label: 'Avg views / listing', value: avgViews, sub: `${stats.totalViews} total views`, color: '#7C3AED' },
      { icon: '🤍', label: 'Save rate', value: `${saveRate}%`, sub: `of viewers save`, color: '#F59E0B' },
      { icon: '✅', label: 'Active listings', value: healthyListings, sub: `of ${stats.totalListings} total`, color: '#10B981' },
    ];
  })();

  const sidebarDashItems = [
    { label: 'Overview', icon: <HomeIcon /> },
    { label: 'Marketplace', icon: <CartIcon />, action: () => navigate('/marketplace') },
    { label: 'My Listings', icon: <PackageIcon /> },
    { label: 'Saved Products', icon: <HeartFilledIcon /> },
    { label: 'My Deals', icon: <TrendingIcon /> },
  ];
  const sidebarSettItems = [
    { label: 'Messages', icon: <MessageIcon />, action: () => navigate('/chat') },
    { label: 'Reviews', icon: <StarIcon /> },
    { label: 'My Account', icon: <UsersIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
    { label: 'Logout', icon: <HelpIcon />, action: () => { logout(); navigate('/'); } },
  ];

  if (loading) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Manrope, sans-serif' }}>
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .dash-root {
          font-family: 'Manrope', sans-serif;
          background: #0A0A0A;
          color: #E4E4E7;
          min-height: 100vh;
          display: flex;
          position: relative;
        }

        .mono { font-family: 'JetBrains Mono', monospace; }

        /* ═══════════ NOISE & GRID ═══════════ */
        .noise-overlay {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        .grid-lines {
          position: fixed;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px),
            repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px);
          pointer-events: none;
          z-index: 1;
        }

        /* ═══════════ SIDEBAR - SOFT BRUTALISM ═══════════ */
        .sidebar {
          width: 240px;
          background: rgba(15,15,15,0.8);
          border-right: 2px solid rgba(255,255,255,0.08);
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 50;
          overflow-y: auto;
          backdrop-filter: blur(20px);
          flex-shrink: 0;
        }

        .sidebar-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 4px;
          margin-bottom: 24px;
        }

        .sidebar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: #0A0A0A;
          border: 2px solid rgba(255,255,255,0.1);
        }

        .sidebar-name {
          font-weight: 700;
          font-size: 14px;
          color: #fff;
        }

        .sidebar-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 28px;
          cursor: text;
        }

        .sidebar-search input {
          background: none;
          border: none;
          outline: none;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          flex: 1;
          font-family: inherit;
        }

        .sidebar-search .kbd {
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          font-family: 'JetBrains Mono', monospace;
        }

        .sidebar-section-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3);
          padding: 0 12px;
          margin-bottom: 8px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          border: 1px solid transparent;
          background: none;
          width: 100%;
          text-align: left;
          text-decoration: none;
        }

        .sidebar-item:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.08);
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          color: #0A0A0A;
          font-weight: 700;
          border-color: transparent;
        }

        .sidebar-item.active svg { stroke: #0A0A0A; }

        .sidebar-spacer { flex: 1; }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
        }

        /* ═══════════ MAIN ═══════════ */
        .main-area {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
          z-index: 10;
        }

        /* ═══════════ TOP BAR - SOFT BRUTALISM ═══════════ */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          border-bottom: 2px solid rgba(255,255,255,0.08);
          background: rgba(10,10,10,0.8);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }

        .topbar-breadcrumb span.current { color: #fff; font-weight: 600; }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topbar-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.5);
          transition: all 0.15s;
        }

        .topbar-icon-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.15);
        }

        /* ═══════════ CONTENT ═══════════ */
        .content-wrapper {
          display: flex;
          flex: 1;
        }

        .content-main {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
        }

        .content-right {
          width: 300px;
          border-left: 2px solid rgba(255,255,255,0.08);
          padding: 28px 20px;
          overflow-y: auto;
          background: rgba(15,15,15,0.5);
          backdrop-filter: blur(20px);
        }

        /* ═══════════ OVERVIEW HEADER ═══════════ */
        .overview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .overview-header h1 {
          font-size: 26px;
          font-weight: 800;
          color: #fff;
        }

        .today-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
        }

        /* ═══════════ STAT CARDS - SOFT BRUTALISM ═══════════ */
        .stat-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 20px;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(0,217,255,0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,217,255,0.1);
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
        }

        .stat-change.up { color: #00D9FF; }
        .stat-change.down { color: #F87171; }

        /* ═══════════ CARD - SOFT BRUTALISM ═══════════ */
        .card {
          background: rgba(255,255,255,0.02);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 24px;
          backdrop-filter: blur(10px);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }

        /* ═══════════ MIDDLE ROW ═══════════ */
        .mid-row {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        /* ═══════════ SALES OVERVIEW ═══════════ */
        .sales-content {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .sales-legend {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sales-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .sales-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: rgba(0,217,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00D9FF;
          border: 1px solid rgba(0,217,255,0.2);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          display: inline-block;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .legend-item .amount {
          color: #fff;
          font-weight: 600;
          margin-left: auto;
          font-size: 13px;
        }

        /* ═══════════ SIDE STATS ═══════════ */
        .side-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mini-stat-card {
          background: rgba(255,255,255,0.02);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 18px;
          flex: 1;
          backdrop-filter: blur(10px);
        }

        .mini-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 6px;
        }

        .mini-stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #fff;
        }

        .mini-stat-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }

        /* ═══════════ BOTTOM ROW ═══════════ */
        .bottom-row {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        /* ═══════════ PROFIT CARD ═══════════ */
        .profit-card {
          background: rgba(255,255,255,0.02);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 24px;
          backdrop-filter: blur(10px);
        }

        /* ═══════════ PRICING CARD - SOFT BRUTALISM ═══════════ */
        .pricing-card {
          background: linear-gradient(135deg, rgba(0,217,255,0.05) 0%, rgba(124,58,237,0.05) 100%);
          border: 1.5px solid rgba(0,217,255,0.2);
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .pricing-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,217,255,0.12);
          color: #00D9FF;
          padding: 4px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
          border: 1px solid rgba(0,217,255,0.2);
        }

        .pricing-amount {
          font-size: 48px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .pricing-per {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }

        .pricing-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin: 16px 0 20px;
          line-height: 1.5;
        }

        .pricing-cta {
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }

        .pricing-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,217,255,0.3);
        }

        /* ═══════════ RIGHT PANEL ═══════════ */
        .right-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }

        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
        }

        .notif-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .notif-text {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }

        .notif-time {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 0;
        }

        .activity-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ═══════════ LISTINGS SECTION - SOFT BRUTALISM ═══════════ */
        .listing-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .listing-tab {
          padding: 6px 14px;
          border-radius: 6px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
        }

        .listing-tab.active {
          background: rgba(0,217,255,0.12);
          color: #00D9FF;
          border-color: rgba(0,217,255,0.3);
        }

        .listing-item {
          background: rgba(255,255,255,0.02);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 10px;
          display: flex;
          gap: 14px;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .listing-item:hover {
          border-color: rgba(0,217,255,0.3);
          background: rgba(255,255,255,0.04);
        }

        .listing-img {
          width: 72px;
          height: 72px;
          border-radius: 6px;
          background: #1A1E25;
          overflow: hidden;
          flex-shrink: 0;
        }

        .listing-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .listing-actions {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .listing-action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          font-size: 10px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.15s;
        }

        .listing-action-btn:hover { 
          background: rgba(255,255,255,0.08); 
          color: #fff; 
          border-color: rgba(255,255,255,0.15);
        }
        
        .listing-action-btn.del:hover { 
          background: rgba(239,68,68,0.15); 
          color: #EF4444; 
          border-color: rgba(239,68,68,0.3); 
        }

        /* ═══════════ MODAL - SOFT BRUTALISM ═══════════ */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-box {
          background: rgba(15,15,15,0.95);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 28px;
          max-width: 380px;
          width: 100%;
          backdrop-filter: blur(20px);
        }

        .divider {
          border: none;
          border-top: 1.5px solid rgba(255,255,255,0.08);
          margin: 20px 0;
        }

        /* ═══════════ RESPONSIVE ═══════════ */
        @media (max-width: 1280px) {
          .content-right { width: 260px; }
          .stat-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 1024px) {
          .sidebar { display: none; }
          .main-area { margin-left: 0; }
          .content-right { display: none; }
          .mid-row, .bottom-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <ConfettiOverlay active={showConfetti} />

      <div className="dash-root" style={{ background: '#080808' }}>
        <div
          ref={glowRef}
          className="fixed inset-0 pointer-events-none z-0"
          style={{ background: 'radial-gradient(800px circle at 50% 50%, rgba(0,217,255,0.06) 0%, transparent 50%)' }}
        />

        {/* NOISE & GRID */}
        <div className="noise-overlay"></div>
        <div className="grid-lines"></div>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-profile">
            <div className="sidebar-profile flex items-center gap-3">


              {/* Logo / Branding */}
              <Link to="/">
                <div className="text-xl font-bold text-white hidden md:flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white font-extrabold text-sm">
                    S
                  </div>
                  <span>
                    SGSITS
                    <span className="bg-gradient-to-r from-[#00D9FF] to-[#7C3AED] bg-clip-text text-transparent">
                      .MKT
                    </span>
                  </span>
                </div>
              </Link>

            </div>
          </div>

          <div className="sidebar-section-label">Dashboards</div>
          {sidebarDashItems.map(item => (
            <button
              key={item.label}
              className={`sidebar-item ${sidebarActive === item.label ? 'active' : ''}`}
              onClick={() => {
                setSidebarActive(item.label);
                if (item.action) item.action();
              }}
            >
              {item.icon}
              {item.label}
              {item.label !== 'Overview' && <ChevronRight />}
            </button>
          ))}

          <div style={{ height: 20 }} />
          <div className="sidebar-section-label">Settings</div>
          {sidebarSettItems.map(item => (
            <button
              key={item.label}
              className={`sidebar-item ${sidebarActive === item.label ? 'active' : ''}`}
              onClick={() => {
                setSidebarActive(item.label);
                if (item.action) item.action();
              }}
            >
              {item.icon}
              {item.label}
              <ChevronRight />
            </button>
          ))}

          <div className="sidebar-spacer" />
          <div className="sidebar-brand">
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#fff' }}>S</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>SGSITS<span style={{ background: 'linear-gradient(90deg, #00D9FF, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>.MKT</span></span>
            </Link>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="main-area">
          {/* TOP BAR */}
          <header className="topbar">
            <div className="topbar-breadcrumb">

              <span>Dashboard /</span>
              <span className="current">Overview</span>
            </div>
            <div className="topbar-actions">
              <button className="topbar-icon-btn" title="Dark Mode"><MoonIcon /></button>
              <button className="topbar-icon-btn" title="Notifications"><BellIcon /></button>
              <button className="topbar-icon-btn" title="Language"><GlobeIcon /></button>
              <button
                style={{ background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', color: '#fff', border: 'none', borderRadius: 50, padding: '8px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                onClick={() => setIsAddProductOpen(true)}
                title="List a Product"
              >
                <PlusIcon /> List Product
              </button>
              {/* User avatar + name in topbar */}
              <button
                onClick={() => setSidebarActive('My Account')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px 6px 6px', cursor: 'pointer' }}
                title="My Account"
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#0A0A0A' }}>
                  {user?.profilePicture
                    ? <img src={user.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (user?.fullName?.charAt(0).toUpperCase() || 'U')
                  }
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{userName?.split(' ')[0]}</span>
              </button>
            </div>
          </header>

          <div className="content-wrapper">
            {/* CENTER CONTENT */}
            <div className="content-main">
              {sidebarActive === 'My Listings' ? (
                /* ── MY LISTINGS FULL CRUD VIEW ── */
                <>
                  <div className="overview-header">
                    <div>
                      <h1>My Listings</h1>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                        {stats.totalListings} total · {stats.activeListings} active · {stats.soldListings} sold
                      </div>
                    </div>
                    <button
                      className="pricing-cta"
                      style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
                      onClick={() => setIsAddProductOpen(true)}
                    >
                      <PlusIcon /> Add New Listing
                    </button>
                  </div>

                  {/* QUICK STATS ROW */}
                  <div className="stat-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
                    {[
                      { label: 'Total', value: stats.totalListings, color: '#fff' },
                      { label: 'Active', value: stats.activeListings, color: '#00D9FF' },
                      { label: 'Sold', value: stats.soldListings, color: '#10B981' },
                      { label: 'Pending', value: stats.pendingListings, color: '#F59E0B' },
                    ].map(s => (
                      <div className="stat-card" key={s.label}>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* FILTER TABS + LISTINGS GRID */}
                  <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div className="listing-tabs" style={{ marginBottom: 0 }}>
                        {['all', 'active', 'sold', 'pending'].map(tab => (
                          <button
                            key={tab}
                            className={`listing-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab} ({tab === 'all' ? stats.totalListings : stats[`${tab}Listings`] || 0})
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredListings.length > 0 ? filteredListings.map((listing) => (
                      <div className="listing-item" key={listing._id}>
                        <div className="listing-img">
                          <img src={getProductImage(listing)} alt={listing.title} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{listing.title}</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{listing.category || 'Uncategorised'}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {getStatusBadge(listing.status)}
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{getTimeAgo(listing.createdAt)}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 800, color: '#00D9FF', fontSize: 18 }}>{getPriceDisplay(listing)}</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                                👁 {listing.views || 0} views · 🤍 {listing.saves || 0} saves
                              </div>
                            </div>
                          </div>
                          <div className="listing-actions" style={{ marginTop: 10 }}>
                            <button className="listing-action-btn" onClick={() => handleViewProduct(listing._id)}><EyeIcon /> VIEW</button>
                            <button className="listing-action-btn" onClick={() => handleEditProduct(listing)}><EditIcon /> EDIT</button>
                            <button className="listing-action-btn del" onClick={() => handleDelete(listing._id)}><TrashIcon /> DELETE</button>
                            {listing.status === 'active' && (
                              <button className="listing-action-btn" style={{ color: '#10B981', borderColor: 'rgba(16,185,129,0.3)' }} onClick={() => handleMarkAsSold(listing._id)}>✓ MARK SOLD</button>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                        <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>📦</div>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No {activeTab !== 'all' ? activeTab : ''} listings yet</div>
                        <div style={{ fontSize: 13, marginBottom: 20 }}>Start selling by adding your first product</div>
                        <button className="pricing-cta" onClick={() => setIsAddProductOpen(true)}>
                          <PlusIcon /> Add Your First Listing
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : sidebarActive === 'My Deals' ? (
                /* ── MY DEALS VIEW ── */
                <>
                  <div className="overview-header">
                    <div>
                      <h1>My Deals</h1>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                        Accepted negotiations and confirmed sales
                      </div>
                    </div>
                  </div>

                  {/* Sub-tab pills */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {[['negotiations', '🤝 Negotiations'], ['confirmed', '✅ Confirmed Deals']].map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setDealsSubTab(key)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: 30,
                          border: `1.5px solid ${dealsSubTab === key ? 'rgba(0,217,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          background: dealsSubTab === key ? 'rgba(0,217,255,0.1)' : 'transparent',
                          color: dealsSubTab === key ? '#00D9FF' : 'rgba(255,255,255,0.4)',
                          fontWeight: 700,
                          fontSize: 12,
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {(dealsLoading || offersLoading) ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
                      Loading...
                    </div>
                  ) : (() => {
                    // Negotiations sub-tab: pending offers + active deals
                    if (dealsSubTab === 'negotiations') {
                      // Pending offer cards the current user is involved in
                      const pendingReceived = offersReceived.filter(o => o.status === 'pending');
                      const pendingSent = offersSent.filter(o => o.status === 'pending');
                      // Active deals (offer accepted, seller hasn't confirmed sold yet)
                      const activeDeals = deals.filter(d => d.dealStatus === 'active');

                      const hasAnything = pendingReceived.length > 0 || pendingSent.length > 0 || activeDeals.length > 0;

                      if (!hasAnything) {
                        return (
                          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                            <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🤝</div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No negotiations yet</div>
                            <div style={{ fontSize: 13 }}>Make or receive an offer to start negotiating</div>
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                          {/* ── PENDING OFFERS RECEIVED (seller) ── */}
                          {pendingReceived.length > 0 && (
                            <div className="card" style={{ padding: 20 }}>
                              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
                                Incoming Offers
                              </div>
                              {pendingReceived.map(offer => (
                                <div key={offer._id} className="listing-item" style={{ flexDirection: 'column', gap: 10, padding: 14, marginBottom: 10, borderRadius: 10 }}>
                                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div className="listing-img" style={{ width: 52, height: 52 }}>
                                      <img src={offer.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 2 }}>{offer.product?.title}</div>
                                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                                        Buyer: {offer.buyer?.fullName}{offer.buyer?.branch ? ` · ${offer.buyer.branch.toUpperCase()}` : ''}
                                      </div>
                                      {offer.message && (
                                        <div style={{ fontSize: 11, fontStyle: 'italic', color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: 5 }}>
                                          "{offer.message}"
                                        </div>
                                      )}
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                      <div style={{ fontSize: 17, fontWeight: 800, color: '#00D9FF' }}>₹{offer.offerPrice}</div>
                                      {offer.product?.price && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>₹{offer.product.price}</div>}
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                    <button
                                      className="listing-action-btn"
                                      style={{ padding: '6px 14px', fontSize: 11, borderColor: 'rgba(16,185,129,0.4)', color: '#10B981', background: 'rgba(16,185,129,0.08)' }}
                                      onClick={() => handleOfferStatus(offer._id, 'accepted')}
                                    >
                                      ✓ Accept
                                    </button>
                                    <button
                                      className="listing-action-btn del"
                                      style={{ padding: '6px 14px', fontSize: 11 }}
                                      onClick={() => handleOfferStatus(offer._id, 'rejected')}
                                    >
                                      ✕ Reject
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ── PENDING OFFERS SENT (buyer) ── */}
                          {pendingSent.length > 0 && (
                            <div className="card" style={{ padding: 20 }}>
                              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
                                Offers You Sent
                              </div>
                              {pendingSent.map(offer => (
                                <div key={offer._id} className="listing-item" style={{ flexDirection: 'column', gap: 10, padding: 14, marginBottom: 10, borderRadius: 10 }}>
                                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div className="listing-img" style={{ width: 52, height: 52 }}>
                                      <img src={offer.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 2 }}>{offer.product?.title}</div>
                                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                                        Seller: {offer.seller?.fullName}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                      <div style={{ fontSize: 17, fontWeight: 800, color: '#00D9FF' }}>₹{offer.offerPrice}</div>
                                      {offer.product?.price && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>₹{offer.product.price}</div>}
                                      <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 1, padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.08)', color: '#F59E0B', display: 'inline-block', marginTop: 4 }}>PENDING</span>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                      className="listing-action-btn"
                                      style={{ padding: '6px 14px', fontSize: 11, color: 'rgba(255,100,100,0.8)', borderColor: 'rgba(239,68,68,0.3)' }}
                                      onClick={() => handleOfferStatus(offer._id, 'cancelled')}
                                    >
                                      Cancel Offer
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ── ACCEPTED DEALS (awaiting seller confirm) ── */}
                          {activeDeals.length > 0 && (
                            <div className="card" style={{ padding: 20 }}>
                              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
                                Accepted — Awaiting Handoff
                              </div>
                              {activeDeals.map((deal) => {
                                const sellerId = typeof deal.seller === 'object' ? deal.seller?._id : deal.seller;
                                const isSeller = sellerId?.toString() === currentUserId;
                                const otherParty = isSeller ? deal.buyer : deal.seller;
                                return (
                                  <div key={deal._id} className="listing-item" style={{ flexDirection: 'column', gap: 10, padding: 14, marginBottom: 10, borderRadius: 10 }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                      <div className="listing-img" style={{ width: 52, height: 52 }}>
                                        <img src={deal.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 2 }}>{deal.product?.title}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                                          {isSeller
                                            ? `Buyer: ${typeof otherParty === 'object' ? otherParty?.fullName : '—'}`
                                            : `Seller: ${typeof otherParty === 'object' ? otherParty?.fullName : '—'}`}
                                          {typeof otherParty === 'object' && otherParty?.branch ? ` · ${otherParty.branch.toUpperCase()}` : ''}
                                        </div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>via {deal.source === 'chat' ? 'Chat' : 'Offer'}</div>
                                      </div>
                                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: 17, fontWeight: 800, color: '#00D9FF' }}>₹{deal.agreedPrice}</div>
                                        {deal.product?.price && deal.agreedPrice !== deal.product.price && (
                                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>₹{deal.product.price}</div>
                                        )}
                                        <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 1, padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.08)', color: '#10B981', display: 'inline-block', marginTop: 4 }}>ACCEPTED</span>
                                      </div>
                                    </div>
                                    {/* Seller: Mark as Handed Over */}
                                    {isSeller && (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '11px 14px' }}>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                                          Ready to hand over the item?
                                        </div>
                                        <button
                                          onClick={() => handleConfirmSold(deal._id)}
                                          style={{ padding: '7px 16px', borderRadius: 6, border: '1.5px solid rgba(16,185,129,0.5)', background: 'rgba(16,185,129,0.15)', color: '#10B981', fontWeight: 700, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                                        >
                                          📦 Handed Over
                                        </button>
                                      </div>
                                    )}
                                    {/* Buyer: Mark as Received */}
                                    {!isSeller && (
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.15)', borderRadius: 8, padding: '11px 14px' }}>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                                          Got the item? Confirm receipt here.
                                        </div>
                                        <button
                                          onClick={() => handleConfirmSold(deal._id)}
                                          style={{ padding: '7px 16px', borderRadius: 6, border: '1.5px solid rgba(0,217,255,0.4)', background: 'rgba(0,217,255,0.1)', color: '#00D9FF', fontWeight: 700, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                                        >
                                          ✓ Received Item
                                        </button>
                                      </div>
                                    )}

                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    }

                    // ── CONFIRMED DEALS sub-tab ──
                    const confirmedDeals = deals.filter(d => d.dealStatus === 'sold');
                    if (confirmedDeals.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>✅</div>
                          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No confirmed deals yet</div>
                          <div style={{ fontSize: 13 }}>Deals move here once the seller confirms them as sold</div>
                        </div>
                      );
                    }

                    return confirmedDeals.map((deal) => {
                      const sellerId = typeof deal.seller === 'object' ? deal.seller?._id : deal.seller;
                      const userId = user?._id;
                      const isSeller = sellerId?.toString() === currentUserId;
                      const isBuyer = !isSeller;
                      const otherParty = isSeller ? deal.buyer : deal.seller;
                      const r = reviewState[deal._id] || {};

                      return (
                        <div
                          key={deal._id}
                          className="listing-item"
                          style={{ flexDirection: 'column', gap: 12, padding: 16, marginBottom: 12, borderRadius: 12 }}
                        >
                          {/* Deal header row */}
                          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <div className="listing-img" style={{ width: 60, height: 60 }}>
                              <img src={deal.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 3 }}>
                                    {deal.product?.title}
                                  </div>
                                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>
                                    {isSeller
                                      ? `Buyer: ${typeof otherParty === 'object' ? otherParty?.fullName : '—'}`
                                      : `Seller: ${typeof otherParty === 'object' ? otherParty?.fullName : '—'}`}
                                    {typeof otherParty === 'object' && otherParty?.branch
                                      ? ` · ${otherParty.branch.toUpperCase()}` : ''}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                      fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                                      textTransform: 'uppercase', letterSpacing: 1, padding: '2px 8px',
                                      borderRadius: 4,
                                      border: `1px solid ${deal.dealStatus === 'sold' ? 'rgba(16,185,129,0.3)' : 'rgba(0,217,255,0.3)'}`,
                                      background: deal.dealStatus === 'sold' ? 'rgba(16,185,129,0.1)' : 'rgba(0,217,255,0.1)',
                                      color: deal.dealStatus === 'sold' ? '#10B981' : '#00D9FF'
                                    }}>
                                      {deal.dealStatus === 'sold' ? 'SOLD' : 'ACTIVE'}
                                    </span>
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                                      via {deal.source === 'chat' ? 'Chat' : 'Offer'}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                  <div style={{ fontSize: 18, fontWeight: 800, color: '#00D9FF' }}>₹{deal.agreedPrice}</div>
                                  {deal.product?.price && deal.agreedPrice !== deal.product.price && (
                                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                                      ₹{deal.product.price}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* SELLER: Confirm as Sold button (Negotiations tab) */}
                          {isSeller && deal.dealStatus === 'active' && (
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)',
                              borderRadius: 8, padding: '10px 14px'
                            }}>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                                Hand off the item? Confirm the sale to finalise.
                              </div>
                              <button
                                onClick={() => handleConfirmSold(deal._id)}
                                style={{
                                  padding: '7px 16px', borderRadius: 6,
                                  border: '1.5px solid rgba(16,185,129,0.5)',
                                  background: 'rgba(16,185,129,0.15)', color: '#10B981',
                                  fontWeight: 700, fontSize: 12, fontFamily: 'inherit',
                                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s'
                                }}
                              >
                                ✓ Confirm as Sold
                              </button>
                            </div>
                          )}

                          {/* BUYER: Review form or submitted review (Confirmed Deals tab) */}
                          {isBuyer && deal.dealStatus === 'sold' && (
                            deal.review?.submittedAt ? (
                              <div style={{
                                background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)',
                                borderRadius: 8, padding: '10px 14px'
                              }}>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Your review</div>
                                <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <span key={s} style={{ fontSize: 14, color: s <= deal.review.rating ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}>★</span>
                                  ))}
                                </div>
                                {deal.review.comment && (
                                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                                    "{deal.review.comment}"
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div style={{
                                background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)',
                                borderRadius: 8, padding: '12px 14px'
                              }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
                                  Rate your experience with the seller
                                </div>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                      key={star}
                                      onClick={() => setReviewState(prev => ({
                                        ...prev,
                                        [deal._id]: { ...prev[deal._id], rating: star }
                                      }))}
                                      style={{
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                        fontSize: 24, lineHeight: 1,
                                        color: star <= (r.rating || 0) ? '#F59E0B' : 'rgba(255,255,255,0.2)',
                                        transition: 'color 0.15s'
                                      }}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  value={r.comment || ''}
                                  onChange={(e) => setReviewState(prev => ({
                                    ...prev,
                                    [deal._id]: { ...prev[deal._id], comment: e.target.value }
                                  }))}
                                  placeholder="Share your experience (optional)..."
                                  rows={2}
                                  style={{
                                    width: '100%', background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                                    color: '#fff', fontSize: 12, padding: '8px 10px',
                                    fontFamily: 'inherit', resize: 'none', outline: 'none',
                                    marginBottom: 10
                                  }}
                                />
                                <button
                                  onClick={() => handleSubmitReview(deal._id)}
                                  disabled={!r.rating || r.submitting}
                                  style={{
                                    padding: '7px 18px', borderRadius: 6, border: 'none',
                                    background: r.rating
                                      ? 'linear-gradient(135deg, #7C3AED, #00D9FF)'
                                      : 'rgba(255,255,255,0.08)',
                                    color: r.rating ? '#fff' : 'rgba(255,255,255,0.3)',
                                    fontWeight: 700, fontSize: 12, fontFamily: 'inherit',
                                    cursor: r.rating ? 'pointer' : 'not-allowed', transition: 'all 0.15s'
                                  }}
                                >
                                  {r.submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                              </div>
                            )
                          )}

                          {/* SELLER: sees buyer's submitted review */}
                          {isSeller && deal.review?.submittedAt && (
                            <div style={{
                              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                              borderRadius: 8, padding: '10px 14px'
                            }}>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Buyer's review</div>
                              <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                                {[1, 2, 3, 4, 5].map(s => (
                                  <span key={s} style={{ fontSize: 14, color: s <= deal.review.rating ? '#F59E0B' : 'rgba(255,255,255,0.15)' }}>★</span>
                                ))}
                              </div>
                              {deal.review.comment && (
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                                  "{deal.review.comment}"
                                </div>
                              )}
                            </div>
                          )}

                          {/* DEAL HISTORY BUTTON */}
                          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 4 }}>
                            <button
                              onClick={() => setDealHistoryOpen(deal)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 8,
                                border: '1.5px solid rgba(0,217,255,0.25)',
                                background: 'rgba(0,217,255,0.06)',
                                color: '#00D9FF', fontFamily: 'inherit',
                                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.15s',
                                letterSpacing: 0.4,
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.45)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,217,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.25)'; }}
                            >
                              📋 Deal History
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </>
              ) : sidebarActive === 'Saved Products' ? (

                /* ── SAVED PRODUCTS VIEW ── */
                <>
                  <div className="overview-header">
                    <div>
                      <h1>Saved Products</h1>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                        Products you've hearted across the marketplace
                      </div>
                    </div>
                    <button
                      className="pricing-cta"
                      style={{ padding: '10px 20px', fontSize: 13 }}
                      onClick={() => navigate('/marketplace')}
                    >
                      Browse Marketplace
                    </button>
                  </div>

                  <div className="card" style={{ padding: 20 }}>
                    {savedLoading ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
                        Loading saved products...
                      </div>
                    ) : savedProducts.length > 0 ? savedProducts.map((item) => (
                      <div className="listing-item" key={item._id}>
                        <div className="listing-img">
                          <img src={getProductImage(item)} alt={item.title} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                                {item.category} · by {typeof item.seller === 'object' ? item.seller.fullName : 'Unknown'}
                              </div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{getTimeAgo(item.createdAt)}</div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontWeight: 800, color: '#00D9FF', fontSize: 18 }}>{getPriceDisplay(item)}</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                                {item.saves || 0} saves · {item.views || 0} views
                              </div>
                            </div>
                          </div>
                          <div className="listing-actions" style={{ marginTop: 10 }}>
                            <button className="listing-action-btn" onClick={() => handleViewProduct(item._id)}>
                              <EyeIcon /> VIEW
                            </button>
                            <button
                              className="listing-action-btn del"
                              style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
                              onClick={async () => {
                                try {
                                  const res = await productAPI.toggleSave(item._id);
                                  if (res.success && !res.saved) {
                                    setSavedProducts(prev => prev.filter(p => p._id !== item._id));
                                    toggleSavedId(item._id);
                                  }
                                } catch (e) { console.error(e); }
                              }}
                            >
                              <HeartFilledIcon /> UNSAVE
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                        <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🤍</div>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No saved products yet</div>
                        <div style={{ fontSize: 13, marginBottom: 20 }}>Heart products in the marketplace to save them here</div>
                        <button className="pricing-cta" onClick={() => navigate('/marketplace')}>
                          Browse Marketplace
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : sidebarActive === 'My Account' ? (
                /* ── MY ACCOUNT VIEW ── */
                <MyAccount />
              ) : (
                /* ── OVERVIEW ── */
                <>
                  {/* OVERVIEW HEADER */}
                  <div className="overview-header">
                    <h1>Overview</h1>

                  </div>

                  {/* STAT CARDS */}
                  <div className="stat-row">
                    <div className="stat-card">
                      <div className="stat-label">Total Listings</div>
                      <div className="stat-value">{stats.totalListings}</div>
                      <div className="stat-change" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {stats.activeListings} active, {stats.soldListings} sold
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Total Views</div>
                      <div className="stat-value">{stats.totalViews}</div>
                      <div className="stat-change up">
                        <ArrowUp color="#00D9FF" />
                        {stats.totalListings > 0 ? Math.round(stats.totalViews / stats.totalListings) : 0} avg per listing
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Total Saves</div>
                      <div className="stat-value">{stats.totalSaves}</div>
                      <div className="stat-change" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        People interested
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Revenue</div>
                      <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                      <div className="stat-change up">
                        <ArrowUp color="#00D9FF" /> {stats.soldListings} items sold
                      </div>
                    </div>
                  </div>

                  {/* SALES OVERVIEW + SIDE STATS */}
                  <div className="mid-row">
                    <div className="card">
                      <div className="card-header">
                        <span className="card-title">Category Distribution</span>
                        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><MoreVert /></button>
                      </div>
                      <div className="sales-info">
                        <div className="sales-icon-circle"><PackageIcon /></div>
                        <div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Total Listed Items</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{stats.totalListings}</div>
                        </div>
                      </div>
                      <div className="sales-content">
                        <DonutChart data={donutData} size={170} />
                        <div className="sales-legend" style={{ minWidth: 160 }}>
                          {donutData.map((d, i) => (
                            <div className="legend-item" key={i}>
                              <span className="legend-dot" style={{ background: d.color }} />
                              <span>{d.label}</span>
                              <span className="amount">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="side-stats">
                      <div className="mini-stat-card">
                        <div className="mini-stat-label">Active Listings</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span className="mini-stat-value">{stats.activeListings}</span>
                          <span style={{ color: '#00D9FF', fontSize: 11, fontWeight: 600 }}>↑</span>
                        </div>
                        <div className="mini-stat-sub">Available now</div>
                      </div>
                      <div className="mini-stat-card">
                        <div className="mini-stat-label">Pending Approval</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span className="mini-stat-value">{stats.pendingListings}</span>
                          <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 600 }}>⏳</span>
                        </div>
                        <div className="mini-stat-sub">Awaiting review</div>
                      </div>
                    </div>
                  </div>

                  {/* PROFIT CHART + LISTINGS */}
                  <div className="bottom-row" style={{ gridTemplateColumns: '2fr 3fr' }}>
                    {/* TOTAL PROFIT */}
                    <div className="profit-card">
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Engagement Growth</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Views + Saves per listing · chronological</div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                        {stats.totalViews + stats.totalSaves} <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>interactions</span>
                      </div>
                      {engagementData.some(v => v > 0) ? (
                        <MiniLineChart data={engagementData} width={260} height={90} color="#00D9FF" />
                      ) : (
                        <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                          Add listings to see your growth curve
                        </div>
                      )}
                    </div>

                    {/* MY LISTINGS */}
                    <div className="card" style={{ maxHeight: 420, overflow: 'auto' }}>
                      <div className="card-header">
                        <span className="card-title">My Listings</span>
                      </div>
                      <div className="listing-tabs">
                        {['all', 'active', 'sold', 'pending'].map(tab => (
                          <button
                            key={tab}
                            className={`listing-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab} ({tab === 'all' ? stats.totalListings : stats[`${tab}Listings`] || 0})
                          </button>
                        ))}
                      </div>
                      {filteredListings.length > 0 ? filteredListings.slice(0, 5).map((listing) => (
                        <div className="listing-item" key={listing._id}>
                          <div className="listing-img">
                            <img src={getProductImage(listing)} alt={listing.title} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>{listing.title}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {getStatusBadge(listing.status)}
                                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{getTimeAgo(listing.createdAt)}</span>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, color: '#00D9FF', fontSize: 16 }}>{getPriceDisplay(listing)}</div>
                              </div>
                            </div>
                            <div className="listing-actions">
                              <button className="listing-action-btn" onClick={() => handleViewProduct(listing._id)}><EyeIcon /> VIEW</button>
                              <button className="listing-action-btn" onClick={() => handleEditProduct(listing)}><EditIcon /> EDIT</button>
                              <button className="listing-action-btn del" onClick={() => handleDelete(listing._id)}><TrashIcon /> DEL</button>
                              {listing.status === 'active' && (
                                <button className="listing-action-btn" onClick={() => handleMarkAsSold(listing._id)}>SOLD</button>
                              )}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.3)' }}>
                          <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.3 }}>📦</div>
                          <div style={{ fontSize: 13 }}>No {activeTab !== 'all' ? activeTab : ''} listings yet</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM ROW: TOP PERFORMING + PREMIUM SELLER */}
                  <div className="bottom-row">
                    <div className="card">
                      <div className="card-header">
                        <span className="card-title">Top Performing</span>
                        <button
                          style={{ background: 'none', border: 'none', color: '#00D9FF', fontSize: 11, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}
                          onClick={() => setSidebarActive('My Listings')}
                        >
                          See All →
                        </button>
                      </div>
                      {listings.length > 0 ? (() => {
                        const maxViews = Math.max(...listings.map(l => l.views || 0), 1);
                        return [...listings]
                          .sort((a, b) => (b.views || 0) - (a.views || 0))
                          .slice(0, 3)
                          .map((l, i) => (
                            <div key={l._id} style={{ marginBottom: 16 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: ['#00D9FF', '#7C3AED', '#F59E0B'][i], flexShrink: 0 }}>#{i + 1}</span>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                                </div>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginLeft: 8 }}>👁 {l.views || 0} · 🤍 {l.saves || 0}</span>
                              </div>
                              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%',
                                  width: `${Math.round(((l.views || 0) / maxViews) * 100)}%`,
                                  background: `linear-gradient(90deg, ${['#00D9FF', '#7C3AED', '#F59E0B'][i]}, ${['#7C3AED', '#F59E0B', '#10B981'][i]})`,
                                  borderRadius: 2,
                                  transition: 'width 0.8s ease'
                                }} />
                              </div>
                            </div>
                          ));
                      })() : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                          No listings yet — add one to see top performers
                        </div>
                      )}
                    </div>

                    {/* PRICING */}
                    <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="pricing-badge">
                        <ZapIcon /> Premium Seller
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                        <span className="pricing-amount">{stats.soldListings}</span>
                        <span className="pricing-per">Items<br />Sold</span>
                      </div>
                      <div className="pricing-desc">
                        Keep selling to unlock premium<br />features and seller badges 🚀
                      </div>
                      <button className="pricing-cta" onClick={() => setIsAddProductOpen(true)}>Add New Product</button>
                    </div>
                  </div>
                </>
              )}
            </div >

            {/* RIGHT PANEL */}
            < div className="content-right" >
              {/* ACTIVITY */}
              < div className="right-section-title" > Activity</div >
              {
                activityItems.map((n, i) => (
                  <div className="notif-item" key={i}>
                    <div className="notif-dot" style={{ background: n.color }} />
                    <div>
                      <div className="notif-text">{n.text}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  </div>
                ))
              }

              < hr className="divider" />

              {/* QUICK STATS */}
              < div className="right-section-title" > Quick Stats</div >
              {
                quickStatsItems.map((a, i) => (
                  <div className="activity-item" key={i} style={{ alignItems: 'flex-start' }}>
                    <div className="activity-icon" style={{ background: `${a.color}20`, color: a.color, fontSize: 14, minWidth: 34, height: 34 }}>
                      {a.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="notif-time" style={{ marginBottom: 1 }}>{a.label}</div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: a.color, lineHeight: 1.1 }}>{a.value}</div>
                      <div className="notif-time" style={{ marginTop: 1 }}>{a.sub}</div>
                    </div>
                  </div>
                ))
              }
            </div >
          </div >
        </div >

        {/* DELETE MODAL */}
        {
          showDeleteModal && (
            <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Delete Listing?</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
                  Are you sure you want to delete this listing? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    style={{ flex: 1, padding: '10px', background: '#EF4444', border: 'none', color: '#fff', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* DEAL HISTORY MODAL */}
        {dealHistoryOpen && (
          <DealHistoryModal
            deal={dealHistoryOpen}
            onClose={() => setDealHistoryOpen(null)}
            currentUserId={currentUserId}
          />
        )}

        {/* ADD PRODUCT MODAL */}
        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => { setIsAddProductOpen(false); fetchDashboardData(); }}
        />

        {/* EDIT PRODUCT MODAL */}
        <EditProductModal
          isOpen={isEditProductOpen}
          onClose={(success) => { setIsEditProductOpen(false); setEditingProduct(null); if (success) fetchDashboardData(); }}
          product={editingProduct}
        />
      </div >
    </>
  );
};

export default UserDashboard;