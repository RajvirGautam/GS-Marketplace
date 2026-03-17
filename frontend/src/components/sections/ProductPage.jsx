import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, offerAPI, chatAPI } from '../../services/api';
import Avatar from '../ui/Avatar';

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
  const location = useLocation();

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
  const [chatLoading, setChatLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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

  // Handle Contact Seller → create/fetch conversation then navigate to /chat
  const handleContactSeller = async () => {
    if (!user) {
      navigate('/');
      return;
    }
    // Guard: cannot chat with yourself
    if (isOwner) return;
    try {
      setChatLoading(true);
      const res = await chatAPI.startConversation(product._id);
      if (res.success && res.conversation?._id) {
        navigate(`/chat/${res.conversation._id}`);
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
    } finally {
      setChatLoading(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    const productUrl = window.location.href;
    const sellerName = typeof product.seller === 'object' ? product.seller.fullName : (product.user || 'a student');
    const priceText = product.type === 'free' ? 'FREE' : product.type === 'barter' ? 'barter' : `₹${product.price}`;
    const whatsappText = `🛒 *${product.title}* — ${priceText}\n📦 Condition: ${product.condition}\n👤 Seller: ${sellerName} (${product.branch?.toUpperCase() || ''} • ${product.year}th Yr)\n\nCheck it out on GS Marketplace 👇\n${productUrl}`;

    // Try native Web Share API (works great on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: whatsappText,
          url: productUrl,
        });
        return;
      } catch (err) {
        // User cancelled or API failed – fall through to modal
        if (err.name === 'AbortError') return;
      }
    }
    // Fallback: open custom share modal
    setShowShareModal(true);
  };

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    // Guard: cannot offer on your own listing
    if (isOwner) return;

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
    const isMobile = window.innerWidth < 768;

    // Skip animation on mobile to prevent image flash glitch
    if (!isMobile && transitionData && mainImgRef.current && product) {
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
            if (location.state?.fromChat) {
              navigate(`/chat/${location.state.conversationId}`);
            } else {
              navigate('/marketplace', {
                state: { scrollY: scrollY },
                replace: false
              });
            }
          }, 600);
        });
      } catch (error) {
        console.error('Back transition error:', error);
        sessionStorage.removeItem('productTransition');
        if (location.state?.fromChat) {
          navigate(`/chat/${location.state.conversationId}`);
        } else {
          navigate('/marketplace');
        }
      }
    } else {
      // Mobile: skip animation, navigate directly with scroll restore
      const scrollY = transitionData ? (() => { try { return JSON.parse(transitionData).scrollY; } catch { return 0; } })() : 0;
      sessionStorage.removeItem('productTransition');
      if (location.state?.fromChat) {
        navigate(`/chat/${location.state.conversationId}`);
      } else {
        navigate('/marketplace', {
          state: { scrollY: scrollY },
          replace: false
        });
      }
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
        const data = await productAPI.getById(id);

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
        Loading product details...
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

  // Robust owner check — coerce both sides to string to handle ObjectId vs string mismatch
  const sellerId = typeof product.seller === 'object' ? product.seller?._id : product.seller;
  const currentUserId = user?._id || user?.id;
  const isOwner = !!currentUserId && !!sellerId && String(currentUserId) === String(sellerId);

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
        
        @keyframes heartPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .animate-heart-pop {
          animation: heartPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          z-index: 50;
        }

        .share-option-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-family: var(--font-main);
        }
        .share-option-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .share-option-btn .share-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 20px;
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
          <button className="btn-glass shadow-lg" onClick={handleShare} title="Share this listing">
            <ShareIcon />
          </button>
          <button className="btn-glass shadow-lg group hidden md:flex items-center" onClick={(e) => {
            const el = e.currentTarget.querySelector('svg');
            el.classList.remove('animate-heart-pop');
            void el.offsetWidth; // trigger reflow
            el.classList.add('animate-heart-pop');
            handleSaveToggle();
          }} title={saved ? 'Unsave' : 'Save'}>
            <Heart filled={saved} className="transition-colors duration-200" style={{ color: saved ? '#EF4444' : 'currentColor' }} />
            {saveCount > 0 && <span style={{ fontSize: 11, opacity: 0.7 }}>{saveCount}</span>}
          </button>

          {/* USER MENU INTEGRATION */}
          {user ? (
            <div className="relative user-menu-container hidden md:block">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn-glass shadow-lg pl-2 pr-3"
              >
                <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                  <Avatar
                    src={user?.profilePicture}
                    name={user?.fullName || user?.name || user?.email}
                    size={24}
                    style={{ fontSize: '10px', fontWeight: '800' }}
                  />
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
            <Link to="/login" className="btn-glass shadow-lg hidden md:flex items-center">
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="wrapper hidden md:block relative z-10">
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
              <div className="text-sm font-bold opacity-60 uppercase tracking-widest mb-3 flex items-center gap-2">
                Marketplace <span className="opacity-40">/</span> <span className="text-white">{product.category}</span>
              </div>
              <div className="flex gap-2 mb-4">
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
            <div className="w-16 h-16 rounded-full p-[2px] mb-3 group-hover/sellercard:scale-105 transition-transform" style={{ background: 'linear-gradient(to top right, #00D9FF, #7C3AED)' }}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-serif italic" style={{ overflow: 'hidden' }}>
                <Avatar
                  src={typeof product.seller === 'object' ? product.seller.profilePicture : undefined}
                  name={typeof product.seller === 'object' ? product.seller.fullName : product.user}
                  size={64}
                  style={{ fontSize: '24px', fontWeight: '800' }}
                />
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
            <div className="card area-specs fade-in delay-3 mb-6">
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

          {/* Actions - moved below specs */}
          <div className="card area-actions fade-in delay-3">
            <div className="flex gap-4 mb-4">
              {!isOwner ? (
                <>
                  <button className="btn-primary flex-1" onClick={handleContactSeller} disabled={chatLoading}>
                    <Message /> {chatLoading ? 'Opening Chat…' : 'Chat with Seller'}
                  </button>
                  <button
                    className="btn-glass flex-1 border-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/10 py-4"
                    onClick={() => setShowOfferModal(true)}
                  >
                    <SparklesIcon /> Make Offer
                  </button>
                </>
              ) : (
                <div className="w-full text-center p-3 bg-white/5 rounded-xl border border-white/10 text-white/50 text-sm font-medium flex items-center justify-center gap-2">
                  <Shield size={16} /> You own this listing
                </div>
              )}
            </div>
            {!isOwner && (
              <div className="text-center text-[10px] uppercase tracking-widest opacity-30 mt-2">
                Campus Handover • Verified Student • Safe
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ======================= MOBILE VIEW ======================= */}
      {/* ========================================================= */}

      <div className="block md:hidden relative z-10 w-full">
        {/* Mobile Main Image with overlaid topnav */}
        <div className="relative w-full aspect-[4/5] bg-zinc-900 rounded-b-3xl overflow-hidden shadow-2xl shadow-black">
          <img
            src={product.images && product.images.length > 0 ? product.images[activeImg] : (product.image || '/placeholder.jpg')}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-24 left-4 flex gap-2 z-10">
            {product.isVerified && (
              <span className="bg-black/80 backdrop-blur text-white px-2 py-1 rounded-md text-[10px] font-bold border border-white/10 flex items-center gap-1">
                <Shield /> Verified
              </span>
            )}
            {product.isTrending && (
              <span className="bg-[#FF5733] text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-lg">
                🔥 Trending
              </span>
            )}
          </div>

          {/* Mobile Breadcrumb overlaying bottom of image */}
          <div className="absolute bottom-4 left-4 text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-2 z-10">
            Marketplace <span className="opacity-40">/</span> <span className="text-[#00D9FF] drop-shadow-md">{product.category}</span>
          </div>
        </div>

        {/* Mobile Content Wrapper */}
        <div className="px-5 pt-6 pb-8 space-y-6">

          {/* Title & Price Row */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight mb-2">
                {product.title}
              </h1>
              <span className="inline-block px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border border-white/20" style={{ color: product.accent || '#00D9FF', borderColor: `${product.accent || '#00D9FF'}40` }}>
                {product.condition}
              </span>
            </div>
            <div className="text-right flex-shrink-0 bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Asking</div>
              <div className="text-3xl font-black">
                {product.type === 'free' ? (
                  <span className="text-green-400">FREE</span>
                ) : product.type === 'barter' ? (
                  <span className="text-purple-400 text-xl">BARTER</span>
                ) : (
                  <>
                    <span className="text-sm opacity-50 align-top mr-0.5">₹</span>
                    {product.price}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Time / Views Row */}
          <div className="flex gap-4 opacity-70 text-[11px] font-mono border-b border-white/10 pb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Posted {product.timeAgo}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3 h-3" /> {product.views} views
            </span>
          </div>

          {/* Seller Info Row (Compact Mobile) */}
          <div
            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 active:scale-[0.98] transition-all"
            onClick={() => {
              const sellerId = typeof product.seller === 'object' ? product.seller?._id : null;
              if (sellerId) navigate(`/seller/${sellerId}`);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                <Avatar
                  src={typeof product.seller === 'object' ? product.seller.profilePicture : undefined}
                  name={typeof product.seller === 'object' ? product.seller.fullName : product.user}
                  size={48}
                  style={{ fontSize: '18px', fontWeight: '800' }}
                />
              </div>
              <div>
                <div className="font-bold text-sm text-[#00D9FF]">{typeof product.seller === 'object' ? product.seller.fullName : product.user || 'Unknown'}</div>
                <div className="text-[10px] opacity-50 mt-0.5 uppercase tracking-wide">
                  {product.branch?.toUpperCase()} • {product.year}th Year
                </div>
              </div>
            </div>
            <div className="text-xs font-bold px-2 py-1 bg-white/10 rounded-lg">
              {product.sellerRating || '⭐ New'}
            </div>
          </div>

          {/* Analysis / Description */}
          <div className="mt-8">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></span> Analysis
            </h3>
            <p className="text-[15px] font-light leading-relaxed opacity-90 text-white/90 px-1">
              {product.description}
            </p>
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <GridIcon /> Specs
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-[#00D9FF] mb-1">
                      {s.label}
                    </span>
                    <span className="font-bold text-sm text-white/90">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Mobile Actions Overlay (Sticky Bottom) */}
        <div className="sticky bottom-0 w-full bg-[#0A0A0A] border-t border-white/10 p-4 z-50">
          {!isOwner ? (
            <div className="flex gap-2 max-w-lg mx-auto">
              <button
                className="w-14 h-14 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center active:scale-95 transition-all flex-shrink-0"
                onClick={(e) => {
                  const el = e.currentTarget.querySelector('svg');
                  el.classList.remove('animate-heart-pop');
                  void el.offsetWidth;
                  el.classList.add('animate-heart-pop');
                  handleSaveToggle();
                }}
              >
                <Heart filled={saved} style={{ color: saved ? '#EF4444' : 'white' }} />
              </button>

              <button className="h-14 flex-1 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-sm" onClick={handleContactSeller} disabled={chatLoading}>
                <Message /> {chatLoading ? 'Loading…' : 'Chat'}
              </button>

              <button className="h-14 flex-1 bg-gradient-to-r from-[#00D9FF] to-[#7C3AED] text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-sm shadow-lg shadow-[#00D9FF]/20" onClick={() => setShowOfferModal(true)}>
                <SparklesIcon /> Offer
              </button>
            </div>
          ) : (
            <div className="w-full max-w-lg mx-auto text-center p-4 bg-white/5 rounded-2xl border border-white/10 text-white/50 text-sm font-bold flex items-center justify-center gap-2">
              <Shield size={18} /> You own this listing
            </div>
          )}
        </div>

      </div>

      {/* ── Make Offer Modal ── */}
      {
        showOfferModal && (
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
        )
      }
      {/* ── Share Modal ── */}
      {showShareModal && (() => {
        const productUrl = window.location.href;
        const sellerName = typeof product.seller === 'object' ? product.seller.fullName : (product.user || 'a student');
        const priceText = product.type === 'free' ? 'FREE' : product.type === 'barter' ? 'barter' : `₹${product.price}`;
        const waText = encodeURIComponent(`🛒 *${product.title}* — ${priceText}\n📦 Condition: ${product.condition}\n👤 Seller: ${sellerName}${product.branch ? ` (${product.branch.toUpperCase()}` : ''}${product.year ? ` • ${product.year}th Yr)` : ')'}\n\nCheck it out on GS Marketplace 👇\n${productUrl}`);

        const handleCopyLink = async () => {
          try {
            await navigator.clipboard.writeText(productUrl);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2500);
          } catch { }
        };

        return (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
            <div className="relative w-full max-w-sm bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-2xl fade-in overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-[80px] opacity-20" style={{ background: product.accent || '#00D9FF' }} />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black">Share Listing</h2>
                  <p className="text-white/40 text-xs mt-0.5 font-mono">Send this to a friend</p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all text-lg font-bold"
                >×</button>
              </div>

              {/* Product preview strip */}
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 mb-5">
                <img
                  src={product.images?.[0] || product.image || '/placeholder.jpg'}
                  alt={product.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white/10"
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{product.title}</div>
                  <div className="text-white/50 text-xs mt-0.5">{priceText} · {product.condition}</div>
                </div>
              </div>

              {/* Share options */}
              <div className="space-y-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-option-btn"
                  onClick={() => setShowShareModal(false)}
                >
                  <span className="share-icon-wrap" style={{ background: '#25D36620' }}>
                    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
                      <path d="M16 3C8.82 3 3 8.82 3 16c0 2.36.63 4.6 1.72 6.55L3 29l6.67-1.7A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Z" fill="#25D366" />
                      <path d="M22.3 19.1c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51H11.8c-.2 0-.5.07-.77.37-.27.3-1.02 1-1.02 2.44 0 1.44 1.05 2.84 1.19 3.03.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.66.61.7.22 1.33.19 1.83.11.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" fill="#fff" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-sm">Share on WhatsApp</div>
                    <div className="text-white/40 text-xs">Send product details + link</div>
                  </div>
                </a>

                {/* Copy Link */}
                <button className="share-option-btn" onClick={handleCopyLink}>
                  <span className="share-icon-wrap" style={{ background: shareCopied ? '#22c55e20' : '#ffffff10' }}>
                    {shareCopied ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <div className="text-sm" style={{ color: shareCopied ? '#22c55e' : '#fff' }}>{shareCopied ? 'Link Copied!' : 'Copy Link'}</div>
                    <div className="text-white/40 text-xs">Copy product URL to clipboard</div>
                  </div>
                </button>
              </div>

              <div className="mt-5 text-center text-[10px] uppercase tracking-widest text-white/20">
                GS Marketplace · Campus Deals
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default ProductPage;