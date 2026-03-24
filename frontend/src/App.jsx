import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { OnboardingProvider } from './context/OnboardingContext'
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
import DarkVeil from './components/ui/DarkVeil'
import ConnectIdModal from './components/auth/ConnectIdModal'
import AuthCallback from './pages/AuthCallback'
import VerificationGuard from './components/auth/VerificationGuard'
import SellerProfile from './components/sections/SellerProfile'
import Chat from './components/sections/Chat'
import ChatNotificationToast from './components/ui/ChatNotificationToast'
import OnboardingOverlay from './components/ui/OnboardingOverlay'
import { Toaster } from 'react-hot-toast'

// Only show footer on non-chat and product pages
function ConditionalFooter() {
  const location = useLocation()
  if (location.pathname.startsWith('/chat') || location.pathname.startsWith('/product')) return null
  return <Footer />
}

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
      <div className="relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="sticky top-0 w-full h-screen overflow-hidden">
            <DarkVeil
              hueShift={0}
              noiseIntensity={0.04}
              scanlineIntensity={0}
              speed={1.0}
              scanlineFrequency={0}
              warpAmount={0.5}
              resolutionScale={1}
            />
          </div>
        </div>
        <div className="relative z-10">
          <Hero />
          <Features />
        </div>
      </div>

      <CTA />
    </>
  )

  return (
    <AuthProvider>
      <Router>
        <SocketProvider>
          <OnboardingProvider>
          <div className="min-h-screen app-background font-sans selection:bg-cyan-200 selection:text-cyan-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/seller/:id" element={<SellerProfile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
            </Routes>

            {/* Footer hidden on /chat and /product routes */}
            <ConditionalFooter />

            {/* Manual login modal */}
            <ConnectIdModal
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
            />

            {/* Auto verification modal */}
            <VerificationGuard />

            {/* 🔴 Global real-time chat toast notifications */}
            <ChatNotificationToast />

            {/* Onboarding tour overlay */}
            <OnboardingOverlay />

            {/* Global toast renderer */}
            <Toaster
              position="bottom-center"
              gutter={12}
              containerStyle={{ zIndex: 99999 }}
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#0A0A12',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8)',
                  borderRadius: '20px',
                  padding: '0',
                  maxWidth: '400px',
                  width: '360px',
                  color: '#fff',
                  fontFamily: '"Manrope", sans-serif',
                },
              }}
            />
          </div>
          </OnboardingProvider>
        </SocketProvider>
      </Router>
    </AuthProvider>
  )
}

export default App