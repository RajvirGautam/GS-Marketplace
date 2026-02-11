import React, { useState, useEffect, useRef } from 'react'
import Icons from '../../assets/icons/Icons'
import Badge from '../ui/Badge'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const cards = [
    {
      id: 1, user: "Shivani (CSE)", price: "₹8,000", title: "Raspberry Pi 4 Model B", tag: "Electronics",
      image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      accent: "#FF6B35"
    },
    {
      id: 2, user: "Amit (Mech)", price: "₹450", title: "Roller Drafter (Omega)", tag: "Engineering",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
      accent: "#00D9FF"
    },
    {
      id: 3, user: "Rahul (IT)", price: "₹1,200", title: "Casio FX-991EX Calculator", tag: "Tools",
      image: "https://sppbook.com.my/image/sppbook/image/cache/data/all_product_images/product-3540/wO1NXWnS1626487064-1280x960.jpeg",
      accent: "#FFE600"
    },
    {
      id: 4, user: "Priya (EI)", price: "₹150", title: "Shivani Guide (Data Structures)", tag: "Books",
      image: "https://cdn-ilblhlh.nitrocdn.com/GPZeMEUHDphHkVuSHXUfUfAmIVwnktTp/assets/images/optimized/rev-ecdaa54/notes.newtondesk.com/wp-content/uploads/2024/02/Data-structures-DSA-study-notes-pdf-samp3.jpg",
      accent: "#7B2CBF"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / 20,
          y: (e.clientY - rect.top - rect.height / 2) / 20
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const currentCard = cards[currentIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; }
        
        .hero-brutalist {
          font-family: 'Manrope', sans-serif;
          background: #0A0A0A;
          position: relative;
          overflow: hidden;
        }

        .mono { font-family: 'Space Mono', monospace; }

        /* Noise texture overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        /* Grid system */
        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px),
            repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px);
          pointer-events: none;
          z-index: 1;
        }

        /* Brutal borders */
        .brutal-border {
          border: 3px solid #fff;
          box-shadow: 8px 8px 0 rgba(255,255,255,0.1);
        }

        .brutal-border-accent {
          box-shadow: 12px 12px 0 currentColor;
        }

        /* Marquee animation */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee {
          animation: marquee 25s linear infinite;
        }

        /* Stagger reveal animations */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .anim-slide-left { animation: slideInLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-slide-right { animation: slideInRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-slide-up { animation: slideInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-scale { animation: scaleIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-fade { animation: fadeIn 0.6s ease-out forwards; }

        /* Rotation ticker */
        @keyframes rotateTicker {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .rotate-slow { animation: rotateTicker 20s linear infinite; }

        /* Glitch effect on hover */
        .glitch:hover {
          animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both;
        }

        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          33% { transform: translate(-2px, 2px); }
          66% { transform: translate(2px, -2px); }
        }

        /* Image reveal */
        .image-reveal {
          position: relative;
          overflow: hidden;
        }

        .image-reveal::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #0A0A0A;
          transform: scaleX(0);
          transform-origin: left;
          animation: revealImage 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards;
          z-index: 10;
        }

        @keyframes revealImage {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); transform-origin: left; }
          51% { transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }

        /* Brutalist button */
        .btn-brutal {
          position: relative;
          background: #fff;
          color: #0A0A0A;
          border: 3px solid #fff;
          padding: 16px 32px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
        }

        .btn-brutal:hover {
          transform: translate(-4px, -4px);
          box-shadow: 4px 4px 0 #fff;
        }

        .btn-brutal:active {
          transform: translate(0, 0);
          box-shadow: 0 0 0 #fff;
        }

        /* Accent highlight */
        .accent-line {
          position: relative;
        }

        .accent-line::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 12px;
          background: currentColor;
          opacity: 0.3;
          z-index: -1;
        }

        /* Rotating badge */
        .circular-badge {
          animation: rotateTicker 8s linear infinite;
        }

        /* Number counter with split style */
        .split-number {
          display: inline-block;
          background: linear-gradient(to bottom, #fff 50%, transparent 50%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
      `}</style>

      <section ref={containerRef} className="hero-brutalist min-h-screen relative pt-32 pb-20 px-6" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        
        {/* Background layers */}
        <div className="noise-overlay" />
        <div className="grid-lines" />

        {/* Floating icon decorations */}
        <div className="absolute top-20 right-[10%] w-20 h-20 text-white/5 rotate-12 anim-fade" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <Icons.DrafterTools />
        </div>
        <div className="absolute bottom-40 left-[8%] w-16 h-16 text-white/5 -rotate-12 anim-fade" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <Icons.Calculator />
        </div>

        {/* Marquee ticker top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden border-b border-white/10 bg-black/50 backdrop-blur-sm z-20">
          <div className="flex items-center h-12 text-white/60 text-xs mono tracking-wider whitespace-nowrap">
            <div className="marquee flex items-center gap-12">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="flex items-center gap-12">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    VERIFIED STUDENTS ONLY
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    CAMPUS MARKETPLACE
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    ZERO MIDDLEMEN
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    SGSITS EXCLUSIVE
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          
          {/* Main editorial grid */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Left sidebar - Issue number & stats */}
            <div className="col-span-12 lg:col-span-2 space-y-8 anim-slide-left" style={{ opacity: 0, animationDelay: '0.2s' }}>
              
              <div className="space-y-2">
                <div className="mono text-xs text-white/40 tracking-wider">ISSUE #01</div>
                <div className="text-6xl font-black text-white">2026</div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-4xl font-black text-white">100<span className="text-xl">%</span></div>
                  <div className="mono text-xs text-white/50 mt-1 uppercase tracking-wide">Verified</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white">24<span className="text-xl">/7</span></div>
                  <div className="mono text-xs text-white/50 mt-1 uppercase tracking-wide">Active</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white">0</div>
                  <div className="mono text-xs text-white/50 mt-1 uppercase tracking-wide">Fees</div>
                </div>
              </div>

              {/* Rotating badge */}
              <div className="hidden lg:block">
                <div className="w-24 h-24 relative">
                  <svg className="circular-badge absolute inset-0" viewBox="0 0 100 100">
                    <defs>
                      <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text className="text-[8px] fill-white/60 mono" style={{ letterSpacing: '4px' }}>
                      <textPath href="#circlePath">CAMPUS • TRADE • SECURE •</textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

            </div>

            {/* Main content area */}
            <div className="col-span-12 lg:col-span-7 space-y-12">
              
              {/* Hero headline */}
              <div className="space-y-6 anim-slide-up" style={{ opacity: 0, animationDelay: '0.3s' }}>
                <div className="inline-block border border-white/20 px-4 py-2 mono text-xs text-white/60 tracking-wider">
                  SGSITS EXCLUSIVE PLATFORM
                </div>
                
                <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-black text-white tracking-tight">
                  TRADE
                  <br />
                  <span className="accent-line" style={{ color: currentCard.accent }}>
                    DIRECTLY
                  </span>
                  <br />
                  ON CAMPUS
                </h1>

                <p className="text-xl text-white/70 max-w-2xl leading-relaxed font-light">
                  Engineering essentials marketplace. From Raspberry Pis to Drafters, Calculators to Lab Coats. 
                  Exchange with verified students. No shipping. No middlemen. Pure campus commerce.
                </p>
              </div>

              {/* Featured Product - Horizontal Layout */}
              <div className="anim-slide-up" style={{ opacity: 0, animationDelay: '0.5s' }}>
                <div className="relative bg-zinc-900 overflow-hidden group">
                  
                  {/* Accent bar on left */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                    style={{ background: currentCard.accent }}
                  />

                  {/* Progress indicator */}
                  <div className="absolute top-0 left-0 h-0.5 bg-white/10 w-full">
                    <div 
                      className="h-full transition-all duration-300 ease-linear"
                      style={{ 
                        width: `${((currentIndex + 1) / cards.length) * 100}%`,
                        background: currentCard.accent
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-[300px,1fr] gap-0">
                    
                    {/* Image Section */}
                    <div className="relative aspect-square md:aspect-auto bg-zinc-800 overflow-hidden border-r border-white/10">
                      <div className="image-reveal h-full">
                        <img 
                          src={currentCard.image}
                          alt={currentCard.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      {/* Image overlay label */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 px-4 py-2 mono text-xs font-bold"
                        style={{ background: currentCard.accent, color: '#0A0A0A' }}
                      >
                        FEATURED ITEM #{currentIndex + 1}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      
                      {/* Top: User & Price */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 border-2 border-white/20"
                            style={{ background: currentCard.accent }}
                          />
                          <div>
                            <div className="text-white font-bold">{currentCard.user}</div>
                            <div className="mono text-xs text-white/40 uppercase">Posted 2m ago</div>
                          </div>
                        </div>
                        <div 
                          className="text-3xl font-black mono tracking-tight"
                          style={{ color: currentCard.accent }}
                        >
                          {currentCard.price}
                        </div>
                      </div>

                      {/* Middle: Product Title */}
                      <div className="flex-1 mb-6">
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                          {currentCard.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="mono text-xs px-3 py-1.5 bg-white text-black font-bold">
                            {currentCard.tag}
                          </span>
                          <span className="mono text-xs px-3 py-1.5 border border-white/20 text-white/60">
                            VERIFIED SELLER
                          </span>
                          <span className="mono text-xs px-3 py-1.5 border border-white/20 text-white/60">
                            ON CAMPUS
                          </span>
                        </div>
                      </div>

                      {/* Bottom: Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="mono text-xs text-white/40 uppercase tracking-wide">
                          {cards.length} Active listings
                        </div>
                        <button 
                          className="mono text-xs px-4 py-2 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors"
                        >
                          VIEW DETAILS →
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

              {/* CTA Section */}
              <div className="flex flex-wrap gap-4 items-center anim-slide-up" style={{ opacity: 0, animationDelay: '0.7s' }}>
                <button className="btn-brutal mono text-sm">
                  BROWSE MARKET
                </button>
                <button className="btn-brutal mono text-sm !bg-transparent !text-white hover:!bg-white hover:!text-black">
                  LIST YOUR ITEM
                </button>
                <div className="ml-auto hidden sm:block mono text-xs text-white/40">
                  SCROLL TO EXPLORE →
                </div>
              </div>

            </div>

            {/* Right sidebar - Features */}
            <div className="col-span-12 lg:col-span-3 space-y-6 anim-slide-right" style={{ opacity: 0, animationDelay: '0.4s' }}>
              
              <div className="border-l-4 border-white/20 pl-6 space-y-6">
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                      <Icons.CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-bold text-white">Verified Only</h4>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    SGSITS student authentication. Every user verified through college credentials.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                      <Icons.Zap className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-bold text-white">Instant Meet</h4>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Face-to-face handover on campus. No shipping delays or costs.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 border-2 border-white flex items-center justify-center">
                      <Icons.CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-bold text-white">Zero Fees</h4>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Direct peer-to-peer. Keep 100% of your sale price.
                  </p>
                </div>

              </div>

              {/* Category tags */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="mono text-xs text-white/40 tracking-wider">CATEGORIES</div>
                <div className="flex flex-wrap gap-2">
                  {['Electronics', 'Books', 'Tools', 'Lab Gear', 'Components'].map((cat) => (
                    <span 
                      key={cat}
                      className="text-xs px-3 py-1 border border-white/20 text-white/60 hover:bg-white hover:text-black transition-colors cursor-pointer mono"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom timestamp */}
        <div className="absolute bottom-6 left-6 mono text-xs text-white/30 anim-fade" style={{ opacity: 0, animationDelay: '0.9s' }}>
          LAST UPDATED: FEB 09 2026 — 13:26 IST
        </div>

      </section>
    </>
  )
}

export default Hero