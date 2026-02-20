// src/pages/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import ProductCard from '../ui/ProductCard';
import AddProductModal from './AddProductModal';


// --- Internal Icons ---
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handler = (e) => setMousePos({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Category data with counts
  const categories = [
    { name: 'Books & Notes', count: 245, slug: 'books' },
    { name: 'Lab Equipment', count: 89, slug: 'lab' },
    { name: 'Stationery', count: 156, slug: 'stationery' },
    { name: 'Electronics', count: 67, slug: 'electronics' },
    { name: 'Hostel Items', count: 43, slug: 'hostel' },
    { name: 'Tools', count: 28, slug: 'tools' },
    { name: 'Miscellaneous', count: 92, slug: 'misc' },
  ];

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

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [
    debouncedSearch,
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
        search: debouncedSearch,
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

      console.log('🔍 Fetching products with filters:', filters);

      const response = await productAPI.getAll(filters);

      if (response.success) {
        setProducts(response.products);
        setPagination(response.pagination);
        console.log('✅ Loaded', response.products.length, 'products');
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
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
    setPriceRange([0, 10000]);
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedBranches.length > 0) count += selectedBranches.length;
    if (selectedYears.length > 0) count += selectedYears.length;
    if (selectedConditions.length > 0) count += selectedConditions.length;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (priceRange[0] !== 0 || priceRange[1] !== 10000) count++;
    return count;
  };

  // Quick filter presets
  const quickFilters = [
    {
      label: 'Free Items',
      action: () => {
        setSelectedTypes(['free']);
        setCurrentPage(1);
      }
    },
    {
      label: 'Under ₹500',
      action: () => {
        setPriceRange([0, 500]);
        setCurrentPage(1);
      }
    },
    {
      label: 'Barter Only',
      action: () => {
        setSelectedTypes(['barter']);
        setCurrentPage(1);
      }
    },
    {
      label: 'New Condition',
      action: () => {
        setSelectedConditions(['New', 'Like New']);
        setCurrentPage(1);
      }
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
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

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
          background: linear-gradient(135deg, #00D9FF, #7C3AED);
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
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
      `}</style>

      <div className="theme-root relative">
        {/* Mouse-tracking glow overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-all duration-700 ease-out"
          style={{ background: `radial-gradient(900px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,217,255,0.07) 0%, transparent 50%)` }}
        />
        {/* Noise & Grid */}
        <div className="noise-overlay"></div>
        <div className="grid-lines"></div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center gap-6">
              <Link to="/">
                <div className="text-xl font-bold text-white hidden md:flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white font-extrabold text-sm">S</div>
                  <span>SGSITS<span className="bg-gradient-to-r from-[#00D9FF] to-[#7C3AED] bg-clip-text text-transparent">.MKT</span></span>
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
                className="btn-primary hidden md:flex"
              >
                + List Item
              </button>

              {user && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-ghost hidden md:flex"
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-xs font-bold text-white">
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
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
                <Link to="/login" className="btn-glass hover:bg-white/10">
                  Login
                </Link>
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

              {/* Price Range */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <div className="flex justify-between mb-4">
                  <h4 className="text-[11px] text-white/40 uppercase font-bold mono">Price Range</h4>
                  <span className="text-[11px] text-[#00D9FF] font-mono">₹{priceRange[0]} - ₹{priceRange[1]}</span>
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
                  {quickFilters.map((filter, index) => (
                    <button
                      key={index}
                      onClick={filter.action}
                      className="quick-filter-btn"
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

                <div className="flex items-center gap-4">

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
              {loading ? (
                <div className="text-center py-20">
                  <div className="text-sm text-white/40 animate-pulse mono">Loading products...</div>
                </div>
              ) : products.length === 0 ? (
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
                    <div
                      key={product._id}
                      className="h-full group"
                    >
                      <div className="bg-white/5 border border-white/10 hover:border-[#00D9FF] rounded-2xl overflow-hidden h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] backdrop-blur-xl">
                        <ProductCard product={product} viewMode={viewMode} index={index} />
                      </div>
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
                    className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft />
                  </button>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${currentPage === pageNum
                          ? 'bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] text-white'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
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
                    className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
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
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] text-white text-3xl flex items-center justify-center shadow-lg shadow-cyan-900/50 z-40"
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
              <h3 className="text-sm font-bold text-white uppercase mono">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-white/60">
                <XIcon />
              </button>
            </div>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
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
            </div>

            <div className="sticky bottom-0 bg-[#0F0F0F] border-t border-white/10 p-4 flex gap-3 mt-8 -mx-6 -mb-6">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 px-4 py-3 bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] text-white text-sm font-bold rounded-xl"
              >
                Show Results
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
