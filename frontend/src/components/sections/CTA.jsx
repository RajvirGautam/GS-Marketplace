import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConnectIdModal from '../auth/ConnectIdModal';

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Mapped cleanly to perimeter zones to prevent center occlusion.
// Mobile coordinates establish a precise, symmetrical alternating zigzag pattern.
// Crucially, the vertical band between top 35% and bottom 35% is kept completely empty 
// on narrow screens so the "Trusted by" text is never physically crossed by flying cards.
const REVIEWS = [
  // --- MOBILE VISIBLE CARDS (Symmetrical Cascade) ---

  // Left 1 (Very Top)
  { id: 1, name: "Rahul S.", role: "Engineering", text: "Got my textbooks in literally 10 minutes. Safe and easy.", pos: { top: '12%', left: '4%' }, rotate: '-3deg', width: '250px', zDepth: 1.4, showOnMobile: true, mobilePos: { top: '8%', left: '4%' } },

  // Right 1 (Mid-Top)
  { id: 7, name: "Vikram P.", role: "M.Tech", text: "Found cheap Arduino kits. Saved a ton of money.", pos: { top: '15%', left: '28%' }, rotate: '1.5deg', width: '230px', zDepth: 3.2, showOnMobile: true, mobilePos: { top: '20%', right: '4%' } },

  // Left 2 (Lower-Top, sits just above text)
  { id: 8, name: "Anita D.", role: "Design", text: "Sold my old T-square to a junior the same day I listed it.", pos: { top: '42%', left: '3%' }, rotate: '-1.5deg', width: '240px', zDepth: 2.5, showOnMobile: true, mobilePos: { top: '26%', left: '4%' } },

  // --- [ EXCLUSION ZONE: CENTER 38% IS RESERVED FOR TYPOGRAPHY ] ---

  // Right 2 (Upper-Bottom, sits just below text)
  { id: 3, name: "Aman K.", role: "Mechanical", text: "Listed 6 things, sold 5 in two days. Highly recommend.", pos: { bottom: '8%', left: '32%' }, rotate: '1deg', width: '245px', zDepth: 2.8, showOnMobile: true, mobilePos: { bottom: '26%', right: '4%' } },

  // Left 3 (Mid-Bottom)
  { id: 10, name: "Kritika S.", role: "Architecture", text: "The UI is so clean. Listed my tools and got inquiries fast.", pos: { top: '45%', right: '3%' }, rotate: '1.5deg', width: '250px', zDepth: 2.2, showOnMobile: true, mobilePos: { bottom: '20%', left: '4%' } },

  // Right 3 (Very Bottom)
  { id: 5, name: "Karan T.", role: "Comp. Sci", text: "Fast uploads, works perfectly on mobile.", pos: { bottom: '6%', right: '34%' }, rotate: '-1deg', width: '220px', zDepth: 2.7, showOnMobile: true, mobilePos: { bottom: '8%', right: '4%' } },

  // --- HIDDEN ON MOBILE (To prevent clutter and maintain the stark geometry) ---

  { id: 15, name: "Arjun N.", role: "Electronics", text: "Verified profiles mean I actually trust the person I'm meeting.", pos: { bottom: '15%', left: '5%' }, rotate: '2.5deg', width: '260px', zDepth: 1.7, showOnMobile: false },
  // { id: 13, name: "Rishabh K.", role: "Pharmacy", text: "Got lab coats for half the price. Great for juniors.", pos: { bottom: '32%', left: '24%' }, rotate: '-2deg', width: '220px', zDepth: 3.5 },
  { id: 2, name: "Priya M.", role: "B.Tech", text: "Met near the library for the handoff. Super convenient.", pos: { top: '10%', right: '5%' }, rotate: '3.5deg', width: '240px', zDepth: 1.5, showOnMobile: false },
  { id: 14, name: "Dev V.", role: "Comp. Sci", text: "Zero latency on image uploads. Works flawlessly.", pos: { top: '22%', right: '26%' }, rotate: '-2deg', width: '235px', zDepth: 3.4, showOnMobile: false },
  { id: 4, name: "Neha J.", role: "Arts", text: "Smooth experience, zero platform fees. Love it.", pos: { bottom: '14%', right: '6%' }, rotate: '-3.5deg', width: '255px', zDepth: 1.6, showOnMobile: false },
  // { id: 9, name: "Rohan J.", role: "Business", text: "Way better than WhatsApp groups. Listings stay fresh.", pos: { bottom: '30%', right: '25%' }, rotate: '2deg', width: '230px', zDepth: 3.1 },
];

const CTA = () => {
  const containerRef = useRef(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleListProduct = () => {
    if (user) {
      navigate('/marketplace', { state: { openList: true } });
    } else {
      // Store intent in sessionStorage before modal opens (ConnectIdModal does a hard redirect on success)
      sessionStorage.setItem('marketplace_openList', '1');
      setShowConnect(true);
    }
  };

  // This fires if user is already logged in by the time they close the modal without hard redirect
  const handleConnectClose = () => {
    setShowConnect(false);
    // If auth loaded user during modal session (edge case), still navigate
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize, { passive: true });

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const maxScroll = height - windowHeight;
      const currentScroll = -top;
      const progress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
      setScrollYProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --- Strict Sequenced Kinematics --- 

  // Phase 1.5 (Cards Zoom): General zoom progress tracker (0.25 -> 0.55)
  const zoomProgress = Math.max(0, Math.min((scrollYProgress - 0.25) / 0.30, 1));
  const globalCardOpacity = 1 - Math.max(0, (zoomProgress - 0.8) / 0.2);

  // Phase 2 (Text Split): Keep the copy visible while the circle opens through the middle. (0.50 -> 0.70)
  const textSplitProgress = Math.max(0, Math.min((scrollYProgress - 0.50) / 0.20, 1));
  const textTranslate = textSplitProgress * (isMobile ? 120 : 250);
  const textOpacity = 1 - Math.max(0, (textSplitProgress - 0.86) / 0.14);

  // Phase 3 (Morph Shell): Replace the circle with a panel that grows into the CTA frame. (0.55 -> 0.80)
  const morphProgress = Math.max(0, Math.min((scrollYProgress - 0.55) / 0.25, 1));
  const morphWidth = `min(${12 + (morphProgress * 76)}vw, 1120px)`;
  const morphHeight = `min(${18 + (morphProgress * 50)}vh, 720px)`;
  const morphRadius = `${Math.max(isMobile ? 18 : 28, 999 - (morphProgress * 960))}px`;
  const morphScale = 0.88 + (morphProgress * 0.14);

  // Phase 4 (CTA Reveal): Fade in as the shell nears its final frame. (0.75 -> 1.0)
  const ctaOpacity = Math.max(0, Math.min((morphProgress - 0.75) / 0.25, 1));
  const isCtaInteractive = ctaOpacity > 0.85;

  return (
    <section ref={containerRef} className="relative w-full h-[600vh] bg-[#0a0a0f]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .mono { font-family: 'Space Mono', monospace; }

        .cta-container {
          opacity: 0;
          transform: scale(0.97);
          filter: blur(10px);
          transition: all 0.35s ease-out;
        }
        .cta-container.is-visible {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }

        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrolling-text {
          animation: scrollText 30s linear infinite;
        }

        .btn-brutal {
          position: relative;
          background: #fff;
          color: #000;
          border: 1px solid #fff;
          padding: 16px 32px;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          text-transform: uppercase;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-brutal:hover {
          background: #ffffff;
          border-color: #ffffff;
          box-shadow: 4px 4px 0 rgba(255,255,255,0.2);
          transform: translate(-2px, -2px);
        }
        .btn-outline {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .btn-outline:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .morph-shell {
          position: absolute;
          background:
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08), transparent 34%),
            linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0) 40%),
            linear-gradient(325deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 42%),
            linear-gradient(180deg, #101018, #09090d 72%);
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02), 0 40px 120px rgba(0,0,0,0.45);
          overflow: hidden;
        }

        .morph-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(circle at center, rgba(0,0,0,0.95), rgba(0,0,0,0.65));
          opacity: 0.28;
          pointer-events: none;
        }

        .split-copy {
          text-shadow: 0 8px 30px rgba(0,0,0,0.45);
          transition: text-shadow 0.3s ease;
        }

        .morph-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, transparent, rgba(255,255,255,0.045), transparent),
            linear-gradient(180deg, rgba(255,255,255,0.03), transparent 30%, rgba(255,255,255,0.015));
          opacity: 0.7;
          pointer-events: none;
        }

        .morph-shell::after {
          content: '';
          position: absolute;
          inset: 14px;
          border-radius: inherit;
          border: 1px solid rgba(255,255,255,0.04);
          pointer-events: none;
        }

        .morph-inner-glow {
          position: absolute;
          inset: 12%;
          border-radius: inherit;
          background:
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.035) 26%, rgba(10,10,15,0) 72%);
          filter: blur(28px);
          opacity: 0.9;
          pointer-events: none;
        }

        .morph-center-spine {
          position: absolute;
          left: 50%;
          top: 12%;
          width: 1px;
          height: 76%;
          transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent);
          box-shadow: 0 0 18px rgba(255,255,255,0.08);
        }

        .morph-center-spine::before,
        .morph-center-spine::after {
          content: '';
          position: absolute;
          left: 50%;
          width: 40px;
          height: 1px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
        }

        .morph-center-spine::before {
          top: 18%;
        }

        .morph-center-spine::after {
          bottom: 18%;
        }

        .morph-scan-line {
          position: absolute;
          left: 10%;
          right: 10%;
          top: 50%;
          height: 1px;
          transform: translateY(-50%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          opacity: 0.6;
          pointer-events: none;
        }

        .morph-shell-content {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* Stratum 1: Parallax Social Proof Field */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        >
          {REVIEWS.map((r, index) => {
            // Mobile: Skip non-configured cards
            if (isMobile && !r.showOnMobile) return null;

            // --- STAGGERED ENTRANCE AND ZOOM ---
            // Each group of 2 cards takes about 20% of the scroll window to zoom past.
            // We stagger the groups by 4% of the scroll window.
            const groupSize = 2;
            const staggerStep = 0.04;
            const individualDuration = 0.22;
            const groupIndex = Math.floor(index / groupSize);
            const startWindow = 0.25 + (groupIndex * staggerStep);

            const cardZoomProgress = Math.max(0, Math.min((scrollYProgress - startWindow) / individualDuration, 1));

            // Z-axis movement: cards fly toward camera
            const baseZTranslate = (cardZoomProgress * 3200) / r.zDepth;
            const zTranslate = isMobile ? baseZTranslate * 0.5 : baseZTranslate;

            // --- FADE-OUT LOGIC BASED ON DEPTH ---
            let depthOpacity = 1;
            const fadeThreshold = isMobile ? 350 : 700;
            if (zTranslate > fadeThreshold) {
              depthOpacity = Math.max(0, 1 - (zTranslate - fadeThreshold) / (isMobile ? 150 : 200));
            }

            // Final opacity: depth fade out * global scene capture (cards are visible from the start)
            const finalOpacity = Math.min(depthOpacity, globalCardOpacity);

            // Apply mobile-specific positioning and scale down sizes to fit narrow viewports
            const currentPos = isMobile && r.mobilePos ? r.mobilePos : r.pos;
            const mobileScale = isMobile ? ' scale(0.65)' : '';

            return (
              <div
                key={r.id}
                className="absolute backdrop-blur-[12px] bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-5 md:p-6 rounded-[28px] border border-white/10 flex flex-col gap-4 overflow-hidden"
                style={{
                  ...currentPos,
                  width: r.width,
                  transform: `translateZ(${zTranslate}px) rotate(${r.rotate})${mobileScale}`,
                  opacity: finalOpacity,
                  willChange: 'transform, opacity'
                }}
              >
                {/* Top highlight glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-center gap-3.5 mb-1 relative z-10">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white/90 shadow-inner">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-bold text-white/95 leading-tight">{r.name}</p>
                      <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" title="Verified" />
                    </div>
                    <p className="text-[11px] text-white/40 font-medium uppercase tracking-[0.08em] mt-1">{r.role}</p>
                  </div>
                </div>

                <p className="text-[14px] text-white/70 leading-[1.6] relative z-10 font-medium italic">
                  "{r.text}"
                </p>

                {/* Subtle bottom shine */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[40%] bg-white/5 blur-[40px] rounded-full pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Stratum 1.5: Bifurcating Typography */}
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center gap-2">
          <h1
            className="split-copy text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter text-center leading-none"
            style={{
              transform: `translateY(-${textTranslate}px)`,
              opacity: textOpacity,
              willChange: 'transform, opacity'
            }}
          >
            Trusted by
          </h1>
          <h1
            className="split-copy text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter text-center leading-none"
            style={{
              transform: `translateY(${textTranslate}px)`,
              opacity: textOpacity,
              willChange: 'transform, opacity'
            }}
          >
            180+ students
          </h1>
        </div>

        {/* Stratum 2: Morphing Shell */}
        <div
          className="absolute morph-shell z-20"
          style={{
            width: morphWidth,
            height: morphHeight,
            borderRadius: morphRadius,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${morphScale})`,
            opacity: morphProgress > 0 ? 1 : 0,
            willChange: 'transform, width, height, border-radius',
          }}
        >
          <div className="morph-grid" />
          <div className="morph-inner-glow" />
          <div className="morph-center-spine" />
          <div className="morph-scan-line" />
          <div
            className={`morph-shell-content transition-opacity duration-300 ${isCtaInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}
            style={{ opacity: ctaOpacity }}
          >
            <div className={`cta-container relative w-full h-full ${isCtaInteractive ? 'is-visible' : ''}`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none overflow-hidden">
                <div className="scrolling-text whitespace-nowrap text-[6rem] md:text-[10rem] font-black uppercase leading-none text-white">
                  CAMPUS MARKETPLACE /// INIT UPLOAD /// SECURE TRADE /// CAMPUS MARKETPLACE /// INIT UPLOAD /// SECURE TRADE ///
                </div>
              </div>

              <div className="absolute top-0 left-0 border-l-2 border-t-2 border-white/20 w-12 h-12 md:w-16 md:h-16 pointer-events-none" />
              <div className="absolute bottom-0 right-0 border-r-2 border-b-2 border-white/20 w-12 h-12 md:w-16 md:h-16 pointer-events-none" />

              <div className="relative z-10 w-full h-full px-6 py-12 md:px-8 md:py-24 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 mb-8 bg-black/40 border border-white/10 px-3 py-1 backdrop-blur-md">
                  <div className="w-2 h-2 bg-white/80 animate-pulse" />
                  <span className="mono text-[10px] md:text-xs text-white/70 tracking-widest uppercase">
                    Network Status: Active
                  </span>
                </div>

                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 max-w-4xl">
                  Ready to clear<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                    Your Inventory?
                  </span>
                </h2>

                <p className="text-white/60 mono text-xs md:text-base max-w-xl mb-12 leading-relaxed">
                  // Join 180+ students network. <br />
                  // Upload latency: &lt; 30 seconds.   <br /> // Zero fees. Instant liquidity.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button onClick={handleListProduct} className="btn-brutal flex items-center justify-center gap-3 text-sm md:text-base">
                    <UploadIcon />
                    <span>List a product</span>
                  </button>
                  <button className="btn-brutal btn-outline flex items-center justify-center gap-3 text-sm md:text-base">
                    <span>View Guidelines</span>
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <ConnectIdModal
        isOpen={showConnect}
        onClose={handleConnectClose}
      />
    </section>
  );
};

export default CTA;