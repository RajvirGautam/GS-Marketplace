import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sellerAPI } from '../../services/api';

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
);

const ShieldCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

const GridIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const HeartIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const PackageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
    </svg>
);

const TagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

// ─── Category display helpers ─────────────────────────────────────────────────

const CATEGORY_META = {
    books: { label: 'Books & Notes', emoji: '📚', color: '#3B82F6' },
    lab: { label: 'Lab Equipment', emoji: '🔬', color: '#8B5CF6' },
    stationery: { label: 'Stationery', emoji: '✏️', color: '#F59E0B' },
    electronics: { label: 'Electronics', emoji: '⚡', color: '#00D9FF' },
    hostel: { label: 'Hostel Items', emoji: '🏠', color: '#10B981' },
    tools: { label: 'Tools', emoji: '🔧', color: '#EF4444' },
    misc: { label: 'Miscellaneous', emoji: '📦', color: '#EC4899' },
};

const formatMemberSince = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr);
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
};

const getPrice = (product) => {
    if (product.type === 'free') return { label: 'FREE', color: '#10B981' };
    if (product.type === 'barter') return { label: 'BARTER', color: '#A78BFA' };
    return { label: `₹${product.price}`, color: '#00D9FF' };
};

// ─── Mini Product Card (on the profile page) ──────────────────────────────────

const MiniProductCard = ({ product, index }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100 + index * 60);
        return () => clearTimeout(t);
    }, [index]);

    const img = (product.images && product.images[0]) || '/placeholder.jpg';
    const price = getPrice(product);

    return (
        <div
            onClick={() => navigate(`/product/${product._id}`)}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.05 * index}s`,
            }}
            className="group relative bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden cursor-pointer hover:border-[rgba(0,217,255,0.3)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)]"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                <img
                    src={img}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Price badge */}
                <div
                    className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-black mono"
                    style={{ background: `${price.color}22`, color: price.color, border: `1px solid ${price.color}44` }}
                >
                    {price.label}
                </div>
                {product.isTrending && (
                    <div className="absolute top-2 left-2 bg-[#F59E0B] text-black px-2 py-0.5 rounded text-[9px] font-bold mono">TRENDING</div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h4 className="text-white text-sm font-bold truncate group-hover:text-[#00D9FF] transition-colors">{product.title}</h4>
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-white/40 mono uppercase">{product.category}</span>
                    <span className="text-[10px] text-white/30 mono">{getTimeAgo(product.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-white/30 mono">
                    <span className="flex items-center gap-1"><EyeIcon />{product.views || 0}</span>
                    <span className="flex items-center gap-1"><HeartIcon />{product.saves || 0}</span>
                    <span className="ml-auto px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">
                        {product.condition}
                    </span>
                </div>
            </div>
        </div>
    );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, accent = '#00D9FF', delay = 0 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            className="relative bg-[rgba(15,15,15,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 overflow-hidden group hover:border-[rgba(255,255,255,0.15)] transition-all"
        >
            {/* Glow */}
            <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: accent }}
            />
            <div className="flex items-center gap-2 mb-3" style={{ color: accent }}>
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-widest mono opacity-70">{label}</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{value}</div>
        </div>
    );
};

// ─── Main SellerProfile Component ─────────────────────────────────────────────

const SellerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [headerVisible, setHeaderVisible] = useState(false);

    // Mouse glow effect
    useEffect(() => {
        const handler = (e) =>
            setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, []);

    // Fetch seller data
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await sellerAPI.getProfile(id);
                if (res.success) {
                    setData(res);
                    setTimeout(() => setHeaderVisible(true), 100);
                } else {
                    setError('Seller not found');
                }
            } catch (err) {
                console.error('Error fetching seller profile:', err);
                setError('Could not load seller profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#00D9FF]/30 border-t-[#00D9FF] animate-spin" />
                <p className="text-white/30 text-sm mono uppercase tracking-widest">Loading Profile...</p>
            </div>
        );
    }

    // ── Error ──
    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-6">
                <div className="text-6xl">👤</div>
                <h1 className="text-3xl font-bold">Seller Not Found</h1>
                <p className="text-white/50">{error || 'This profile does not exist.'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-sm font-semibold hover:bg-white/20 transition-all"
                >
                    <ArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    const { seller, stats, recentListings } = data;
    const initials = seller?.fullName
        ? seller.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';
    const BRANCH_MAP = { cs: 'Computer Science', it: 'Information Tech.', ece: 'Electronics & Comm.', ee: 'Electrical Engg.', mech: 'Mechanical Engg.', civil: 'Civil Engg.' };
    const branchLabel = BRANCH_MAP[seller?.branch] || seller?.branch?.toUpperCase() || '—';

    const totalCategoryItems = stats.categoryBreakdown.reduce((s, c) => s + c.count, 0) || 1;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .sp-root {
          font-family: 'Outfit', sans-serif;
          background: #050505;
          color: #fff;
          min-height: 100vh;
        }

        .sp-mono { font-family: 'JetBrains Mono', monospace; }

        .sp-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .sp-back-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff; border-radius: 50px;
          padding: 10px 20px; font-weight: 600; font-size: 13px;
          cursor: pointer; transition: all 0.2s;
          backdrop-filter: blur(12px);
          font-family: 'Outfit', sans-serif;
        }
        .sp-back-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); }

        .avatar-ring {
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          padding: 3px; border-radius: 50%;
        }

        .avatar-inner {
          background: #111; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .verified-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3);
          color: #00D9FF; border-radius: 100px;
          padding: 4px 12px; font-size: 11px; font-weight: 700;
        }

        .bio-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.65); border-radius: 100px;
          padding: 6px 14px; font-size: 12px; font-weight: 500;
        }

        .section-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: rgba(255,255,255,0.35);
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
          font-family: 'JetBrains Mono', monospace;
        }

        .section-title::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06);
        }

        .cat-bar-track {
          height: 5px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden;
        }

        .empty-listings {
          grid-column: 1 / -1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 20px; text-align: center; gap: 12px;
          background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;
        }

        @keyframes sp-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .h-animate { animation: sp-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        .h-animate-d1 { animation-delay: 0.1s; opacity: 0; }
        .h-animate-d2 { animation-delay: 0.2s; opacity: 0; }
        .h-animate-d3 { animation-delay: 0.3s; opacity: 0; }
        .h-animate-d4 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

            <div className="sp-root relative">
                <div className="sp-noise" />

                {/* Dynamic mouse glow */}
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                        background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,217,255,0.06) 0%, transparent 50%)`
                    }}
                />

                {/* ── Sticky Nav ── */}
                <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <button onClick={() => navigate(-1)} className="sp-back-btn">
                            <ArrowLeft /> Back
                        </button>
                        <div className="sp-mono text-[11px] text-white/20 uppercase tracking-widest hidden sm:block">
                            Seller Profile
                        </div>
                        <Link
                            to="/marketplace"
                            className="sp-mono text-[11px] text-[#00D9FF]/60 hover:text-[#00D9FF] transition-colors uppercase tracking-widest hidden sm:block"
                        >
                            Browse Market →
                        </Link>
                    </div>
                </nav>

                {/* ── Main Content ── */}
                <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

                    {/* ── Hero / Profile Header ── */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-14">
                        {/* Avatar */}
                        <div className="avatar-ring w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 h-animate h-animate-d1">
                            <div className="avatar-inner w-full h-full">
                                {seller?.profilePicture ? (
                                    <img src={seller.profilePicture} alt={seller.fullName} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span style={{ fontSize: 40, fontWeight: 900, background: 'linear-gradient(135deg,#00D9FF,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {initials}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Name + badges */}
                        <div className="flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
                            <div className="h-animate h-animate-d1">
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
                                    {seller?.fullName || 'Unknown Seller'}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 h-animate h-animate-d2">
                                {seller?.isVerified && (
                                    <span className="verified-badge">
                                        <ShieldCheck /> Verified Student
                                    </span>
                                )}
                                {seller?.enrollmentNumber && (
                                    <span className="sp-mono text-[11px] text-white/30 tracking-wider">
                                        {seller.enrollmentNumber}
                                    </span>
                                )}
                            </div>

                            {/* Bio Pills */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 h-animate h-animate-d3">
                                {seller?.branch && (
                                    <span className="bio-pill">🎓 {branchLabel}</span>
                                )}
                                {seller?.year && (
                                    <span className="bio-pill">📅 Year {seller.year}</span>
                                )}
                                <span className="bio-pill">
                                    <CalendarIcon />
                                    Member since {formatMemberSince(seller?.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats Row ── */}
                    <div className="h-animate h-animate-d4 mb-12">
                        <div className="section-title"><PackageIcon /> Activity Stats</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatCard icon={<GridIcon />} label="Total" value={stats.totalListings} accent="#00D9FF" delay={100} />
                            <StatCard icon={<TagIcon />} label="Active" value={stats.activeListings} accent="#10B981" delay={150} />
                            <StatCard icon={<PackageIcon />} label="Sold" value={stats.soldListings} accent="#F59E0B" delay={200} />
                            <StatCard icon={<EyeIcon />} label="Views" value={stats.totalViews} accent="#8B5CF6" delay={250} />
                            <StatCard icon={<HeartIcon />} label="Saves" value={stats.totalSaves} accent="#EF4444" delay={300} />
                        </div>
                    </div>

                    {/* ── Category Breakdown ── */}
                    {stats.categoryBreakdown.length > 0 && (
                        <div className="mb-12 h-animate h-animate-d4" style={{ animationDelay: '0.45s', opacity: 0 }}>
                            <div className="section-title"><GridIcon /> Sells In</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {stats.categoryBreakdown.map(({ category, count }) => {
                                    const meta = CATEGORY_META[category] || { label: category, emoji: '📦', color: '#00D9FF' };
                                    const pct = Math.round((count / totalCategoryItems) * 100);
                                    return (
                                        <div
                                            key={category}
                                            className="flex items-center gap-4 p-4 bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-xl hover:border-white/12 transition-all"
                                        >
                                            <span className="text-2xl">{meta.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-sm font-semibold text-white/80">{meta.label}</span>
                                                    <span className="sp-mono text-[11px] font-bold" style={{ color: meta.color }}>{count} item{count !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="cat-bar-track">
                                                    <div
                                                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`, height: '100%', borderRadius: 100, transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Recent Active Listings ── */}
                    <div>
                        <div className="section-title"><GridIcon /> Active Listings ({stats.activeListings})</div>
                        {recentListings.length === 0 ? (
                            <div className="empty-listings">
                                <span className="text-4xl">🛍️</span>
                                <p className="text-white/50 text-sm">No active listings right now</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentListings.map((p, i) => (
                                        <MiniProductCard key={p._id} product={p} index={i} />
                                    ))}
                                </div>
                                {stats.activeListings > 6 && (
                                    <div className="mt-6 text-center">
                                        <Link
                                            to="/marketplace"
                                            className="inline-flex items-center gap-2 px-8 py-3 bg-[rgba(0,217,255,0.08)] border border-[rgba(0,217,255,0.2)] text-[#00D9FF] rounded-full text-sm font-semibold hover:bg-[rgba(0,217,255,0.15)] transition-all"
                                        >
                                            View All Listings in Marketplace
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ── Footer space ── */}
                    <div className="h-16" />
                </div>
            </div>
        </>
    );
};

export default SellerProfile;
