
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../ui/ProductCard' // Ensure you have this component
import { products as allProducts } from '/Users/vkgautam/Desktop/GS-MARK-II/sgsits-market/src/components/sections/Products.js' // Importing shared data

// --- Internal Icons ---
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
)
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
)
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
)
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
)
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
)
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
)

const Marketplace = () => {
  // State Management
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedPostedWithin, setSelectedPostedWithin] = useState(null)
  const [priceRange, setPriceRange] = useState([0, 10000]) // Increased range
  const [availability, setAvailability] = useState({
    availableNow: true,
    auction: false,
    trending: false,
    hasPhotos: false
  })

  // Category data with counts
  const categories = [
    { name: 'Books & Notes', count: 245, emoji: '📚', slug: 'books' },
    { name: 'Lab Equipment', count: 89, emoji: '🔧', slug: 'lab' },
    { name: 'Stationery', count: 156, emoji: '📐', slug: 'stationery' },
    { name: 'Electronics', count: 67, emoji: '💻', slug: 'electronics' },
    { name: 'Hostel Items', count: 43, emoji: '🛏️', slug: 'hostel' },
    { name: 'Miscellaneous', count: 92, emoji: '🎒', slug: 'misc' }
  ]

  const branches = [
    { name: 'Computer Science', count: 142, slug: 'cs' },
    { name: 'Electronics & Comm.', count: 98, slug: 'ece' },
    { name: 'Mechanical', count: 87, slug: 'mech' },
    { name: 'Civil', count: 54, slug: 'civil' },
    { name: 'Electrical', count: 39, slug: 'ee' }
  ]

  const years = [
    { label: '1st Year', count: 89, value: 1 },
    { label: '2nd Year', count: 156, value: 2 },
    { label: '3rd Year', count: 178, value: 3 },
    { label: '4th Year', count: 269, value: 4 }
  ]

  const conditions = [
    { label: 'Any Condition', count: 'all', value: null },
    { label: 'New', count: 32, value: 'New' },
    { label: 'Like New', count: 87, value: 'Like New' },
    { label: 'Good', count: 214, value: 'Good' },
    { label: 'Acceptable', count: 45, value: 'Acceptable' }
  ]

  const itemTypes = [
    { label: 'For Sale (Cash)', count: 512, value: 'sale' },
    { label: 'For Barter (Exchange)', count: 78, value: 'barter' },
    { label: 'For Rent', count: 12, value: 'rent' },
    { label: 'Free (Giveaway)', count: 6, value: 'free' }
  ]

  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 24

  // Toggle functions
  const toggleCategory = (slug) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    )
  }

  const toggleBranch = (slug) => {
    setSelectedBranches(prev => 
      prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]
    )
  }

  const toggleYear = (value) => {
    setSelectedYears(prev => 
      prev.includes(value) ? prev.filter(y => y !== value) : [...prev, value]
    )
  }

  const toggleType = (value) => {
    setSelectedTypes(prev => 
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBranches([])
    setSelectedYears([])
    setSelectedConditions([])
    setSelectedTypes([])
    setSelectedPostedWithin(null)
    setPriceRange([0, 10000])
    setAvailability({
      availableNow: true,
      auction: false,
      trending: false,
      hasPhotos: false
    })
    setSearchQuery('')
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (selectedCategories.length > 0) count++
    if (selectedBranches.length > 0) count++
    if (selectedYears.length > 0) count++
    if (selectedConditions.length > 0) count++
    if (selectedTypes.length > 0) count++
    if (selectedPostedWithin) count++
    if (priceRange[0] !== 0 || priceRange[1] !== 10000) count++
    return count
  }

  // Filter and sort products
  useEffect(() => {
    let result = [...allProducts]

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    }

    // Branch filter
    if (selectedBranches.length > 0) {
      result = result.filter(p => selectedBranches.includes(p.branch))
    }

    // Year filter
    if (selectedYears.length > 0) {
      result = result.filter(p => selectedYears.includes(p.year))
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      result = result.filter(p => selectedConditions.includes(p.condition))
    }

    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.type))
    }

    // Price range filter
    result = result.filter(p => {
      // Use numericPrice from data structure for cleaner sorting
      const price = p.numericPrice || parseInt(p.price.replace(/[^0-9]/g, ''))
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Availability filters
    if (availability.trending) {
      result = result.filter(p => p.isTrending)
    }

    // Sort
    switch(sortBy) {
      case 'newest':
        // Assuming default is newest
        break
      case 'oldest':
        result.reverse()
        break
      case 'price_low':
        result.sort((a, b) => (a.numericPrice || 0) - (b.numericPrice || 0))
        break
      case 'price_high':
        result.sort((a, b) => (b.numericPrice || 0) - (a.numericPrice || 0))
        break
      case 'popular':
        result.sort((a, b) => b.views - a.views)
        break
      default:
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [searchQuery, selectedCategories, selectedBranches, selectedYears, 
      selectedConditions, selectedTypes, selectedPostedWithin, 
      priceRange, availability, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

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

        .mono { font-family: 'Space Mono', monospace; }

        /* Noise & Grid */
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px),
            repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px);
          pointer-events: none;
          z-index: 1;
        }

        /* Custom Checkbox */
        .brutal-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
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

        /* Radio button */
        .brutal-radio {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        .brutal-radio:checked {
          border-color: #00D9FF;
        }
        .brutal-radio:checked::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #00D9FF;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Range Slider */
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
        }

        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          width: 36px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: background 0.3s;
        }
        .toggle-switch.active {
          background: #00D9FF;
          border-color: #00D9FF;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          background: #fff;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
        }
        .toggle-switch.active::after {
          transform: translateX(16px);
        }

        /* Animations */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .anim-slide-left { animation: slideInLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-slide-right { animation: slideInRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-slide-up { animation: slideInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-scale { animation: scaleIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-fade { animation: fadeIn 0.6s ease-out forwards; }

        /* Filter Tag */
        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid rgba(0, 217, 255, 0.3);
          padding: 4px 8px;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
        }

        /* Mobile Filter Drawer */
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
      `}</style>

      <div className="theme-root relative">
        <div className="noise-overlay" />
        <div className="grid-lines" />

        {/* --- STICKY HEADER --- */}
        <header 
          className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 anim-fade"
          style={{ animationDuration: '0.8s' }}
        >
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              
              {/* Logo */}
              <Link to="/">
                <div className="mono text-lg font-bold text-white hidden md:block cursor-pointer">
                  SGSITS<span className="text-[#00D9FF]">.MKT</span>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl relative">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchSuggestions(e.target.value.length >= 2)
                    }}
                    onFocus={() => setShowSearchSuggestions(searchQuery.length >= 2)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    placeholder="Search 'CS 3rd sem books', 'Arduino', 'Drafter'..."
                    className="w-full h-12 pl-11 pr-10 bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D9FF] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setShowSearchSuggestions(false)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>

                {/* Auto-suggest dropdown (simplified) */}
                {showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="p-2 text-xs mono text-white/40 uppercase">Searching...</div>
                  </div>
                )}
              </div>

              {/* Categories Dropdown */}
              <div className="relative hidden lg:block">
                <button className="px-4 py-2 bg-zinc-900 border border-white/10 text-white text-sm mono flex items-center gap-2 hover:border-white/30 transition-colors">
                  Categories <ChevronDown />
                </button>
              </div>

              {/* List Product Button */}
              <button className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-bold mono hover:scale-105 transition-transform hidden md:block">
                ➕ LIST PRODUCT
              </button>

              {/* User Icon */}
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-sm font-bold cursor-pointer hover:border-white/40 transition-colors">
                A
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN LAYOUT --- */}
        <div className="max-w-[1800px] mx-auto relative z-10">
          <div className="grid grid-cols-12">
            
            {/* LEFT SIDEBAR - Desktop Only */}
            <aside 
              className="col-span-12 lg:col-span-3 xl:col-span-2 border-r border-white/10 bg-black/40 backdrop-blur-sm p-6 hidden lg:block overflow-y-auto custom-scrollbar sticky top-[73px] h-[calc(100vh-73px)] anim-slide-left"
              style={{ opacity: 0, animationDelay: '0.2s' }}
            >
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="mono text-xs font-bold text-white uppercase tracking-widest">Filters</h3>
                <button 
                  onClick={clearAllFilters}
                  className="mono text-[10px] text-[#00D9FF] hover:underline"
                >
                  CLEAR ALL
                </button>
              </div>

              {/* Active Filters Summary */}
              {getActiveFilterCount() > 0 && (
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="mono text-[10px] text-white/40 mb-3">ACTIVE: {getActiveFilterCount()} FILTERS</div>
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
                      <span className="text-xs text-white/40 mono">{cat.count}</span>
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
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                />
                <div className="flex gap-2 mt-3">
                  <input 
                    type="number" 
                    value={priceRange[0]} 
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                    placeholder="Min"
                  />
                  <input 
                    type="number" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-full bg-zinc-900 border border-white/10 px-2 py-1 text-xs text-white"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Branch Filter */}
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
                      <span className="text-xs text-white/40 mono">{branch.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
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
                      <span className="text-xs text-white/40 mono">{year.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <h4 className="mono text-[10px] text-white/40 uppercase mb-4 font-bold">Item Condition</h4>
                <div className="space-y-3">
                  {conditions.map(cond => (
                    <label key={cond.value || 'any'} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="condition"
                        className="brutal-radio"
                        checked={selectedPostedWithin === cond.value}
                        onChange={() => setSelectedPostedWithin(cond.value)}
                      />
                      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex-1">
                        {cond.label}
                      </span>
                      <span className="text-xs text-white/40 mono">
                        {cond.count === 'all' ? 'all' : cond.count}
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
                      <span className="text-xs text-white/40 mono">{type.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <h4 className="mono text-[10px] text-white/40 uppercase mb-4 font-bold">Availability</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Available Now</span>
                    <div 
                      className={`toggle-switch ${availability.availableNow ? 'active' : ''}`}
                      onClick={() => setAvailability(prev => ({...prev, availableNow: !prev.availableNow}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Trending Items</span>
                    <div 
                      className={`toggle-switch ${availability.trending ? 'active' : ''}`}
                      onClick={() => setAvailability(prev => ({...prev, trending: !prev.trending}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Has Photos</span>
                    <div 
                      className={`toggle-switch ${availability.hasPhotos ? 'active' : ''}`}
                      onClick={() => setAvailability(prev => ({...prev, hasPhotos: !prev.hasPhotos}))}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <main className="col-span-12 lg:col-span-9 xl:col-span-10 p-6 lg:p-8">
              
              {/* Sort & View Controls */}
              <div 
                className="flex flex-wrap items-center justify-between gap-4 mb-8 anim-slide-up"
                style={{ opacity: 0, animationDelay: '0.4s' }}
              >
                <div className="mono text-xs text-white/40">
                  SHOWING <span className="text-white font-bold">{currentProducts.length}</span> OF <span className="text-white font-bold">{filteredProducts.length}</span> RESULTS
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 text-white text-xs mono"
                  >
                    <FilterIcon /> FILTERS ({getActiveFilterCount()})
                  </button>

                  {/* View Toggle */}
                  <div className="flex border border-white/10">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-[#00D9FF] text-black' : 'bg-zinc-900 text-white/40'}`}
                    >
                      <GridIcon />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-[#00D9FF] text-black' : 'bg-zinc-900 text-white/40'}`}
                    >
                      <ListIcon />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative group">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-zinc-900 border border-white/10 text-xs mono text-white px-4 py-2 pr-8 focus:outline-none focus:border-white/40"
                    >
                      <option value="newest">SORT: NEWEST FIRST</option>
                      <option value="oldest">SORT: OLDEST FIRST</option>
                      <option value="price_low">SORT: PRICE LOW → HIGH</option>
                      <option value="price_high">SORT: PRICE HIGH → LOW</option>
                      <option value="popular">SORT: MOST POPULAR</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                      <ChevronDown />
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-20 anim-fade">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">No products match your filters</h3>
                  <p className="text-white/60 mb-6">Try adjusting your search or filters</p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={clearAllFilters}
                      className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-white text-black hover:bg-white/90 transition-colors"
                    >
                      Browse All
                    </button>
                  </div>
                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length > 0 && (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {currentProducts.map((product, index) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        viewMode={viewMode} 
                        index={index} 
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2 anim-fade" style={{ opacity: 0, animationDelay: '1s' }}>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/40 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft />
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center font-mono text-xs font-bold ${
                              currentPage === pageNum 
                                ? 'bg-white text-black' 
                                : 'border border-white/10 hover:border-white/40 text-white/60'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      {totalPages > 5 && <span className="flex items-center text-white/40">...</span>}
                      
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/40 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <div 
          className={`filter-backdrop ${mobileFilterOpen ? 'open' : ''}`}
          onClick={() => setMobileFilterOpen(false)}
        />
        <div className={`filter-drawer ${mobileFilterOpen ? 'open' : ''} lg:hidden`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 className="mono text-sm font-bold text-white uppercase">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <XIcon />
              </button>
            </div>

            {/* Mobile filters content - Same as sidebar */}
            <div className="space-y-6">
              {/* Categories */}
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

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-black border-t border-white/10 p-4 flex gap-3 mt-8">
              <button 
                onClick={clearAllFilters}
                className="flex-1 px-4 py-3 border border-white/20 text-white text-sm mono"
              >
                CLEAR
              </button>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 px-4 py-3 bg-[#00D9FF] text-black text-sm font-bold mono"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Button (Mobile) */}
        <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-2xl flex items-center justify-center shadow-2xl z-40">
          ➕    
        </button>
      </div>
    </>
  )
}

export default Marketplace