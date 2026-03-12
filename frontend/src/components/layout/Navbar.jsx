import React, { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import NotificationBell from '../ui/NotificationBell'
import Avatar from '../ui/Avatar'

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

// ── Mobile nav card icons ────────────────────────────────────────────────────
const MarketplaceIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const DashboardIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const MessagesIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
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

  // Scroll animation (SHAPE AND POSITION ONLY)
  useEffect(() => {
    let ticking = false;

    const updateNav = () => {
      if (!navRef.current) return;

      const scrollY = window.scrollY;
      const maxScroll = 200;
      let ratio = scrollY / maxScroll;
      if (ratio > 1) ratio = 1;
      if (ratio < 0) ratio = 0;

      const isMobile = window.innerWidth < 768;

      const startWidth = isMobile ? 92 : 55;
      const endWidth = 100;
      const currentWidth = startWidth + ((endWidth - startWidth) * ratio);

      // Desktop: pill is offset right-of-center; mobile: perfectly centered
      const startOffset = isMobile ? 0 : 72;
      const currentOffset = startOffset * (1 - ratio);
      const currentLeft = `calc(50% - ${currentOffset}px)`;

      // Mobile: start just below the ticker bar (~36px); desktop: start lower
      const topStart = isMobile ? 48 : 65;
      const currentTop = topStart - (topStart * ratio);
      const currentRadius = 65 - (65 * ratio);

      const el = navRef.current;
      el.style.left = currentLeft;
      el.style.width = `${currentWidth}%`;
      el.style.top = `${currentTop}px`;
      el.style.borderTopLeftRadius = `${currentRadius}px`;
      el.style.borderTopRightRadius = `${currentRadius}px`;
      el.style.borderBottomLeftRadius = `${currentRadius}px`;
      el.style.borderBottomRightRadius = `${currentRadius}px`;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNav();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    // Trigger once on mount to set initial shape
    updateNav();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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
        transition-[background-color,box-shadow,border-color] duration-200 ease-out
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
          Campus<span className="text-cyan-700 dark:text-cyan-400">.MKT</span>
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
                <Avatar
                  src={user?.profilePicture}
                  name={user?.fullName || user?.name || user?.email}
                  size={28}
                  style={{ fontSize: '12px', fontWeight: 'bold' }}
                />
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
      <div className="flex items-center gap-2 md:hidden">
        {/* Quick-access icons for logged-in users */}
        {user && (
          <>
            <Link
              to="/chat"
              className="relative p-2 rounded-full bg-black/5 dark:bg-white/10 text-indigo-800 dark:text-slate-200 ring-1 ring-inset ring-black/5 dark:ring-white/10"
            >
              <DMIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-[3px] rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[8px] font-black flex items-center justify-center ring-1 ring-black/20 animate-pulse">
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
            className="py-1.5 px-3 text-[10px] bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-bold rounded-lg"
          >
            CONNECT
          </button>
        )}

        <button
          className="p-2 rounded-full bg-black/5 dark:bg-white/10 ring-1 ring-inset ring-black/5 dark:ring-white/10 text-indigo-950 dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-full rounded-3xl border border-white/20 dark:border-white/10 overflow-hidden bg-white/75 dark:bg-[#0d0d18]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] animate-fade-in-up">

          {/* Nav Cards Grid */}
          <div className="p-3 grid grid-cols-2 gap-2">
            <Link
              to="/marketplace"
              onClick={() => setIsOpen(false)}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                <MarketplaceIcon />
              </div>
              <span className="text-sm font-black text-indigo-900 dark:text-white tracking-tight">Marketplace</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-violet-500/10 dark:hover:bg-violet-500/10 hover:border-violet-500/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                <DashboardIcon />
              </div>
              <span className="text-sm font-black text-indigo-900 dark:text-white tracking-tight">Dashboard</span>
            </Link>

            {user && (
              <Link
                to="/chat"
                onClick={() => setIsOpen(false)}
                className="group col-span-2 flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-fuchsia-500/10 dark:hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/25 shrink-0 group-hover:scale-110 transition-transform">
                  <MessagesIcon />
                </div>
                <span className="text-sm font-black text-indigo-900 dark:text-white tracking-tight flex-1">Messages</span>
                {unreadCount > 0 && (
                  <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-fuchsia-500/40 animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="mx-3 h-px bg-black/5 dark:bg-white/10" />

          {/* Auth Section */}
          <div className="p-3">
            {!user ? (
              <button
                onClick={() => { setIsOpen(false); onConnectClick(); }}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-black rounded-2xl shadow-lg shadow-violet-500/30 text-sm tracking-wide hover:opacity-90 transition-opacity"
              >
                CONNECT COLLEGE ID
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <Avatar
                  src={user?.profilePicture}
                  name={user?.fullName || user?.name || user?.email}
                  size={40}
                />
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-indigo-900 dark:text-white font-bold text-sm truncate">
                    {user.fullName || user.name || "Student"}
                  </div>
                  <div className="text-[11px] text-indigo-900/50 dark:text-white/40 truncate font-mono">{user.email}</div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); logout(); navigate('/'); }}
                  className="shrink-0 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/15 transition-colors"
                  title="Logout"
                >
                  <LogOutIcon />
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  )
}

export default Navbar