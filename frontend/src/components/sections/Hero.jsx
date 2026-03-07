import React, { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'


const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const today = new Date();
  const day = today.getDate();


  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };


  const month = today.toLocaleString("en-US", { month: "short" });
  const year = today.getFullYear();


  const cards = [
    {
      id: 1, user: "Ved1nsh EI", price: "₹8,000", title: "Raspberry Pi 4 Model B", tag: "Electronics",
      image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      accent: "#FF6B35",
      gradient: "from-orange-500 to-red-500",
      description: "Brand new, sealed box. Includes heatsinks & case. Perfect for IoT projects."
    },
    {
      id: 2, user: "Amit (Mech)", price: "₹450", title: "Roller Drafter (Omega)", tag: "Engineering",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
      accent: "#00D9FF",
      gradient: "from-cyan-400 to-blue-500",
      description: "Lightly used, excellent condition. Ideal for engineering drawing classes."
    },
    {
      id: 3, user: "Rahul (IT)", price: "₹1,200", title: "Casio FX-991EX Calculator", tag: "Tools",
      image: "https://sppbook.com.my/image/sppbook/image/cache/data/all_product_images/product-3540/wO1NXWnS1626487064-1280x960.jpeg",
      accent: "#FFE600",
      gradient: "from-yellow-400 to-orange-400",
      description: "552 functions, solar powered. Used for one semester only."
    },
    {
      id: 4, user: "Priya (EI)", price: "₹150", title: "Shivani Guide (Data Structures)", tag: "Books",
      image: "https://cdn-ilblhlh.nitrocdn.com/GPZeMEUHDphHkVuSHXUfUfAmIVwnktTp/assets/images/optimized/rev-ecdaa54/notes.newtondesk.com/wp-content/uploads/2024/02/Data-structures-DSA-study-notes-pdf-samp3.jpg",
      accent: "#7B2CBF",
      gradient: "from-purple-500 to-pink-500",
      description: "Clean copy with highlights. Covers all semester topics + solved papers."
    },
  ];


  // Initialize particles
  useEffect(() => {
    const count = window.innerWidth < 640 ? 25 : 50;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setParticles(newParticles);
  }, []);

  // Handle Scroll to hide dots/stars
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 200); // Wait 200ms after scroll stops to show dots again
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);


  // Auto-rotate cards with transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setIsTransitioning(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  // Mouse tracking for background only
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  // 3D card tilt effect
  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };


  const handleCardMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };


  const currentCard = cards[currentIndex];

  const switchCard = (idx) => {
    if (idx === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsTransitioning(false);
    }, 300);
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .hero-enhanced {
          font-family: 'Manrope', sans-serif;
          background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%, #000000 100%);
          position: relative;
          overflow: visible; /* Prevent any chance of the 4th card clipping */
          min-height: 100vh;
        }

        .mono { font-family: 'Space Mono', monospace; }

        /* Animated gradient mesh background */
        .gradient-mesh {
          position: absolute;
          inset: 0;
          opacity: 0.4;
          filter: blur(100px);
          animation: meshMove 20s ease-in-out infinite;
        }

        @keyframes meshMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-50px, 50px) scale(0.9); }
        }

        /* Particle system */
        .particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 20s infinite linear;
        }

        @keyframes particleFloat {
          0% { transform: translate(0, 0); }
          100% { transform: translate(var(--tx), var(--ty)); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        /* Marquee - FIXED at top */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee {
          animation: marquee 40s linear infinite;
        }

        .top-ticker {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* Text reveal animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .anim-fade-up { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-fade-left { animation: fadeInLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-fade-right { animation: fadeInRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-scale { animation: scaleIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        /* Glassmorphism card - Restored */
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        /* 3D Card */
        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.2s ease-out;
          will-change: transform;
        }

        /* Scroll Stack Animation Core Styles */
        .sticky-card-wrapper {
          position: sticky;
        }
        
        .card-3d-inner {
          transform-style: preserve-3d;
          transition: transform 0.2s ease-out;
          will-change: transform;
        }

        /* Product card redesign - Kept Opaque Dark */
        .product-showcase {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #0d0d12;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .product-showcase::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, var(--accent-color) 0%, transparent 40%, transparent 60%, var(--accent-color) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.4;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .product-showcase:hover::before {
          opacity: 0.8;
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .product-image-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%);
          pointer-events: none;
        }

        .card-transition-enter {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .card-transition-exit {
          opacity: 0;
          transform: translateY(12px);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Navigation dots */
        .nav-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
        }

        .nav-dot.active {
          width: 36px;
          border-radius: 20px;
        }

        .nav-dot::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: inherit;
          border: 2px solid transparent;
          transition: border-color 0.3s;
        }

        .nav-dot.active::before {
          border-color: var(--accent-color);
        }

        /* Magnetic button */
        .btn-magnetic {
          position: relative;
          background: white;
          color: #0a0a0f;
          border: none;
          padding: 18px 40px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .btn-magnetic::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .btn-magnetic:hover::before {
          transform: translateX(100%);
        }

        .btn-magnetic:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(255, 255, 255, 0.3);
        }

        .btn-magnetic:active {
          transform: translateY(0);
        }

        /* Progress ring for auto-rotate */
        @keyframes progressRing {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }

        .progress-ring-circle {
          animation: progressRing 5s linear;
          stroke-dasharray: 100;
          stroke-dashoffset: 0;
        }

        /* Accent line */
        .accent-underline {
          position: relative;
          display: inline-block;
        }

        .accent-underline::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 16px;
          background: currentColor;
          opacity: 0.3;
          z-index: -1;
          transform: scaleX(0);
          transform-origin: left;
          animation: expandLine 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
        }

        @keyframes expandLine {
          to { transform: scaleX(1); }
        }

        /* Circular text */
        @keyframes rotateCircle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .circular-text {
          animation: rotateCircle 15s linear infinite;
        }

        /* Noise texture */
        .noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.02;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        /* Feature icon pulse */
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        .icon-pulse {
          animation: pulse 3s ease-in-out infinite;
        }

        /* Stagger delay classes */
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        .delay-700 { animation-delay: 0.7s; opacity: 0; }
        .delay-800 { animation-delay: 0.8s; opacity: 0; }

        /* Quick action pill */
        .action-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          border: none;
          position: relative;
          overflow: hidden;
        }

        .action-pill:hover {
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .card-3d { transform: none !important; }
          .hero-enhanced { padding-top: 4rem; }
          .product-showcase { border-radius: 16px; }
        }

        /* ===== MOBILE ADAPTIVE STYLES ===== */

        /* Mobile ticker */
        .mobile-ticker {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .mobile-ticker .marquee {
          animation: marquee 25s linear infinite;
        }

        /* Mobile hero card - full bleed style */
        .mobile-product-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: #0d0d12;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .mobile-product-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(135deg, var(--accent-color) 0%, transparent 50%, var(--accent-color) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.3;
          pointer-events: none;
        }

        .mobile-product-image {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .mobile-product-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%);
          pointer-events: none;
        }

        /* Mobile stats strip */
        .mobile-stats-strip {
          display: flex;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .mobile-stats-strip::-webkit-scrollbar {
          display: none;
        }

        .mobile-stat-item {
          flex: 1;
          min-width: 0;
          text-align: center;
          padding: 16px 12px;
          position: relative;
        }

        .mobile-stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(255,255,255,0.08);
        }

        /* Mobile feature pills - horizontal scroll */
        .mobile-features-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 4px;
        }

        .mobile-features-scroll::-webkit-scrollbar {
          display: none;
        }

        .mobile-feature-pill {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }

        /* Swipe indicator animation */
        @keyframes swipeHint {
          0%, 100% { transform: translateX(0); opacity: 0.4; }
          50% { transform: translateX(8px); opacity: 0.8; }
        }

        .swipe-hint {
          animation: swipeHint 2s ease-in-out infinite;
        }

      `}</style>

      {/* ===== MOBILE TICKER BAR ===== */}
      <div className="mobile-ticker sm:hidden">
        <div className="flex items-center h-9 text-white/60 text-[10px] mono tracking-wider">
          <div className="marquee flex items-center gap-8 whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={`m-${i}`}>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ background: currentCard.accent }} />
                  VERIFIED ONLY
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ background: currentCard.accent }} />
                  CAMPUS TRADE
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ background: currentCard.accent }} />
                  ZERO FEES
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP TICKER BAR ===== */}
      <div className="top-ticker hidden sm:block">
        <div className="flex items-center h-12 text-white/70 text-xs mono tracking-wider">
          <div className="marquee flex items-center gap-16 whitespace-nowrap">
            {[...Array(15)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: currentCard.accent }} />
                  VERIFIED STUDENTS ONLY
                </span>
                <span className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: currentCard.accent }} />
                  CAMPUS MARKETPLACE
                </span>
                <span className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: currentCard.accent }} />
                  ZERO MIDDLEMEN
                </span>
                <span className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: currentCard.accent }} />
                  CAMPUS EXCLUSIVE
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <section ref={containerRef} className="hero-enhanced relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">

        {/* Animated gradient mesh */}
        <div
          className="gradient-mesh"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${currentCard.accent}40 0%, transparent 50%)`
          }}
        />

        {/* Grid overlay - Remains constant during scroll */}
        <div className="grid-overlay" />

        {/* Noise texture */}
        <div className="noise" />

        {/* Particle system - Fades out on scroll */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: isScrolling ? 0 : particle.opacity,
              transition: 'opacity 0.4s ease',
              '--tx': `${particle.speedX * 100}px`,
              '--ty': `${particle.speedY * 100}px`
            }}
          />
        ))}

        <div className="max-w-[1800px] mx-auto relative z-10 pt-8 sm:pt-20">

          {/* ============================= */}
          {/* ===== MOBILE LAYOUT ONLY ===== */}
          {/* ============================= */}
          <div className="lg:hidden space-y-6 pb-8">

            {/* Mobile badge */}
            <div className="flex items-center justify-center anim-fade-up delay-100">
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: currentCard.accent }} />
                <span className="mono text-[10px] text-white/80 tracking-widest uppercase font-bold">SGSITS Exclusive</span>
              </div>
            </div>

            {/* Mobile headline - compact */}
            <div className="text-center anim-fade-up delay-200">
              <h1 className="text-[clamp(2.8rem,14vw,4.5rem)] leading-[0.92] font-black text-white tracking-tight">
                <span className="block">TRADE</span>
                <span className="block" style={{ color: currentCard.accent }}>DIRECTLY</span>
                <span className="block">ON CAMPUS</span>
              </h1>
              <p className="text-sm text-white/60 mt-4 px-4 leading-relaxed max-w-sm mx-auto">
                Engineering essentials from <span className="font-semibold text-white/80">verified students</span>.
                <span className="font-bold" style={{ color: currentCard.accent }}> No shipping. No fees.</span>
              </p>
            </div>

            {/* Mobile stats strip */}
            <div className="glass-card rounded-2xl overflow-hidden anim-fade-up delay-300">
              <div className="mobile-stats-strip">
                <div className="mobile-stat-item">
                  <div className="text-2xl font-black" style={{ color: currentCard.accent }}>100%</div>
                  <div className="mono text-[9px] text-white/50 mt-1 uppercase tracking-widest">Verified</div>
                </div>
                <div className="mobile-stat-item">
                  <div className="text-2xl font-black" style={{ color: currentCard.accent }}>24/7</div>
                  <div className="mono text-[9px] text-white/50 mt-1 uppercase tracking-widest">Support</div>
                </div>
                <div className="mobile-stat-item">
                  <div className="text-2xl font-black" style={{ color: currentCard.accent }}>0₹</div>
                  <div className="mono text-[9px] text-white/50 mt-1 uppercase tracking-widest">Fees</div>
                </div>
              </div>
            </div>

            {/* ===== REDESIGNED MOBILE PRODUCT SHOWCASE (STACKING SCROLL) ===== */}
            <div className="relative w-full pb-[5vh] anim-scale delay-400">
              {cards.map((card, idx) => (
                <React.Fragment key={card.id}>
                  <div
                    className="sticky-card-wrapper"
                    style={{
                      top: `calc(90px + ${idx * 24}px)`,
                      zIndex: idx + 10,
                    }}
                  >
                    <div
                      style={{
                        '--accent-color': card.accent,
                        animationDelay: `${400 + (idx * 100)}ms`
                      }}
                    >
                      <div className="mobile-product-card shadow-[0_15px_35px_rgba(0,0,0,0.8)] bg-[#0d0d12] border border-white/5">
                        <div className="mobile-product-image">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="mono text-[9px] px-2 py-1 rounded-full font-bold text-white/90"
                                style={{ background: `${card.accent}40`, border: `1px solid ${card.accent}60` }}
                              >
                                {card.tag}
                              </span>
                              <span className="mono text-[9px] text-white/50">#{String(idx + 1).padStart(2, '0')}/{String(cards.length).padStart(2, '0')}</span>
                            </div>
                            <h3 className="text-xl font-black text-white leading-tight">{card.title}</h3>
                            <div
                              className="mono text-2xl font-black text-white mt-1"
                              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
                            >
                              {card.price}
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs"
                              style={{ background: `linear-gradient(135deg, ${card.accent}, ${card.accent}99)` }}
                            >
                              {card.user.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-bold text-sm">{card.user}</div>
                              <div className="mono text-[9px] text-white/40 uppercase tracking-wide">Active now · Verified ✓</div>
                            </div>
                          </div>

                          <p className="text-xs text-white/50 leading-relaxed mb-4">
                            {card.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-5">
                            <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/50 mono font-semibold border border-white/5">
                              📍 Campus Pickup
                            </span>
                            <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/50 mono font-semibold border border-white/5">
                              ⚡ Instant
                            </span>
                            <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/50 mono font-semibold border border-white/5">
                              🛡️ Verified
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              className="action-pill mono text-white flex-1 justify-center text-xs"
                              style={{ background: card.accent }}
                            >
                              View Details →
                            </button>
                            <button
                              className="action-pill mono text-white/80 flex-1 justify-center text-xs"
                              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                            >
                              💬 Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {idx !== cards.length - 1 && (
                    <div style={{ height: '20vh' }} />
                  )}
                </React.Fragment>
              ))}
              {/* Spacer so last card reaches its sticky top before page scrolls away */}
              <div style={{ height: '60vh' }} />
            </div>

            {/* Mobile feature pills - horizontal scroll */}
            <div className="anim-fade-up delay-500">
              <div className="mobile-features-scroll px-1">
                <div className="mobile-feature-pill">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${currentCard.accent}25` }}
                  >
                    <Icons.CheckCircle className="w-4 h-4" style={{ color: currentCard.accent }} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">Verified Only</div>
                    <div className="text-[10px] text-white/40">College credentials</div>
                  </div>
                </div>
                <div className="mobile-feature-pill">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${currentCard.accent}25` }}
                  >
                    <Icons.Zap className="w-4 h-4" style={{ color: currentCard.accent }} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">Instant Meet</div>
                    <div className="text-[10px] text-white/40">On-campus handover</div>
                  </div>
                </div>
                <div className="mobile-feature-pill">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${currentCard.accent}25` }}
                  >
                    <Icons.CheckCircle className="w-4 h-4" style={{ color: currentCard.accent }} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">Zero Fees</div>
                    <div className="text-[10px] text-white/40">100% yours to keep</div>
                  </div>
                </div>
                <span className="flex-shrink-0 flex items-center text-white/30 swipe-hint">›</span>
              </div>
            </div>

          </div>

          {/* ============================== */}
          {/* ===== DESKTOP LAYOUT ONLY ===== */}
          {/* ============================== */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ===== LEFT SIDEBAR - STATS ===== */}
            <div className="lg:col-span-2 space-y-10 anim-fade-left delay-100 sticky top-32 h-fit">

              {/* Date */}
              <div className="space-y-3">
                <div className="mono text-2xl text-white/90 font-black tracking-wider">
                  {day}<sup className="text-sm">{getOrdinal(day)}</sup> {month}
                </div>
                <div className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
                  {year}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-8 pt-8 border-t border-white/10">
                <div className="group cursor-pointer">
                  <div className="text-5xl font-black counter transition-all group-hover:scale-110" style={{ color: currentCard.accent }}>
                    100<span className="text-2xl">%</span>
                  </div>
                  <div className="mono text-xs text-white/60 mt-2 uppercase tracking-widest">Verified Users</div>
                </div>

                <div className="group cursor-pointer">
                  <div className="text-5xl font-black counter transition-all group-hover:scale-110" style={{ color: currentCard.accent }}>
                    24<span className="text-2xl">/7</span>
                  </div>
                  <div className="mono text-xs text-white/60 mt-2 uppercase tracking-widest">Active Support</div>
                </div>

                <div className="group cursor-pointer">
                  <div className="text-5xl font-black counter transition-all group-hover:scale-110" style={{ color: currentCard.accent }}>
                    0<span className="text-2xl">₹</span>
                  </div>
                  <div className="mono text-xs text-white/60 mt-2 uppercase tracking-widest">Platform Fees</div>
                </div>
              </div>

              {/* Rotating badge - MOVED BACK DOWN HERE */}
              <div className="hidden lg:block pt-2">
                <div className="w-28 h-28 relative">
                  <svg className="circular-text absolute inset-0 w-full h-full" viewBox="0 0 120 120">
                    <defs>
                      <path id="circlePath" d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
                    </defs>
                    <text className="text-[9px] fill-white/70 mono font-bold" letterSpacing="5">
                      <textPath href="#circlePath" startOffset="0%">
                        • CAMPUS • TRADE • SECURE • FAST •
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: currentCard.accent }}>
                      <Icons.Zap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div className="lg:col-span-7 space-y-12">

              {/* Hero headline */}
              <div className="space-y-8 anim-fade-up delay-200">

                <div className="inline-flex items-center gap-3 glass-card px-5 py-3 rounded-full">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: currentCard.accent }} />
                  <span className="mono text-xs text-white/80 tracking-widest uppercase font-bold">SGSITS Exclusive Platform</span>
                </div>

                <h1 className="text-[clamp(2.5rem,10vw,8rem)] leading-[0.95] font-black text-white tracking-tight">
                  <span className="block anim-fade-up delay-300">TRADE</span>
                  <span className="block accent-underline anim-fade-up delay-400" style={{ color: currentCard.accent }}>
                    DIRECTLY
                  </span>
                  <span className="block anim-fade-up delay-500">ON CAMPUS</span>
                </h1>

                <p className="text-xl sm:text-2xl text-white/70 max-w-3xl leading-relaxed font-light anim-fade-up delay-600">
                  Engineering essentials marketplace. From <span className="font-semibold text-white">Raspberry Pis</span> to <span className="font-semibold text-white">Drafters</span>, <span className="font-semibold text-white">Calculators</span> to <span className="font-semibold text-white">Lab Coats</span>.
                  Exchange with verified students. <span className="font-bold" style={{ color: currentCard.accent }}>No shipping. No middlemen.</span> Pure campus commerce.
                </p>
              </div>

              {/* ===== REDESIGNED PRODUCT SHOWCASE (STACKING SCROLL) ===== */}
              <div className="relative w-full pt-4">
                {cards.map((card, idx) => (
                  <React.Fragment key={card.id}>
                    <div
                      className="sticky-card-wrapper"
                      style={{
                        top: `calc(120px + ${idx * 48}px)`,
                        zIndex: idx + 10,
                      }}
                    >
                      <div
                        className="card-3d-inner anim-scale"
                        style={{
                          '--accent-color': card.accent,
                          '--accent-glow': `${card.accent}40`,
                          animationDelay: `${700 + (idx * 100)}ms`,
                        }}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          const centerX = rect.width / 2;
                          const centerY = rect.height / 2;
                          const rotateX = (y - centerY) / 25;
                          const rotateY = (centerX - x) / 25;
                          e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                        }}
                      >
                        <div className="product-showcase shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#0d0d12] border border-white/5">
                          {/* Top strip - seller info */}
                          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
                                style={{ background: `linear-gradient(135deg, ${card.accent}, ${card.accent}99)` }}
                              >
                                {card.user.charAt(0)}
                              </div>
                              <div>
                                <div className="text-white font-bold text-sm">{card.user}</div>
                                <div className="mono text-[10px] text-white/40 uppercase tracking-wide">Active now · Verified ✓</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className="mono text-[10px] px-3 py-1.5 rounded-full font-bold text-white/90"
                                style={{ background: `${card.accent}30`, border: `1px solid ${card.accent}50` }}
                              >
                                {card.tag}
                              </span>
                              <span className="mono text-[10px] text-white/30">
                                #{String(idx + 1).padStart(2, '0')}/{String(cards.length).padStart(2, '0')}
                              </span>
                            </div>
                          </div>

                          {/* Main content area */}
                          <div className="grid md:grid-cols-2 gap-0">
                            {/* Image */}
                            <div className="product-image-wrapper aspect-[4/3] md:aspect-auto md:min-h-[380px]">
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                style={{
                                  transform: `scale(1.02) translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
                                  transition: 'transform 0.4s ease-out'
                                }}
                              />
                              <div className="absolute bottom-6 left-6 z-10">
                                <div
                                  className="mono text-3xl lg:text-4xl font-black text-white"
                                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
                                >
                                  {card.price}
                                </div>
                              </div>
                            </div>

                            {/* Details side */}
                            <div className="p-8 lg:p-10 flex flex-col justify-between relative">
                              <div
                                className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
                                style={{ background: card.accent }}
                              />
                              <div className="relative">
                                <h3 className="text-2xl lg:text-4xl font-black text-white leading-tight mb-4">
                                  {card.title}
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-md">
                                  {card.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-white/5 text-white/60 mono font-semibold border border-white/5">
                                    📍 On Campus Pickup
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-white/5 text-white/60 mono font-semibold border border-white/5">
                                    ⚡ Instant Meet
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-white/5 text-white/60 mono font-semibold border border-white/5">
                                    🛡️ Verified Seller
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3">
                                <button
                                  className="action-pill mono text-white flex-1 sm:flex-none"
                                  style={{ background: card.accent }}
                                >
                                  View Details →
                                </button>
                                <button
                                  className="action-pill mono text-white/80 flex-1 sm:flex-none"
                                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                                >
                                  💬 Message
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {idx !== cards.length - 1 && (
                      <div style={{ height: '35vh' }} />
                    )}
                  </React.Fragment>
                ))}
                {/* Spacer so last card reaches its sticky top before page scrolls away */}
                <div style={{ height: '80vh' }} />
              </div>

            </div>

            {/* ===== RIGHT SIDEBAR - FEATURES ===== */}
            <div className="lg:col-span-3 space-y-8 anim-fade-right delay-300 sticky top-32 h-fit">

              <div className="space-y-8">

                {/* Feature 1 */}
                <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white icon-pulse shadow-xl"
                      style={{ background: `linear-gradient(135deg, ${currentCard.accent}, ${currentCard.accent}aa)` }}
                    >
                      <Icons.CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-2">Verified Only</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Student authentication. Every user verified through college credentials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white icon-pulse shadow-xl"
                      style={{ background: `linear-gradient(135deg, ${currentCard.accent}, ${currentCard.accent}aa)` }}
                    >
                      <Icons.Zap className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-2">Instant Meet</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Face-to-face handover on campus. No shipping delays or costs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white icon-pulse shadow-xl"
                      style={{ background: `linear-gradient(135deg, ${currentCard.accent}, ${currentCard.accent}aa)` }}
                    >
                      <Icons.CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-2">Zero Fees</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Direct peer-to-peer. Keep 100% of your sale price.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom timestamp */}
        <div className="absolute bottom-8 left-8 mono text-xs text-white/30 anim-fade-up delay-800 hidden sm:block">
          LAST UPDATED: {month.toUpperCase()} {String(day).padStart(2, '0')} {year} — {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} IST
        </div>

      </section>
    </>
  )
}

export default Hero