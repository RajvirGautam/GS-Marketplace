import React, { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import NotificationBell from '../ui/NotificationBell'
import Avatar from '../ui/Avatar'
import { showInfo } from '../../utils/toast'

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

// ── Mobile nav card icons ────────────────────────────────────────────────────
const MarketplaceIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const MessagesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MobileNavItem = ({ path, onClick, icon, label, active, badge }) => {
  const content = active ? (
    <div className="flex items-center gap-2 bg-white/20 dark:bg-white/15 px-3.5 py-1.5 rounded-full text-white shadow-inner transition-all duration-300 backdrop-blur-md">
      <div className="shrink-0">{icon}</div>
      <span className="text-[12px] font-semibold tracking-wide">{label}</span>
    </div>
  ) : (
    <div className="relative p-2 text-white/50 hover:text-white transition-colors duration-300 flex items-center justify-center">
      <div className="shrink-0">{icon}</div>
      {badge > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#1c1c1c]" />
      )}
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="shrink-0 block flex-1 flex justify-center">{content}</button>;
  }
  return <Link to={path} className="shrink-0 block flex-1 flex justify-center">{content}</Link>;
};
// ────────────────────────────────────────────────────────────────────────────

const Navbar = ({ isDark, toggleTheme, onConnectClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navRef = useRef(null)
  const dropdownRef = useRef(null)
  const mobileDropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadCount } = useSocket()

  // Guard: show toast if not logged in when clicking Dashboard
  const handleDashboardClick = (e) => {
    if (!user) {
      e.preventDefault();
      showInfo('Login Required', 'Login to view your dashboard!');
    }
  };

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
      const isOutsideDesktop = dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target);
      
      if (isOutsideDesktop && isOutsideMobile) {
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
      const endWidth = isMobile ? 95 : 100; // 100% full width on desktop!
      const currentWidth = startWidth + ((endWidth - startWidth) * ratio);

      // Desktop: pill is offset right-of-center; mobile: perfectly centered
      const startOffset = isMobile ? 0 : 72;
      const currentOffset = startOffset * (1 - ratio);
      const currentLeft = `calc(50% - ${currentOffset}px)`;

      // Mobile: start slightly lower to clear ticker (~36px) and have breathing room
      const topStart = isMobile ? 52 : 65;
      const topEnd = isMobile ? 12 : 0; // Stick to top on desktop
      const currentTop = topStart - ((topStart - topEnd) * ratio);

      const currentRadius = isMobile ? 24 : 65 - (65 * ratio); // Go square on desktop

      const el = navRef.current;
      el.style.left = currentLeft;
      el.style.width = `${currentWidth}%`;
      el.style.top = `${currentTop}px`;
      el.style.borderRadius = `${currentRadius}px`;
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
        flex items-center px-1.5 md:px-6 py-1.5 md:py-2
        justify-between md:justify-between
        rounded-full
        
        /* --- GLASSY EFFECT STYLES --- */
        bg-black/20 dark:bg-black/40 md:bg-white/10 dark:md:bg-black/20
        backdrop-blur-xl
        border border-white/10 dark:border-white/10 md:dark:border-white/10
        /* --------------------------- */
        
        shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.4)]
        transition-[background-color,box-shadow,border-color] duration-200 ease-out
        hover:md:bg-white/20 dark:hover:md:bg-white/5
      `}
    >
      {/* Background gradient for the logo */}
      <div
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(59,130,246,1)_0%,rgba(59,130,246,0)_20%)]"
        style={{ borderRadius: 'inherit' }}
      ></div>

      {/* ===== DESKTOP MENU ===== */}
      <div className="relative z-10 hidden md:flex items-center justify-between w-full">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 pl-2">
          <img src="https://res.cloudinary.com/rajvirgautam/image/upload/v1773618022/CampusMarketplace-removebg-preview_kutxp3.png" alt="Campus Marketplace" className="h-8 w-auto" />
          <span className="font-['Montserrat'] font-black text-white uppercase tracking-tighter leading-none mt-1" style={{ fontSize: '0.9rem' }}>
            Campus <br /> Marketplace
          </span>
        </Link>

        {/* Desktop Links & Actions */}
        <div className="flex items-center gap-6 text-sm font-bold text-indigo-900 dark:text-slate-200">
          <Link to="/marketplace" className="hover:text-fuchsia-600 dark:hover:text-cyan-400 transition-colors drop-shadow-sm">Marketplace</Link>
          <Link to="/dashboard" onClick={handleDashboardClick} className="hover:text-fuchsia-600 dark:hover:text-cyan-400 transition-colors drop-shadow-sm">Dashboard</Link>
          <div className="h-4 w-[1px] bg-indigo-950/10 dark:bg-white/10 mx-1"></div>
          {user && (
            <Link to="/chat" className="relative p-2 rounded-full border border-transparent bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-indigo-800 dark:text-slate-200 ring-1 ring-inset ring-black/5 dark:ring-white/10 transition-colors" title="Messages">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md shadow-fuchsia-500/40 ring-2 ring-black/20 animate-pulse">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </Link>
          )}
          {user && <NotificationBell dark={false} />}
          {!user ? (
            <button onClick={onConnectClick} className="py-2 px-5 text-xs bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-bold rounded-full shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform">CONNECT ID</button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/15 hover:border-black/20 dark:hover:border-white text-indigo-900 dark:text-white transition-all backdrop-blur-md cursor-pointer">
                  <Avatar src={user?.profilePicture} name={user?.fullName || user?.name || user?.email} size={28} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <span className="text-xs font-bold tracking-wide">{getDisplayName()}</span>
                  <div className={`opacity-50 group-hover:opacity-100 transition-all duration-200 ${showUserMenu ? 'rotate-180' : ''}`}><ChevronDown /></div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-3 w-60 rounded-xl bg-[#0F0F0F] border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                    <div className="p-4 border-b border-white/10">
                      <div className="text-[9px] text-white/40 font-mono uppercase mb-1 tracking-widest">Account</div>
                      <div className="text-sm text-white font-bold truncate">{user.fullName || user.name || "Student"}</div>
                      {user.enrollmentNumber && <div className="text-[10px] text-cyan-400 font-mono mt-1">{user.enrollmentNumber}</div>}
                    </div>
                    <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="block w-full px-4 py-3 text-xs font-mono uppercase font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left tracking-wide">View Dashboard</Link>
                    <button onClick={() => { logout(); navigate('/'); }} className="block w-full text-left px-4 py-3 text-xs font-mono uppercase font-bold text-red-500 hover:bg-white/5 transition-colors tracking-wide">LOGOUT</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MOBILE MENU (DOCK STYLE) ===== */}
      <div className="relative z-10 flex md:hidden items-center justify-evenly w-full px-1">
        <Link to="/" className="shrink-0 flex-1 flex flex-col justify-center items-center p-1 gap-1">
          <img src="https://res.cloudinary.com/rajvirgautam/image/upload/v1773618022/CampusMarketplace-removebg-preview_kutxp3.png" alt="Campus Marketplace" className="h-5 w-auto brightness-0 invert" />

        </Link>
        <MobileNavItem path="/marketplace" active={location.pathname === '/marketplace'} icon={<MarketplaceIcon className="w-[20px] h-[20px]" />} label="Market" />
        <MobileNavItem
          path="/dashboard"
          onClick={!user ? (e) => { e.preventDefault(); showInfo('Login Required', 'Login to view your dashboard!'); } : undefined}
          active={location.pathname === '/dashboard'}
          icon={<DashboardIcon className="w-[20px] h-[20px]" />}
          label="Dash"
        />

        {user ? (
          <>
            <MobileNavItem path="/chat" active={location.pathname === '/chat'} icon={<MessagesIcon className="w-[20px] h-[20px]" />} label="Chat" badge={unreadCount} />
            <div className="shrink-0 flex-1 flex justify-center items-center scale-90 opacity-90 mx-0.5 text-white/50 hover:text-white transition-colors">
              <NotificationBell dark={true} />
            </div>
            {/* Minimal Avatar for Logout toggle */}
            <div ref={mobileDropdownRef} className="relative pr-1 flex-1 flex justify-center">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-0.5 rounded-full border border-transparent dark:border-white/10 shadow-sm active:scale-95 transition-transform" title="Account">
                <Avatar src={user?.profilePicture} name={user?.fullName || user?.name || user?.email} size={30} style={{ fontSize: '12px', fontWeight: 'bold' }} />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-[120%] mt-2 w-36 rounded-xl bg-white/10 backdrop-blur-2xl dark:bg-[#1c1c1c]/90 border border-white/20 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden z-50">
                  <button onClick={() => { logout(); navigate('/'); setShowUserMenu(false); }} className="w-full text-center px-4 py-3 text-sm font-bold text-red-400 hover:bg-white/10 transition-colors tracking-wide">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <MobileNavItem path="#connect" onClick={onConnectClick} icon={<UserIcon className="w-[20px] h-[20px]" />} label="Connect" />
        )}
      </div>
    </nav>
  )
}

export default Navbar