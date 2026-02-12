import { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext' // Import your auth context

const Navbar = ({ isDark, toggleTheme, onConnectClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef(null)
  const { user, logout } = useAuth() // Get user and logout from your auth context

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

      const currentTop = 55 - (55 * ratio)
      const currentRadius = 55 - (55 * ratio)
      
      const minOpacity = 0.25
      const maxOpacity = 0.85
      const currentOpacity = minOpacity + ((maxOpacity - minOpacity) * ratio)

      const lightBg = `rgba(255, 255, 255, ${currentOpacity})`
      const darkBg = `rgba(0, 0, 0, ${currentOpacity})`

      const lightBorder = `rgba(255, 255, 255, ${0.4 - (0.2 * ratio)})`
      const darkBorder = `rgba(255, 255, 255, ${0.15 - (0.1 * ratio)})`

      const el = navRef.current
      el.style.left = currentLeft
      el.style.width = `${currentWidth}%`
      el.style.top = `${currentTop}px`
      el.style.borderTopLeftRadius = `${currentRadius}px`
      el.style.borderTopRightRadius = `${currentRadius}px`
      el.style.borderBottomLeftRadius = `${currentRadius}px`
      el.style.borderBottomRightRadius = `${currentRadius}px`
      el.style.backgroundColor = isDark ? darkBg : lightBg
      el.style.borderColor = isDark ? darkBorder : lightBorder
    }

    window.addEventListener('scroll', handleUpdate, { passive: true })
    window.addEventListener('resize', handleUpdate)
    
    handleUpdate()

    return () => {
      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [isDark])

  return (
    <nav
      ref={navRef}
      className={`
        fixed z-50 left-1/2 -translate-x-1/2 top-6
        flex items-center justify-between px-10 py-2
        rounded-full
        bg-white/5 
        backdrop-blur-xl
        border border-white/20
        shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.6)]
        transition-colors duration-200 ease-out
        hover:bg-white/10 
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.9)]
      `}
    >
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-violet-700 dark:from-cyan-500 dark:to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
          <Icons.Zap />
        </div>
        <span className="text-xl md:text-2xl font-black text-indigo-950 dark:text-white tracking-tighter whitespace-nowrap">
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
        <a
          href="#"
          className="hover:text-fuchsia-600 dark:hover:text-cyan-400 transition-colors drop-shadow-sm"
        >
          About
        </a>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-indigo-800 dark:text-yellow-300 ring-1 ring-black/5 dark:ring-white/10 transition-colors"
        >
          {isDark ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        {/* Auth Buttons */}
        {!user ? (
          <button 
            onClick={onConnectClick}
            className="py-1.5 px-5 text-xs bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-bold rounded-lg shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform"
          >
            CONNECT ID
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-700 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <span className="text-sm">{user.name || user.email}</span>
            </div>
            <button
              onClick={logout}
              className="py-1.5 px-4 text-xs bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-3 md:hidden">
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
        <div className="absolute top-[calc(100%+10px)] left-0 w-full p-4 rounded-2xl glass border border-white/20 flex flex-col gap-4 md:hidden animate-fade-in-up bg-white/60 dark:bg-black/80 backdrop-blur-2xl">
          <Link
            to="/marketplace"
            className="text-indigo-900 dark:text-white font-bold text-lg"
            onClick={() => setIsOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            to="/dashboard"
            className="text-indigo-900 dark:text-white font-bold text-lg"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <a
            href="#"
            className="text-indigo-900 dark:text-white font-bold text-lg"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          
          {/* Auth Mobile */}
          {!user ? (
            <button 
              onClick={() => {
                setIsOpen(false);
                onConnectClick();
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-violet-700 text-white font-bold rounded-lg"
            >
              CONNECT COLLEGE ID
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-700 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <span className="text-indigo-900 dark:text-white font-bold">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav> 
  )
}

export default Navbar