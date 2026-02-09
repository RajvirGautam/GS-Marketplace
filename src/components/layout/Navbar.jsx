import { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import NeonButton from '../ui/NeonButton'

const Navbar = ({ isDark, toggleTheme, onConnectClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef(null)

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
      const currentTop = 24 - (24 * ratio)
      const currentRadius = 24 - (24 * ratio)
      
      const minOpacity = 0.25
      const maxOpacity = 0.85
      const currentOpacity = minOpacity + ((maxOpacity - minOpacity) * ratio)

      const lightBg = `rgba(255, 255, 255, ${currentOpacity})`
      const darkBg = `rgba(3, 0, 20, ${currentOpacity})`

      const lightBorder = `rgba(255, 255, 255, ${0.4 - (0.2 * ratio)})`
      const darkBorder = `rgba(255, 255, 255, ${0.15 - (0.1 * ratio)})`

      const el = navRef.current
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
        /* Positioning & Layout */
        fixed z-50 left-1/2 -translate-x-1/2 top-6
        flex items-center justify-between px-8 py-4
        
        /* Shape */
        rounded-full
        
        /* The Material (Base) */
        bg-gray-50/10 /* Very faint white tint */
        backdrop-blur-xl /* Heavy blurring for depth */
        
        /* The Edges (Simulating 3D Glass) */
        border border-white/20 /* Subtle outer definition */
        
        /* THE LIGHTING ENGINE */
        shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.6)]
        
        /* Interaction */
        transition-all duration-100 ease-out
        hover:bg-gray-50/20 
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.9)]
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-violet-700 dark:from-cyan-500 dark:to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
          <Icons.Zap />
        </div>
        <span className="text-xl md:text-2xl font-black text-indigo-950 dark:text-white tracking-tighter whitespace-nowrap">
          SGSITS<span className="text-cyan-700 dark:text-cyan-400">.MKT</span>
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-sm font-bold text-indigo-900 dark:text-slate-200">
        {['Marketplace', 'Categories', 'About'].map((item) => (
          <a
            key={item}
            href="#"
            className="hover:text-fuchsia-600 dark:hover:text-cyan-400 transition-colors drop-shadow-sm"
          >
            {item}
          </a>
        ))}
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-indigo-800 dark:text-yellow-300 ring-1 ring-black/5 dark:ring-white/10 transition-colors"
        >
          {isDark ? <Icons.Sun /> : <Icons.Moon />}
        </button>

        {/* Desktop Connect Button */}
        <NeonButton 
            primary 
            className="!py-1.5 !px-5 !text-xs shadow-lg shadow-violet-500/20"
            onClick={onConnectClick}
        >
          Connect ID
        </NeonButton>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-indigo-100/50 dark:bg-white/5 text-indigo-900 dark:text-yellow-300 backdrop-blur-md"
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
          {['Marketplace', 'Categories', 'About', 'Safety'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-indigo-900 dark:text-white font-bold text-lg"
            >
              {item}
            </a>
          ))}
          {/* Mobile Connect Button */}
          <NeonButton 
            primary 
            className="w-full justify-center"
            onClick={() => {
                setIsOpen(false);
                onConnectClick();
            }}
          >
            Connect College ID
          </NeonButton>
        </div>
      )}
    </nav> 
  )
}

export default Navbar