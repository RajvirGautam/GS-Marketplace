import React, { useState, useEffect, useRef } from 'react';
import Icons from '../../assets/icons/Icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import NotificationBell from '../ui/NotificationBell';

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
const DMIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
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
// -------------------

const Navbar = ({ isDark, toggleTheme, onConnectClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useSocket();
  const isHomePage = location.pathname === '/';

  const getDisplayName = () => {
    if (!user) return "";
    const rawName = user.fullName || user.name || user?.email?.split('@')[0];
    return rawName ? rawName.split(' ')[0] : "Student";
  };

  const getInitials = () => {
    if (!user) return "U";
    const rawName = user.fullName || user.name || user.email;
    return rawName ? rawName.charAt(0).toUpperCase() : "U";
  };

  // Click outside user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll for dynamic sizing & blur (increasing size/width on scroll)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <nav
        className={`fixed z-[10050] left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-center
          ${scrolled
            ? 'top-0 w-full h-16 rounded-none bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 shadow-2xl'
            : `${isHomePage ? 'top-12 sm:top-16' : 'top-4'} w-[92%] max-w-7xl h-14 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/30 dark:hover:bg-black/30`
          }
        `}
      >
        <div className={`flex items-center justify-between h-full transition-all duration-500 ${scrolled ? 'px-6 md:px-10' : 'px-4 md:px-6'}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className={`flex items-center justify-center rounded-[10px] transform transition-transform duration-300 group-hover:scale-105 shadow-xl shadow-cyan-500/20 text-white ${scrolled ? 'w-10 h-10 bg-gradient-to-tr from-cyan-500 to-violet-600' : 'w-9 h-9 bg-gradient-to-tr from-cyan-600 to-violet-700'}`}>
              <Icons.Zap />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter whitespace-nowrap hidden sm:inline transition-colors">
              SGSITS<span className="text-cyan-600 dark:text-cyan-400">.MKT</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wide">
              Marketplace
            </Link>
            <Link to="/dashboard" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wide">
              Dashboard
            </Link>

            <div className="h-4 w-[1px] bg-slate-900/10 dark:bg-white/10 mx-2"></div>

            {/* Quick Actions */}
            {user && (
              <Link to="/chat" className="relative p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors group">
                <DMIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse group-hover:scale-110 transition-transform">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {user && <NotificationBell dark={isDark} />}

            <button onClick={toggleTheme} className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-700 dark:text-yellow-300 transition-colors">
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>

            {/* Auth section */}
            {!user ? (
              <button onClick={onConnectClick} className="ml-2 py-2 px-6 text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full shadow-xl hover:scale-105 transition-transform tracking-wider">
                CONNECT ID
              </button>
            ) : (
              <div className="relative ml-2 flex items-center gap-3" ref={dropdownRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all text-slate-800 dark:text-white">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white text-[10px] font-bold shadow-inner overflow-hidden">
                    {user?.profilePicture ? <img src={user.profilePicture} alt="avatar" className="w-full h-full object-cover" /> : getInitials()}
                  </div>
                  <span className="text-xs font-bold tracking-wide">{getDisplayName()}</span>
                  <div className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}>
                    <ChevronDown />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-white/90 dark:bg-[#0c0c14]/90 border border-black/5 dark:border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono text-center uppercase tracking-widest mb-1">Signed in as</div>
                      <div className="text-sm text-slate-800 dark:text-white font-bold text-center truncate">{user.fullName || "Student"}</div>
                    </div>
                    <div className="p-2">
                      <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all">
                        <DashboardIcon /> User Dashboard
                      </Link>
                      <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-4 py-2.5 mt-1 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOutIcon /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <>
                <Link to="/chat" className="relative p-2 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-200">
                  <DMIcon />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-gradient-to-br from-fuchsia-500 to-red-500 text-white text-[8px] font-black flex items-center justify-center animate-pulse shadow-md ring-2 ring-white dark:ring-black">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <NotificationBell dark={isDark} />
              </>
            )}

            {!user && (
              <button onClick={onConnectClick} className="py-1.5 px-4 text-[10px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-full shadow-lg tracking-widest">
                CONNECT
              </button>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="p-2 ml-1 rounded-full bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white transition-all active:scale-95">
              <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[1px]' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 absolute ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[1px]' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE FULLSCREEN MENU ── */}
      <div
        className={`fixed inset-0 z-[8000] bg-white/70 dark:bg-[#0c0c14]/80 backdrop-blur-3xl transition-all duration-500 md:hidden flex flex-col pt-24 px-6 pb-8
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none delay-200'}
        `}
      >
        <div className={`flex flex-col flex-1 gap-2 transition-all duration-700 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">MENU</h2>
            <button onClick={toggleTheme} className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-yellow-400 shadow-inner">
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>

          <Link to="/marketplace" className="group flex items-center p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <MarketIcon />
            </div>
            <div className="ml-4 flex-1">
              <div className="font-bold text-slate-900 dark:text-white text-lg tracking-wide">Marketplace</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Discover & buy products</div>
            </div>
          </Link>

          <Link to="/dashboard" className="group flex items-center p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <DashboardIcon />
            </div>
            <div className="ml-4 flex-1">
              <div className="font-bold text-slate-900 dark:text-white text-lg tracking-wide">Dashboard</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Manage your deals & items</div>
            </div>
          </Link>

          {user && (
            <Link to="/chat" className="group flex items-center p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm active:scale-[0.98] transition-all relative">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform">
                <DMIcon />
              </div>
              <div className="ml-4 flex-1">
                <div className="font-bold text-slate-900 dark:text-white text-lg tracking-wide">Messages</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Continue negotiations</div>
              </div>
              {unreadCount > 0 && (
                <div className="mr-2 px-3 py-1 rounded-full bg-fuchsia-500 text-white font-black text-sm shadow-md">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </Link>
          )}

          <div className="mt-auto"></div>

          {/* User Section Bottom */}
          {user ? (
            <div className="mt-12 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#7C3AED] flex items-center justify-center text-white font-black text-xl shadow-inner overflow-hidden">
                  {user?.profilePicture ? <img src={user.profilePicture} alt="avatar" className="w-full h-full object-cover" /> : getInitials()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-slate-900 dark:text-white font-bold text-lg truncate">{user.fullName || "Student"}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.enrollmentNumber || user.email}</div>
                </div>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="w-full py-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                <LogOutIcon /> SIGN OUT
              </button>
            </div>
          ) : (
            <button onClick={() => { setIsOpen(false); onConnectClick(); }} className="mt-12 w-full py-5 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm tracking-widest shadow-2xl active:scale-[0.98] transition-transform">
              CONNECT COLLEGE ID
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;