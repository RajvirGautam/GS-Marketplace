import { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import Categories from './components/sections/Categories'
import RecentListings from './components/sections/RecentListings'
import CTA from './components/sections/CTA'
// 1. IMPORT THE MODAL
import ConnectIdModal from './components/auth/ConnectIdModal'

function App() {
  const [theme, setTheme] = useState('dark')
  
  // 2. CREATE THE STATE TO OPEN/CLOSE IT
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (
    <div className="min-h-screen app-background font-sans selection:bg-cyan-200 selection:text-cyan-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200">
      
      {/* 3. PASS THE OPENER FUNCTION TO NAVBAR */}
      <Navbar 
        isDark={theme === 'dark'} 
        toggleTheme={toggleTheme} 
        onConnectClick={() => {
            console.log("Connect Clicked!"); // Debugging log
            setIsLoginOpen(true);
        }}
      />

      <Hero />
      <Features />
      <Categories />
      <RecentListings />
      <CTA />
      <Footer />
      
      {/* 4. RENDER THE MODAL */}
      <ConnectIdModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        isDark={theme === 'dark'}
      />
    </div>
  )
}

export default App