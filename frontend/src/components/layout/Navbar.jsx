import React, { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// --- LOCAL ICONS ---
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
// -------------------

const Navbar = ({ isDark, toggleTheme, onConnectClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Helper to get the display name
  const getDisplayName = () => {
    if (!user) return "";
    const rawName = user.fullName || user.name || user.email?.split('@')[0];
    return rawName ? rawName.split(' ')[0] : "Student";
  };

  const getInitials = () => {
    if (!user) return "U";
    const rawName = user.fullName || user.name || user.email;
    return rawName ? rawName.charAt(0).toUpperCase() : "U";
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll animation (SHAPE AND POSITION ONLY)
  useEffect(() => {
    const handleUpdate = () => {
      if (!navRef.current) return
      
      const scrollY = window.scrollY
      const maxScroll = 200
      let ratio = scrollY / maxScroll
      if (ratio > 1) ratio = 1
      if (ratio < 0) ratio = 0

      const isMobile = window.innerWidth < 768
      
      const startWidth = isMobile ? 90 : 55
      const endWidth = 100
      const currentWidth = startWidth + ((endWidth - startWidth) * ratio)

      const startOffset = 72
      const currentOffset = startOffset * (1 - ratio)
      const currentLeft = `calc(50% - ${currentOffset}px)`

      const currentTop = 65 - (65 * ratio)
      const currentRadius = 65 - (65 * ratio)
      
      // --- REMOVED JS COLOR/OPACITY CALCULATION HERE ---
      // The JS was overriding the Tailwind glass classes.
      // We now rely solely on CSS for the glass effect.

      const el = navRef.current
      el.style.left = currentLeft
      el.style.width = `${currentWidth}%`
      el.style.top = `${currentTop}px`
      el.style.borderTopLeftRadius = `${currentRadius}px`
      el.style.borderTopRightRadius = `${currentRadius}px`
      el.style.borderBottomLeftRadius = `${currentRadius}px`
      el.style.borderBottomRightRadius = `${currentRadius}px`
      
      // --- REMOVED JS STYLE OVERRIDES HERE ---
      // el.style.backgroundColor = ...
      // el.style.borderColor = ...
    }

    window.addEventListener('scroll', handleUpdate, { passive: true })
    window.addEventListener('resize', handleUpdate)
    // Trigger once on mount to set initial shape
    handleUpdate()

    return () => {
      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [isDark]) // isDark dependency remains if you ever want to re-add JS theming

  return (
    <nav
      ref={navRef}
      className={`
        fixed z-50 left-1/2 -translate-x-1/2 top-6
        flex items-center justify-between px-6 py-2
        rounded-full
        
        /* --- GLASSY EFFECT STYLES --- */
        bg-white/10 dark:bg-black/20
        backdrop-blur-xl
        border border-white/20 dark:border-white/10
        /* --------------------------- */
        
        shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.6)]
        transition-all duration-200 ease-out
        hover:bg-white/20 dark:hover:bg-white/5
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.9)]
      `}
    >
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0 pl-2">
        <div className="w-9 h-9 bg-gradient-to-tr from-cyan-600 to-violet-700 dark:from-cyan-500 dark:to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
          <Icons.Zap />
        </div>
        <span className="text-xl font-black text-indigo-950 dark:text-white tracking-tighter whitespace-nowrap hidden sm:inline">
          SGSITS<span className="text-cyan-700 dark:text-cyan-400">.MKT</span>
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-sm font-bold text-indigo-900 dark:text-slate-200">
        <Link
          to="/marketplace"
          className="hover:text-fuchsia-600 dark:hover:text-cyan-400 transition-colors drop-shadow-sm"
        >
          Marketplace
        </Link>
        <Link
          to="/dashboard"
          className="hover:text-fuchsia-600 dark:hover:text-cyan-400 transition-colors drop-shadow-sm"
        >
          Dashboard
        </Link>
        
        <div className="h-4 w-[1px] bg-indigo-950/10 dark:bg-white/10 mx-1"></div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-indigo-800 dark:text-yellow-300 ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-colors"
        >
          {isDark ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        {/* Auth Buttons */}
        {!user ? (
          <button 
            onClick={onConnectClick}
            className="py-2 px-5 text-xs bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-bold rounded-full shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform"
          >
            CONNECT ID
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* WRAPPER FOR USER MENU */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/15 hover:border-black/20 dark:hover:border-white text-indigo-900 dark:text-white transition-all backdrop-blur-md cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  {getInitials()}
                </div>
                <span className="text-xs font-bold tracking-wide">
                  {getDisplayName()}
                </span>
                <div className={`opacity-50 group-hover:opacity-100 transition-all duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>
                   <ChevronDown />
                </div>
              </button>

              {/* DARK BRUTALIST DROPDOWN */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-60 rounded-xl bg-[#0F0F0F] border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                  {/* Info Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="text-[9px] text-white/40 font-mono uppercase mb-1 tracking-widest">
                      Account
                    </div>
                    <div className="text-sm text-white font-bold truncate">
                      {user.fullName || user.name || "Student"}
                    </div>
                    {user.enrollmentNumber && (
                      <div className="text-[10px] text-cyan-400 font-mono mt-1">
                        {user.enrollmentNumber}
                      </div>
                    )}
                  </div>
                  
                  {/* Minimalist Links */}
                  <Link 
                    to="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="block w-full px-4 py-3 text-xs font-mono uppercase font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left tracking-wide"
                  >
                     View Dashboard
                  </Link>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON - Separated from dropdown */}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/10 transition-all backdrop-blur-md"
              title="Logout"
            >
              <LogOutIcon />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        {!user && (
            <button 
                onClick={onConnectClick}
                className="py-1.5 px-3 text-[10px] bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-bold rounded-lg"
            >
                CONNECT
            </button>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/5 text-indigo-900 dark:text-yellow-300 backdrop-blur-md"
        >
          {isDark ? <Icons.Sun /> : <Icons.Moon />}
        </button>
        <button
          className="text-indigo-950 dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-full p-4 rounded-3xl border border-white/20 flex flex-col gap-2 animate-fade-in-up bg-white/80 dark:bg-black/80 backdrop-blur-2xl shadow-2xl">
          <Link
            to="/marketplace"
            className="p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-indigo-900 dark:text-white font-bold text-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            to="/dashboard"
            className="p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-indigo-900 dark:text-white font-bold text-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          
          {/* Auth Mobile */}
          {!user ? (
            <button 
              onClick={() => {
                setIsOpen(false);
                onConnectClick();
              }}
              className="mt-2 w-full py-4 bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-bold rounded-xl shadow-lg"
            >
              CONNECT COLLEGE ID
            </button>
          ) : (
            <div className="mt-2 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-700 flex items-center justify-center text-white font-bold">
                  {getInitials()}
                </div>
                <div className="overflow-hidden">
                    <div className="text-indigo-900 dark:text-white font-bold truncate">
                    {user.fullName || user.name || "Student"}
                    </div>
                    <div className="text-xs text-indigo-900/50 dark:text-white/50 truncate">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/10 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOutIcon /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav> 
  )
}

export default Navbar