import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import AddProductModal from './AddProductModal';
import EditProductModal from './dashboard/EditProductModal';


// Icons (keeping original - they're good!)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const BarChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const MoreVert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="1"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
);

const ArrowUp = ({ color = "currentColor" }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
    <path d="M12 19V5"/>
    <path d="m5 12 7-7 7 7"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const TrendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
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


// Main Component
const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarActive, setSidebarActive] = useState('Overview');

  useEffect(() => { fetchDashboardData(); }, []);

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

  const donutData = [
    { label: 'Electronics', value: stats.totalListings > 0 ? Math.floor(stats.totalListings * 0.4) : 5, color: '#00D9FF' },
    { label: 'Books', value: stats.totalListings > 0 ? Math.floor(stats.totalListings * 0.3) : 3, color: '#7C3AED' },
    { label: 'Clothes', value: stats.totalListings > 0 ? Math.floor(stats.totalListings * 0.2) : 2, color: '#F59E0B' },
    { label: 'Others', value: stats.totalListings > 0 ? Math.floor(stats.totalListings * 0.1) : 1, color: '#10B981' },
  ];

  const profitData = [20, 35, 25, 45, 38, 55, 48, 62, 55, 70, 65, 78, 72, 85, 80, 90, 88, 95, 100, 105];

  const notifications = [
    { text: `${stats.totalViews} Total product views`, time: 'Today', color: '#00D9FF' },
    { text: `${stats.soldListings} Items sold`, time: 'This week', color: '#10B981' },
    { text: `${stats.totalSaves} Products saved by users`, time: 'This month', color: '#7C3AED' },
    { text: `${stats.activeListings} Active listings`, time: 'Current', color: '#F59E0B' },
  ];

  const activities = [
    { text: 'Dashboard theme updated', time: 'Just now', color: '#7C3AED' },
    { text: `${stats.totalListings} Total products listed`, time: 'Overview', color: '#00D9FF' },
    { text: `${stats.pendingListings} Pending approvals`, time: 'Action needed', color: '#F59E0B' },
    { text: 'System running smoothly', time: 'Status', color: '#10B981' },
  ];

  const sidebarDashItems = [
    { label: 'Overview', icon: <HomeIcon /> },
    { label: 'Marketplace', icon: <CartIcon />, action: () => navigate('/marketplace') },
    { label: 'Analytics', icon: <BarChartIcon /> },
    { label: 'My Products', icon: <PackageIcon /> },
  ];
  const sidebarSettItems = [
    { label: 'Messages', icon: <MessageIcon /> },
    { label: 'Reviews', icon: <StarIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
    { label: 'Logout', icon: <HelpIcon />, action: () => { logout(); navigate('/'); } },
  ];

  if (loading) {
    return (
      <div style={{ background:'#0A0A0A', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:'Manrope, sans-serif' }}>
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
          min-height: 100vh;
          background: rgba(15,15,15,0.8);
          border-right: 2px solid rgba(255,255,255,0.08);
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 50;
          overflow-y: auto;
          backdrop-filter: blur(20px);
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
          margin-left: 240px;
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

      <div className="dash-root">
        {/* NOISE & GRID */}
        <div className="noise-overlay"></div>
        <div className="grid-lines"></div>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-profile">
            <div className="sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
            <span className="sidebar-name">{userName.split(' ').slice(0,2).join(' ')}</span>
          </div>

          <div className="sidebar-search">
            <SearchIcon />
            <input placeholder="Search..." readOnly />
            <span className="kbd">⌘K</span>
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
              className={`sidebar-item`}
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
            <span style={{ fontSize: 18 }}>🎓</span> Campus Market
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="main-area">
          {/* TOP BAR */}
          <header className="topbar">
            <div className="topbar-breadcrumb">
              <span>🏠</span>
              <span>Dashboards /</span>
              <span className="current">Overview</span>
            </div>
            <div className="topbar-actions">
              <button className="topbar-icon-btn" title="Dark Mode"><MoonIcon /></button>
              <button className="topbar-icon-btn" title="Notifications"><BellIcon /></button>
              <button className="topbar-icon-btn" title="Language"><GlobeIcon /></button>
              <button
                className="topbar-icon-btn"
                style={{ background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', color: '#fff', border: 'none' }}
                onClick={() => setIsAddProductOpen(true)}
                title="Add Product"
              >
                <PlusIcon />
              </button>
            </div>
          </header>

          <div className="content-wrapper">
            {/* CENTER CONTENT */}
            <div className="content-main">
              {/* OVERVIEW HEADER */}
              <div className="overview-header">
                <h1>Overview</h1>
                <button className="today-btn">
                  Today ▾
                </button>
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
                    {stats.totalListings > 0 ? Math.round(stats.totalViews / stats.totalListings) : 0} avg per item
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
                    <button style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}><MoreVert /></button>
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
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Last 20 periods</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
                    {stats.totalViews + stats.totalSaves} Total
                  </div>
                  <MiniLineChart data={profitData} width={260} height={90} color="#00D9FF" />
                </div>

                {/* MY LISTINGS */}
                <div className="card" style={{ maxHeight: 420, overflow: 'auto' }}>
                  <div className="card-header">
                    <span className="card-title">My Listings</span>
                  </div>
                  <div className="listing-tabs">
                    {['all','active','sold','pending'].map(tab => (
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

              {/* PRICING CARD */}
              <div className="bottom-row">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">All Your Products</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                    Manage all your listings here. You have {stats.totalListings} total products.
                  </div>
                  <button 
                    className="pricing-cta" 
                    style={{ width: '100%' }}
                    onClick={() => navigate('/marketplace')}
                  >
                    View All Listings
                  </button>
                </div>

                {/* PRICING */}
                <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="pricing-badge">
                    <ZapIcon /> Premium Seller
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span className="pricing-amount">{stats.soldListings}</span>
                    <span className="pricing-per">Items<br/>Sold</span>
                  </div>
                  <div className="pricing-desc">
                    Keep selling to unlock premium<br/>features and seller badges 🚀
                  </div>
                  <button className="pricing-cta" onClick={() => setIsAddProductOpen(true)}>Add New Product</button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="content-right">
              {/* NOTIFICATIONS */}
              <div className="right-section-title">Activity</div>
              {notifications.map((n, i) => (
                <div className="notif-item" key={i}>
                  <div className="notif-dot" style={{ background: n.color }} />
                  <div>
                    <div className="notif-text">{n.text}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              ))}

              <hr className="divider" />

              {/* ACTIVITIES */}
              <div className="right-section-title">Quick Stats</div>
              {activities.map((a, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-icon" style={{ background: `${a.color}20`, color: a.color, fontSize: 12, fontWeight: 700 }}>
                    {['📊', '📦', '⏳', '✅'][i]}
                  </div>
                  <div>
                    <div className="notif-text">{a.text}</div>
                    <div className="notif-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
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
      </div>
    </>
  );
};

export default UserDashboard;