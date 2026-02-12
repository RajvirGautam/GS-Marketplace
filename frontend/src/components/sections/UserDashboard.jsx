import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import AddProductModal from './AddProductModal';

// Icons
const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // REAL DATA STATE
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // FETCH DATA ON MOUNT
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');
      
      // Fetch both listings and analytics in parallel
      const [listingsRes, analyticsRes] = await Promise.all([
        productAPI.getMyListings(),
        productAPI.getAnalytics()
      ]);
      
      console.log('✅ Listings Response:', listingsRes);
      console.log('✅ Analytics Response:', analyticsRes);
      
      if (listingsRes.success) {
        setListings(listingsRes.products || []);
        console.log('✅ Set', listingsRes.products?.length || 0, 'listings');
      } else {
        console.error('❌ Failed to fetch listings');
        setListings([]);
      }
      
      if (analyticsRes.success) {
        setAnalytics(analyticsRes.analytics);
        console.log('✅ Analytics loaded:', analyticsRes.analytics);
      } else {
        console.error('❌ Failed to fetch analytics');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setListings([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic User Name
  const userName = user?.fullName?.split(' ')[0] || "User";

  // Use analytics from API or calculate from listings as fallback
  const stats = analytics || {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    soldListings: listings.filter(l => l.status === 'sold').length,
    pendingListings: listings.filter(l => l.status === 'pending').length,
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalSaves: listings.reduce((sum, l) => sum + (l.saves || 0), 0),
    totalRevenue: listings
      .filter(l => l.status === 'sold')
      .reduce((sum, l) => sum + (l.price || 0), 0)
  };

  console.log('📈 Current Stats:', stats);
  console.log('📦 Current Listings:', listings.length);

  const filteredListings = activeTab === 'all' 
    ? listings 
    : listings.filter(l => l.status === activeTab);

  // DELETE PRODUCT
  const handleDelete = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('🗑️ Deleting product:', deleteItemId);
      const response = await productAPI.delete(deleteItemId);
      
      if (response.success) {
        console.log('✅ Product deleted successfully');
        setListings(listings.filter(l => l._id !== deleteItemId));
        setShowDeleteModal(false);
        setDeleteItemId(null);
        alert('✅ Product deleted successfully!');
        
        // Refresh analytics
        fetchDashboardData();
      } else {
        console.error('❌ Delete failed:', response);
        alert('❌ Failed to delete product');
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      alert('❌ Failed to delete product');
    }
  };

  // MARK AS SOLD
  const handleMarkAsSold = async (productId) => {
    try {
      console.log('💰 Marking as sold:', productId);
      const response = await productAPI.update(productId, { status: 'sold' });
      
      if (response.success) {
        console.log('✅ Product marked as sold');
        setListings(listings.map(l => 
          l._id === productId ? { ...l, status: 'sold' } : l
        ));
        alert('✅ Product marked as sold!');
        
        // Refresh analytics
        fetchDashboardData();
      } else {
        console.error('❌ Update failed:', response);
        alert('❌ Failed to update product');
      }
    } catch (error) {
      console.error('❌ Error updating product:', error);
      alert('❌ Failed to update product');
    }
  };

  // NAVIGATE TO PRODUCT PAGE
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // NAVIGATE TO EDIT
  const handleEditProduct = (productId) => {
    alert(`Edit functionality coming soon for product ${productId}`);
  };

  const handleBackClick = () => {
    navigate('/marketplace');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      sold: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return (
      <span className={`px-2 py-1 text-[10px] mono font-bold uppercase border ${styles[status] || styles.active}`}>
        {status}
      </span>
    );
  };

  // Get time ago helper
  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Recently';
    const now = new Date();
    const created = new Date(createdAt);
    const diff = now - created;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  // Get product price display
  const getPriceDisplay = (product) => {
    if (product.type === 'free') return 'FREE';
    if (product.type === 'barter') return 'BARTER';
    return `₹${product.price || 0}`;
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder.jpg';
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="dashboard-root min-h-screen flex items-center justify-center">
        <div className="text-white mono text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        .dashboard-root {
          font-family: 'Manrope', sans-serif;
          background: #0A0A0A;
          color: #fff;
          min-height: 100vh;
        }

        .mono {
          font-family: 'JetBrains Mono', monospace;
        }

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

        .btn-glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 50px;
          padding: 10px 18px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          backdrop-filter: blur(10px);
          text-decoration: none;
        }

        .btn-glass:hover {
          background: rgba(255,255,255,0.15);
          border-color: white;
        }

        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .stat-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .listing-card {
          background: #0F0F0F;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s;
        }

        .listing-card:hover {
          border-color: rgba(255,255,255,0.3);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
        }

        .chat-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
          cursor: pointer;
        }

        .chat-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
        }

        .tab-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          transition: all 0.2s;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .tab-btn.active {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.3);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: #0F0F0F;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 32px;
          max-width: 400px;
          animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .action-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .action-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.3);
        }

        .action-btn.delete:hover {
          background: rgba(239,68,68,0.2);
          border-color: rgb(239,68,68);
          color: rgb(239,68,68);
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .anim-slide-up {
          animation: slideInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      <div className="dashboard-root relative">
        <div className="noise-overlay"></div>
        <div className="grid-lines"></div>

        <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center pointer-events-none">
          <button onClick={handleBackClick} className="btn-glass pointer-events-auto shadow-lg">
            <ArrowLeft />
            <span className="hidden sm:inline">Back</span>
          </button>

          {user && (
            <div className="relative pointer-events-auto user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn-glass shadow-lg"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-[10px] font-bold">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
                <ChevronDown />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0F0F0F] border border-white/20 shadow-2xl backdrop-blur-xl z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="text-[10px] text-white/40 mono uppercase mb-1">Logged in as</div>
                    <div className="text-sm text-white font-bold truncate">{user.fullName}</div>
                    <div className="text-xs text-white/60 truncate mt-0.5">{user.email}</div>
                    {user.enrollmentNumber && (
                      <div className="text-[10px] text-cyan-400 mono mt-2">{user.enrollmentNumber}</div>
                    )}
                  </div>
                  <Link 
                    to="/marketplace"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    Browse Marketplace
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-24 md:py-32">
          
          <div className="mb-12 anim-slide-up">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  Hey {userName} 👋
                </h1>
                <p className="text-white/60 text-sm">
                  Manage your listings, track performance, and connect with buyers
                </p>
              </div>
              <button 
                onClick={() => setIsAddProductOpen(true)} 
                className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 font-bold mono text-sm flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <PlusIcon /> ADD PRODUCT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            
            <div className="stat-card p-6 anim-slide-up delay-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#00D9FF]/20 flex items-center justify-center">
                  <PackageIcon />
                </div>
                <span className="mono text-xs text-white/40">TOTAL</span>
              </div>
              <div className="text-3xl font-black mb-1">{stats.totalListings}</div>
              <div className="text-xs text-white/60 uppercase mono">Total Listings</div>
              <div className="mt-4 flex gap-4 text-xs">
                <span className="text-green-400">● {stats.activeListings} Active</span>
                <span className="text-blue-400">● {stats.soldListings} Sold</span>
              </div>
            </div>

            <div className="stat-card p-6 anim-slide-up delay-2">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#F59E0B]/20 flex items-center justify-center">
                  <TrendingIcon />
                </div>
                <span className="mono text-xs text-white/40">ENGAGEMENT</span>
              </div>
              <div className="text-3xl font-black mb-1">{stats.totalViews}</div>
              <div className="text-xs text-white/60 uppercase mono">Total Views</div>
              <div className="mt-4 text-xs text-white/60">
                Avg {stats.totalListings > 0 ? Math.round(stats.totalViews / stats.totalListings) : 0} views per listing
              </div>
            </div>

            <div className="stat-card p-6 anim-slide-up delay-3">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#7C3AED]/20 flex items-center justify-center">
                  <HeartIcon />
                </div>
                <span className="mono text-xs text-white/40">SAVED</span>
              </div>
              <div className="text-3xl font-black mb-1">{stats.totalSaves}</div>
              <div className="text-xs text-white/60 uppercase mono">Total Saves</div>
              <div className="mt-4 text-xs text-white/60">
                People interested in your items
              </div>
            </div>

            <div className="stat-card p-6 anim-slide-up delay-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#10B981]/20 flex items-center justify-center">
                  <DollarIcon />
                </div>
                <span className="mono text-xs text-white/40">REVENUE</span>
              </div>
              <div className="text-3xl font-black mb-1">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-white/60 uppercase mono">Total Sales</div>
              <div className="mt-4 text-xs text-green-400 flex items-center gap-1">
                <CheckCircleIcon /> {stats.soldListings} items sold
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2">
              
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                <button 
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All ({stats.totalListings})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  Active ({stats.activeListings})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'sold' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sold')}
                >
                  Sold ({stats.soldListings})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending ({stats.pendingListings})
                </button>
              </div>

              <div className="space-y-4">
                {filteredListings.map((listing, index) => (
                  <div 
                    key={listing._id} 
                    className="listing-card p-4 anim-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-4">
                      
                      <div className="w-24 h-24 flex-shrink-0 bg-zinc-800 overflow-hidden relative">
                        <img 
                          src={getProductImage(listing)} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        {listing.isTrending && (
                          <div className="absolute top-1 right-1 bg-[#F59E0B] text-black px-1 py-0.5 text-[8px] font-bold">
                            🔥
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg truncate mb-1">
                              {listing.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              {getStatusBadge(listing.status)}
                              <span className="text-xs text-white/40 mono">{getTimeAgo(listing.createdAt)}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-xl font-black text-[#00D9FF]">
                              {getPriceDisplay(listing)}
                            </div>
                            <div className="text-[10px] text-white/40 mono uppercase">
                              {listing.condition || 'Used'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                          <span className="flex items-center gap-1">
                            <EyeIcon /> {listing.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <HeartIcon /> {listing.saves || 0}
                          </span>
                          <span className="text-white/40 mono">{listing.category?.toUpperCase()}</span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button 
                            onClick={() => handleViewProduct(listing._id)}
                            className="action-btn flex items-center gap-2 px-3 py-2 text-xs mono font-bold text-white"
                          >
                            <EyeIcon /> VIEW
                          </button>
                          <button 
                            className="action-btn flex items-center gap-2 px-3 py-2 text-xs mono font-bold text-white"
                            onClick={() => handleEditProduct(listing._id)}
                          >
                            <EditIcon /> EDIT
                          </button>
                          <button 
                            className="action-btn delete flex items-center gap-2 px-3 py-2 text-xs mono font-bold text-white"
                            onClick={() => handleDelete(listing._id)}
                          >
                            <TrashIcon /> DELETE
                          </button>
                          {listing.status === 'active' && (
                            <button 
                              onClick={() => handleMarkAsSold(listing._id)}
                              className="action-btn px-3 py-2 text-xs mono font-bold text-white"
                            >
                              MARK AS SOLD
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}

                {filteredListings.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 opacity-20">📦</div>
                    <h3 className="text-xl font-bold text-white/60 mb-2">
                      No {activeTab !== 'all' ? activeTab : ''} listings
                    </h3>
                    <p className="text-white/40 text-sm">
                      {activeTab === 'all' 
                        ? 'Start by adding your first product'
                        : `You don't have any ${activeTab} listings`
                      }
                    </p>
                  </div>
                )}
              </div>

            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-900/50 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Chats</h2>
                </div>

                <div className="text-center py-8 text-white/40">
                  <MessageIcon />
                  <p className="text-sm mt-2">Chat system coming soon!</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {showDeleteModal && (
          <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Delete Listing?</h3>
              <p className="text-white/60 text-sm mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 text-sm mono font-bold hover:bg-white/10 transition-colors"
                  onClick={() => setShowDeleteModal(false)}
                >
                  CANCEL
                </button>
                <button 
                  className="flex-1 bg-red-500 text-white px-4 py-3 text-sm mono font-bold hover:bg-red-600 transition-colors"
                  onClick={confirmDelete}
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        )}

        <AddProductModal 
          isOpen={isAddProductOpen} 
          onClose={() => {
            setIsAddProductOpen(false);
            fetchDashboardData(); // Refresh after adding
          }} 
        />

      </div>
    </>
  );
};

export default UserDashboard;