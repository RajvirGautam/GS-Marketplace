import React, { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import NotificationBell from '../ui/NotificationBell'

// --- LOCAL ICONS ---
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
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

// ── DM Icon with badge ──────────────────────────────────────────────────────
const DMIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
// ────────────────────────────────────────────────────────────────────────────

// ── Mobile nav link icons ──────────────────────────────────────────────────
const MarketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
// ────────────────────────────────────────────────────────────────────────────

const Navbar = ({ isDark, toggleTheme, onConnectClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { unreadCount } = useSocket()

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

  // Close mobile menu on scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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

      const startWidth = isMobile ? 92 : 55
      const endWidth = 100
      const currentWidth = startWidth + ((endWidth - startWidth) * ratio)

      const startOffset = isMobile ? 20 : 72
      const currentOffset = startOffset * (1 - ratio)
      const currentLeft = `calc(50% - ${currentOffset}px)`

      // Mobile: start below the h-9 (36px) ticker bar + breathing room
      const startTop = isMobile ? 44 : 65
      const currentTop = startTop - (startTop * ratio)
      const startRadius = isMobile ? 28 : 65
      const currentRadius = startRadius - (startRadius * ratio)

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

        {/* DM Icon — always visible when logged in */}
        {user && (
          <Link
            to="/chat"
            className="relative p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-indigo-800 dark:text-slate-200 ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-colors"
            title="Messages"
          >
            <DMIcon />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md shadow-fuchsia-500/40 ring-2 ring-black/20 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        )}

        {/* Notification Bell */}
        {user && <NotificationBell dark={false} />}

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
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white text-[10px] font-bold shadow-sm overflow-hidden">
                  {user?.profilePicture
                    ? <img src={user.profilePicture} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : getInitials()
                  }
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

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="flex items-center gap-2 md:hidden">

        {/* Inline quick-action icons for logged-in users */}
        {user && (
          <>
            <Link
              to="/chat"
              className="relative p-2 rounded-xl bg-black/5 dark:bg-white/8 text-indigo-800 dark:text-slate-200 ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-colors"
              title="Messages"
            >
              <DMIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-[2px] rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[8px] font-black flex items-center justify-center shadow-md shadow-fuchsia-500/40 ring-1 ring-black/20 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <NotificationBell dark={false} />
          </>
        )}

        {!user && (
          <button
            onClick={onConnectClick}
            className="py-1.5 px-3.5 text-[10px] bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-extrabold rounded-full shadow-lg shadow-violet-500/20 tracking-wider"
          >
            CONNECT
          </button>
        )}

        {/* Hamburger / close */}
        <button
          className="p-2 rounded-xl bg-black/5 dark:bg-white/8 text-indigo-950 dark:text-white ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* ===== MOBILE FULLSCREEN OVERLAY ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== MOBILE DROPDOWN PANEL ===== */}
      <div
        className={`
          md:hidden
          absolute top-[calc(100%+10px)] left-0 w-full
          rounded-2xl overflow-hidden
          border border-white/15 dark:border-white/10
          bg-white/85 dark:bg-[#0c0c14]/90
          backdrop-blur-2xl
          shadow-[0_24px_80px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.15)]
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          origin-top z-[9999]
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}
      >
        {/* ── Quick action bar ── */}
        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-black/5 dark:border-white/5">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-indigo-900/40 dark:text-white/30 font-bold">Quick Actions</span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/8 text-indigo-800 dark:text-yellow-300 ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-colors"
            >
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </div>

        {/* ── Navigation links ── */}
        <div className="p-3 space-y-1">
          <Link
            to="/marketplace"
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-indigo-900 dark:text-white font-bold text-[15px] transition-all active:scale-[0.98]"
            onClick={() => setIsOpen(false)}
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 dark:from-cyan-500/20 dark:to-violet-500/20 flex items-center justify-center text-cyan-700 dark:text-cyan-400">
              <MarketIcon />
            </span>
            <span>Marketplace</span>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-indigo-900 dark:text-white font-bold text-[15px] transition-all active:scale-[0.98]"
            onClick={() => setIsOpen(false)}
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 dark:from-cyan-500/20 dark:to-violet-500/20 flex items-center justify-center text-cyan-700 dark:text-cyan-400">
              <DashboardIcon />
            </span>
            <span>Dashboard</span>
          </Link>

          {user && (
            <Link
              to="/chat"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-indigo-900 dark:text-white font-bold text-[15px] transition-all active:scale-[0.98]"
              onClick={() => setIsOpen(false)}
            >
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 dark:from-cyan-500/20 dark:to-violet-500/20 flex items-center justify-center text-cyan-700 dark:text-cyan-400 relative">
                <DMIcon />
              </span>
              <span className="flex-1">Messages</span>
              {unreadCount > 0 && (
                <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-fuchsia-500/30">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="mx-4 h-px bg-black/5 dark:bg-white/5" />

        {/* ── Auth section ── */}
        <div className="p-3">
          {!user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                onConnectClick();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-violet-500/20 tracking-wide transition-all active:scale-[0.98]"
            >
              CONNECT COLLEGE ID
            </button>
          ) : (
            <div className="rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 overflow-hidden">
              {/* User info row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 overflow-hidden">
                  {user?.profilePicture
                    ? <img src={user.profilePicture} alt="avatar" className="w-full h-full object-cover" />
                    : getInitials()
                  }
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="text-indigo-900 dark:text-white font-bold text-sm truncate">
                    {user.fullName || user.name || "Student"}
                  </div>
                  <div className="text-[11px] text-indigo-900/40 dark:text-white/40 truncate font-mono">
                    {user.enrollmentNumber || user.email}
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full py-3 border-t border-black/5 dark:border-white/5 bg-red-500/[0.06] hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <LogOutIcon /> LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar