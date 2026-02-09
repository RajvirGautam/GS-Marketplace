import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'

// --- Internal Icons ---
const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
)
const HeartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)
const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
)
const FlagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
)

// Mock product database — in production, fetch by ID
const PRODUCTS_DB = [
  {
    id: 1, user: "Shivani Verma", branch: "CSE", year: "4th Year", price: 8000, title: "Raspberry Pi 4 Model B",
    tag: "Electronics", category: "electronics",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80",
    ],
    accent: "#FF6B35",
    condition: "Like New", type: "For Sale",
    description: "Raspberry Pi 4 Model B with 4GB RAM. Barely used — purchased for a semester project that's now complete. Runs perfectly, no scratches or damage. Comes with the official power adapter (USB-C, 5.1V/3A), a black ABS case with fan cutout, and a 32GB microSD pre-loaded with Raspberry Pi OS. Great for IoT projects, home servers, or learning Linux. Meet on campus anytime.",
    specs: [
      { label: "Model", value: "Raspberry Pi 4B" },
      { label: "RAM", value: "4 GB LPDDR4" },
      { label: "Ports", value: "2× USB 3.0, 2× USB 2.0" },
      { label: "Connectivity", value: "Wi-Fi 5, BT 5.0, Gigabit Ethernet" },
      { label: "Video", value: "2× micro-HDMI (4K)" },
      { label: "Storage", value: "32 GB microSD included" },
    ],
    includes: ["Raspberry Pi 4B board", "Official USB-C power adapter", "ABS case with fan mount", "32 GB microSD card", "GPIO header reference card"],
    location: "Near ATC Building",
    postedAt: "2 hours ago",
    views: 145, saves: 32,
    sellerRating: 4.8, sellerListings: 7, sellerJoined: "Aug 2024",
    isTrending: true, isVerified: true,
  },
  {
    id: 2, user: "Amit Sharma", branch: "Mech", year: "3rd Year", price: 450, title: "Roller Drafter (Omega)",
    tag: "Engineering", category: "stationery",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    ],
    accent: "#00D9FF",
    condition: "Good", type: "For Sale",
    description: "Omega brand roller drafter in good working condition. Used for two semesters of Engineering Drawing. Smooth roller mechanism, no jams. Minor cosmetic scratches on the base but functionally perfect.",
    specs: [
      { label: "Brand", value: "Omega" },
      { label: "Type", value: "Roller Drafter" },
      { label: "Board Size", value: "A2 compatible" },
      { label: "Mechanism", value: "Parallel roller glide" },
    ],
    includes: ["Roller drafter unit", "Mounting clips"],
    location: "Hostel 2",
    postedAt: "5 hours ago",
    views: 78, saves: 11,
    sellerRating: 4.5, sellerListings: 3, sellerJoined: "Jan 2025",
    isTrending: false, isVerified: true,
  },
  {
    id: 3, user: "Rahul Tiwari", branch: "IT", year: "2nd Year", price: 1200, title: "Casio FX-991EX Calculator",
    tag: "Tools", category: "stationery",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?auto=format&fit=crop&w=1200&q=80",
    ],
    accent: "#F59E0B",
    condition: "New", type: "For Sale",
    description: "Brand new sealed Casio FX-991EX scientific calculator. Bought two by mistake. 552 functions, spreadsheet mode, QR code feature. Perfect for all engineering exams.",
    specs: [
      { label: "Brand", value: "Casio" },
      { label: "Model", value: "FX-991EX (ClassWiz)" },
      { label: "Functions", value: "552" },
      { label: "Display", value: "High-resolution LCD" },
      { label: "Power", value: "Solar + Battery" },
    ],
    includes: ["Calculator", "Hard case", "User manual"],
    location: "Library",
    postedAt: "12 hours ago",
    views: 203, saves: 56,
    sellerRating: 4.9, sellerListings: 2, sellerJoined: "Sep 2025",
    isTrending: true, isVerified: true,
  },
  {
    id: 4, user: "Priya Jain", branch: "EI", year: "3rd Year", price: 150, title: "Data Structures — Shivani Guide",
    tag: "Books", category: "books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
    ],
    accent: "#A855F7",
    condition: "Good", type: "For Sale",
    description: "Shivani publication guide for Data Structures. Minimal highlighting on a few pages, all pages intact. Covers arrays, linked lists, trees, graphs, sorting, and hashing. Used for RGPV exam prep — scored 78.",
    specs: [
      { label: "Publisher", value: "Shivani Publications" },
      { label: "Subject", value: "Data Structures" },
      { label: "University", value: "RGPV aligned" },
      { label: "Pages", value: "~320" },
    ],
    includes: ["Textbook only"],
    location: "Canteen Area",
    postedAt: "1 day ago",
    views: 134, saves: 28,
    sellerRating: 4.6, sellerListings: 12, sellerJoined: "Mar 2024",
    isTrending: false, isVerified: true,
  },
  {
    id: 5, user: "Neha Patel", branch: "ECE", year: "4th Year", price: 2500, title: "Arduino Mega 2560 Kit",
    tag: "Electronics", category: "electronics",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80",
    ],
    accent: "#10B981",
    condition: "Like New", type: "For Sale",
    description: "Arduino Mega 2560 Rev3 with sensor kit. Includes ultrasonic, temperature, IR, and motion sensors. USB cable included. Perfect for final year projects.",
    specs: [
      { label: "Board", value: "Arduino Mega 2560 R3" },
      { label: "Microcontroller", value: "ATmega2560" },
      { label: "Digital I/O", value: "54 pins" },
      { label: "Analog Input", value: "16 pins" },
    ],
    includes: ["Arduino Mega board", "USB cable", "5 sensor modules", "Jumper wires (40pc)", "Breadboard"],
    location: "Lab Block",
    postedAt: "3 hours ago",
    views: 102, saves: 34,
    sellerRating: 4.7, sellerListings: 5, sellerJoined: "Jun 2024",
    isTrending: true, isVerified: true,
  },
]

const ProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const canvasRef = useRef(null)

  // Fetch product
  useEffect(() => {
    const found = PRODUCTS_DB.find(p => p.id === parseInt(id))
    if (found) {
      setProduct(found)
      setActiveImage(0)
    }
    window.scrollTo(0, 0)
  }, [id])

  // Ambient glow: extract dominant color from accent and create radial gradient
  // We'll use the product accent color to simulate ambient image lighting
  const ambientStyle = useMemo(() => {
    if (!product) return {}
    const c = product.accent
    return {
      background: `
        radial-gradient(ellipse 80% 60% at 35% 40%, ${c}18 0%, transparent 70%),
        radial-gradient(ellipse 50% 50% at 70% 60%, ${c}10 0%, transparent 60%),
        radial-gradient(ellipse 120% 80% at 50% 100%, ${c}08 0%, transparent 50%),
        #0A0A0A
      `
    }
  }, [product])

  // Parallax mouse tracking on hero image
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setMousePos({ x: x * 12, y: y * 12 })
    }
    const el = heroRef.current
    if (el) {
      el.addEventListener('mousemove', handleMouseMove)
      return () => el.removeEventListener('mousemove', handleMouseMove)
    }
  }, [product])

  if (!product) {
    return (
      <div className="product-page-root min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">Product not found</h2>
          <Link to="/marketplace" className="mono text-xs text-cyan-400 hover:underline">← BACK TO MARKETPLACE</Link>
        </div>
      </div>
    )
  }

  const relatedProducts = PRODUCTS_DB.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3)
  if (relatedProducts.length < 3) {
    const others = PRODUCTS_DB.filter(p => p.id !== product.id && !relatedProducts.find(r => r.id === p.id))
    relatedProducts.push(...others.slice(0, 3 - relatedProducts.length))
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .product-page-root {
          font-family: 'Manrope', sans-serif;
          background: #0A0A0A;
          color: #fff;
          min-height: 100vh;
        }
        .mono { font-family: 'Space Mono', monospace; }

        /* Noise overlay */
        .pp-noise {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        /* Grid background */
        .pp-grid {
          position: fixed;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.015) 99px, rgba(255,255,255,0.015) 100px),
            repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.015) 99px, rgba(255,255,255,0.015) 100px);
          pointer-events: none;
          z-index: 1;
        }

        /* Stagger reveal */
        @keyframes pp-slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pp-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pp-slideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pp-slideRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pp-scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .pp-anim-up { animation: pp-slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .pp-anim-fade { animation: pp-fadeIn 0.6s ease-out forwards; opacity: 0; }
        .pp-anim-left { animation: pp-slideLeft 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .pp-anim-right { animation: pp-slideRight 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .pp-anim-scale { animation: pp-scaleIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }

        /* Image hover tilt */
        .pp-hero-img {
          transition: transform 0.15s ease-out;
        }

        /* Brutal button */
        .pp-btn-primary {
          position: relative;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 16px 32px;
          border: 2px solid #fff;
          background: #fff;
          color: #0A0A0A;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .pp-btn-primary:hover {
          transform: translate(-3px, -3px);
          box-shadow: 3px 3px 0 #fff;
        }
        .pp-btn-primary:active {
          transform: translate(0, 0);
          box-shadow: none;
        }

        .pp-btn-outline {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 16px 32px;
          border: 2px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #fff;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .pp-btn-outline:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.05);
          transform: translate(-3px, -3px);
          box-shadow: 3px 3px 0 rgba(255,255,255,0.2);
        }

        /* Thumbnail strip */
        .pp-thumb {
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0.5;
        }
        .pp-thumb:hover { opacity: 0.8; }
        .pp-thumb.active {
          border-color: currentColor;
          opacity: 1;
        }

        /* Spec row */
        .pp-spec-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .pp-spec-row:last-child { border-bottom: none; }

        /* Fullscreen overlay */
        .pp-fullscreen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
          animation: pp-fadeIn 0.3s ease-out forwards;
        }

        /* Scrollbar */
        .product-page-root::-webkit-scrollbar { width: 6px; }
        .product-page-root::-webkit-scrollbar-track { background: #0A0A0A; }
        .product-page-root::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); }

        /* Related card */
        .pp-related-card {
          background: #0F0F0F;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }
        .pp-related-card:hover {
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-4px);
        }

        /* Marquee */
        @keyframes pp-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .pp-marquee { animation: pp-marquee 20s linear infinite; }

        /* Condition badge color map */
        .cond-new { background: #10B981; color: #000; }
        .cond-likenew { background: #00D9FF; color: #000; }
        .cond-good { background: #F59E0B; color: #000; }
        .cond-acceptable { background: #EF4444; color: #fff; }
      `}</style>

      <div className="product-page-root relative" style={ambientStyle}>
        <div className="pp-noise" />
        <div className="pp-grid" />

        {/* ===== STICKY HEADER ===== */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 pp-anim-fade">
          <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/marketplace" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <ArrowLeft />
                <span className="mono text-xs hidden sm:inline">BACK</span>
              </Link>
              <div className="hidden md:block h-5 w-px bg-white/10" />
              <Link to="/">
                <span className="mono text-lg font-bold text-white hidden md:inline">
                  SGSITS<span className="text-[#00D9FF]">.MKT</span>
                </span>
              </Link>
            </div>

            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 mono text-xs text-white/40">
              <Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
              <span>/</span>
              <span className="text-white/60">{product.tag}</span>
              <span>/</span>
              <span className="text-white truncate max-w-[200px]">{product.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`w-10 h-10 flex items-center justify-center border transition-colors ${isSaved ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'}`}
              >
                <HeartIcon filled={isSaved} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors">
                <ShareIcon />
              </button>
            </div>
          </div>
        </header>

        {/* ===== HERO SECTION — EDITORIAL SPLIT ===== */}
        <section className="relative z-10 max-w-[1800px] mx-auto">
          <div className="grid grid-cols-12 min-h-[80vh]">

            {/* LEFT: Product Image */}
            <div
              ref={heroRef}
              className="col-span-12 lg:col-span-7 relative overflow-hidden bg-zinc-950 border-r border-white/5 flex items-center justify-center p-8 lg:p-16 pp-anim-scale"
              style={{ animationDelay: '0.1s' }}
            >
              {/* Ambient glow behind image */}
              <div
                className="absolute inset-0 opacity-30 blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${product.accent}40, transparent 70%)`
                }}
              />

              {/* Main image */}
              <div className="relative w-full max-w-[600px] aspect-square">
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="pp-hero-img w-full h-full object-contain relative z-10 drop-shadow-2xl"
                  style={{
                    transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                    filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))'
                  }}
                  onClick={() => setShowFullscreen(true)}
                />

                {/* Expand button */}
                <button
                  onClick={() => setShowFullscreen(true)}
                  className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all cursor-zoom-in"
                >
                  <ExpandIcon />
                </button>
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`pp-thumb w-16 h-16 overflow-hidden bg-zinc-800`}
                      style={{ borderColor: activeImage === i ? product.accent : 'transparent' }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Image counter */}
              <div className="absolute top-6 left-6 mono text-[10px] text-white/40 bg-black/40 backdrop-blur px-3 py-1 border border-white/10">
                {activeImage + 1} / {product.images.length}
              </div>

              {/* Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                {product.isTrending && (
                  <div className="bg-[#F59E0B] text-black px-3 py-1 mono text-[10px] font-bold">
                    🔥 TRENDING
                  </div>
                )}
                {product.isVerified && (
                  <div className="bg-[#00D9FF] text-black px-3 py-1 mono text-[10px] font-bold uppercase tracking-wider">
                    ✓ Verified Seller
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Product Details */}
            <div className="col-span-12 lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">

              {/* Top section */}
              <div>
                {/* Tag + Condition */}
                <div className="flex items-center gap-3 mb-6 pp-anim-up" style={{ animationDelay: '0.2s' }}>
                  <span className="mono text-[10px] px-3 py-1.5 border border-white/20 text-white/60 uppercase tracking-wider">
                    {product.tag}
                  </span>
                  <span className={`mono text-[10px] px-3 py-1.5 font-bold uppercase tracking-wider ${
                    product.condition === 'New' ? 'cond-new' :
                    product.condition === 'Like New' ? 'cond-likenew' :
                    product.condition === 'Good' ? 'cond-good' : 'cond-acceptable'
                  }`}>
                    {product.condition}
                  </span>
                  <span className="mono text-[10px] px-3 py-1.5 border border-white/10 text-white/40 uppercase">
                    {product.type}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight mb-6 pp-anim-up" style={{ animationDelay: '0.3s' }}>
                  {product.title}
                </h1>

                {/* Price */}
                <div className="mb-8 pp-anim-up" style={{ animationDelay: '0.4s' }}>
                  <div className="mono text-[10px] text-white/30 uppercase tracking-wider mb-1">Price</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black mono tracking-tight" style={{ color: product.accent }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="mono text-xs text-white/30">FIXED</span>
                  </div>
                </div>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mono mb-8 pb-8 border-b border-white/10 pp-anim-up" style={{ animationDelay: '0.45s' }}>
                  <span className="flex items-center gap-1.5">
                    <LocationIcon /> {product.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon /> {product.postedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <EyeIcon /> {product.views} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HeartIcon filled={false} /> {product.saves} saves
                  </span>
                </div>

                {/* Description */}
                <div className="mb-8 pp-anim-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="mono text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">Description</h3>
                  <p className={`text-[15px] text-white/70 leading-relaxed ${!descExpanded ? 'line-clamp-4' : ''}`}>
                    {product.description}
                  </p>
                  {product.description.length > 200 && (
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className="mono text-[10px] mt-3 underline underline-offset-4 text-white/40 hover:text-white transition-colors"
                    >
                      {descExpanded ? 'SHOW LESS' : 'READ MORE'}
                    </button>
                  )}
                </div>

                {/* Seller Card */}
                <div className="bg-white/[0.03] border border-white/10 p-5 mb-8 pp-anim-up" style={{ animationDelay: '0.55s' }}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center text-lg font-black text-black"
                      style={{ background: product.accent }}
                    >
                      {product.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{product.user}</span>
                        {product.isVerified && (
                          <span className="w-4 h-4 bg-[#00D9FF] text-black rounded-full flex items-center justify-center">
                            <CheckIcon />
                          </span>
                        )}
                      </div>
                      <div className="mono text-[10px] text-white/40 mt-0.5">
                        {product.branch} · {product.year} · Joined {product.sellerJoined}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{product.sellerRating}</div>
                      <div className="mono text-[10px] text-white/40">{product.sellerListings} listed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="space-y-3 pp-anim-up" style={{ animationDelay: '0.6s' }}>
                <button
                  className="pp-btn-primary w-full flex items-center justify-center gap-3"
                  style={{ background: product.accent, borderColor: product.accent, color: '#000' }}
                >
                  <ChatIcon /> CONTACT SELLER
                </button>
                <button className="pp-btn-outline w-full flex items-center justify-center gap-3">
                  <HeartIcon filled={false} /> {isSaved ? 'SAVED' : 'SAVE FOR LATER'}
                </button>
                <button className="w-full mono text-[10px] text-white/30 py-2 flex items-center justify-center gap-2 hover:text-white/60 transition-colors">
                  <FlagIcon /> Report this listing
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ===== DETAILS SECTION ===== */}
        <section className="relative z-10 max-w-[1800px] mx-auto border-t border-white/10">
          <div className="grid grid-cols-12">

            {/* Specifications */}
            <div className="col-span-12 lg:col-span-6 p-8 lg:p-12 border-r border-white/5 pp-anim-left" style={{ animationDelay: '0.7s' }}>
              <h3 className="mono text-[10px] text-white/40 uppercase tracking-widest font-bold mb-8">
                Specifications
              </h3>
              <div>
                {product.specs.map((spec, i) => (
                  <div key={i} className="pp-spec-row">
                    <span className="mono text-xs text-white/40 uppercase">{spec.label}</span>
                    <span className="text-sm text-white font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="col-span-12 lg:col-span-6 p-8 lg:p-12 pp-anim-right" style={{ animationDelay: '0.8s' }}>
              <h3 className="mono text-[10px] text-white/40 uppercase tracking-widest font-bold mb-8">
                What's Included
              </h3>
              <div className="space-y-4">
                {product.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                      style={{ color: product.accent }}
                    >
                      <CheckIcon />
                    </div>
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              {/* Safety / Trust */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="mono text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">
                  Safety
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: <ShieldIcon />, text: "Verified SGSITS student seller" },
                    { icon: <LocationIcon />, text: "Meet on campus — safe handover zones" },
                    { icon: <TagIcon />, text: "Zero platform fees — pay seller directly" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                      <span className="text-white/30">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <section className="relative z-10 max-w-[1800px] mx-auto border-t border-white/10 p-8 lg:p-12 pp-anim-up" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="mono text-[10px] text-white/40 uppercase tracking-widest font-bold">
                Similar Listings
              </h3>
              <Link to="/marketplace" className="mono text-[10px] text-white/40 hover:text-white transition-colors">
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} to={`/product/${rp.id}`} className="pp-related-card block group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ background: `linear-gradient(to bottom, ${rp.accent}30, transparent)` }}
                    />
                    <img
                      src={rp.image}
                      alt={rp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="mono text-[10px] font-bold px-2 py-1"
                        style={{ background: rp.accent, color: '#000' }}
                      >
                        ₹{rp.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-bold truncate group-hover:text-[#00D9FF] transition-colors">
                      {rp.title}
                    </h4>
                    <div className="mono text-[10px] text-white/40 mt-1">
                      {rp.user} · {rp.condition}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ===== BOTTOM BAR ===== */}
        <div className="border-t border-white/10 overflow-hidden">
          <div className="flex items-center h-10 text-white/30 text-[10px] mono tracking-wider whitespace-nowrap">
            <div className="pp-marquee flex items-center gap-12">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="flex items-center gap-12">
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    SGSITS EXCLUSIVE
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    VERIFIED STUDENTS
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    ZERO FEES
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    CAMPUS TRADE
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== FULLSCREEN LIGHTBOX ===== */}
        {showFullscreen && (
          <div className="pp-fullscreen" onClick={() => setShowFullscreen(false)}>
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))' }}
            />
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors"
              onClick={() => setShowFullscreen(false)}
            >
              ✕
            </button>
            {/* Thumbnail nav in fullscreen */}
            {product.images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                    className={`w-20 h-20 overflow-hidden border-2 transition-all ${activeImage === i ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                    style={{ borderColor: activeImage === i ? product.accent : 'transparent' }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProductPage