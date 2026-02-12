import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import ProductCard from '../ui/ProductCard';
import AddProductModal from './AddProductModal';

// --- Internal Icons ---
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
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

const Marketplace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State Management
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // MOUSE & ACCENT STATE
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeAccent, setActiveAccent] = useState(null);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const productsPerPage = 24;

  // Category data with counts
  const categories = [
    { name: 'Books & Notes', count: 245, emoji: '📚', slug: 'books' },
    { name: 'Lab Equipment', count: 89, emoji: '🔬', slug: 'lab' },
    { name: 'Stationery', count: 156, emoji: '✏️', slug: 'stationery' },
    { name: 'Electronics', count: 67, emoji: '⚡', slug: 'electronics' },
    { name: 'Hostel Items', count: 43, emoji: '🏠', slug: 'hostel' },
    { name: 'Miscellaneous', count: 92, emoji: '📦', slug: 'misc' },
  ];

  const branches = [
    { name: 'Computer Science', count: 142, slug: 'cs' },
    { name: 'Electronics & Comm.', count: 98, slug: 'ece' },
    { name: 'Mechanical', count: 87, slug: 'mech' },
    { name: 'Civil', count: 54, slug: 'civil' },
    { name: 'Electrical', count: 39, slug: 'ee' },
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

  // Mouse Move Handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [
    searchQuery,
    selectedCategories,
    selectedBranches,
    selectedYears,
    selectedConditions,
    selectedTypes,
    priceRange,
    sortBy,
    currentPage
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchQuery,
        categories: selectedCategories,
        branches: selectedBranches,
        years: selectedYears,
        conditions: selectedConditions,
        types: selectedTypes,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        page: currentPage,
        limit: productsPerPage
      };

      const response = await productAPI.getAll(filters);
      
      if (response.success) {
        setProducts(response.products);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
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
    setPriceRange([0, 10000]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedBranches.length > 0) count++;
    if (selectedYears.length > 0) count++;
    if (selectedConditions.length > 0) count++;
    if (selectedTypes.length > 0) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 10000) count++;
    return count;
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

  // Restore scroll position
  useEffect(() => {
    if (location.state?.scrollY) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollY);
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  const totalPages = pagination.pages || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .theme-root {
          font-family: 'Manrope', sans-serif;
          background: #0A0A0A;
          color: #fff;
          min-height: 100vh;
        }

        .mono {
          font-family: 'Space Mono', monospace;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        /* --- ROUNDED UI BUTTONS & INPUTS --- */
        .btn-glass {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 100px;
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

        .brutal-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          border-radius: 4px;
        }

        .brutal-checkbox:checked {
          background: #fff;
          border-color: #fff;
        }

        .brutal-checkbox:checked::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #000;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.2);
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: #fff;
          border: 1px solid #000;
          cursor: pointer;
          border-radius: 50%;
        }

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

        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid rgba(0, 217, 255, 0.3);
          padding: 6px 12px;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          border-radius: 100px;
        }

        .filter-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #0F0F0F;
          border-top: 1px solid rgba(255,255,255,0.2);
          max-height: 70vh;
          overflow-y: auto;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 1000;
        }

        .filter-drawer.open {
          transform: translateY(0);
        }

        .filter-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          z-index: 999;
        }

        .filter-backdrop.open {
          opacity: 1;
          pointer-events: all;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .anim-fade {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>

      <div className="theme-root relative">
        <div className="noise-overlay" style={{ zIndex: 1 }}></div>
        
        {/* --- DYNAMIC CURSOR GLOW --- */}
        <div
          className="fixed inset-0 pointer-events-none transition-colors duration-500 ease-out"
          style={{
            zIndex: 0,
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${activeAccent ? activeAccent + '20' : 'rgba(255, 255, 255, 0.03)'}, transparent 40%)`
          }}
        />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 anim-fade">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <div className="mono text-lg font-bold text-white hidden md:block cursor-pointer">
                  SGSITS<span className="text-[#00D9FF]">.MKT</span>
                </div>
              </Link>

              {/* Search */}
              <div className="flex-1 max-w-2xl relative">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search CS 3rd sem books, Arduino, Drafter..."
                    className="w-full h-12 pl-11 pr-10 bg-zinc-900 border border-white/10 text-white text-sm rounded-full focus:outline-none focus:border-[#00D9FF] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>
              </div>

              <div className="hidden lg:block">
                <button className="btn-glass">
                  Categories <ChevronDown />
                </button>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-bold mono rounded-full hover:scale-105 transition-transform hidden md:block"
              >
                LIST PRODUCT
              </button>

              {user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="btn-glass px-2 py-1 pr-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-[10px] font-bold">
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
                    <ChevronDown />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#141414] border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden z-50">
                      <div className="p-4 border-b border-white/10">
                        <div className="text-[10px] text-white/40 uppercase mb-1 font-bold mono">Logged in as</div>
                        <div className="text-sm text-white font-bold truncate">{user.fullName}</div>
                        <div className="text-xs text-white/60 truncate mt-0.5">{user.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        My Dashboard
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
                <Link to="/login" className="btn-glass hover:bg-white/10">
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto relative z-10">
          <div className="grid grid-cols-12">
            
            {/* Sidebar Filters */}
            <aside className="col-span-12 lg:col-span-3 xl:col-span-2 border-r border-white/10 bg-black/40 backdrop-blur-sm p-6 hidden lg:block overflow-y-auto custom-scrollbar sticky top-[81px] h-[calc(100vh-81px)]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="mono text-xs font-bold text-white uppercase tracking-widest">Filters</h3>
                {getActiveFilterCount() > 0 && (
                  <button onClick={clearAllFilters} className="mono text-[10px] text-[#00D9FF] hover:underline">
                    CLEAR ALL
                  </button>
                )}
              </div>

              {/* Active Filters */}
              {getActiveFilterCount() > 0 && (
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="mono text-[10px] text-white/40 mb-3">
                    ACTIVE ({getActiveFilterCount()}) FILTERS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(cat => (
                      <span key={cat} className="filter-tag">
                        {categories.find(c => c.slug === cat)?.name}
                        <button onClick={() => toggleCategory(cat)} className="text-white/60 hover:text-white">
                          <XIcon />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mb-8">
                <h4 className="mono text-[10px] text-white/40 uppercase mb-4 font-bold">Categories</h4>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="brutal-checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                      />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex-1">
                        {cat.emoji} {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <div className="flex justify-between mb-4">
                  <h4 className="mono text-[10px] text-white/40 uppercase font-bold">Price Range</h4>
                  <span className="mono text-[10px] text-white">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => {
                    setPriceRange([0, parseInt(e.target.value)]);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Branches */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <h4 className="mono text-[10px] text-white/40 uppercase mb-4 font-bold">Seller's Branch</h4>
                <div className="space-y-3">
                  {branches.map(branch => (
                    <label key={branch.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="brutal-checkbox"
                        checked={selectedBranches.includes(branch.slug)}
                        onChange={() => toggleBranch(branch.slug)}
                      />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex-1">
                        {branch.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Years */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <h4 className="mono text-[10px] text-white/40 uppercase mb-4 font-bold">Seller's Year</h4>
                <div className="space-y-3">
                  {years.map(year => (
                    <label key={year.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="brutal-checkbox"
                        checked={selectedYears.includes(year.value)}
                        onChange={() => toggleYear(year.value)}
                      />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex-1">
                        {year.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Item Type */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <h4 className="mono text-[10px] text-white/40 uppercase mb-4 font-bold">Item Type</h4>
                <div className="space-y-3">
                  {itemTypes.map(type => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="brutal-checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                      />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex-1">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="col-span-12 lg:col-span-9 xl:col-span-10 p-6 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="mono text-xs text-white/40">
                  SHOWING <span className="text-white font-bold">{products.length}</span> OF{' '}
                  <span className="text-white font-bold">{pagination.total || 0}</span> RESULTS
                </div>

                <div className="flex items-center gap-4">
                  
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden btn-glass text-xs mono"
                  >
                    <FilterIcon /> FILTERS
                  </button>

                  <div className="flex border border-white/10 rounded-full overflow-hidden p-0.5 bg-zinc-900">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-[#00D9FF] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      <GridIcon />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-[#00D9FF] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      <ListIcon />
                    </button>
                  </div>

                  <div className="relative group">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-zinc-900 border border-white/10 text-xs mono text-white px-4 py-2 pr-8 rounded-full focus:outline-none focus:border-white/40 cursor-pointer"
                    >
                      <option value="newest">SORT: NEWEST FIRST</option>
                      <option value="oldest">SORT: OLDEST FIRST</option>
                      <option value="pricelow">SORT: PRICE LOW→HIGH</option>
                      <option value="pricehigh">SORT: PRICE HIGH→LOW</option>
                      <option value="popular">SORT: MOST POPULAR</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="mono text-sm text-white/60">LOADING PRODUCTS...</div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                  <p className="text-white/60 mb-6">Try adjusting your search or filters</p>
                  <button onClick={clearAllFilters} className="btn-glass">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {products.map((product, index) => (
                    <div 
                      key={product._id} 
                      className="h-full"
                      onMouseEnter={() => setActiveAccent(product.accent || '#7C3AED')} 
                      onMouseLeave={() => setActiveAccent(null)}
                    >
                      <ProductCard product={product} viewMode={viewMode} index={index} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-white/40 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-full"
                  >
                    <ChevronLeft />
                  </button>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center font-mono text-xs font-bold rounded-full transition-all ${
                          currentPage === pageNum
                            ? 'bg-white text-black'
                            : 'border border-white/10 hover:border-white/40 text-white/60'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && <span className="flex items-center text-white/40 px-2">...</span>}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-white/40 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-full"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Add Button */}
        <button
          onClick={() => setIsAddProductOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-2xl flex items-center justify-center shadow-2xl z-40"
        >
          +
        </button>

        {/* Mobile Filter Drawer */}
        <div
          className={`filter-backdrop ${mobileFilterOpen ? 'open' : ''}`}
          onClick={() => setMobileFilterOpen(false)}
        ></div>

        <div className={`filter-drawer ${mobileFilterOpen ? 'open' : ''} lg:hidden`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 className="mono text-sm font-bold text-white uppercase">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <XIcon />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mono text-[10px] text-white/40 uppercase mb-4 font-bold">Categories</h4>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="brutal-checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                      />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex-1">
                        {cat.emoji} {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-black border-t border-white/10 p-4 flex gap-3 mt-8">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-3 border border-white/20 text-white text-sm mono rounded-full"
              >
                CLEAR
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 px-4 py-3 bg-[#00D9FF] text-black text-sm font-bold mono rounded-full"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />
      </div>
    </>
  );
};

export default Marketplace;