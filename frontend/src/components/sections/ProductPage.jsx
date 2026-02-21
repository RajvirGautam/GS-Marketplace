import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, offerAPI } from '../../services/api';

// --- ICONS ---
const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const Heart = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const Shield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const Message = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Zap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const Clock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Eye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // AUTH INTEGRATION
  const { user, logout, savedProductIds, toggleSavedId } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isNavigating, setIsNavigating] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerError, setOfferError] = useState('');
  const [offerSuccess, setOfferSuccess] = useState(false);

  const mainImgRef = useRef(null);
  const transitionImgRef = useRef(null);
  const viewTracked = useRef(false); // guard against StrictMode double-fire

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

  // Sync heart state from global savedProductIds whenever product or set changes
  useEffect(() => {
    if (product?._id) {
      setSaved(savedProductIds.has(product._id.toString()));
      setSaveCount(product.saves || 0);
    }
  }, [product, savedProductIds]);

  // Handle save toggle
  const handleSaveToggle = async () => {
    if (!user) return;
    try {
      const response = await productAPI.toggleSave(product._id);
      if (response.success) {
        setSaved(response.saved);
        setSaveCount(prev => response.saved ? prev + 1 : Math.max(0, prev - 1));
        toggleSavedId(product._id);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // Handle Contact Seller
  const handleContactSeller = () => {
    if (!user) {
      // If not logged in, redirect to login (or show modal)
      navigate('/login');
      return;
    }
    const sellerName = typeof product.seller === 'object' ? product.seller.fullName : product.user;
    console.log(`Starting chat with ${sellerName} as ${user.fullName}`);
    alert(`Starting chat with ${sellerName}`);
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    setOfferSubmitting(true);
    setOfferError('');

    try {
      const res = await offerAPI.create({
        productId: product._id,
        offerPrice: Number(offerAmount),
        message: offerMessage
      });

      if (res.success) {
        setOfferSuccess(true);
        setTimeout(() => {
          setShowOfferModal(false);
          setOfferSuccess(false);
          setOfferAmount('');
          setOfferMessage('');
        }, 2000);
      }
    } catch (err) {
      setOfferError(err.response?.data?.message || 'Failed to send offer. You might already have a pending offer.');
    } finally {
      setOfferSubmitting(false);
    }
  };

  // Handle back navigation with zoom out effect
  const handleBackClick = (e) => {
    e.preventDefault();

    if (isNavigating) return; // Prevent double clicks
    setIsNavigating(true);

    const transitionData = sessionStorage.getItem('productTransition');

    if (transitionData && mainImgRef.current && product) {
      try {
        const { rect, scrollY } = JSON.parse(transitionData);
        const mainImg = mainImgRef.current;
        const currentRect = mainImg.getBoundingClientRect();

        // Create transition overlay
        const transitionImg = document.createElement('img');
        transitionImg.src = product.image || (product.images && product.images[0]);
        transitionImg.style.position = 'fixed';
        transitionImg.style.top = `${currentRect.top}px`;
        transitionImg.style.left = `${currentRect.left}px`;
        transitionImg.style.width = `${currentRect.width}px`;
        transitionImg.style.height = `${currentRect.height}px`;
        transitionImg.style.objectFit = 'cover';
        transitionImg.style.zIndex = '9999';
        transitionImg.style.borderRadius = '24px';
        transitionImg.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        transitionImg.style.pointerEvents = 'none';

        document.body.appendChild(transitionImg);
        transitionImgRef.current = transitionImg;

        // Start zoom out animation
        requestAnimationFrame(() => {
          transitionImg.style.top = `${rect.top}px`;
          transitionImg.style.left = `${rect.left}px`;
          transitionImg.style.width = `${rect.width}px`;
          transitionImg.style.height = `${rect.height}px`;
          transitionImg.style.borderRadius = '12px';

          // After animation completes, navigate
          setTimeout(() => {
            // Clean up
            if (transitionImgRef.current) {
              transitionImgRef.current.remove();
              transitionImgRef.current = null;
            }
            sessionStorage.removeItem('productTransition');

            // Navigate back with scroll position
            navigate('/marketplace', {
              state: { scrollY: scrollY },
              replace: false
            });
          }, 600);
        });
      } catch (error) {
        console.error('Back transition error:', error);
        sessionStorage.removeItem('productTransition');
        navigate('/marketplace');
      }
    } else {
      sessionStorage.removeItem('productTransition');
      navigate('/marketplace');
    }
  };

  // Handle browser back button - cleanup only
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (transitionImgRef.current) {
        transitionImgRef.current.remove();
        transitionImgRef.current = null;
      }
      sessionStorage.removeItem('productTransition');
    };

    const handlePopState = () => {
      handleBeforeUnload();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (transitionImgRef.current) {
        transitionImgRef.current.remove();
        transitionImgRef.current = null;
      }
      sessionStorage.removeItem('productTransition');
    };
  }, []);

  // Fetch product from API
  useEffect(() => {
    window.scrollTo(0, 0);

    viewTracked.current = false; // reset when product ID changes
    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log('🔍 Fetching product ID:', id);
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        const data = await response.json();

        console.log('✅ Product response:', data);

        if (data.success && data.product) {
          setProduct(data.product);
          setActiveImg(0);

          // ── Increment view count (once per product open) ──
          if (!viewTracked.current) {
            viewTracked.current = true;
            productAPI.trackView(id).catch(() => { });
          }

          setTimeout(() => {
            setLoading(false);

            // Handle Zoom In Transition from Marketplace
            const transitionData = sessionStorage.getItem('productTransition');

            if (transitionData && mainImgRef.current) {
              try {
                const { rect, imgSrc } = JSON.parse(transitionData);
                const mainImg = mainImgRef.current;

                setTimeout(() => {
                  const finalRect = mainImg.getBoundingClientRect();

                  const transitionImg = document.createElement('img');
                  transitionImg.src = imgSrc;
                  transitionImg.style.position = 'fixed';
                  transitionImg.style.top = `${rect.top}px`;
                  transitionImg.style.left = `${rect.left}px`;
                  transitionImg.style.width = `${rect.width}px`;
                  transitionImg.style.height = `${rect.height}px`;
                  transitionImg.style.objectFit = 'cover';
                  transitionImg.style.zIndex = '9999';
                  transitionImg.style.borderRadius = '12px';
                  transitionImg.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                  transitionImg.style.pointerEvents = 'none';

                  document.body.appendChild(transitionImg);
                  transitionImgRef.current = transitionImg;

                  mainImg.style.opacity = '0';

                  requestAnimationFrame(() => {
                    transitionImg.style.top = `${finalRect.top}px`;
                    transitionImg.style.left = `${finalRect.left}px`;
                    transitionImg.style.width = `${finalRect.width}px`;
                    transitionImg.style.height = `${finalRect.height}px`;
                    transitionImg.style.borderRadius = '24px';

                    setTimeout(() => {
                      mainImg.style.opacity = '1';
                      if (transitionImgRef.current) {
                        transitionImgRef.current.remove();
                        transitionImgRef.current = null;
                      }
                    }, 600);
                  });
                }, 50);
              } catch (error) {
                console.error('Zoom transition error:', error);
              }
            }
          }, 10);
        } else {
          setLoading(false);
          setProduct(null);
        }
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        setLoading(false);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  // Mouse movement effect for background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50 font-mono">
        Loading Neural Data...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-white/60 mb-8">Product not found in the mainframe.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-6 py-2 bg-white text-black font-bold rounded-full"
        >
          Back to Market
        </button>
      </div>
    );
  }

  const bgStyle = {
    background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${product.accent || '#4f46e5'}20 0%, transparent 40%), #050505`
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Newsreader:ital,wght@1,300;1,400&display=swap');

        :root {
          --font-main: 'Outfit', sans-serif;
          --font-serif: 'Newsreader', serif;
          --bg-card: rgba(20, 20, 20, 0.6);
          --border: rgba(255, 255, 255, 0.08);
          --accent: ${product.accent || '#4f46e5'};
        }

        body {
          margin: 0;
          background: #050505;
          color: #fff;
          font-family: var(--font-main);
          overflow-x: hidden;
        }

        .wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 24px 40px 24px;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(12, 1fr);
            align-items: start;
          }
        }

        .card {
          background: var(--bg-card);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 24px;
          position: relative;
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .card:hover {
          border-color: rgba(255,255,255,0.2);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .area-main-img {
          grid-column: span 12;
          aspect-ratio: 4/3;
          padding: 0;
          overflow: hidden;
        }

        .area-header { grid-column: span 12; }
        .area-price { grid-column: span 12; }
        .area-seller { grid-column: span 12; }
        .area-desc { grid-column: span 12; }
        .area-specs { grid-column: span 12; }
        .area-actions { grid-column: span 12; }

        @media (min-width: 1024px) {
          .area-main-img {
            grid-column: 1 / 8;
            grid-row: span 4;
            aspect-ratio: 4/3;
            position: sticky;
            top: 100px;
          }
          .area-header { grid-column: 8 / 13; }
          .area-seller { grid-column: 8 / 10; }
          .area-price { grid-column: 10 / 13; }
          .area-desc { grid-column: 8 / 13; }
          .area-specs { grid-column: 8 / 13; }
          .area-actions { grid-column: 8 / 13; }
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

        .btn-primary {
          background: #fff;
          color: #000;
          border: none;
          border-radius: 16px;
          width: 100%;
          padding: 18px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px rgba(255,255,255,0.5);
        }

        .btn-ai {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          width: 100%;
          padding: 12px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          letter-spacing: -0.5px;
          color: rgba(255,255,255,0.7);
        }

        .btn-ai:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: var(--accent);
        }

        .tag-pill {
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }

        .serif-italic {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 300;
        }

        .thumb-cont {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          padding: 8px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .thumb-btn {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.2s;
        }

        .thumb-btn.active {
          opacity: 1;
          border-color: white;
          transform: scale(1.1);
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(10px);
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          z-index: 50;
        }
      `}</style>

      <div className="noise"></div>
      <div style={bgStyle} className="fixed inset-0 transition-all duration-1000 ease-out z-0"></div>

      <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center pointer-events-none">
        <button onClick={handleBackClick} className="btn-glass pointer-events-auto shadow-lg">
          <ArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex gap-3 pointer-events-auto items-center">
          <button className="btn-glass shadow-lg">
            <ShareIcon />
          </button>
          <button className="btn-glass shadow-lg" onClick={handleSaveToggle} title={saved ? 'Unsave' : 'Save'}>
            <Heart filled={saved} />
            {saveCount > 0 && <span style={{ fontSize: 11, opacity: 0.7 }}>{saveCount}</span>}
          </button>

          {/* USER MENU INTEGRATION */}
          {user ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn-glass shadow-lg pl-2 pr-3"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-[10px] font-bold">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#141414] border border-white/20 shadow-2xl backdrop-blur-xl rounded-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="text-[10px] text-white/40 uppercase mb-1 font-bold">Logged in as</div>
                    <div className="text-sm text-white font-bold truncate">{user.fullName}</div>
                    <div className="text-xs text-white/60 truncate mt-0.5">{user.email}</div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    Dashboard
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
          ) : (
            <Link to="/login" className="btn-glass shadow-lg">
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="wrapper relative z-10">
        <div className="bento-grid">
          {/* 1. Main Image */}
          <div className="card area-main-img fade-in group cursor-zoom-in">
            <img
              ref={mainImgRef}
              src={product.images && product.images.length > 0
                ? product.images[activeImg]
                : (product.image || '/placeholder.jpg')
              }
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />

            <div className="absolute top-6 left-6 flex gap-2 z-10">
              {product.isVerified && (
                <span className="bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1">
                  <Shield /> Verified
                </span>
              )}
              {product.isTrending && (
                <span className="bg-[#FF5733] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  🔥 Trending
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="thumb-cont">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`thumb-btn ${activeImg === i ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg(i);
                    }}
                  >
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Header */}
          <div className="card area-header fade-in delay-1 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="tag-pill">{product.category}</span>
                <span className="tag-pill" style={{ color: product.accent, borderColor: product.accent }}>
                  {product.condition}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">
                {product.title}
              </h1>
            </div>

            <div className="flex gap-6 opacity-60 text-sm mt-6 border-t border-white/10 pt-4">
              <span className="flex items-center gap-2">
                <Clock /> Posted {product.timeAgo}
              </span>
              <span className="flex items-center gap-2">
                <Eye /> {product.views} views
              </span>
            </div>
          </div>

          {/* 3. Seller */}
          <div
            className="card area-seller fade-in delay-2 flex flex-col items-center justify-center text-center cursor-pointer group/sellercard hover:border-white/30 transition-all"
            onClick={() => {
              const sellerId = typeof product.seller === 'object' ? product.seller?._id : null;
              if (sellerId) navigate(`/seller/${sellerId}`);
            }}
            title="View Seller Profile"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#7C3AED] p-[2px] mb-3 group-hover/sellercard:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xl font-serif italic">
                {typeof product.seller === 'object'
                  ? product.seller.fullName?.charAt(0).toUpperCase()
                  : (product.user?.charAt(0) || 'U')
                }
              </div>
            </div>
            <div className="font-bold text-lg group-hover/sellercard:text-[#00D9FF] transition-colors">
              {typeof product.seller === 'object' ? product.seller.fullName : product.user || 'Unknown'}
            </div>
            <div className="text-xs opacity-50 mb-3">
              {product.branch?.toUpperCase()} •  {product.year}th Year
            </div>
            <div className="bg-white/5 rounded-full px-3 py-1 text-xs font-bold border border-white/5">
              {product.sellerRating || '⭐ New'} Rating
            </div>
            <div className="mt-3 text-[10px] text-[#00D9FF]/60 group-hover/sellercard:text-[#00D9FF] transition-colors font-semibold uppercase tracking-widest">
              View Profile →
            </div>
          </div>

          {/* 4. Price & AI */}
          <div className="card area-price fade-in delay-2 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-20"></div>

            <div className="card-title mb-2">
              <Zap /> Asking Price
            </div>

            <div className="text-4xl lg:text-5xl font-black tracking-tighter mb-4">
              {product.type === 'free' ? (
                <span className="text-4xl font-bold text-green-400">FREE</span>
              ) : product.type === 'barter' ? (
                <span className="text-3xl font-bold text-purple-400">BARTER</span>
              ) : (
                <>
                  <span className="text-xl opacity-50 align-top mr-1">₹</span>
                  {product.price}
                </>
              )}
            </div>

            <button className="btn-ai">
              <SparklesIcon />
              CHECK FAIR PRICE WITH AI
            </button>
          </div>

          {/* 5. Description */}
          <div className="card area-desc fade-in delay-3">
            <div className="card-header">
              <div className="card-title">Analysis</div>
            </div>

            <p className="text-lg font-light leading-relaxed opacity-90 mb-8">
              <span className="serif-italic text-2xl opacity-60 mr-1">"</span>
              {product.description}
            </p>

            {product.highlights && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: product.accent }}></div>
                    <span className="text-sm font-medium">{h}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Specs */}
          {product.specs && (
            <div className="card area-specs fade-in delay-3">
              <div className="flex gap-4 mb-6">
                <button className="btn-primary flex-1" onClick={handleContactSeller}>
                  <Message /> Chat with Seller
                </button>
                {user?._id !== (typeof product.seller === 'object' ? product.seller._id : product.seller) && (
                  <button
                    className="btn-glass flex-1 border-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/10"
                    onClick={() => setShowOfferModal(true)}
                  >
                    <SparklesIcon /> Make Offer
                  </button>
                )}
              </div>

              <div className="card-header">
                <div className="card-title">
                  <GridIcon /> Specifications
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex flex-col p-3 border-b border-white/10 last:border-0">
                    <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1">
                      {s.label}
                    </span>
                    <span className="font-semibold text-sm">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Actions */}
          <div className="card area-actions fade-in delay-3 bg-white/5 border-white/10 flex flex-col gap-4 justify-center">
            <button
              className="btn-primary group relative overflow-hidden"
              onClick={handleContactSeller}
            >
              <span className="relative z-10 flex items-center gap-2">
                Contact Seller <Message />
              </span>
              <div className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>

            <div className="text-center text-[10px] uppercase tracking-widest opacity-30">
              Campus Handover • Verified Student • Safe
            </div>
          </div>
        </div>
      </div>

      {/* ── Make Offer Modal ── */}
      {showOfferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !offerSubmitting && setShowOfferModal(false)}></div>
          <div className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-2xl fade-in overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9FF] rounded-full blur-[80px] opacity-10"></div>

            <h2 className="text-2xl font-black mb-1">Make an Offer</h2>
            <p className="text-white/40 text-sm mb-6">Negotiate a fair price for this item.</p>

            {offerSuccess ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <Shield />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Offer Sent Successfully!</h3>
                <p className="text-sm text-white/40">The seller will be notified of your offer.</p>
              </div>
            ) : (
              <form onSubmit={handleMakeOffer} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Proposed Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={product.price}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 text-white font-bold focus:border-[#00D9FF] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Message (Optional)</label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Hi, I'm interested and can meet today..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm focus:border-[#00D9FF] outline-none transition-all min-h-[100px] resize-none"
                  />
                </div>

                {offerError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-medium">
                    {offerError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    disabled={offerSubmitting}
                    onClick={() => setShowOfferModal(false)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={offerSubmitting || !offerAmount}
                    className="flex-[2] btn-primary"
                    style={{ borderRadius: '1rem', padding: '1rem' }}
                  >
                    {offerSubmitting ? 'Sending...' : 'Send Offer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;