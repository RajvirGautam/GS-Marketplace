
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import AddProductModal from './AddProductModal';
import EditProductModal from './dashboard/EditProductModal';


// --- Internal Icons ---
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


const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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


const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
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


const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);


// Donut Chart
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
  const [savedItems, setSavedItems] = useState([]);
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
      const [listingsRes, analyticsRes, savedRes] = await Promise.all([
        productAPI.getMyListings(),
        productAPI.getAnalytics(),
        productAPI.getSaved()
      ]);
      if (listingsRes.success) setListings(listingsRes.products || []);
      else setListings([]);
      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (savedRes.success) setSavedItems(savedRes.products || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setListings([]);
      setSavedItems([]);
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
  
  const handleUnsave = async (productId) => {
    try {
      const response = await productAPI.toggleSave(productId);
      if (response.success) {
        setSavedItems(savedItems.filter(item => item._id !== productId));
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error unsaving product:', error);
    }
  };


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
      <span className={`px-2 py-1 text-[10px] mono font-bold uppercase border rounded ${styles[status] || styles.active}`}>
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


  const sidebarDashItems = [
    { label: 'Overview', icon: <HomeIcon /> },
    { label: 'Marketplace', icon: <CartIcon />, action: () => navigate('/marketplace') },
    { label: 'Saved', icon: <HeartIcon /> },
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


        .sidebar {
          width: 260px;
          background: #0F0F0F;
          border-right: 1px solid rgba(255,255,255,0.08);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }


        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          padding: 0 8px;
        }


        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
          color: #fff;
        }


        .sidebar-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
        }


        .sidebar-section {
          margin-bottom: 24px;
        }


        .sidebar-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
          padding: 0 8px;
        }


        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          margin-bottom: 4px;
        }


        .sidebar-item:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }


        .sidebar-item.active {
          background: rgba(0, 217, 255, 0.1);
          color: #00D9FF;
          border: 1px solid rgba(0, 217, 255, 0.2);
        }


        .main-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          max-width: 1600px;
        }


        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }


        .header-title {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
        }


        .header-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }


        .btn-primary {
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s;
        }


        .btn-primary:hover {
          transform: translateY(-2px);
        }


        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }


        .stat-card {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s;
        }


        .stat-card:hover {
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }


        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }


        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }


        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
        }


        .stat-change {
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
        }


        .stat-change.positive { color: #10B981; }
        .stat-change.negative { color: #EF4444; }


        .card {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }


        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }


        .card-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }


        .listing-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 2px;
        }


        .listing-tab {
          padding: 10px 20px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
        }


        .listing-tab:hover {
          color: #fff;
        }


        .listing-tab.active {
          color: #00D9FF;
        }


        .listing-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #00D9FF;
        }


        .listing-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 12px;
          transition: all 0.2s;
        }


        .listing-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
        }


        .listing-img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
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
          gap: 8px;
          margin-top: 12px;
        }


        .listing-action-btn {
          padding: 6px 12px;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid rgba(0, 217, 255, 0.2);
          color: #00D9FF;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }


        .listing-action-btn:hover {
          background: rgba(0, 217, 255, 0.2);
        }


        .listing-action-btn.del {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }


        .listing-action-btn.del:hover {
          background: rgba(239, 68, 68, 0.2);
        }


        .delete-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }


        .delete-modal-content {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          text-align: center;
        }


        .delete-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }


        .delete-modal-text {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 24px;
        }


        .delete-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }


        .delete-modal-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }


        .delete-modal-btn.cancel {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }


        .delete-modal-btn.cancel:hover {
          background: rgba(255,255,255,0.15);
        }


        .delete-modal-btn.confirm {
          background: #EF4444;
          color: #fff;
        }


        .delete-modal-btn.confirm:hover {
          background: #DC2626;
        }


        .bottom-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }


        .pricing-cta {
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }


        .pricing-cta:hover {
          transform: translateY(-2px);
        }


        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255,255,255,0.4);
        }


        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.3;
        }


        .empty-state-text {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }


        .empty-state-subtext {
          font-size: 14px;
          opacity: 0.7;
        }


        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
          
          .main-content {
            padding: 20px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>


      <div className="dash-root">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">S</div>
            <div className="sidebar-logo-text">SGSITS.MKT</div>
          </div>


          <div className="sidebar-section">
            <div className="sidebar-label">Dashboard</div>
            {sidebarDashItems.map((item) => (
              <div
                key={item.label}
                className={`sidebar-item ${sidebarActive === item.label ? 'active' : ''}`}
                onClick={() => {
                  if (item.action) item.action();
                  else setSidebarActive(item.label);
                }}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>


          <div className="sidebar-section">
            <div className="sidebar-label">Account</div>
            {sidebarSettItems.map((item) => (
              <div
                key={item.label}
                className={`sidebar-item ${sidebarActive === item.label ? 'active' : ''}`}
                onClick={() => {
                  if (item.action) item.action();
                  else setSidebarActive(item.label);
                }}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </aside>


        {/* Main Content */}
        <main className="main-content">
          {/* OVERVIEW */}
          {sidebarActive === 'Overview' && (
            <>
              <div className="header">
                <div>
                  <h1 className="header-title">Welcome back, {userName.split(' ')[0]}! 👋</h1>
                  <p className="header-subtitle">Here's what's happening with your marketplace</p>
                </div>
                <button className="btn-primary" onClick={() => setIsAddProductOpen(true)}>
                  <PlusIcon /> New Product
                </button>
              </div>


              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Total Products</span>
                    <PackageIcon />
                  </div>
                  <div className="stat-value">{stats.totalListings}</div>
                  <div className="stat-change positive">
                    <ZapIcon /> Active & Growing
                  </div>
                </div>


                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Total Views</span>
                    <TrendingIcon />
                  </div>
                  <div className="stat-value">{stats.totalViews}</div>
                  <div className="stat-change positive">
                    <ZapIcon /> +12% this week
                  </div>
                </div>


                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Total Revenue</span>
                    <DollarIcon />
                  </div>
                  <div className="stat-value">₹{stats.totalRevenue}</div>
                  <div className="stat-change positive">
                    <ZapIcon /> {stats.soldListings} items sold
                  </div>
                </div>


                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Items Sold</span>
                    <CheckCircleIcon />
                  </div>
                  <div className="stat-value">{stats.soldListings}</div>
                  <div className="stat-change positive">
                    <ZapIcon /> Great performance
                  </div>
                </div>
              </div>


              {/* Charts Row */}
              <div className="bottom-row">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Category Distribution</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                    <DonutChart data={donutData} />
                  </div>
                </div>


                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Views Trend</span>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <MiniLineChart data={profitData} width={300} />
                  </div>
                </div>
              </div>


              {/* Recent Listings */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Recent Listings</span>
                </div>
                {listings.slice(0, 3).map((listing) => (
                  <div className="listing-item" key={listing._id}>
                    <div className="listing-img">
                      <img src={getProductImage(listing)} alt={listing.title} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>
                        {listing.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {getStatusBadge(listing.status)}
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                          {getTimeAgo(listing.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#00D9FF', fontSize: 16 }}>
                        {getPriceDisplay(listing)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}


          {/* MY PRODUCTS */}
          {sidebarActive === 'My Products' && (
            <>
              <div className="header">
                <div>
                  <h1 className="header-title">My Products</h1>
                  <p className="header-subtitle">Manage all your listings</p>
                </div>
                <button className="btn-primary" onClick={() => setIsAddProductOpen(true)}>
                  <PlusIcon /> New Product
                </button>
              </div>


              <div className="card">
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


                {filteredListings.length > 0 ? filteredListings.map((listing) => (
                  <div className="listing-item" key={listing._id}>
                    <div className="listing-img">
                      <img src={getProductImage(listing)} alt={listing.title} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>
                            {listing.title}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {getStatusBadge(listing.status)}
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                              {getTimeAgo(listing.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#00D9FF', fontSize: 16 }}>
                            {getPriceDisplay(listing)}
                          </div>
                        </div>
                      </div>
                      <div className="listing-actions">
                        <button className="listing-action-btn" onClick={() => handleViewProduct(listing._id)}>
                          <EyeIcon /> VIEW
                        </button>
                        <button className="listing-action-btn" onClick={() => handleEditProduct(listing)}>
                          <EditIcon /> EDIT
                        </button>
                        <button className="listing-action-btn del" onClick={() => handleDelete(listing._id)}>
                          <TrashIcon /> DEL
                        </button>
                        {listing.status === 'active' && (
                          <button className="listing-action-btn" onClick={() => handleMarkAsSold(listing._id)}>
                            <CheckCircleIcon /> SOLD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <div className="empty-state-text">No {activeTab !== 'all' ? activeTab : ''} listings yet</div>
                    <div className="empty-state-subtext">Start listing your products to see them here</div>
                  </div>
                )}
              </div>
            </>
          )}


          {/* SAVED ITEMS */}
          {sidebarActive === 'Saved' && (
            <>
              <div className="header">
                <div>
                  <h1 className="header-title">Saved Items</h1>
                  <p className="header-subtitle">Products you've bookmarked</p>
                </div>
              </div>


              <div className="card">
                {savedItems.length > 0 ? savedItems.map((item) => (
                  <div className="listing-item" key={item._id}>
                    <div className="listing-img">
                      <img src={getProductImage(item)} alt={item.title} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 4 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                            By {item.seller?.fullName || 'Unknown Seller'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#00D9FF', fontSize: 16 }}>
                            {getPriceDisplay(item)}
                          </div>
                        </div>
                      </div>
                      <div className="listing-actions">
                        <button className="listing-action-btn" onClick={() => handleViewProduct(item._id)}>
                          <EyeIcon /> VIEW
                        </button>
                        <button className="listing-action-btn del" onClick={() => handleUnsave(item._id)}>
                          <XIcon /> REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">💝</div>
                    <div className="empty-state-text">No saved items yet</div>
                    <div className="empty-state-subtext">Browse marketplace and save items you like!</div>
                    <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/marketplace')}>
                      Browse Marketplace
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete Product?</div>
            <div className="delete-modal-text">
              This action cannot be undone. Are you sure you want to delete this listing?
            </div>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-modal-btn confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={isAddProductOpen} 
        onClose={() => setIsAddProductOpen(false)} 
        onSuccess={fetchDashboardData}
      />


      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          isOpen={isEditProductOpen}
          onClose={() => {
            setIsEditProductOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSuccess={fetchDashboardData}
        />
      )}
    </>
  );
};


export default UserDashboard;

