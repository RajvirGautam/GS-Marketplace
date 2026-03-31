import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { productAPI, offerAPI, dealAPI } from '../../services/api';
import AddProductModal from './AddProductModal';
import EditProductModal from './dashboard/EditProductModal';
import MyAccount from './dashboard/MyAccount';
import NotificationBell from '../ui/NotificationBell';
import Avatar from '../ui/Avatar';
import { useOnboarding } from '../../context/OnboardingContext';

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


// CountUp Component for stats
const CountUp = ({ end, duration = 1500, prefix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{prefix}{count.toLocaleString()}</>;
};

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
  const isBuyer = (typeof deal.buyer === 'object' ? deal.buyer?._id : deal.buyer)?.toString() === currentUserId;
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
      color: '#3B82F6',
      done: true,
    },
    {
      icon: '🤝',
      label: 'Offer Accepted',
      desc: deal.source === 'chat'
        ? `Agreed price locked via chat negotiation`
        : `${isSeller ? 'You accepted' : `${otherName} accepted`} the offer — deal was created`,
      time: deal.createdAt,
      color: '#10B981',
      done: true,
    },
    {
      icon: '⚡',
      label: 'Deal Opened',
      desc: `Both parties committed — agreed price ₹${deal.agreedPrice}`,
      time: deal.createdAt,
      color: '#8B5CF6',
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
          border: 'none',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderBottom: 'none',
          padding: '20px 20px 16px',
          position: 'relative',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: 6, color: 'rgba(255,255,255,0.5)',
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 14, lineHeight: 1,
            }}
          >✕</button>

          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'none', color: '#3B82F6', marginBottom: 10 }}>
            Deal History
          </div>

          {/* Product row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img
              src={deal.product?.images?.[0] || '/placeholder.jpg'}
              alt=""
              style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', border: 'none' }}
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
                  fontSize: 14, fontWeight: 800, color: '#3B82F6',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>₹{deal.agreedPrice}</span>
                {deal.product?.price && deal.agreedPrice !== deal.product.price && (
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>₹{deal.product.price}</span>
                )}
                <span style={{
                  fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace',
                  textTransform: 'none', letterSpacing: 1, padding: '2px 7px',
                  borderRadius: 4, border: 'none',
                  background: 'rgba(16,185,129,0.1)', color: '#10B981'
                }}>SOLD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'none', color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>
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
                    {step.hideDetails ? "Review content is hidden" : step.desc}
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
  const location = useLocation();
  const { user, logout, toggleSavedId } = useAuth();
  const { notifications } = useSocket();

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

  // Register sidebar setter for onboarding tour
  const { registerTabSetter } = useOnboarding();
  useEffect(() => {
    registerTabSetter(setSidebarActive);
  }, [registerTabSetter, setSidebarActive]);

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

  // ── Deep-link: read ?tab= URL param and switch to the right sidebar/subtab ──
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'negotiations') {
      setSidebarActive('My Deals');
      setDealsSubTab('negotiations');
    } else if (tab === 'deals') {
      setSidebarActive('My Deals');
      setDealsSubTab('deals');
    } else if (tab) {
      setSidebarActive(tab);
    }
    // Clear the param from the URL so navigating back works cleanly
    if (tab) navigate(location.pathname, { replace: true });
  }, [location.search]);

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

  // ── Real-time: re-fetch offers/deals when a relevant notification arrives ──
  useEffect(() => {
    if (!notifications.length) return;
    const latest = notifications[0]; // SocketContext prepends newest first
    const offerTypes = ['new_offer', 'offer_accepted', 'offer_rejected', 'deal_done'];
    if (offerTypes.includes(latest?.type)) {
      fetchOffers();
      fetchDeals();
    }
  }, [notifications]);

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
      active: {
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#f4f4f5',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      sold: {
        background: 'rgba(255, 255, 255, 0.06)',
        color: '#d4d4d8',
        border: '1px solid rgba(255, 255, 255, 0.16)'
      },
      pending: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#a1a1aa',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }
    };
    const style = styles[status] || styles.active;
    return (
      <span
        style={{
          ...style,
          padding: '3px 9px',
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: 0.7,
          fontFamily: 'JetBrains Mono, monospace'
        }}
      >
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
      { label: 'Electronics', value: 5, color: '#3B82F6' },
      { label: 'Books', value: 3, color: '#8B5CF6' },
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
        color: '#3B82F6'
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
        color: '#3B82F6'
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
        color: '#8B5CF6'
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
      { label: 'Sell-through rate', value: `${sellThrough}%`, sub: `${stats.soldListings}/${stats.totalListings} sold`, color: '#3B82F6' },
      { label: 'Avg views / listing', value: avgViews, sub: `${stats.totalViews} total views`, color: '#8B5CF6' },
      { label: 'Save rate', value: `${saveRate}%`, sub: `of viewers save`, color: '#F59E0B' },
      { label: 'Active listings', value: healthyListings, sub: `of ${stats.totalListings} total`, color: '#10B981' },
    ];
  })();

  const sidebarDashItems = [
    { label: 'Overview', icon: <HomeIcon />, onboarding: 'dash-overview' },
    { label: 'My Listings', icon: <PackageIcon />, onboarding: 'dash-listings' },
    { label: 'Saved Products', icon: <HeartFilledIcon />, onboarding: 'dash-saved' },
    { label: 'My Deals', icon: <TrendingIcon />, onboarding: 'dash-deals' },
  ];
  const sidebarSettItems = [
    { label: 'Messages', icon: <MessageIcon />, action: () => navigate('/chat') },
    { label: 'My Account', icon: <UsersIcon /> },
    { label: 'Logout', icon: <HelpIcon />, action: () => { logout(); navigate('/'); } },
  ];

  if (loading) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Manrope, sans-serif' }}>
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  const mobileTabs = ['Overview', 'My Listings', 'My Deals', 'Saved Products', 'My Account'];
  const activeMobileTab = mobileTabs.includes(sidebarActive) ? sidebarActive : 'Overview';

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
          background: #F5F5F7;
          color: #111111;
          font-weight: 700;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .sidebar-item.active svg { stroke: #111111; }

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

        /* Mesh Gradient Button (Desktop) */
        .btn-mesh-desktop {
          background: radial-gradient(circle at 20% 30%, #4c1d95 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, #9333ea 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, #7c3aed 0%, #1e1b4b 100%);
          box-shadow: 
            0 0 15px rgba(167, 139, 250, 0.4), 
            inset 0 0 8px rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          border: none;
          border-radius: 9999px;
          padding: 9px 18px;
          color: white;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.025em;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Manrope', sans-serif;
          cursor: pointer;
        }

        .btn-mesh-desktop:hover {
          transform: scale(1.02);
          box-shadow: 
            0 0 25px rgba(167, 139, 250, 0.6), 
            inset 0 0 12px rgba(255, 255, 255, 0.4);
        }

        .btn-mesh-desktop:active {
          transform: scale(0.98);
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
          background: #161618;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: #1c1c1f;
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
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1;
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
          background: #161618;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 24px;
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
          gap: 12px;
        }

        .mini-stat-card {
          background: #161618;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 14px 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .mini-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .mini-stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1;
        }

        .mini-stat-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
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
          background: #161618;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 24px;
        }

        /* ═══════════ PRICING CARD - SOFT BRUTALISM ═══════════ */
        .pricing-card {
          background: #161618;
          border: 1.5px solid rgba(0,217,255,0.2);
          border-radius: 8px;
          padding: 24px;
          text-align: center;
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
          background: #161618;
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 10px;
          display: flex;
          gap: 14px;
          transition: all 0.2s;
        }

        .listing-item:hover {
          border-color: rgba(0,217,255,0.3);
          background: #1c1c1f;
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

        /* Essential for ensuring mobile buttons get events instead of overlapping parents */
        .listing-action-btn {
          position: relative;
          z-index: 10;
        }

        /* ═══════════ MARKET THEME (LISTINGS / SAVED / DEALS) ═══════════ */
        .market-theme {
          --market-paper: #f4f4f5;
          --market-bg: #0a0a0b;
          --market-bg-soft: #111214;
          --market-bg-lift: #18191d;
          --market-border: rgba(255, 255, 255, 0.08);
          --market-border-strong: rgba(255, 255, 255, 0.16);
          --market-text: #f4f4f5;
          --market-muted: rgba(244, 244, 245, 0.58);
          --market-accent: #f4f4f5;
          --market-accent-2: #d4d4d8;
          --market-danger: #f87171;
          --market-shadow: none;
        }

        .market-theme .overview-header h1 {
          font-family: 'Manrope', sans-serif;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.3px;
          color: var(--market-paper);
        }

        .market-theme .overview-header > div > div {
          color: var(--market-muted) !important;
          font-size: 13px;
        }

        .market-theme .market-section-panel {
          background: var(--market-bg-soft);
          border: 1px solid var(--market-border);
          border-radius: 14px;
          padding: 18px;
          box-shadow: var(--market-shadow);
        }

        .market-theme .market-main-btn {
          border: 1px solid var(--market-border-strong);
          border-radius: 999px;
          padding: 9px 16px;
          background: var(--market-bg-lift);
          color: var(--market-paper);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3px;
          font-family: 'Manrope', sans-serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.18s ease, border-color 0.18s ease;
        }

        .market-theme .market-main-btn:hover {
          background: #1f2024;
          border-color: rgba(255, 255, 255, 0.24);
        }

        .market-theme .market-chip-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .market-theme .market-chip {
          border: 1px solid var(--market-border);
          background: #0f1012;
          color: var(--market-muted);
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.45px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.16s ease;
          white-space: nowrap;
        }

        .market-theme .market-chip.active {
          background: #1d2025;
          color: #f4f4f5;
          border-color: rgba(255, 255, 255, 0.22);
        }

        .market-theme .market-chip-soft {
          border-color: rgba(255, 255, 255, 0.22);
          color: #e4e4e7;
          background: #1a1d22;
        }

        .market-theme .market-metric-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }

        .market-theme .market-metric-card {
          background: #0d0e10;
          border: 1px solid var(--market-border);
          border-radius: 10px;
          padding: 12px;
        }

        .market-theme .market-metric-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.65px;
          color: var(--market-muted);
          margin-bottom: 5px;
          font-family: 'JetBrains Mono', monospace;
        }

        .market-theme .market-metric-value {
          font-size: 25px;
          line-height: 1;
          color: var(--market-paper);
          font-weight: 800;
          font-family: 'Manrope', sans-serif;
        }

        .market-theme .card {
          background: var(--market-bg-soft);
          border: 1px solid var(--market-border);
          border-radius: 14px;
          box-shadow: var(--market-shadow);
        }

        .market-theme .listing-tabs {
          gap: 8px;
          flex-wrap: wrap;
        }

        .market-theme .listing-tab {
          border-radius: 999px;
          border: 1px solid var(--market-border);
          color: var(--market-muted);
          background: #101114;
          padding: 7px 12px;
        }

        .market-theme .listing-tab.active {
          border-color: rgba(255, 255, 255, 0.24);
          color: #f4f4f5;
          background: #1c1f24;
        }

        .market-theme .listing-item {
          background: #0f1012;
          border: 1px solid var(--market-border);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 10px;
          transition: border-color 0.16s ease, background 0.16s ease;
        }

        .market-theme .listing-item:hover {
          border-color: var(--market-border-strong);
          background: #14161a;
        }

        .market-theme .listing-item-mylist {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          gap: 14px;
          padding: 16px;
          margin-bottom: 0;
          border-radius: 14px;
          background: linear-gradient(180deg, #101116 0%, #0d0e12 100%);
        }

        .market-theme .mylistings-grid-desktop {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .market-theme .listing-item-mylist .listing-img {
          width: 112px;
          height: 112px;
          border-radius: 12px;
        }

        .market-theme .listing-kpi-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .market-theme .listing-kpi-pill {
          border: 1px solid var(--market-border);
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 10px;
          color: var(--market-muted);
          background: #13151a;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.25px;
        }

        .market-theme .listing-item-mylist .listing-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 12px;
        }

        .market-theme .listing-item-mylist .listing-action-btn {
          width: 100%;
          justify-content: center;
        }

        .market-theme .listing-item-mylist-mobile {
          display: block;
          padding: 0;
          overflow: hidden;
          border-radius: 14px;
          background: linear-gradient(180deg, #101116 0%, #0d0e12 100%);
        }

        .market-theme .listing-item-mylist-mobile .listing-img {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid var(--market-border);
        }

        .market-theme .listing-mylist-mobile-body {
          padding: 12px;
        }

        .market-theme .listing-item-mylist-mobile .listing-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 10px;
        }

        .market-theme .listing-item-mylist-mobile .listing-action-btn {
          width: 100%;
          justify-content: center;
        }

        .market-theme .listing-img {
          width: 78px;
          height: 78px;
          border-radius: 10px;
          border: 1px solid var(--market-border);
          background: #0b0c0e;
        }

        .market-theme .listing-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .market-theme .listing-action-btn {
          border-radius: 999px;
          padding: 6px 12px;
          border: 1px solid #334155;
          background: #1e293b;
          color: #f8fafc;
          font-size: 10px;
          letter-spacing: 0.45px;
        }

        .market-theme .listing-action-btn:hover {
          border-color: #475569;
          background: #334155;
        }

        .market-theme .listing-action-btn.del {
          color: #fff5f7;
          border-color: #6a1f2b;
          background: #6a1f2b;
        }

        .market-theme .listing-action-btn.del:hover {
          color: #fff5f7;
          border-color: #581823;
          background: #581823;
        }

        .market-theme .market-price {
          color: #f4f4f5;
          font-family: 'Manrope', sans-serif;
          font-size: 22px;
          line-height: 1;
          letter-spacing: -0.2px;
          font-weight: 800;
        }

        .market-theme .market-meta {
          font-size: 11px;
          color: var(--market-muted);
          line-height: 1.4;
        }

        .market-theme .market-empty {
          text-align: center;
          padding: 54px 12px;
          color: var(--market-muted);
        }

        .market-theme .market-empty-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          margin: 0 auto 12px;
          border: 1px solid var(--market-border);
          background: #121316;
        }

        .market-theme .market-deal-toggle {
          border: 1px solid var(--market-border);
          background: #111215;
          color: var(--market-muted);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.35px;
          cursor: pointer;
          transition: all 0.16s ease;
        }

        .market-theme .market-deal-toggle.active {
          background: #1d2025;
          border-color: rgba(255, 255, 255, 0.22);
          color: #f4f4f5;
        }

        .market-theme .market-deal-toggle.negotiations.active {
          background: #1d4ed8;
          border-color: #1d4ed8;
          color: #f8fbff;
        }

        .market-theme .market-deal-toggle.confirmed.active {
          background: #15803d;
          border-color: #15803d;
          color: #f3fff8;
        }

        .market-theme .market-note {
          background: #111316;
          border: 1px solid var(--market-border);
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .market-theme .market-note > div {
          font-size: 12px;
          color: var(--market-muted);
        }

        .market-theme .market-note button {
          border: 1px solid var(--market-border-strong);
          border-radius: 999px;
          padding: 7px 13px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          background: #1b1e23;
          color: var(--market-paper);
        }

        .market-theme textarea {
          background: #121417 !important;
          border: 1px solid var(--market-border) !important;
          color: var(--market-paper) !important;
          border-radius: 10px !important;
        }

        .market-theme textarea::placeholder {
          color: var(--market-muted);
        }

        .market-theme .pricing-cta {
          background: #1a1c21;
          color: #f4f4f5;
          border-radius: 999px;
          border: 1px solid var(--market-border-strong);
          font-family: 'Manrope', sans-serif;
          box-shadow: none;
        }

        .market-theme .pricing-cta:hover {
          background: #20242a;
          border-color: rgba(255, 255, 255, 0.24);
          box-shadow: none;
        }

        .market-theme .mobile-section-title {
          font-size: 26px;
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          color: var(--market-paper);
          line-height: 1.08;
          margin-bottom: 5px;
        }

        .market-theme .mobile-section-sub {
          font-size: 12px;
          color: var(--market-muted);
          margin-bottom: 14px;
          line-height: 1.45;
        }

        @media (max-width: 900px) {
          .market-theme .market-metric-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .market-theme .listing-item-mylist {
            grid-template-columns: 1fr;
          }

          .market-theme .listing-item-mylist .listing-img {
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 9;
          }

          .market-theme .listing-item-mylist .listing-actions {
            grid-template-columns: 1fr 1fr;
          }

          .market-theme .mylistings-grid-desktop {
            grid-template-columns: 1fr;
          }

          .market-theme .market-main-btn {
            padding: 8px 13px;
            font-size: 10px;
          }

          .market-theme .listing-img {
            width: 68px;
            height: 68px;
          }

          .market-theme .market-price {
            font-size: 20px;
          }
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

        /* ═══════════ MY DEALS REDESIGN ═══════════ */
        .deals-page-bg {
          background: #060606;
          border-radius: 16px;
          padding: 28px 28px 32px;
          min-height: 400px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .deals-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .deals-title {
          font-family: 'Manrope', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #f4f4f5;
          line-height: 1;
          padding-bottom: 7px;
          border-bottom: 2.5px solid rgba(255,255,255,0.75);
          display: inline-block;
          letter-spacing: -0.5px;
        }

        .deals-toggle-group {
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 4px;
        }

        .deals-toggle-btn {
          padding: 7px 18px;
          border-radius: 999px;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Manrope', sans-serif;
          letter-spacing: 0.15px;
          background: transparent;
          color: rgba(244,244,245,0.45);
        }

        .deals-toggle-btn.active {
          background: rgba(255,255,255,0.12);
          color: #f4f4f5;
          box-shadow: 0 1px 6px rgba(0,0,0,0.5);
        }

        .deals-toggle-btn.negotiations.active {
          background: #1d4ed8;
          color: #f8fbff;
          box-shadow: 0 1px 10px rgba(29, 78, 216, 0.45);
        }

        .deals-toggle-btn.confirmed.active {
          background: #15803d;
          color: #f3fff8;
          box-shadow: 0 1px 10px rgba(21, 128, 61, 0.45);
        }

        .deals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .deal-card {
          background: #101012;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 16px;
          position: relative;
          transition: border-color 0.18s;
        }

        .deal-card-media {
          padding: 0;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          min-height: 290px;
          background: #090909;
        }

        .deal-media-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .deal-media-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top,
            rgba(0, 0, 0, 0.96) 0%,
            rgba(0, 0, 0, 0.9) 28%,
            rgba(0, 0, 0, 0.65) 50%,
            rgba(0, 0, 0, 0) 76%);
        }

        .deal-media-content {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          z-index: 2;
        }

        .deal-media-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
        }

        .deal-media-title {
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: #f5f5f5;
          line-height: 1.3;
          text-shadow: 0 1px 2px rgba(0,0,0,0.7);
        }

        .deal-media-meta {
          margin-top: 4px;
          font-size: 11px;
          color: rgba(244,244,245,0.84);
          line-height: 1.4;
        }

        .deal-media-message {
          margin-top: 8px;
          font-size: 11px;
          color: rgba(244,244,245,0.88);
          font-style: italic;
          line-height: 1.45;
        }

        .deal-card-media .deal-card-price {
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0,0,0,0.7);
          font-size: 22px;
        }

        .deal-card-media .deal-actions {
          margin-top: 10px;
        }

        .deal-card-confirmed {
          padding: 0;
          overflow: hidden;
        }

        .deal-confirmed-media {
          position: relative;
          min-height: 220px;
          aspect-ratio: 4 / 3;
          background: #0b0b0d;
        }

        .deal-confirmed-body {
          padding: 12px;
        }

        .deal-confirmed-submeta {
          margin-top: 4px;
          font-size: 10px;
          color: rgba(244,244,245,0.72);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        .deal-confirmed-body .deal-review-box {
          margin-bottom: 12px;
        }

        @media (max-width: 767px) {
          .deal-card-media {
            min-height: 250px;
          }
          .mobile-deal-card {
            width: 100%;
            max-width: 560px;
            margin-left: auto;
            margin-right: auto;
          }
          .deal-media-content {
            left: 10px;
            right: 10px;
            bottom: 10px;
          }
          .deal-media-title {
            font-size: 14px;
          }
          .deal-card-media .deal-card-price {
            font-size: 20px;
          }
        }

        .deal-card:hover {
          border-color: rgba(255,255,255,0.16);
        }

        .deal-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #3f3f46;
          color: #f4f4f5;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
          font-family: 'JetBrains Mono', monospace;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          line-height: 1.4;
        }

        .deal-badge.incoming {
          background: #9fd8ff;
          color: #0b2239;
        }

        .deal-badge.sent {
          background: #1e3a8a;
          color: #f8fbff;
        }

        .deal-badge.handoff {
          background: #c8aa4a;
          color: #1f1a0a;
        }

        .deal-badge.sold {
          background: #52525b;
          color: #f4f4f5;
        }

        .deal-card-top {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .deal-card-img {
          width: 88px;
          height: 88px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
          background: #17171b;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .deal-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .deal-card-body {
          flex: 1;
          min-width: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding-right: 64px;
        }

        .deal-card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #f4f4f5;
          margin-bottom: 5px;
          line-height: 1.3;
        }

        .deal-card-meta {
          font-size: 11px;
          color: rgba(244,244,245,0.5);
          line-height: 1.4;
        }

        .deal-card-price {
          font-family: 'Manrope', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #f4f4f5;
          line-height: 1;
          flex-shrink: 0;
        }

        .deal-msg-box {
          margin-top: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 12px;
          color: rgba(244,244,245,0.6);
          font-style: italic;
          font-family: 'Manrope', sans-serif;
          line-height: 1.5;
        }

        .deal-note-box {
          margin-top: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12px;
          color: rgba(244,244,245,0.65);
          font-family: 'Manrope', sans-serif;
          line-height: 1.5;
        }

        .deal-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 12px;
        }

        .deal-actions > button {
          width: 100%;
        }

        .deal-actions > button:only-child {
          grid-column: 1 / -1;
        }

        .deal-btn-primary {
          background: linear-gradient(135deg, #2563eb, #0891b2);
          color: #f8fbff;
          border: 1px solid #1d4ed8;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          flex: 1;
        }

        .deal-btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8, #0e7490);
          border-color: #1e40af;
        }

        .deal-btn-primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .deal-btn-primary-full {
          background: linear-gradient(135deg, #2563eb, #0891b2);
          color: #f8fbff;
          border: 1px solid #1d4ed8;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          width: 100%;
          margin-top: 12px;
          display: block;
        }

        .deal-btn-primary-full:hover {
          background: linear-gradient(135deg, #1d4ed8, #0e7490);
          border-color: #1e40af;
        }

        .deal-btn-accept {
          background: #0f8f62;
          color: #f3fff8;
          border: 1px solid #0f8f62;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          flex: 1;
        }

        .deal-btn-accept:hover {
          background: #0b7a53;
          border-color: #0b7a53;
        }

        .deal-btn-handover {
          background: #c8aa4a;
          color: #1f1a0a;
          border: 1px solid #c8aa4a;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          width: 100%;
          margin-top: 12px;
          display: block;
        }

        .deal-btn-handover:hover {
          background: #b99b40;
          border-color: #b99b40;
        }

        .deal-btn-outline-orange {
          background: transparent;
          color: #c7d2fe;
          border: 1.5px solid #6366f1;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          flex: 1;
        }

        .deal-btn-outline-orange:hover {
          background: rgba(99,102,241,0.14);
        }

        .deal-btn-secondary {
          background: #312e81;
          color: #f5f3ff;
          border: 1.5px solid #4338ca;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          flex: 1;
        }

        .deal-btn-secondary:hover {
          background: #3730a3;
          color: #ffffff;
          border-color: #4f46e5;
        }

        .deal-btn-decline {
          background: #6a1f2b;
          color: #fff5f7;
          border: 1px solid #6a1f2b;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          flex: 1;
        }

        .deal-btn-decline:hover {
          background: #581823;
          border-color: #581823;
        }

        .deal-btn-review-submit {
          background: #ffffff;
          color: #0a0a0a;
          border: 1px solid #ffffff;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.35px;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.16s;
          white-space: nowrap;
        }

        .deal-btn-review-submit:hover {
          background: #f4f4f5;
          border-color: #f4f4f5;
        }

        .deal-btn-review-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .deal-review-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 10px;
        }

        @media (max-width: 1100px) {
          .deals-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ═══════════ VIEWPORT SPLIT ═══════════ */
        .dash-mobile-only {
          display: flex;
          flex-direction: column;
        }
        .dash-desktop-only {
          display: none;
        }
        @media (min-width: 768px) {
          .dash-mobile-only { display: none !important; }
          .dash-desktop-only { display: flex !important; width: 100%; }
        }
      `}</style>

      <ConfettiOverlay active={showConfetti} />

      {/* ===================== MOBILE VIEW ===================== */}
      <div className="dash-mobile-only" style={{ fontFamily: 'Manrope, sans-serif', background: '#080808', color: '#E4E4E7', minHeight: '100vh', paddingBottom: 76 }}>
        <div className="noise-overlay" />
        {/* Mobile Top Bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="https://res.cloudinary.com/rajvirgautam/image/upload/v1773613904/CampusMarketplace_gemesr.png" alt="Campus Marketplace" style={{ height: '24px', width: 'auto' }} />
            <span className="font-['Montserrat'] font-black text-white uppercase tracking-tighter leading-none mt-1" style={{ fontSize: '0.6rem' }}>
              Campus<br />Marketplace
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button title="Marketplace" onClick={() => navigate('/marketplace')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, cursor: 'pointer', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}>
               <span style={{ fontSize: 11, fontWeight: 700 }}>Marketplace</span>
            </button>
            <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <NotificationBell dark={true} />
            <button onClick={() => setSidebarActive('My Account')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Avatar
                src={user?.profilePicture}
                name={user?.fullName || user?.name || user?.email}
                size={32}
                style={{ fontSize: '12px', fontWeight: '800' }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Content Area */}
        <div style={{ padding: '16px 14px', paddingBottom: '100px' }}>

          {/* ── OVERVIEW TAB ── */}
          {activeMobileTab === 'Overview' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Hey, {userName?.split(' ')[0]}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Here's how your listings are doing.</div>
              </div>
              {/* 2x2 Stat Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Listings', value: <CountUp end={stats.totalListings} />, sub: `${stats.activeListings} active`, color: '#3B82F6' },
                  { label: 'Views', value: <CountUp end={stats.totalViews} />, sub: `${stats.totalListings > 0 ? Math.round(stats.totalViews / stats.totalListings) : 0} avg`, color: '#8B5CF6' },
                  { label: 'Saves', value: <CountUp end={stats.totalSaves} />, sub: 'interested users', color: '#F59E0B' },
                  { label: 'Revenue', value: <CountUp end={stats.totalRevenue} prefix="₹" />, sub: `${stats.soldListings} sold`, color: '#10B981' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 14px 12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}80, transparent)` }} />
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              {/* Quick Stats Card */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, marginBottom: 12 }}>Quick Insights</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                {quickStatsItems.map((qs, i) => (
                  <div key={i} style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 4 }}>{qs.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>{qs.value}</div>
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1a1a1c', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: qs.color, boxShadow: `0 0 10px ${qs.color}50` }} />
                    </div>
                  </div>
                ))}
                </div>
              </div>

              {/* Recent Activity Card */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, marginBottom: 12 }}>Recent Activity</div>
                <div style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px' }}>
                {activityItems.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: i < activityItems.length - 1 ? 16 : 0, marginBottom: i < activityItems.length - 1 ? 16 : 0, borderBottom: i < activityItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 6, flexShrink: 0, boxShadow: `0 0 8px ${a.color}50` }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{a.text}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
              <button onClick={() => setIsAddProductOpen(true)} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                List a New Product
              </button>
            </>
          )}

          {/* ── MY LISTINGS TAB ── */}
          {activeMobileTab === 'My Listings' && (
            <div className="market-theme">
              <div className="market-section-panel" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div>
                    <div className="mobile-section-title">My Listings</div>
                    <div className="mobile-section-sub" style={{ marginBottom: 0 }}>
                      Manage your storefront. {stats.activeListings} active out of {stats.totalListings} total listings.
                    </div>
                  </div>
                  <button className="market-main-btn" onClick={() => setIsAddProductOpen(true)}>
                    <PlusIcon /> Add
                  </button>
                </div>
                <div className="market-chip-row" style={{ overflowX: 'auto', paddingBottom: 2, flexWrap: 'nowrap', marginBottom: 0 }}>
                  {['all', 'active', 'sold', 'pending'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`market-chip ${activeTab === tab ? 'active' : ''}`}
                    >
                      {tab} ({tab === 'all' ? stats.totalListings : stats[`${tab}Listings`] || 0})
                    </button>
                  ))}
                </div>
              </div>

              <div className="market-section-panel">
                {filteredListings.length > 0 ? filteredListings.map(listing => (
                  <div className="listing-item listing-item-mylist-mobile" key={listing._id}>
                    <div className="listing-img">
                      <img src={getProductImage(listing)} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="listing-mylist-mobile-body">
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#f4f4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                        {listing.title}
                      </div>
                      <div className="market-meta" style={{ marginBottom: 8 }}>
                        {listing.category || 'Uncategorised'} · {getTimeAgo(listing.createdAt)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
                        <div className="market-price" style={{ fontSize: 20 }}>{getPriceDisplay(listing)}</div>
                        {getStatusBadge(listing.status)}
                      </div>
                      <div className="listing-kpi-row" style={{ marginTop: 6 }}>
                        <span className="listing-kpi-pill">{listing.views || 0} views</span>
                        <span className="listing-kpi-pill">{listing.saves || 0} saves</span>
                      </div>
                      <div className="listing-actions">
                        <button className="listing-action-btn" onClick={() => handleViewProduct(listing._id)}>VIEW</button>
                        <button className="listing-action-btn" onClick={() => handleEditProduct(listing)}>EDIT</button>
                        <button className="listing-action-btn del" onClick={() => handleDelete(listing._id)}>DELETE</button>
                        {listing.status === 'active' && (
                          <button
                            className="listing-action-btn"
                            style={{
                              color: '#f4f4f5',
                              borderColor: 'rgba(255, 255, 255, 0.22)',
                              background: 'rgba(255, 255, 255, 0.12)'
                            }}
                            onClick={() => handleMarkAsSold(listing._id)}
                          >
                            MARK SOLD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="market-empty">
                    <div className="market-empty-icon" />
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#f4f4f5' }}>
                      No {activeTab !== 'all' ? activeTab : ''} listings yet
                    </div>
                    <div style={{ fontSize: 12, marginBottom: 16 }}>
                      Start your seller board with your first product card.
                    </div>
                    <button className="market-main-btn" onClick={() => setIsAddProductOpen(true)}>
                      <PlusIcon /> Add Listing
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY DEALS TAB ── */}
          {activeMobileTab === 'My Deals' && (
            <div className="market-theme" style={{ background: '#060606', borderRadius: 14, padding: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="market-section-panel" style={{ marginBottom: 14, background: '#101012', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="mobile-section-title">My Deals</div>
                <div className="mobile-section-sub" style={{ marginBottom: 12 }}>
                  Track incoming offers, accepted handoffs, and completed exchanges.
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['negotiations', 'Ongoing'], ['confirmed', 'Completed']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setDealsSubTab(val)}
                      className={`market-deal-toggle ${val} ${dealsSubTab === val ? 'active' : ''}`}
                      style={{ flex: 1 }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="market-section-panel" style={{ background: '#101012', borderColor: 'rgba(255,255,255,0.1)' }}>
                {dealsLoading || offersLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--market-muted)' }}>Loading deals...</div>
                ) : dealsSubTab === 'negotiations' ? (() => {
                  const pendingReceived = offersReceived.filter(o => o.status === 'pending');
                  const pendingSent = offersSent.filter(o => o.status === 'pending');
                  const activeDeals = deals.filter(d => d.dealStatus === 'active');
                  const merged = [
                    ...pendingReceived.map(o => ({ ...o, _t: 'received' })),
                    ...pendingSent.map(o => ({ ...o, _t: 'sent' })),
                    ...activeDeals.map(d => ({ ...d, _t: 'deal' }))
                  ].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

                  if (!merged.length) {
                    return (
                      <div className="market-empty">
                        <div className="market-empty-icon" />
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', marginBottom: 6 }}>No active negotiations</div>
                        <div style={{ fontSize: 12 }}>Offers and deal activity will appear here.</div>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                      {merged.map((item, i) => {
                        const type = item._t;
                        const isSellerDeal = type === 'deal'
                          ? (typeof item.seller === 'object' ? item.seller?._id : item.seller)?.toString() === currentUserId
                          : false;
                        const title = item.product?.title || 'Untitled product';
                        const partyLabel = type === 'received'
                          ? `From ${item.buyer?.fullName || 'Buyer'}`
                          : type === 'sent'
                            ? `To ${item.seller?.fullName || 'Seller'}`
                            : `${isSellerDeal ? 'Buyer' : 'Seller'} ${typeof (isSellerDeal ? item.buyer : item.seller) === 'object' ? (isSellerDeal ? item.buyer : item.seller)?.fullName || 'Unknown' : 'Unknown'}`;
                        const amount = item.offerPrice || item.agreedPrice;

                        return (
                          <div className="deal-card deal-card-media mobile-deal-card" key={item._id + i} style={{ minHeight: 250 }}>
                            <img className="deal-media-img" src={item.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                            <div className="deal-media-gradient" />
                            <span className={`deal-badge ${type === 'received' ? 'incoming' : type === 'sent' ? 'sent' : 'handoff'}`}>
                              {type === 'received' ? 'INCOMING' : type === 'sent' ? 'SENT' : 'HANDOFF'}
                            </span>
                            <div className="deal-media-content">
                              <div className="deal-media-header">
                                <div style={{ minWidth: 0 }}>
                                  <div className="deal-media-title">{title}</div>
                                  <div className="deal-media-meta">{partyLabel}</div>
                                </div>
                                <div className="deal-card-price">₹{amount}</div>
                              </div>

                              {item.message && type !== 'deal' && (
                                <div className="deal-media-message">"{item.message}"</div>
                              )}

                              {type === 'deal' && (
                                <div className="deal-media-message">
                                  {isSellerDeal ? 'Ready to hand over this item?' : 'Received the item from seller?'}
                                </div>
                              )}

                              {type === 'received' && (
                                <div className="deal-actions">
                                  <button className="deal-btn-accept" onClick={() => handleOfferStatus(item._id, 'accepted')}>ACCEPT</button>
                                  <button className="deal-btn-decline" onClick={() => handleOfferStatus(item._id, 'rejected')}>REJECT</button>
                                </div>
                              )}

                              {type === 'sent' && (
                                <div className="deal-actions">
                                  <button className="deal-btn-decline" onClick={() => handleOfferStatus(item._id, 'cancelled')}>CANCEL OFFER</button>
                                </div>
                              )}

                              {type === 'deal' && (
                                <button className="deal-btn-handover" onClick={() => handleConfirmSold(item._id)}>
                                  {isSellerDeal ? 'MARK HANDED OVER' : 'CONFIRM RECEIVED'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })() : (() => {
                  const confirmed = deals.filter(d => d.dealStatus === 'sold');
                  if (!confirmed.length) {
                    return (
                      <div className="market-empty">
                        <div className="market-empty-icon" />
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', marginBottom: 6 }}>No completed deals yet</div>
                        <div style={{ fontSize: 12 }}>Completed handoffs will appear in your archive here.</div>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                      {confirmed.map(deal => {
                        const sellerId = typeof deal.seller === 'object' ? deal.seller?._id : deal.seller;
                        const isSeller = sellerId?.toString() === currentUserId;
                        const isBuyer = !isSeller;
                        const otherParty = isSeller ? deal.buyer : deal.seller;
                        const r = reviewState[deal._id] || {};
                        return (
                        <div className="deal-card deal-card-confirmed mobile-deal-card" key={deal._id}>
                          <div className="deal-confirmed-media" style={{ minHeight: 250 }}>
                            <img className="deal-media-img" src={deal.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                            <div className="deal-media-gradient" />
                            <span className="deal-badge sold">SOLD</span>
                            <div className="deal-media-content">
                              <div className="deal-media-header">
                                <div style={{ minWidth: 0 }}>
                                  <div className="deal-media-title">{deal.product?.title}</div>
                                  <div className="deal-media-meta">
                                    {isSeller
                                      ? `Buyer: ${typeof otherParty === 'object' ? otherParty?.fullName : 'Unknown'}`
                                      : `Seller: ${typeof otherParty === 'object' ? otherParty?.fullName : 'Unknown'}`}
                                  </div>
                                  <div className="deal-confirmed-submeta">Completed {getTimeAgo(deal.updatedAt || deal.createdAt)} · {deal.source === 'chat' ? 'CHAT DEAL' : 'OFFER DEAL'}</div>
                                </div>
                                <div className="deal-card-price">₹{deal.agreedPrice}</div>
                              </div>
                            </div>
                          </div>

                          <div className="deal-confirmed-body">
                            {isBuyer && (
                              deal.buyerReview?.submittedAt ? (
                                <div className="deal-review-box">
                                  <div style={{ fontSize: 11, color: 'rgba(244,244,245,0.45)', marginBottom: 5 }}>Your review of the seller</div>
                                  <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                      <span key={s} style={{ fontSize: 14, color: s <= deal.buyerReview.rating ? '#f97316' : 'rgba(255,255,255,0.18)' }}>★</span>
                                    ))}
                                  </div>
                                  {deal.buyerReview.comment && (
                                    <div style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(244,244,245,0.6)' }}>
                                      "{deal.buyerReview.comment}"
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="deal-review-box">
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f4f4f5', marginBottom: 8 }}>Rate Seller</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                          key={star}
                                          onClick={() => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], rating: star } }))}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            fontSize: 24,
                                            lineHeight: 1,
                                            color: star <= (r.rating || 0) ? '#f97316' : 'rgba(255,255,255,0.2)'
                                          }}
                                        >
                                          ★
                                        </button>
                                      ))}
                                    </div>
                                    {r.rating ? (
                                      <button
                                        className="deal-btn-review-submit"
                                        onClick={() => handleSubmitReview(deal._id)}
                                        disabled={r.submitting}
                                      >
                                        {r.submitting ? 'Submitting...' : 'Submit Review'}
                                      </button>
                                    ) : null}
                                  </div>
                                  <textarea
                                    value={r.comment || ''}
                                    onChange={(e) => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], comment: e.target.value } }))}
                                    placeholder="Share your experience (optional)..."
                                    rows={2}
                                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f4f4f5' }}
                                  />
                                </div>
                              )
                            )}

                            {isSeller && (
                              deal.sellerReview?.submittedAt ? (
                                <div className="deal-review-box">
                                  <div style={{ fontSize: 11, color: 'rgba(244,244,245,0.45)', marginBottom: 5 }}>Your review of the buyer</div>
                                  <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                      <span key={s} style={{ fontSize: 14, color: s <= deal.sellerReview.rating ? '#f97316' : 'rgba(255,255,255,0.18)' }}>★</span>
                                    ))}
                                  </div>
                                  {deal.sellerReview.comment && (
                                    <div style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(244,244,245,0.6)' }}>
                                      "{deal.sellerReview.comment}"
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="deal-review-box">
                                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f4f4f5', marginBottom: 8 }}>Rate Buyer</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                          key={star}
                                          onClick={() => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], rating: star } }))}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            fontSize: 24,
                                            lineHeight: 1,
                                            color: star <= (r.rating || 0) ? '#f97316' : 'rgba(255,255,255,0.2)'
                                          }}
                                        >
                                          ★
                                        </button>
                                      ))}
                                    </div>
                                    {r.rating ? (
                                      <button
                                        className="deal-btn-review-submit"
                                        onClick={() => handleSubmitReview(deal._id)}
                                        disabled={r.submitting}
                                      >
                                        {r.submitting ? 'Submitting...' : 'Submit Review'}
                                      </button>
                                    ) : null}
                                  </div>
                                  <textarea
                                    value={r.comment || ''}
                                    onChange={(e) => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], comment: e.target.value } }))}
                                    placeholder="How was this buyer? (optional)"
                                    rows={2}
                                    style={{ width: '100%', fontSize: 12, padding: '8px 10px', fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f4f4f5' }}
                                  />
                                </div>
                              )
                            )}

                            <div className="deal-actions">
                              <button className="deal-btn-primary" onClick={() => setDealHistoryOpen(deal)}>VIEW TIMELINE</button>
                            </div>
                          </div>
                        </div>
                      );})}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ── SAVED PRODUCTS TAB ── */}
          {activeMobileTab === 'Saved Products' && (
            <div className="market-theme">
              <div className="market-section-panel" style={{ marginBottom: 14 }}>
                <div className="mobile-section-title">Saved Products</div>
                <div className="mobile-section-sub" style={{ marginBottom: 0 }}>
                  Your personal watchlist of listings worth revisiting.
                </div>
              </div>

              <div className="market-section-panel">
                {savedLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--market-muted)' }}>Loading saved products...</div>
                ) : savedProducts.length > 0 ? savedProducts.map(item => (
                  <div className="listing-item listing-item-mylist-mobile" key={item._id}>
                    <div className="listing-img">
                      <img src={getProductImage(item)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="listing-mylist-mobile-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#f4f4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
                            {item.title}
                          </div>
                          <div className="market-meta">
                            {item.category} · {typeof item.seller === 'object' ? item.seller.fullName : 'Unknown'}
                          </div>
                        </div>
                        <div className="market-price" style={{ fontSize: 20, textAlign: 'right' }}>{getPriceDisplay(item)}</div>
                      </div>

                      <div className="market-meta" style={{ marginBottom: 6 }}>
                        Saved {getTimeAgo(item.createdAt)}
                      </div>
                      <div className="listing-kpi-row" style={{ marginTop: 4 }}>
                        <span className="listing-kpi-pill">{item.saves || 0} saves</span>
                        <span className="listing-kpi-pill">{item.views || 0} views</span>
                      </div>

                      <div className="listing-actions">
                        <button className="listing-action-btn" onClick={() => handleViewProduct(item._id)}>
                          VIEW ITEM
                        </button>
                        <button
                          className="listing-action-btn del"
                          onClick={async () => {
                            try {
                              const res = await productAPI.toggleSave(item._id);
                              if (res.success && !res.saved) {
                                setSavedProducts(prev => prev.filter(p => p._id !== item._id));
                                toggleSavedId(item._id);
                              }
                            } catch (e) { }
                          }}
                        >
                          UNSAVE
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="market-empty">
                    <div className="market-empty-icon" />
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', marginBottom: 6 }}>No saved products yet</div>
                    <div style={{ fontSize: 12, marginBottom: 16 }}>Save products from marketplace and build your watchlist.</div>
                    <button className="market-main-btn" onClick={() => navigate('/marketplace')}>
                      Browse Marketplace
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY ACCOUNT TAB ── */}
          {activeMobileTab === 'My Account' && <MyAccount />}
        </div>

        {/* Fixed Bottom Tab Bar */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(8,8,8,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'stretch', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {[
            { label: 'Overview', icon: <HomeIcon />, tab: 'Overview' },
            { label: 'Listings', icon: <PackageIcon />, tab: 'My Listings' },
            { label: 'Deals', icon: <TrendingIcon />, tab: 'My Deals' },
            { label: 'Saved', icon: <HeartFilledIcon />, tab: 'Saved Products' },
            { label: 'Account', icon: <UsersIcon />, tab: 'My Account' },
          ].map(item => (
            <button
              key={item.tab || item.label}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setSidebarActive(item.tab);
                  if (item.tab === 'Saved Products') fetchSavedProducts();
                  if (item.tab === 'My Deals' || item.tab === 'Overview') { fetchDeals(); fetchOffers(); }
                }
              }}
              style={{ flex: 1, padding: '10px 4px 12px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: activeMobileTab === item.tab ? '#00D9FF' : 'rgba(255,255,255,0.35)', transition: 'color 0.15s' }}
            >
              <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* =================== END MOBILE VIEW =================== */}

      {/* =================== DESKTOP VIEW =================== */}
      <div className="dash-desktop-only">
        <div className="dash-root" style={{ background: '#080808', width: '100%' }}>
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
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                  <img src="https://res.cloudinary.com/rajvirgautam/image/upload/v1773613904/CampusMarketplace_gemesr.png" alt="Campus Marketplace" className="h-8 w-auto hidden md:block" />
                  <span className="hidden md:block font-['Montserrat'] font-black text-white uppercase tracking-tighter leading-none mt-1" style={{ fontSize: '0.9rem' }}>
                    Campus<br/>Marketplace
                  </span>
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
                data-onboarding={item.onboarding}
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
              <Link to="/" className="flex items-center gap-2 cursor-pointer" style={{ textDecoration: 'none' }}>
                <img src="https://res.cloudinary.com/rajvirgautam/image/upload/v1773613904/CampusMarketplace_gemesr.png" alt="Campus Marketplace" style={{ height: '22px', width: 'auto' }} />
                <span className="font-['Montserrat'] font-black text-white uppercase tracking-tighter leading-none mt-1" style={{ fontSize: '0.65rem' }}>
                  Campus<br/>Marketplace
                </span>
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
                <button
                  className="topbar-icon-btn"
                  title="Marketplace"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', width: 'auto', color: 'rgba(255,255,255,0.6)' }}
                  onClick={() => navigate('/marketplace')}
                >
                  <CartIcon /> <span style={{ fontSize: 13, fontWeight: 700 }}>Marketplace</span>
                </button>
                <NotificationBell dark={true} />
                <button
                  className="btn-mesh-desktop"
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
                  <Avatar
                    src={user?.profilePicture}
                    name={user?.fullName || user?.name || user?.email}
                    size={28}
                    style={{ fontSize: '11px', fontWeight: '800' }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{userName?.split(' ')[0]}</span>
                </button>
              </div>
            </header>

            <div className="content-wrapper">
              {/* CENTER CONTENT */}
              <div className="content-main">
                {sidebarActive === 'My Listings' ? (
                  /* ── MY LISTINGS FULL CRUD VIEW ── */
                  <div className="market-theme">
                    <div className="overview-header">
                      <div>
                        <h1>My Listings</h1>
                        <div>
                          Your seller board with live inventory, performance, and quick actions.
                        </div>
                      </div>
                      <button className="market-main-btn" onClick={() => setIsAddProductOpen(true)}>
                        <PlusIcon /> Add New Listing
                      </button>
                    </div>

                    <div className="market-section-panel" style={{ marginBottom: 16 }}>
                      <div className="market-metric-strip">
                        {[
                          { label: 'Total', value: <CountUp end={stats.totalListings} /> },
                          { label: 'Active', value: <CountUp end={stats.activeListings} /> },
                          { label: 'Sold', value: <CountUp end={stats.soldListings} /> },
                          { label: 'Pending', value: <CountUp end={stats.pendingListings} /> }
                        ].map(s => (
                          <div className="market-metric-card" key={s.label}>
                            <div className="market-metric-label">{s.label}</div>
                            <div className="market-metric-value">{s.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="market-chip-row" style={{ marginBottom: 0 }}>
                        {['all', 'active', 'sold', 'pending'].map(tab => (
                          <button
                            key={tab}
                            className={`market-chip ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab} ({tab === 'all' ? stats.totalListings : stats[`${tab}Listings`] || 0})
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="market-section-panel">
                      {filteredListings.length > 0 ? <div className="mylistings-grid-desktop">{filteredListings.map((listing) => (
                        <div className="listing-item listing-item-mylist-mobile" key={listing._id}>
                          <div className="listing-img">
                            <img src={getProductImage(listing)} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div className="listing-mylist-mobile-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: '#f4f4f5', fontSize: 15, marginBottom: 4 }}>{listing.title}</div>
                                <div className="market-meta" style={{ marginBottom: 7 }}>
                                  {listing.category || 'Uncategorised'} · {getTimeAgo(listing.createdAt)}
                                </div>
                                <div className="listing-kpi-row">
                                  {getStatusBadge(listing.status)}
                                  <span className="listing-kpi-pill">{listing.views || 0} views</span>
                                  <span className="listing-kpi-pill">{listing.saves || 0} saves</span>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div className="market-price">{getPriceDisplay(listing)}</div>
                              </div>
                            </div>
                            <div className="listing-actions">
                              <button className="listing-action-btn" onClick={() => handleViewProduct(listing._id)}><EyeIcon /> VIEW</button>
                              <button className="listing-action-btn" onClick={() => handleEditProduct(listing)}><EditIcon /> EDIT</button>
                              <button className="listing-action-btn del" onClick={() => handleDelete(listing._id)}><TrashIcon /> DELETE</button>
                              {listing.status === 'active' && (
                                <button
                                  className="listing-action-btn"
                                  style={{
                                    color: '#f3fff8',
                                    borderColor: '#0f8f62',
                                    background: '#0f8f62'
                                  }}
                                  onClick={() => handleMarkAsSold(listing._id)}
                                >
                                  MARK SOLD
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}</div> : (
                        <div className="market-empty">
                          <div className="market-empty-icon" />
                          <div style={{ fontSize: 17, fontWeight: 700, color: '#f4f4f5', marginBottom: 8 }}>
                            No {activeTab !== 'all' ? activeTab : ''} listings yet
                          </div>
                          <div style={{ fontSize: 13, marginBottom: 18 }}>
                            Add products to start filling your storefront.
                          </div>
                          <button className="market-main-btn" onClick={() => setIsAddProductOpen(true)}>
                            <PlusIcon /> Add Your First Listing
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : sidebarActive === 'My Deals' ? (
                  /* ── MY DEALS VIEW ── */
                  <div className="market-theme deals-page-bg">
                    {/* Header row: title left, toggles right */}
                    <div className="deals-header-row">
                      <span className="deals-title">My Deals</span>
                      <div className="deals-toggle-group">
                        {[['negotiations', 'Ongoing Deals'], ['confirmed', 'Completed Deals']].map(([key, label]) => (
                          <button
                            key={key}
                            className={`deals-toggle-btn ${key} ${dealsSubTab === key ? 'active' : ''}`}
                            onClick={() => setDealsSubTab(key)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(dealsLoading || offersLoading) ? (
                      <div style={{ textAlign: 'center', padding: '44px 20px', color: 'rgba(244,244,245,0.4)' }}>
                        Loading deal activity...
                      </div>
                    ) : (() => {
                      if (dealsSubTab === 'negotiations') {
                        const pendingReceived = offersReceived.filter(o => o.status === 'pending');
                        const pendingSent = offersSent.filter(o => o.status === 'pending');
                        const activeDeals = deals.filter(d => d.dealStatus === 'active');
                        const merged = [
                          ...pendingReceived.map(o => ({ ...o, _t: 'received' })),
                          ...pendingSent.map(o => ({ ...o, _t: 'sent' })),
                          ...activeDeals.map(d => ({ ...d, _t: 'deal' }))
                        ].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

                        if (!merged.length) {
                          return (
                            <div style={{ textAlign: 'center', padding: '60px 12px', color: 'rgba(244,244,245,0.35)' }}>
                              <div style={{ fontSize: 17, fontWeight: 700, color: '#f4f4f5', marginBottom: 6 }}>No ongoing deals yet</div>
                              <div style={{ fontSize: 13 }}>Incoming offers and active handoffs will show up here.</div>
                            </div>
                          );
                        }

                        return (
                          <div className="deals-grid">
                            {merged.map((item, i) => {
                              const type = item._t;
                              const isSellerDeal = type === 'deal'
                                ? (typeof item.seller === 'object' ? item.seller?._id : item.seller)?.toString() === currentUserId
                                : false;
                              const counterpart = type === 'received'
                                ? `Buyer: ${item.buyer?.fullName || 'Unknown'}`
                                : type === 'sent'
                                  ? `Seller: ${item.seller?.fullName || 'Unknown'}`
                                  : `${isSellerDeal ? 'Buyer' : 'Seller'}: ${typeof (isSellerDeal ? item.buyer : item.seller) === 'object' ? (isSellerDeal ? item.buyer : item.seller)?.fullName || 'Unknown' : 'Unknown'}`;
                              const badgeLabel = type === 'received' ? 'INCOMING' : type === 'sent' ? 'SENT' : 'HANDOFF';
                              const badgeClass = type === 'received' ? 'incoming' : type === 'sent' ? 'sent' : 'handoff';

                              return (
                                <div className="deal-card deal-card-media" key={item._id + i}>
                                  <img className="deal-media-img" src={item.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                                  <div className="deal-media-gradient" />
                                  <span className={`deal-badge ${badgeClass}`}>{badgeLabel}</span>
                                  <div className="deal-media-content">
                                    <div className="deal-media-header">
                                      <div style={{ minWidth: 0 }}>
                                        <div className="deal-media-title">{item.product?.title}</div>
                                        <div className="deal-media-meta">
                                          {counterpart}
                                          {type === 'deal' ? ` via ${item.source === 'chat' ? 'Offer' : 'Offer'}` : ''}
                                        </div>
                                      </div>
                                      <div className="deal-card-price">₹{item.offerPrice || item.agreedPrice}</div>
                                    </div>

                                  {item.message && type !== 'deal' && (
                                    <div className="deal-media-message">"{item.message}"</div>
                                  )}

                                  {type === 'deal' && (
                                    <div className="deal-media-message">
                                      {isSellerDeal ? 'Ready to hand over this item?' : 'Confirm that you received the item.'}
                                    </div>
                                  )}

                                  {type === 'received' && (
                                    <div className="deal-actions">
                                      <button className="deal-btn-accept" onClick={() => handleOfferStatus(item._id, 'accepted')}>ACCEPT OFFER</button>
                                      <button className="deal-btn-decline" onClick={() => handleOfferStatus(item._id, 'rejected')}>REJECT</button>
                                    </div>
                                  )}

                                  {type === 'sent' && (
                                    <div className="deal-actions">
                                      <button className="deal-btn-decline" onClick={() => handleOfferStatus(item._id, 'cancelled')}>CANCEL OFFER</button>
                                    </div>
                                  )}

                                  {type === 'deal' && (
                                    <button className="deal-btn-handover" onClick={() => handleConfirmSold(item._id)}>
                                      {isSellerDeal ? 'MARK HANDED OVER' : 'CONFIRM RECEIVED'}
                                    </button>
                                  )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }

                      const confirmedDeals = deals.filter(d => d.dealStatus === 'sold');
                      if (!confirmedDeals.length) {
                        return (
                          <div style={{ textAlign: 'center', padding: '60px 12px', color: 'rgba(244,244,245,0.35)' }}>
                            <div style={{ fontSize: 17, fontWeight: 700, color: '#f4f4f5', marginBottom: 6 }}>No completed deals yet</div>
                            <div style={{ fontSize: 13 }}>Finalized deals and reviews will be archived here.</div>
                          </div>
                        );
                      }

                      return (
                        <div className="deals-grid">
                          {confirmedDeals.map((deal) => {
                            const sellerId = typeof deal.seller === 'object' ? deal.seller?._id : deal.seller;
                            const isSeller = sellerId?.toString() === currentUserId;
                            const isBuyer = !isSeller;
                            const otherParty = isSeller ? deal.buyer : deal.seller;
                            const r = reviewState[deal._id] || {};

                            return (
                              <div key={deal._id} className="deal-card deal-card-confirmed">
                                <div className="deal-confirmed-media">
                                  <img className="deal-media-img" src={deal.product?.images?.[0] || '/placeholder.jpg'} alt="" />
                                  <div className="deal-media-gradient" />
                                  <span className="deal-badge sold">SOLD</span>
                                  <div className="deal-media-content">
                                    <div className="deal-media-header">
                                      <div style={{ minWidth: 0 }}>
                                        <div className="deal-media-title">{deal.product?.title}</div>
                                        <div className="deal-media-meta">
                                          {isSeller
                                            ? `Buyer: ${typeof otherParty === 'object' ? otherParty?.fullName : 'Unknown'}`
                                            : `Seller: ${typeof otherParty === 'object' ? otherParty?.fullName : 'Unknown'}`}
                                          {typeof otherParty === 'object' && otherParty?.branch ? ` · ${otherParty.branch.toUpperCase()}` : ''}
                                        </div>
                                        <div className="deal-confirmed-submeta">{deal.source === 'chat' ? 'CHAT DEAL' : 'OFFER DEAL'}</div>
                                      </div>
                                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                        <div className="deal-card-price">₹{deal.agreedPrice}</div>
                                        {deal.product?.price && deal.agreedPrice !== deal.product.price && (
                                          <div style={{ fontSize: 11, color: 'rgba(244,244,245,0.7)', textDecoration: 'line-through', marginTop: 2 }}>₹{deal.product.price}</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="deal-confirmed-body">

                                {isBuyer && (
                                  deal.buyerReview?.submittedAt ? (
                                    <div className="deal-review-box">
                                      <div style={{ fontSize: 11, color: 'rgba(244,244,245,0.45)', marginBottom: 5 }}>Your review of the seller</div>
                                      <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                          <span key={s} style={{ fontSize: 14, color: s <= deal.buyerReview.rating ? '#f97316' : 'rgba(255,255,255,0.18)' }}>★</span>
                                        ))}
                                      </div>
                                      {deal.buyerReview.comment && (
                                        <div style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(244,244,245,0.6)' }}>
                                          "{deal.buyerReview.comment}"
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="deal-review-box">
                                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f4f4f5', marginBottom: 8 }}>Rate Seller</div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                          {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                              key={star}
                                              onClick={() => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], rating: star } }))}
                                              style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                fontSize: 24,
                                                lineHeight: 1,
                                                color: star <= (r.rating || 0) ? '#f97316' : 'rgba(255,255,255,0.2)'
                                              }}
                                            >
                                              ★
                                            </button>
                                          ))}
                                        </div>
                                        {r.rating ? (
                                          <button
                                            className="deal-btn-review-submit"
                                            onClick={() => handleSubmitReview(deal._id)}
                                            disabled={r.submitting}
                                          >
                                            {r.submitting ? 'Submitting...' : 'Submit Review'}
                                          </button>
                                        ) : null}
                                      </div>
                                      <textarea
                                        value={r.comment || ''}
                                        onChange={(e) => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], comment: e.target.value } }))}
                                        placeholder="Share your experience (optional)..."
                                        rows={2}
                                        style={{ width: '100%', fontSize: 12, padding: '8px 10px', fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f4f4f5' }}
                                      />
                                    </div>
                                  )
                                )}

                                {isSeller && (
                                  deal.sellerReview?.submittedAt ? (
                                    <div className="deal-review-box">
                                      <div style={{ fontSize: 11, color: 'rgba(244,244,245,0.45)', marginBottom: 5 }}>Your review of the buyer</div>
                                      <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                          <span key={s} style={{ fontSize: 14, color: s <= deal.sellerReview.rating ? '#f97316' : 'rgba(255,255,255,0.18)' }}>★</span>
                                        ))}
                                      </div>
                                      {deal.sellerReview.comment && (
                                        <div style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(244,244,245,0.6)' }}>
                                          "{deal.sellerReview.comment}"
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="deal-review-box">
                                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f4f4f5', marginBottom: 8 }}>Rate Buyer</div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                          {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                              key={star}
                                              onClick={() => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], rating: star } }))}
                                              style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                fontSize: 24,
                                                lineHeight: 1,
                                                color: star <= (r.rating || 0) ? '#f97316' : 'rgba(255,255,255,0.2)'
                                              }}
                                            >
                                              ★
                                            </button>
                                          ))}
                                        </div>
                                        {r.rating ? (
                                          <button
                                            className="deal-btn-review-submit"
                                            onClick={() => handleSubmitReview(deal._id)}
                                            disabled={r.submitting}
                                          >
                                            {r.submitting ? 'Submitting...' : 'Submit Review'}
                                          </button>
                                        ) : null}
                                      </div>
                                      <textarea
                                        value={r.comment || ''}
                                        onChange={(e) => setReviewState(prev => ({ ...prev, [deal._id]: { ...prev[deal._id], comment: e.target.value } }))}
                                        placeholder="How was this buyer? (optional)"
                                        rows={2}
                                        style={{ width: '100%', fontSize: 12, padding: '8px 10px', fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f4f4f5' }}
                                      />
                                    </div>
                                  )
                                )}

                                <div style={{ marginTop: 4 }}>
                                  <button className="deal-btn-primary" style={{ width: '100%' }} onClick={() => setDealHistoryOpen(deal)}>
                                    DEAL TIMELINE
                                  </button>
                                </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                ) : sidebarActive === 'Saved Products' ? (

                  /* ── SAVED PRODUCTS VIEW ── */
                  <div className="market-theme">
                    <div className="overview-header">
                      <div>
                        <h1>Saved Products</h1>
                        <div>
                          A curated watchlist of products you want to track or buy later.
                        </div>
                      </div>
                      <button className="market-main-btn" onClick={() => navigate('/marketplace')}>
                        Browse Marketplace
                      </button>
                    </div>

                    <div className="market-section-panel">
                      {savedLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--market-muted)' }}>
                          Loading saved products...
                        </div>
                      ) : savedProducts.length > 0 ? <div className="mylistings-grid-desktop">{savedProducts.map((item) => (
                        <div className="listing-item listing-item-mylist-mobile" key={item._id}>
                          <div className="listing-img">
                            <img src={getProductImage(item)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div className="listing-mylist-mobile-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, color: '#f4f4f5', fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                                <div className="market-meta" style={{ marginBottom: 6 }}>
                                  {item.category} · by {typeof item.seller === 'object' ? item.seller.fullName : 'Unknown'}
                                </div>
                                <div className="market-meta">Saved {getTimeAgo(item.createdAt)}</div>
                                <div className="listing-kpi-row" style={{ marginTop: 6 }}>
                                  <span className="listing-kpi-pill">{item.saves || 0} saves</span>
                                  <span className="listing-kpi-pill">{item.views || 0} views</span>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div className="market-price">{getPriceDisplay(item)}</div>
                              </div>
                            </div>
                            <div className="listing-actions">
                              <button className="listing-action-btn" onClick={() => handleViewProduct(item._id)}>
                                <EyeIcon /> VIEW ITEM
                              </button>
                              <button
                                className="listing-action-btn del"
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
                      ))}</div> : (
                        <div className="market-empty">
                          <div className="market-empty-icon" />
                          <div style={{ fontSize: 17, fontWeight: 700, color: '#f4f4f5', marginBottom: 8 }}>No saved products yet</div>
                          <div style={{ fontSize: 13, marginBottom: 18 }}>Save listings in marketplace and build your personal shortlist.</div>
                          <button className="market-main-btn" onClick={() => navigate('/marketplace')}>
                            Browse Marketplace
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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
                        <div className="stat-label">Active Listings</div>
                        <div className="stat-value"><CountUp end={stats.activeListings} /></div>
                        <div className="stat-change up">
                          <ArrowUp color="#00D9FF" /> {stats.activeListings} items live now
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Total Views</div>
                        <div className="stat-value"><CountUp end={stats.totalViews} /></div>
                        <div className="stat-change up">
                          <ArrowUp color="#00D9FF" />
                          {stats.totalListings > 0 ? Math.round(stats.totalViews / stats.totalListings) : 0} avg per listing
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Total Saves</div>
                        <div className="stat-value"><CountUp end={stats.totalSaves} /></div>
                        <div className="stat-change" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          People interested
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Revenue</div>
                        <div className="stat-value"><CountUp end={stats.totalRevenue} prefix="₹" /></div>
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
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}><CountUp end={stats.totalListings} /></div>
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
                          <div className="mini-stat-label">Total Listings</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="mini-stat-value"><CountUp end={stats.totalListings} /></span>
                            <span style={{ color: '#3B82F6', fontSize: 16, fontWeight: 600, display: 'flex' }}><PackageIcon /></span>
                          </div>
                          <div className="mini-stat-sub">{stats.activeListings} active · {stats.soldListings} sold</div>
                        </div>
                        <div className="mini-stat-card">
                          <div className="mini-stat-label">Pending Approval</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="mini-stat-value"><CountUp end={stats.pendingListings} /></span>
                             <span style={{ color: '#F59E0B', fontSize: 14, fontWeight: 600, display: 'flex' }}><TrendingIcon /></span>
                          </div>
                          <div className="mini-stat-sub">Awaiting review</div>
                        </div>
                        <div className="mini-stat-card">
                          <div className="mini-stat-label">Offers Received</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="mini-stat-value"><CountUp end={offersReceived.length} /></span>
                            <span style={{ color: '#8B5CF6', display: 'flex' }}><MessageIcon /></span>
                          </div>
                          <div className="mini-stat-sub">Across all listings</div>
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
                                  <div style={{ fontWeight: 800, color: '#3B82F6', fontSize: 16 }}>{getPriceDisplay(listing)}</div>
                                </div>
                              </div>
                              <div className="listing-actions">
                                <button className="listing-action-btn" onClick={() => handleViewProduct(listing._id)}><EyeIcon /> VIEW</button>
                                <button className="listing-action-btn" onClick={() => handleEditProduct(listing)}><EditIcon /> EDIT</button>
                                <button className="listing-action-btn del" onClick={() => handleDelete(listing._id)}><TrashIcon /> DELETE</button>
                                {listing.status === 'active' && (
                                  <button className="listing-action-btn" onClick={() => handleMarkAsSold(listing._id)}>SOLD</button>
                                )}
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.3)' }}>
                             <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', margin: '0 auto 8px', opacity: 0.3 }} />
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
                            style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 11, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}
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
                                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginLeft: 8 }}>{l.views || 0} views · {l.saves || 0} saves</span>
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
                          Premium Seller
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                          <span className="pricing-amount">{stats.soldListings}</span>
                          <span className="pricing-per">Items<br />Sold</span>
                        </div>
                        <div className="pricing-desc">
                           Keep selling to unlock premium<br />features and seller badges
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
                <div className="right-section-title" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>Recent Activity</div>
                <div style={{ padding: '4px 0', display: 'flex', flexDirection: 'column' }}>
                {
                  activityItems.map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 0 }}>
                      {/* Timeline spine: dot + vertical line */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: n.color,
                          boxShadow: `0 0 8px ${n.color}60`,
                          flexShrink: 0, marginTop: 6,
                        }} />
                        {i < activityItems.length - 1 && (
                          <div style={{
                            width: 1,
                            flex: 1,
                            minHeight: 20,
                            background: `linear-gradient(to bottom, ${n.color}50, rgba(255,255,255,0.06))`,
                            marginTop: 4,
                            marginBottom: 4,
                          }} />
                        )}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, paddingBottom: i < activityItems.length - 1 ? 16 : 0 }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    </div>
                  ))
                }
                </div>

                <hr className="divider" style={{ margin: '24px 0', border: 'none' }} />

                {/* QUICK STATS */}
                <div className="right-section-title" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>Quick Insights</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {
                  quickStatsItems.map((a, i) => (
                    <div className="activity-item" key={i} style={{ background: '#161618', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px', alignItems: 'center', transition: 'all 0.2s', cursor: 'default' }}>
                      <div style={{ flex: 1 }}>
                        <div className="notif-time" style={{ marginBottom: '6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{a.label}</div>
                        <div style={{ fontWeight: 800, fontSize: '24px', color: '#fff', letterSpacing: '-0.5px' }}>{a.value}</div>
                      </div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#1a1a1c', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                         <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: a.color, boxShadow: `0 0 12px ${a.color}40` }} />
                      </div>
                    </div>
                  ))
                }
                </div>
              </div >
            </div >
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
    </>
  );
};

export default UserDashboard;