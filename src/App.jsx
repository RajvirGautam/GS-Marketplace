import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import ProductPage from './components/sections/ProductPage'

import Footer from './components/layout/Footer'

import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import Categories from './components/sections/Categories'
import RecentListings from './components/sections/RecentListings'
import CTA from './components/sections/CTA'
import Marketplace from './components/sections/Marketplace'

import ConnectIdModal from './components/auth/ConnectIdModal'

function App() {
  const [theme, setTheme] = useState('dark')
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  // ✅ HOME PAGE (WITH NAVBAR)
  const HomePage = () => (
    <>
      <Navbar
        isDark={theme === 'dark'}
        toggleTheme={toggleTheme}
        onConnectClick={() => setIsLoginOpen(true)}
      />

      <Hero />
      <Features />
      <Categories />
      <RecentListings />
      <CTA />
    </>
  )

  return (
    <Router>
      <div className="min-h-screen app-background font-sans selection:bg-cyan-200 selection:text-cyan-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200">
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductPage />} />


        </Routes>

        {/* Footer stays global */}
        <Footer />

        {/* Modal works everywhere */}
        <ConnectIdModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          isDark={theme === 'dark'}
        />
      </div>
    </Router>
  )
}

export default App