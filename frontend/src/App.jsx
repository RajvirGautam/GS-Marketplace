import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProductPage from './components/sections/ProductPage'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import Categories from './components/sections/Categories'
import RecentListings from './components/sections/RecentListings'
import CTA from './components/sections/CTA'
import Marketplace from './components/sections/Marketplace'
import UserDashboard from './components/sections/UserDashboard'
import ConnectIdModal from './components/auth/ConnectIdModal'
import AuthCallback from './pages/AuthCallback'
import VerificationGuard from './components/auth/VerificationGuard' // ← ADD THIS

function App() {
  const [theme, setTheme] = useState('dark')
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  // HOME PAGE WITH NAVBAR
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
    <AuthProvider>
      <Router>
        <div className="min-h-screen app-background font-sans selection:bg-cyan-200 selection:text-cyan-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>

          {/* Footer stays global */}
          <Footer />

          {/* Manual login modal (for login button clicks) */}
          <ConnectIdModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
          />

          {/* Auto verification modal (for unverified users) - ADD THIS */}
          <VerificationGuard />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App