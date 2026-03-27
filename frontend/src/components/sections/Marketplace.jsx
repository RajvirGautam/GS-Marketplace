// src/pages/Marketplace.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { productAPI } from '../../services/api';
import ProductCard from '../ui/ProductCard';
import AddProductModal from './AddProductModal';
import NotificationBell from '../ui/NotificationBell';
import ConnectIdModal from '../auth/ConnectIdModal';
import Avatar from '../ui/Avatar';
import { useOnboarding } from '../../context/OnboardingContext';


// --- Internal Icons ---
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);


const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);


// ─── Price Distribution Histogram ───────────────────────────────────────────
// Renders a smooth bezier area curve above the dual-handle range slider.
// histogram: number[] — count per price bucket
// maxPrice, minSelected, maxSelected: for shading the selected region
const PriceHistogram = ({ histogram, maxPrice, minSelected, maxSelected }) => {
  if (!histogram || histogram.length === 0) return null;

  const W = 200; // SVG viewBox width
  const H = 52;  // SVG viewBox height
  const n = histogram.length;
  const peak = Math.max(...histogram, 1);
  const pad = 2; // small side padding so the curve doesn't clip

  // Build evenly-spaced x,y points for each bucket midpoint
  const pts = histogram.map((v, i) => ({
    x: pad + ((i + 0.5) / n) * (W - pad * 2),
    y: H - 4 - ((v / peak) * (H - 8)),
  }));

  // Add anchor points at both edges so the area closes nicely at baseline
  const allPts = [
    { x: pad, y: H - 4 },
    ...pts,
    { x: W - pad, y: H - 4 },
  ];

  // Catmull-Rom → cubic bezier conversion for smooth curves
  const toCubicBezier = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[Math.max(i - 2, 0)];
      const p1 = points[i - 1];
      const p2 = points[i];
      const p3 = points[Math.min(i + 1, points.length - 1)];
      const alpha = 0.5;
      const cp1x = p1.x + (p2.x - p0.x) * alpha / 3;
      const cp1y = p1.y + (p2.y - p0.y) * alpha / 3;
      const cp2x = p2.x - (p3.x - p1.x) * alpha / 3;
      const cp2y = p2.y - (p3.y - p1.y) * alpha / 3;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const linePath = toCubicBezier(allPts);
  // Close the area back to baseline
  const areaPath = linePath + ` L ${W - pad},${H - 4} L ${pad},${H - 4} Z`;

  // Map selected range to SVG x coords for clip rect
  const clipX = pad + (minSelected / maxPrice) * (W - pad * 2);
  const clipW = ((maxSelected - minSelected) / maxPrice) * (W - pad * 2);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: H, display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* gradient for selected (lit) region */}
        <linearGradient id="histGradSel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0.85" />
        </linearGradient>

        {/* clip path for the selected range */}
        <clipPath id="selClip">
          <rect x={clipX} y={0} width={clipW} height={H} />
        </clipPath>
        {/* clip path for everything outside selected range */}
        <clipPath id="unselClip">
          <rect x={pad} y={0} width={clipX - pad} height={H} />
          <rect x={clipX + clipW} y={0} width={(W - pad) - (clipX + clipW)} height={H} />
        </clipPath>
      </defs>

      {/* Unselected region — dimmed */}
      <path d={areaPath} fill="rgba(255,255,255,0.08)" clipPath="url(#unselClip)" />

      {/* Selected region — lit with gradient */}
      <path d={areaPath} fill="url(#histGradSel)" clipPath="url(#selClip)" />

      {/* Thin baseline */}
      <line x1={pad} y1={H - 4} x2={W - pad} y2={H - 4} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
};
// ────────────────────────────────────────────────────────────────────────────

// Module-level cache — survives component re-mounts (e.g. back nav) but clears on full page refresh
let _marketplaceCache = null;

const Marketplace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const { startOnboarding } = useOnboarding();

  // Skip the initial fetch/reset effects when restoring from cache
  const skipInitialFetch = useRef(false);
  // Prevent filter-reset + re-fetch when priceRange is updated by server (not user)
  const skipPriceRangeReset = useRef(false);

  // Refs to track latest values for cache-on-unmount (avoids stale closure)
  const productsRef = useRef([]);
  const hasMoreRef = useRef(false);

  // State Management
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(10000);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [draftPriceRange, setDraftPriceRange] = useState([0, 10000]);
  const [priceHistogram, setPriceHistogram] = useState([]);

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const productsPerPage = 24;
  const glowRef = useRef(null);
  const sentinelRef = useRef(null);
  const mobileSentinelRef = useRef(null);

  // Trigger onboarding on mount if flagged
  useEffect(() => {
    if (sessionStorage.getItem('triggerOnboarding') === 'true') {
      sessionStorage.removeItem('triggerOnboarding');
      // Slight delay to ensure elements are rendered
      setTimeout(() => {
        startOnboarding();
      }, 500);
    }
  }, [startOnboarding]);

  useEffect(() => {
    let animationFrameId;
    const handler = (e) => {
      if (glowRef.current) {
        // Use animation frame to throttle style updates for maximum smoothness
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.background = `radial-gradient(900px circle at ${e.clientX}px ${e.clientY}px, rgba(0,217,255,0.07) 0%, transparent 50%)`;
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

  // Category data with counts (now dynamic)
  const [categories, setCategories] = useState([
    { name: 'Books & Notes', count: 0, slug: 'books', emoji: '📚' },
    { name: 'Lab Equipment', count: 0, slug: 'lab', emoji: '🔬' },
    { name: 'Stationery', count: 0, slug: 'stationery', emoji: '✏️' },
    { name: 'Electronics', count: 0, slug: 'electronics', emoji: '⚡' },
    { name: 'Hostel Items', count: 0, slug: 'hostel', emoji: '🏠' },
    { name: 'Tools', count: 0, slug: 'tools', emoji: '🔧' },
    { name: 'Sports & Fitness', count: 0, slug: 'sports', emoji: '⚽' },
    { name: 'Musical Instruments', count: 0, slug: 'music', emoji: '🎸' },
    { name: 'Clothing & Uniforms', count: 0, slug: 'clothing', emoji: '👕' },
    { name: 'Miscellaneous', count: 0, slug: 'misc', emoji: '📦' },
  ]);

  // Fetch dynamic categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productAPI.getCategories();
        if (res.success) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const branches = [
    { name: 'Computer Science', count: 142, slug: 'cs' },
    { name: 'Information Technology', count: 98, slug: 'it' },
    { name: 'Electronics & Comm.', count: 87, slug: 'ece' },
    { name: 'Electrical', count: 54, slug: 'ee' },
    { name: 'Mechanical', count: 67, slug: 'mech' },
    { name: 'Civil', count: 39, slug: 'civil' },
  ];

  const years = [
    { label: '1st Year', count: 89, value: 1 },
    { label: '2nd Year', count: 156, value: 2 },
    { label: '3rd Year', count: 178, value: 3 },
    { label: '4th Year', count: 269, value: 4 },
  ];

  const conditions = ['New', 'Like New', 'Good', 'Acceptable'];

  const itemTypes = [
    { label: 'For Sale (Cash)', count: 512, value: 'sale' },
    { label: 'For Barter (Exchange)', count: 78, value: 'barter' },
    { label: 'For Rent', count: 12, value: 'rent' },
    { label: 'Free (Giveaway)', count: 6, value: 'free' },
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-open AddProductModal when navigating from CTA "List a product"
  useEffect(() => {
    const fromState = location.state?.openList;
    const fromStorage = sessionStorage.getItem('marketplace_openList');
    if (fromState || fromStorage) {
      sessionStorage.removeItem('marketplace_openList');
      if (user) {
        setIsAddProductOpen(true);
      } else {
        setIsLoginOpen(true);
      }
      // Clear the location state flag
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Restore from cache when navigating back from a product page
  useEffect(() => {
    const scrollY = sessionStorage.getItem('marketplaceScrollY');
    if (scrollY && _marketplaceCache) {
      skipInitialFetch.current = true;
      setProducts(_marketplaceCache.products);
      setHasMore(_marketplaceCache.hasMore);
      setLoading(false);
      setTimeout(() => window.scrollTo(0, Number(scrollY)), 80);
      sessionStorage.removeItem('marketplaceScrollY');
    }
  }, []);

  // Keep refs in sync so unmount can safely read latest values
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  // Save to cache on unmount
  useEffect(() => {
    return () => {
      _marketplaceCache = {
        products: productsRef.current,
        hasMore: hasMoreRef.current,
      };
    };
  }, []);

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    if (skipInitialFetch.current) return; // skip on cache restore
    if (skipPriceRangeReset.current) { skipPriceRangeReset.current = false; return; }
    setCurrentPage(1);
    setProducts([]);
  }, [
    debouncedSearch,
    selectedCategories,
    selectedBranches,
    selectedYears,
    selectedConditions,
    selectedTypes,
    priceRange,
    sortBy
  ]);

  // Fetch products from backend
  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return; // skip on cache restore
    }
    if (skipPriceRangeReset.current) return; // filter-reset effect will clear this flag
    fetchProducts(currentPage);
  }, [
    currentPage,
    debouncedSearch,
    selectedCategories,
    selectedBranches,
    selectedYears,
    selectedConditions,
    selectedTypes,
    priceRange,
    sortBy
  ]);

  // IntersectionObserver — fetch next page when sentinel is near viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(e => e.isIntersecting) && hasMore && !loadingMore && !loading) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { rootMargin: '0px 0px 50px 0px', threshold: 0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    if (mobileSentinelRef.current) observer.observe(mobileSentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading]);

  // Prevent scrolling past the loaded products when fetching more
  useEffect(() => {
    if (loadingMore) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [loadingMore]);

  const fetchProducts = async (page) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const filters = {
        search: debouncedSearch,
        categories: selectedCategories,
        branches: selectedBranches,
        years: selectedYears,
        conditions: selectedConditions,
        types: selectedTypes,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        page,
        limit: productsPerPage
      };

      const response = await productAPI.getAll(filters);

      if (response.success) {
        if (page === 1) {
          setProducts(response.products);
          setLoading(false);
        } else {
          setProducts(prev => [...prev, ...response.products]);
          setLoadingMore(false);
        }
        setHasMore(response.pagination.page < response.pagination.pages);
        if (response.globalMaxPrice && response.globalMaxPrice !== maxPriceLimit) {
          setMaxPriceLimit(response.globalMaxPrice);
          if (priceRange[1] === maxPriceLimit) {
            skipPriceRangeReset.current = true; // don't re-fetch; this is a server-side discovery
            setPriceRange([priceRange[0], response.globalMaxPrice]);
            setDraftPriceRange([draftPriceRange[0], response.globalMaxPrice]);
          }
        }
        if (response.priceHistogram) setPriceHistogram(response.priceHistogram);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Toggle functions
  const toggleCategory = (slug) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const toggleBranch = (slug) => {
    setSelectedBranches(prev =>
      prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const toggleYear = (value) => {
    setSelectedYears(prev =>
      prev.includes(value) ? prev.filter(y => y !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const toggleCondition = (cond) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
    setCurrentPage(1);
  };

  const toggleType = (value) => {
    setSelectedTypes(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBranches([]);
    setSelectedYears([]);
    setSelectedConditions([]);
    setSelectedTypes([]);
    setPriceRange([0, maxPriceLimit]);
    setDraftPriceRange([0, maxPriceLimit]);
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
    setActiveQuickFilter(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBranches.length > 0) count += selectedBranches.length;
    if (selectedYears.length > 0) count += selectedYears.length;
    if (selectedConditions.length > 0) count += selectedConditions.length;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (priceRange[0] !== 0 || priceRange[1] !== maxPriceLimit) count++;
    return count;
  };

  // Quick filter presets — mono-select (one at a time)
  const applyQuickFilter = (key, apply, clear) => {
    if (activeQuickFilter === key) {
      // toggle off
      clear();
      setActiveQuickFilter(null);
    } else {
      // switch to this one: first clear all filter state
      setSelectedCategories([]);
      setSelectedBranches([]);
      setSelectedYears([]);
      setSelectedConditions([]);
      setSelectedTypes([]);
      setPriceRange([0, maxPriceLimit]);
      setDraftPriceRange([0, maxPriceLimit]);
      // then apply the specific filter
      apply();
      setActiveQuickFilter(key);
    }
    setCurrentPage(1);
  };

  const quickFilters = [
    {
      key: 'free',
      label: 'Free Items',
      apply: () => setSelectedTypes(['free']),
      clear: () => setSelectedTypes([]),
    },
    {
      key: 'under500',
      label: 'Under ₹500',
      apply: () => { setPriceRange([0, 500]); setDraftPriceRange([0, 500]); },
      clear: () => { setPriceRange([0, maxPriceLimit]); setDraftPriceRange([0, maxPriceLimit]); },
    },
    {
      key: 'barter',
      label: 'Barter Only',
      apply: () => setSelectedTypes(['barter']),
      clear: () => setSelectedTypes([]),
    },
    {
      key: 'new',
      label: 'New Condition',
      apply: () => setSelectedConditions(['New', 'Like New']),
      clear: () => setSelectedConditions([]),
    },
  ];

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

  // Restore scroll position
  useEffect(() => {
    const savedScrollY = location.state?.scrollY || sessionStorage.getItem('marketplaceScrollY');
    if (savedScrollY) {
      setTimeout(() => {
        window.scrollTo(0, Number(savedScrollY));
        sessionStorage.removeItem('marketplaceScrollY');
        if (location.state?.scrollY) window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        /* Skeleton Shimmer */
        @keyframes shimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.10) 40%,
            rgba(255,255,255,0.04) 80%
          );
          background-size: 800px 100%;
          animation: shimmer 1.6s infinite linear;
          border-radius: 8px;
        }

        .theme-root {
          font-family: 'Manrope', sans-serif;
          background: #0A0A0A;
          color: #fff;
          min-height: 100vh;
        }

        .mono {
          font-family: 'JetBrains Mono', monospace;
        }

        /* Noise & Grid Overlays */
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

        /* Buttons */
        .btn-primary {
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          color: #fff;
          border-radius: 50px;
          padding: 10px 24px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-ghost:hover {
          border-color: #fff;
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .btn-glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 50px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          backdrop-filter: blur(10px);
        }

        .btn-glass:hover {
          background: rgba(255,255,255,0.15);
          border-color: white;
        }

        /* Input Fields */
        .input-modern {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 50px;
          transition: all 0.2s;
        }

        .input-modern:focus {
          background: rgba(255,255,255,0.05);
          border-color: #00D9FF;
          outline: none;
        }

        /* Checkboxes */
        .modern-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .modern-checkbox:checked {
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          border-color: #00D9FF;
        }

        .modern-checkbox:checked::after {
          content: '✓';
          position: absolute;
          font-size: 12px;
          color: #fff;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
        }

        /* Slider */
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.1);
          outline: none;
          border-radius: 10px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10B981, #34D399);
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        /* Tags */
        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 217, 255, 0.1);
          color: #00D9FF;
          border: 1px solid rgba(0, 217, 255, 0.2);
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 8px;
        }

        .quick-filter-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .quick-filter-btn:hover {
          background: rgba(255,255,255,0.05);
          color: white;
          border-color: rgba(255,255,255,0.3);
        }

        /* Dual range slider */
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: transparent;
          outline: none;
          border-radius: 10px;
          position: relative;
          pointer-events: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #10B981, #34D399);
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          border: 2.5px solid #0A0A0A;
          pointer-events: auto;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #10B981, #34D399);
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          border: 2.5px solid #0A0A0A;
          pointer-events: auto;
        }

        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }

        /* Drawer */
        .filter-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #0F0F0F;
          border-top: 1px solid rgba(255,255,255,0.1);
          max-height: 70vh;
          overflow-y: auto;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 1000;
        }
        .filter-drawer.open { transform: translateY(0); }
        .filter-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          opacity: 0; pointer-events: none; transition: opacity 0.3s; z-index: 999;
          backdrop-filter: blur(8px);
        }
        .filter-backdrop.open { opacity: 1; pointer-events: all; }

        /* Liquid Button (Desktop & Mobile) */
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
      `}</style>

      <div className="theme-root relative">
        {/* Mouse-tracking glow overlay (Desktop Only) */}
        <div className="hidden md:block">
          <div
            ref={glowRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'radial-gradient(900px circle at 50% 50%, rgba(0,217,255,0.07) 0%, transparent 50%)' }}
          />
        </div>
        {/* Noise & Grid */}
        <div className="noise-overlay"></div>
        <div className="grid-lines"></div>

        {/* ====== DESKTOP VIEW ====== */}
        <div className="hidden md:block">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 relative">
            {/* Background gradient for the logo */}
            <div className="absolute inset-y-0 left-0 pointer-events-none bg-[linear-gradient(to_right,rgba(59,130,246,1)_0%,rgba(59,130,246,0)_100%)] w-[14%] z-0" style={{ opacity: 0.8 }}></div>

            <div className="max-w-[1800px] mx-auto px-6 py-4 relative z-10">
              <div className="flex items-center gap-6">
                <Link to="/">
                  <div className="hidden md:flex items-center gap-2 cursor-pointer">
                    <img src="https://res.cloudinary.com/rajvirgautam/image/upload/v1773618022/CampusMarketplace-removebg-preview_kutxp3.png" alt="Campus Marketplace" className="h-8 w-auto" />
                    <span className="font-['Montserrat'] font-black text-white uppercase tracking-tighter leading-none mt-1" style={{ fontSize: '0.9rem' }}>
                      Campus<br />Marketplace
                    </span>
                  </div>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-2xl relative">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, tags, description, specs..."
                      className="w-full h-12 pl-12 pr-10 bg-white/5 border border-white/10 text-white text-sm rounded-full focus:outline-none focus:border-[#00D9FF] transition-colors placeholder-white/40 input-modern"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setDebouncedSearch('');
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        <XIcon />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="btn-mesh-desktop hidden md:flex"
                  data-onboarding="list-item"
                >
                  <span className="relative z-10">+ List Item</span>
                </button>

                {user && (
                  <Link
                    to="/chat"
                    className="btn-glass hidden md:flex relative"
                    style={{ padding: '9px 16px' }}
                    title="Messages"
                    data-onboarding="chat-icon"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-[3px] rounded-full flex items-center justify-center text-[9px] font-black text-white"
                        style={{ background: 'linear-gradient(135deg, #c026d3, #ef4444)', boxShadow: '0 0 8px rgba(192,38,211,0.5)' }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Notification Bell */}
                {user && <span data-onboarding="notification-bell"><NotificationBell dark={true} /></span>}

                {user && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-glass hidden md:flex"
                    style={{ fontSize: 13, padding: '9px 18px' }}
                  >
                    Dashboard
                  </button>
                )}

                {user ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="btn-glass"
                    >
                      <Avatar
                        src={user?.profilePicture}
                        name={user?.fullName || user?.name || user?.email}
                        size={32}
                        style={{ fontSize: '12px', fontWeight: '800' }}
                      />
                      <span className="hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
                      <ChevronDown />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-[#0F0F0F] border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden z-50">
                        <div className="p-4 border-b border-white/10">
                          <div className="text-[10px] text-white/40 mono uppercase mb-1 font-bold">Logged in as</div>
                          <div className="text-sm text-white font-bold truncate">{user.fullName}</div>
                          <div className="text-xs text-white/60 truncate mt-0.5">{user.email}</div>
                          {user.enrollmentNumber && (
                            <div className="text-[10px] text-cyan-400 mono mt-2">{user.enrollmentNumber}</div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            navigate('/dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                        >
                          Dashboard
                        </button>
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
                  <button onClick={() => setIsLoginOpen(true)} className="btn-glass hover:bg-white/10">
                    Login
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-[1800px] mx-auto relative z-10">
            <div className="grid grid-cols-12">

              {/* Sidebar Filters */}
              <aside className="col-span-12 lg:col-span-3 xl:col-span-2 border-r border-white/10 bg-black/30 backdrop-blur-xl p-6 hidden lg:block overflow-y-auto custom-scrollbar sticky top-[81px] h-[calc(100vh-81px)]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mono">Filters</h3>
                  {getActiveFilterCount() > 0 && (
                    <button onClick={clearAllFilters} className="text-[10px] font-bold text-[#00D9FF] hover:underline mono">
                      RESET
                    </button>
                  )}
                </div>

                {/* Active Filters */}
                {getActiveFilterCount() > 0 && (
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="text-[10px] text-white/40 mb-3 uppercase font-bold mono">
                      Active
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map(cat => (
                        <span key={cat} className="filter-tag">
                          {categories.find(c => c.slug === cat)?.name}
                          <button onClick={() => toggleCategory(cat)} className="hover:text-white">
                            <XIcon />
                          </button>
                        </span>
                      ))}
                      {selectedBranches.map(branch => (
                        <span key={branch} className="filter-tag">
                          {branches.find(b => b.slug === branch)?.name}
                          <button onClick={() => toggleBranch(branch)} className="hover:text-white">
                            <XIcon />
                          </button>
                        </span>
                      ))}
                      {selectedYears.map(year => (
                        <span key={year} className="filter-tag">
                          {years.find(y => y.value === year)?.label}
                          <button onClick={() => toggleYear(year)} className="hover:text-white">
                            <XIcon />
                          </button>
                        </span>
                      ))}
                      {selectedConditions.map(cond => (
                        <span key={cond} className="filter-tag">
                          {cond}
                          <button onClick={() => toggleCondition(cond)} className="hover:text-white">
                            <XIcon />
                          </button>
                        </span>
                      ))}
                      {selectedTypes.map(type => (
                        <span key={type} className="filter-tag">
                          {itemTypes.find(t => t.value === type)?.label}
                          <button onClick={() => toggleType(type)} className="hover:text-white">
                            <XIcon />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Categories</h4>
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="modern-checkbox"
                          checked={selectedCategories.includes(cat.slug)}
                          onChange={() => toggleCategory(cat.slug)}
                        />
                        <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                          {cat.name}
                        </span>
                        <span className="text-xs text-white/20 font-mono">{cat.count}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range - Histogram + Dual Handle */}
                <div className="mb-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col items-start gap-1">
                      <h4 className="text-[11px] text-white/40 uppercase font-bold mono">Price Range</h4>
                      {(draftPriceRange[0] !== 0 || draftPriceRange[1] !== maxPriceLimit) && (
                        <button
                          onClick={() => {
                            setPriceRange([0, maxPriceLimit]);
                            setDraftPriceRange([0, maxPriceLimit]);
                            setCurrentPage(1);
                          }}
                          className="text-[9px] font-bold text-[#10B981] hover:underline mono bg-[#10B981]/10 px-2 py-0.5 rounded-sm"
                        >
                          RESET
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-[#10B981] font-mono mt-0.5">
                      ₹{draftPriceRange[0].toLocaleString()} – ₹{draftPriceRange[1].toLocaleString()}
                    </span>
                  </div>

                  {/* Histogram area curve */}
                  <PriceHistogram
                    histogram={priceHistogram}
                    maxPrice={maxPriceLimit}
                    minSelected={draftPriceRange[0]}
                    maxSelected={draftPriceRange[1]}
                  />

                  <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    {/* Track background */}
                    <div style={{
                      position: 'absolute', width: '100%', height: 4,
                      background: 'rgba(255,255,255,0.1)', borderRadius: 10,
                    }} />
                    {/* Filled range between handles */}
                    <div style={{
                      position: 'absolute',
                      left: `${(draftPriceRange[0] / maxPriceLimit) * 100}%`,
                      right: `${100 - (draftPriceRange[1] / maxPriceLimit) * 100}%`,
                      height: 4,
                      background: 'linear-gradient(90deg, #10B981, #34D399)',
                      borderRadius: 10,
                    }} />
                    {/* Min handle */}
                    <input
                      type="range" min="0" max={maxPriceLimit} step="100"
                      value={draftPriceRange[0]}
                      onChange={(e) => {
                        const val = Math.min(parseInt(e.target.value), draftPriceRange[1] - 100);
                        setDraftPriceRange([val, draftPriceRange[1]]);
                      }}
                      onMouseUp={(e) => {
                        const val = Math.min(parseInt(e.target.value), draftPriceRange[1] - 100);
                        setPriceRange([val, draftPriceRange[1]]);
                        setCurrentPage(1);
                      }}
                      onTouchEnd={(e) => {
                        const val = Math.min(parseInt(e.target.value), draftPriceRange[1] - 100);
                        setPriceRange([val, draftPriceRange[1]]);
                        setCurrentPage(1);
                      }}
                      style={{ position: 'absolute', width: '100%', zIndex: 4 }}
                    />
                    {/* Max handle */}
                    <input
                      type="range" min="0" max={maxPriceLimit} step="100"
                      value={draftPriceRange[1]}
                      onChange={(e) => {
                        const val = Math.max(parseInt(e.target.value), draftPriceRange[0] + 100);
                        setDraftPriceRange([draftPriceRange[0], val]);
                      }}
                      onMouseUp={(e) => {
                        const val = Math.max(parseInt(e.target.value), draftPriceRange[0] + 100);
                        setPriceRange([draftPriceRange[0], val]);
                        setCurrentPage(1);
                      }}
                      onTouchEnd={(e) => {
                        const val = Math.max(parseInt(e.target.value), draftPriceRange[0] + 100);
                        setPriceRange([draftPriceRange[0], val]);
                        setCurrentPage(1);
                      }}
                      style={{ position: 'absolute', width: '100%', zIndex: 3 }}
                    />
                  </div>

                  {/* Scale labels */}
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] text-white/25 mono">₹0</span>
                    <span className="text-[9px] text-white/25 mono">₹{(maxPriceLimit * 0.25 / 1000).toFixed(1)}k</span>
                    <span className="text-[9px] text-white/25 mono">₹{(maxPriceLimit * 0.5 / 1000).toFixed(1)}k</span>
                    <span className="text-[9px] text-white/25 mono">₹{(maxPriceLimit * 0.75 / 1000).toFixed(1)}k</span>
                    <span className="text-[9px] text-white/25 mono">₹{(maxPriceLimit / 1000).toFixed(1)}k</span>
                  </div>
                </div>

                {/* Branches */}
                <div className="mb-8 pt-6 border-t border-white/10">
                  <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Seller's Branch</h4>
                  <div className="space-y-3">
                    {branches.map(branch => (
                      <label key={branch.slug} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="modern-checkbox"
                          checked={selectedBranches.includes(branch.slug)}
                          onChange={() => toggleBranch(branch.slug)}
                        />
                        <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                          {branch.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Years */}
                <div className="mb-8 pt-6 border-t border-white/10">
                  <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Seller's Year</h4>
                  <div className="space-y-3">
                    {years.map(year => (
                      <label key={year.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="modern-checkbox"
                          checked={selectedYears.includes(year.value)}
                          onChange={() => toggleYear(year.value)}
                        />
                        <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                          {year.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="mb-8 pt-6 border-t border-white/10">
                  <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Condition</h4>
                  <div className="space-y-3">
                    {conditions.map(cond => (
                      <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="modern-checkbox"
                          checked={selectedConditions.includes(cond)}
                          onChange={() => toggleCondition(cond)}
                        />
                        <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                          {cond}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Item Types */}
                <div className="mb-8 pt-6 border-t border-white/10">
                  <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Item Type</h4>
                  <div className="space-y-3">
                    {itemTypes.map(type => (
                      <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="modern-checkbox"
                          checked={selectedTypes.includes(type.value)}
                          onChange={() => toggleType(type.value)}
                        />
                        <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="col-span-12 lg:col-span-9 xl:col-span-10 p-6 lg:p-8">

                {/* Quick Filters */}
                <div className="mb-6 overflow-x-auto">
                  <div className="flex gap-3 pb-2">
                    {quickFilters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => applyQuickFilter(filter.key, filter.apply, filter.clear)}
                        className="quick-filter-btn"
                        style={activeQuickFilter === filter.key ? {
                          background: 'linear-gradient(135deg, rgba(0,217,255,0.15), rgba(124,58,237,0.15))',
                          border: '1px solid rgba(0,217,255,0.4)',
                          color: '#00D9FF',
                        } : {}}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="text-sm text-white/60">
                    Showing <span className="text-white font-bold">{products.length}</span> results
                    {debouncedSearch && (
                      <span className="ml-1 text-[#00D9FF]">
                        for "{debouncedSearch}"
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 lg:hidden">

                    <button
                      onClick={() => setMobileFilterOpen(true)}
                      className="lg:hidden btn-ghost text-xs"
                    >
                      <FilterIcon /> Filters
                      {getActiveFilterCount() > 0 && (
                        <span className="ml-2 w-5 h-5 bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {getActiveFilterCount()}
                        </span>
                      )}
                    </button>

                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                      >
                        <GridIcon />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                      >
                        <ListIcon />
                      </button>
                    </div>

                    <div className="relative group">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white/5 border border-white/10 text-sm text-white px-4 py-2.5 pr-8 rounded-xl focus:outline-none cursor-pointer font-medium hover:bg-white/10"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="pricelow">Price: Low to High</option>
                        <option value="pricehigh">Price: High to Low</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                        <ChevronDown />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {loading && products.length === 0 ? (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {Array.from({ length: viewMode === 'grid' ? 8 : 5 }).map((_, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="skeleton-shimmer w-full" style={{ height: viewMode === 'grid' ? 180 : 120 }} />
                        <div className="p-4 space-y-3">
                          <div className="flex gap-2">
                            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
                            <div className="skeleton-shimmer h-5 w-20 rounded-full" />
                          </div>
                          <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                          <div className="skeleton-shimmer h-3 w-1/2 rounded" />
                          <div className="flex items-center justify-between pt-1">
                            <div className="skeleton-shimmer h-5 w-16 rounded" />
                            <div className="skeleton-shimmer h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !loading && products.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-4xl mb-4 grayscale opacity-50">📦</div>
                    <h3 className="text-lg font-bold text-white mb-2">No products found</h3>
                    <p className="text-white/60 mb-6 text-sm">
                      We couldn't find what you're looking for.
                    </p>
                    <button onClick={clearAllFilters} className="text-[#00D9FF] text-sm font-bold hover:underline">
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {products.map((product, index) => (
                      <div key={product._id} className="h-full group">
                        <ProductCard product={product} viewMode={viewMode} index={index} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Lazy load sentinel */}
                <div ref={sentinelRef} className="h-1 mt-2" />
              </main>
            </div>
          </div>
        </div>

        {/* ====== MOBILE VIEW ====== */}
        <div className="block md:hidden min-h-[100dvh] pb-24 relative z-10">

          {/* Mobile Top Bar */}
          <div className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
            {user ? (
              <div className="relative user-menu-container">
                <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ cursor: 'pointer' }}>
                  <Avatar
                    src={user?.profilePicture}
                    name={user?.fullName || user?.name || user?.email}
                    size={32}
                    style={{ fontSize: '12px', fontWeight: '800' }}
                  />
                </div>
                {showUserMenu && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-[#0F0F0F] border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-white/10">
                      <div className="text-[10px] text-white/40 mono uppercase mb-1 font-bold">Logged in as</div>
                      <div className="text-sm text-white font-bold truncate">{user.fullName}</div>
                      <div className="text-xs text-white/60 truncate mt-0.5">{user.email}</div>
                      {user.enrollmentNumber && (
                        <div className="text-[10px] text-cyan-400 mono mt-2">{user.enrollmentNumber}</div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                    >
                      Dashboard
                    </button>
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
              <button onClick={() => setIsLoginOpen(true)} className="w-8 h-8 rounded-full bg-white/10 flex flex-col items-center justify-center text-white/50 hover:bg-white/20 transition-colors">
                <span className="text-xs">👤</span>
              </button>
            )}

            <Link to="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <img src="https://res.cloudinary.com/rajvirgautam/image/upload/v1773618022/CampusMarketplace-removebg-preview_kutxp3.png" alt="Campus Marketplace" className="h-6 w-auto" />
                <span className="font-['Montserrat'] font-black text-white uppercase tracking-tighter leading-none mt-0.5" style={{ fontSize: '0.65rem' }}>
                  Campus<br />Marketplace
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {user ? (
                <span data-onboarding="notification-bell" className="flex items-center">
                  <NotificationBell dark={true} />
                </span>
              ) : (
                <button onClick={() => setIsLoginOpen(true)} className="btn-glass px-3 py-1 text-xs" style={{ padding: '6px 12px' }}>
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Area */}
          <div className="px-4 py-3 bg-[#0A0A0A] border-b border-white/5 sticky top-[53px] z-40">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-10 pr-10 bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:outline-none focus:border-[#00D9FF] transition-colors placeholder-white/40"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setDebouncedSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                  <XIcon />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Categories Scroller */}
          <div className="px-4 py-4 overflow-x-auto custom-scrollbar flex gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategories.length === 0 ? 'bg-[#1E3A8A] text-white' : 'bg-white/5 text-white/60'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategories([cat.slug]);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategories.includes(cat.slug) ? 'bg-[#059669] text-white' : 'bg-white/5 text-white/60'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mobile Filters & Stats */}
          <div className="px-4 py-2 flex items-center justify-between mb-2">
            <div className="text-xs text-white/50 mono">
              <span className="text-white font-bold">{products.length}</span> items
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-1.5 text-xs text-white font-bold bg-[#059669] px-3 py-1.5 rounded-lg border-none"
            >
              <FilterIcon /> Filters
              {getActiveFilterCount() > 0 && <span className="ml-1 w-4 h-4 rounded-full bg-white text-[#059669] flex items-center justify-center text-[9px] font-black">{getActiveFilterCount()}</span>}
            </button>
          </div>

          {/* Mobile Grid */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 px-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                  <div className="skeleton-shimmer w-full" style={{ height: 130 }} />
                  <div className="p-3 space-y-2">
                    <div className="skeleton-shimmer h-4 w-14 rounded-full" />
                    <div className="skeleton-shimmer h-3 w-full rounded" />
                    <div className="skeleton-shimmer h-3 w-2/3 rounded" />
                    <div className="skeleton-shimmer h-4 w-12 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && products.length === 0 ? (
            <div className="text-center py-12 px-4 mx-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl mb-3 grayscale opacity-50">📦</div>
              <h3 className="text-base font-bold text-white mb-1">No products found</h3>
              <p className="text-white/50 mb-4 text-xs">
                Try a different search or filter.
              </p>
              <button onClick={clearAllFilters} className="text-[#00D9FF] text-xs font-bold hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4" data-onboarding="product-grid">
              {products.map((product, index) => (
                <div key={product._id} className="h-full">
                  <ProductCard product={product} viewMode="grid" index={index} />
                </div>
              ))}
            </div>
          )}

          {/* Mobile lazy load sentinel */}
          <div ref={mobileSentinelRef} className="h-1 mt-2" />

        </div>

        {/* Mobile Bottom Navigation (Sticky Wrapper) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <div 
            className="relative flex items-center h-[64px] px-2"
            style={{
              background: 'rgba(10,10,10,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px 20px 0 0',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {/* Evenly spaced 5 elements */}
            <div className="flex-1 flex flex-col items-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="flex flex-col items-center gap-1 text-[#00D9FF]"
              >
                <GridIcon />
                <span className="text-[9px] font-bold mt-1">Home</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <button 
                onClick={() => user ? navigate('/dashboard') : setIsLoginOpen(true)} 
                className="flex flex-col items-center gap-1 text-white/50 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                <span className="text-[9px] font-bold mt-1">Dashboard</span>
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center relative h-full">
              <button 
                onClick={() => user ? setIsAddProductOpen(true) : setIsLoginOpen(true)} 
                className="absolute -top-[28px] w-14 h-14 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white text-3xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all active:scale-95 z-[60]"
                data-onboarding="list-item"
              >
                +
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <button 
                onClick={() => user ? navigate('/chat') : setIsLoginOpen(true)} 
                className="flex flex-col items-center gap-1 text-white/50 hover:text-white relative" 
                data-onboarding="chat-icon"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                <span className="text-[9px] font-bold mt-1">Messages</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white bg-gradient-to-br from-pink-500 to-red-500 border border-black">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <button 
                onClick={() => user ? navigate('/dashboard?tab=My Account') : setIsLoginOpen(true)} 
                className="flex flex-col items-center gap-1 text-white/50 hover:text-white"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden">
                  <Avatar
                    src={user?.profilePicture}
                    name={user?.fullName || user?.name || user?.email}
                    size={20}
                    style={{ fontSize: '10px', fontWeight: '800' }}
                  />
                </div>
                <span className="text-[9px] font-bold mt-1">Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Loading More Sticky Overlay */}
        {loadingMore && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pb-[120px] md:pb-12 pt-24 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent">
            <div className="bg-[#1A1A1A] border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-auto">
              <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-[#00D9FF] animate-spin" />
              <span className="text-sm font-bold text-white tracking-wide">Loading more...</span>
            </div>
          </div>
        )}

        {/* Hiding old mobile Add Button since we added a sticky bottom nav */}
        <div className="hidden">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] text-white text-3xl flex items-center justify-center shadow-lg shadow-cyan-900/50 z-40"
          >
            +
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        <div
          className={`filter-backdrop ${mobileFilterOpen ? 'open' : ''}`}
          onClick={() => setMobileFilterOpen(false)}
        ></div>

        <div className={`filter-drawer ${mobileFilterOpen ? 'open' : ''} lg:hidden`}>
          {/* STICKY HEADER */}
          <div className="sticky top-0 bg-[#0F0F0F] z-[30] px-6 py-4 flex items-center justify-between border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase mono">Filters</h3>
            <button 
              onClick={() => setMobileFilterOpen(false)} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 active:bg-white/10 active:scale-95 transition-all"
            >
              <XIcon />
            </button>
          </div>

          <div className="p-6 pt-2 space-y-6 max-h-[calc(70vh-140px)] overflow-y-auto custom-scrollbar">
            {/* Categories */}
            <div>
              <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Categories</h4>
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                    />
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                      {cat.emoji} {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[11px] text-white/40 uppercase font-bold mono">Price Range</h4>
                <span className="text-[11px] text-[#10B981] font-mono">₹{draftPriceRange[0].toLocaleString()} – ₹{draftPriceRange[1].toLocaleString()}</span>
              </div>
              <PriceHistogram
                histogram={priceHistogram}
                maxPrice={maxPriceLimit}
                minSelected={draftPriceRange[0]}
                maxSelected={draftPriceRange[1]}
              />
              <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center', marginTop: 4 }}>
                <div style={{ position: 'absolute', width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 10 }} />
                <div style={{ position: 'absolute', left: `${(draftPriceRange[0] / maxPriceLimit) * 100}%`, right: `${100 - (draftPriceRange[1] / maxPriceLimit) * 100}%`, height: 4, background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: 10 }} />
                <input type="range" min="0" max={maxPriceLimit} step="100" value={draftPriceRange[0]}
                  onChange={(e) => { const val = Math.min(parseInt(e.target.value), draftPriceRange[1] - 100); setDraftPriceRange([val, draftPriceRange[1]]); }}
                  onTouchEnd={(e) => { const val = Math.min(parseInt(e.target.value), draftPriceRange[1] - 100); setPriceRange([val, draftPriceRange[1]]); setCurrentPage(1); }}
                  onMouseUp={(e) => { const val = Math.min(parseInt(e.target.value), draftPriceRange[1] - 100); setPriceRange([val, draftPriceRange[1]]); setCurrentPage(1); }}
                  style={{ position: 'absolute', width: '100%', zIndex: 4 }} />
                <input type="range" min="0" max={maxPriceLimit} step="100" value={draftPriceRange[1]}
                  onChange={(e) => { const val = Math.max(parseInt(e.target.value), draftPriceRange[0] + 100); setDraftPriceRange([draftPriceRange[0], val]); }}
                  onTouchEnd={(e) => { const val = Math.max(parseInt(e.target.value), draftPriceRange[0] + 100); setPriceRange([draftPriceRange[0], val]); setCurrentPage(1); }}
                  onMouseUp={(e) => { const val = Math.max(parseInt(e.target.value), draftPriceRange[0] + 100); setPriceRange([draftPriceRange[0], val]); setCurrentPage(1); }}
                  style={{ position: 'absolute', width: '100%', zIndex: 3 }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-white/25 mono">₹0</span>
                <span className="text-[9px] text-white/25 mono">₹{(maxPriceLimit * 0.5 / 1000).toFixed(1)}k</span>
                <span className="text-[9px] text-white/25 mono">₹{(maxPriceLimit / 1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* Condition */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Condition</h4>
              <div className="space-y-3">
                {conditions.map(cond => (
                  <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={selectedConditions.includes(cond)}
                      onChange={() => toggleCondition(cond)}
                    />
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                      {cond}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seller's Branch */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Seller's Branch</h4>
              <div className="space-y-3">
                {branches.map(branch => (
                  <label key={branch.slug} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={selectedBranches.includes(branch.slug)}
                      onChange={() => toggleBranch(branch.slug)}
                    />
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                      {branch.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seller's Year */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Seller's Year</h4>
              <div className="space-y-3">
                {years.map(year => (
                  <label key={year.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={selectedYears.includes(year.value)}
                      onChange={() => toggleYear(year.value)}
                    />
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                      {year.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Item Type */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-[11px] text-white/40 uppercase mb-4 font-bold mono">Item Type</h4>
              <div className="space-y-3">
                {itemTypes.map(type => (
                  <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="modern-checkbox"
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleType(type.value)}
                    />
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors flex-1">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* STICKY FOOTER */}
          <div className="sticky bottom-0 bg-[#0F0F0F] border-t border-white/10 p-6 flex gap-3 z-[30]">
            <button
              onClick={clearAllFilters}
              className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl active:scale-95 transition-all"
            >
              Clear
            </button>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="flex-1 px-4 py-3.5 bg-[#F5F5F7] text-black text-sm font-bold rounded-xl active:scale-95 transition-all"
            >
              Show Results
            </button>
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />

        {/* Login Modal */}
        <ConnectIdModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </>
  );
};

export default Marketplace;
