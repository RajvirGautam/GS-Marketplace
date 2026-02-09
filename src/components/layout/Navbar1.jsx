import { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import NeonButton from '../ui/NeonButton'

const Navbar = ({ isDark, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef(null)
  const navContentRef = useRef(null)

  useEffect(() => {
    const handleUpdate = () => {
      if (!navRef.current) return

      const scrollY = window.scrollY
      const maxScroll = 150 // Pixel threshold to complete animation
      
      // Calculate normalized scroll progress (0 to 1)
      let ratio = scrollY / maxScroll
      if (ratio > 1) ratio = 1
      if (ratio < 0) ratio = 0

      // --- Geometry Interpolation ---
      // Width: Starts at 55% (desktop), ends at 100%
      const startWidth = window.innerWidth < 768 ? 90 : 50
      const endWidth = 100
      const currentWidth = startWidth + ((endWidth - startWidth) * ratio)
      
      // Top Position: Starts at 24px, ends at 0px
      const currentTop = 24 - (24 * ratio)
      
      // Border Radius: Starts at 999px (pill), ends at 0px (rect)
      const currentRadius = 50 - (50 * ratio)
      
      // Background Opacity: Becomes solid black/glass on scroll
      const bgOpacity = 0.1 + (0.8 * ratio) // 10% to 90% opacity

      const el = navRef.current
      
      // Apply CSS transformations
      el.style.width = `${currentWidth}%`
      el.style.top = `${currentTop}px`
      el.style.borderBottomLeftRadius = `${currentRadius}px`
      el.style.borderBottomRightRadius = `${currentRadius}px`
      el.style.borderTopLeftRadius = `${currentRadius}px`
      el.style.borderTopRightRadius = `${currentRadius}px`
      
      // Dynamic Background: Deep Space Black with increasing opacity
      el.style.backgroundColor = `rgba(3, 0, 20, ${bgOpacity})`
      el.style.borderBottom = `1px solid rgba(255, 255, 255, ${0.1 + (0.1 * ratio)})`
      
      // Remove border from sides when full width
      if (ratio === 1) {
          el.style.borderLeft = 'none'
          el.style.borderRight = 'none'
          el.style.borderTop = 'none'
      } else {
          el.style.border = '1px solid rgba(255, 255, 255, 0.1)'
      }
    }

    window.addEventListener('scroll', handleUpdate, { passive: true })
    window.addEventListener('resize', handleUpdate)
    handleUpdate() // Initial call

    return () => {
      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [])

  return (
    <nav
      ref={navRef}
      className={`
        fixed z-50 left-1/2 -translate-x-1/2
        flex items-center justify-between
        backdrop-blur-md shadow-2xl transition-shadow duration-300
        overflow-hidden
      `}
      style={{ height: '70px' }} // Fixed height for consistency
    >
      <div className="w-full h-full px-6 md:px-10 flex items-center justify-between relative">
        
        {/* 1. Logo Section (Left) */}
        <div className="flex items-center gap-2 flex-shrink-0 z-20">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Icons.Zap size={18} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">
            SGSITS<span className="text-cyan-400">.MKT</span>
          </span>
        </div>

        {/* 2. Navigation Links (Absolute Center) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {['Marketplace', 'Categories', 'Community', 'About'].map((item) => (
            <a 
                key={item} 
                href="#" 
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-200 tracking-wide"
            >
                {item}
            </a>
            ))}
        </div>

        {/* 3. Actions (Right) */}
        <div className="hidden md:flex items-center gap-4 z-20">
          <button 
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isDark ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
          </button>
          
          <a href="#" className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
              Log in
          </a>
          <NeonButton primary className="!py-2 !px-6 !text-xs !rounded-full">
            Sign up
          </NeonButton>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden z-20">
          <button 
            className="text-white" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4 md:hidden animate-fade-in-up">
          {['Marketplace', 'Categories', 'About'].map((item) => (
            <a key={item} href="#" className="text-slate-200 font-bold text-lg">{item}</a>
          ))}
          <NeonButton primary className="w-full justify-center">Connect ID</NeonButton>
        </div>
      )}
    </nav>
  )
}

export default Navbar