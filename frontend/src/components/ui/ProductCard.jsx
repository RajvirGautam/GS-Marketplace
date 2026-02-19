import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';

const HeartIcon = ({ filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ProductCard = ({ product, viewMode = 'grid', index = 0 }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(product.saves || 0);
  const [showActions, setShowActions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Initialize saved state
  useEffect(() => {
    if (user && product.savedBy) {
      setIsSaved(product.savedBy.includes(user._id));
    }
  }, [user, product.savedBy]);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50 + index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.1 + index * 0.05}s`
  };

  // Helper functions
  const getSellerName = () => {
    if (typeof product.seller === 'object' && product.seller?.fullName) {
      return product.seller.fullName;
    }
    return product.user || 'Unknown';
  };

  const getSellerInitial = () => {
    const name = getSellerName();
    return name.charAt(0).toUpperCase();
  };

  const getProductImage = () => {
    if (product.images && product.images.length > 0) return product.images[0];
    return product.image || '/placeholder.jpg';
  };

  const getProductPrice = () => {
    if (product.type === 'free') return 'FREE';
    if (product.type === 'barter') return 'BARTER';
    return `₹${product.price || 0}`;
  };

  const getTimeAgo = () => {
    if (product.postedDate) return product.postedDate;
    if (product.timeAgo) return product.timeAgo;
    if (product.createdAt) {
      const date = new Date(product.createdAt);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return 'Today';
      if (days === 1) return '1 day ago';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return `${Math.floor(days / 30)} months ago`;
    }
    return 'Recently';
  };

  const getAccentColor = () => product.accent || '#00D9FF';
  const getGradientStart = () => product.gradientStart || '#1a1a1a';

  // Stop propagation helper
  const stopNav = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle save/unsave
  const handleSaveClick = async (e) => {
    stopNav(e);

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      console.log('🔄 Toggling save for product:', product._id);
      const response = await productAPI.toggleSave(product._id);
      console.log('✅ Save response:', response);

      if (response.success) {
        setIsSaved(response.saved);
        setSaveCount(prev => response.saved ? prev + 1 : Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('❌ Error saving product:', error);
    }
  };

  // Handle card click with zoom transition
  const handleCardClick = (e) => {
    e.preventDefault();
    const productId = product._id || product.id;

    const cardElement = e.currentTarget;
    const imgElement = cardElement.querySelector('img');

    if (imgElement) {
      const rect = imgElement.getBoundingClientRect();
      sessionStorage.setItem('productTransition', JSON.stringify({
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        imgSrc: getProductImage(),
        scrollY: window.scrollY
      }));
    }

    navigate(`/product/${productId}`);
  };

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="group relative bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,1)] flex cursor-pointer"
        style={animationStyle}
      >
        {/* Image Section */}
        <div className="relative w-64 flex-shrink-0 overflow-hidden bg-zinc-900 border-r border-[rgba(255,255,255,0.1)]">
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
            style={{ background: `linear-gradient(to bottom, ${getGradientStart()}, #000)` }}
          />
          <img
            src={getProductImage()}
            alt={product.title}
            className="relative w-full h-full object-cover mix-blend-normal transition-transform duration-700 group-hover:scale-110"
          />
          {product.isTrending && (
            <div className="absolute top-3 left-3 bg-[#F59E0B] text-black px-2 py-1 mono text-[9px] font-bold">
              TRENDING
            </div>
          )}
          {(product.isVerified || product.seller?.isVerified) && (
            <div className="absolute top-3 right-3 bg-[#00D9FF] text-black px-2 py-0.5 mono text-[9px] font-bold uppercase tracking-wider">
              Verified
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl leading-tight group-hover:text-[#00D9FF] transition-colors mb-1">
                  {product.title}
                </h3>
                <div className="mono text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">
                  {product.tag || product.category?.toUpperCase()}
                </div>
              </div>
              <div className="flex gap-2" onClick={stopNav}>
                <button
                  onClick={handleSaveClick}
                  className="w-9 h-9 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.4)] transition-colors"
                  style={{ color: isSaved ? '#EF4444' : 'white' }}
                >
                  <HeartIcon filled={isSaved} />
                </button>
                <button
                  onClick={stopNav}
                  className="w-9 h-9 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.4)] transition-colors"
                >
                  <ShareIcon />
                </button>
              </div>
            </div>

            <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.4)] mono mb-4">
              <span className="flex items-center gap-1">
                <LocationIcon /> {product.location || 'SGSITS Campus'}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon /> {product.views || 0} views
              </span>
              <span>{getTimeAgo()}</span>
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const sellerId = typeof product.seller === 'object' ? product.seller?._id : null;
                if (sellerId) navigate(`/seller/${sellerId}`);
              }}
              className="flex items-center gap-2 py-3 border-t border-dashed border-[rgba(255,255,255,0.1)] cursor-pointer hover:opacity-80 transition-opacity group/seller"
            >
              <div className="w-8 h-8 rounded-none bg-zinc-800 border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-xs font-bold text-white group-hover/seller:border-[#00D9FF] transition-colors">
                {getSellerInitial()}
              </div>
              <span className="text-sm text-[rgba(255,255,255,0.7)] group-hover/seller:text-[#00D9FF] transition-colors">{getSellerName()}</span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <div>
              <div className="mono text-[9px] text-[rgba(255,255,255,0.3)] uppercase mb-1">Price</div>
              <div className="text-2xl font-black text-white" style={{ color: getAccentColor() }}>
                {getProductPrice()}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={stopNav}
                className="bg-transparent border border-[rgba(255,255,255,0.2)] text-white px-4 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-[rgba(255,255,255,0.05)] transition-all flex items-center gap-2"
              >
                <ChatIcon /> Chat
              </button>
              <span className="bg-white text-black border border-white px-4 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all">
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(255,255,255,0.3)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,1)] cursor-pointer"
      style={animationStyle}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Accent Top Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{ background: getAccentColor() }}
      />

      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 border-b border-[rgba(255,255,255,0.1)]">
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ background: `linear-gradient(to bottom, ${getGradientStart()}, #000)` }}
        />
        <img
          src={getProductImage()}
          alt={product.title}
          className="relative w-full h-full object-cover mix-blend-normal transition-transform duration-700 group-hover:scale-110"
        />

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.isTrending && (
            <div className="bg-[#F59E0B] text-black px-2 py-0.5 mono text-[9px] font-bold">
              TRENDING
            </div>
          )}
          {(product.isVerified || product.seller?.isVerified) && (
            <div className="bg-[#00D9FF] text-black px-2 py-0.5 mono text-[9px] font-bold uppercase tracking-wider">
              Verified
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2" onClick={stopNav}>
          <button
            onClick={handleSaveClick}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.9)] backdrop-blur shadow-lg transition-all hover:scale-110"
            style={{
              color: isSaved ? '#EF4444' : 'black'
            }}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            <HeartIcon filled={isSaved} />
          </button>
          <button
            onClick={stopNav}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.9)] backdrop-blur shadow-lg transition-all hover:scale-110"
          >
            <ShareIcon />
          </button>
        </div>

        {/* Metadata Row */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-[10px] text-[rgba(255,255,255,0.8)] mono bg-[rgba(0,0,0,0.6)] backdrop-blur px-2 py-1">
          <span className="flex items-center gap-1">
            <LocationIcon /> {product.location || 'Campus'}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon /> {product.views || 0}
          </span>
          <span className="ml-auto">{getTimeAgo()}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-200"
          style={{ background: `linear-gradient(45deg, transparent 40%, ${getAccentColor()}10 40%, transparent 60%)` }}
        />

        <div className="mb-2">
          <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[#00D9FF] transition-colors truncate">
            {product.title}
          </h3>
          <div className="mono text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mt-1">
            {product.tag || product.category?.toUpperCase()}
          </div>
        </div>

        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const sellerId = typeof product.seller === 'object' ? product.seller?._id : null;
            if (sellerId) navigate(`/seller/${sellerId}`);
          }}
          className="flex items-center gap-2 mb-4 py-3 border-t border-dashed border-[rgba(255,255,255,0.1)] cursor-pointer hover:opacity-80 transition-opacity group/seller"
        >
          <div className="w-6 h-6 rounded-none bg-zinc-800 border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[10px] font-bold text-white group-hover/seller:border-[#00D9FF] transition-colors">
            {getSellerInitial()}
          </div>
          <span className="text-xs text-[rgba(255,255,255,0.7)] group-hover/seller:text-[#00D9FF] transition-colors">{getSellerName().split(' ')[0]}</span>
          {(product.isVerified || product.seller?.isVerified) && (
            <span className="text-[#00D9FF] text-xs">✓</span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="mono text-[9px] text-[rgba(255,255,255,0.3)] uppercase mb-0.5">Price</div>
              <div className="text-xl font-black text-white" style={{ color: getAccentColor() }}>
                {getProductPrice()}
              </div>
            </div>
            {product.condition && (
              <span className="px-2 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[10px] mono text-[rgba(255,255,255,0.6)]">
                {product.condition.toUpperCase()}
              </span>
            )}
          </div>

          <div
            className={`grid grid-cols-2 gap-2 transition-all duration-300 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto'
              }`}
          >
            <button
              onClick={stopNav}
              className="bg-transparent border border-[rgba(255,255,255,0.2)] text-white px-3 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-[rgba(255,255,255,0.05)] transition-all flex items-center justify-center gap-1"
            >
              <ChatIcon /> Chat
            </button>
            <span className="bg-white text-black border border-white px-3 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all text-center">
              View
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
