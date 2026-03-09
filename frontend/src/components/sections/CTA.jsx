import React, { useEffect, useRef, useState } from 'react';

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
  { id: 1, name: "Rahul S.", role: "Engineering", text: "Got my textbooks in literally 10 minutes. Safe and easy.", pos: { top: '12%', left: '4%' }, rotate: '-3deg', width: '250px', zDepth: 1.4, showOnMobile: true, mobilePos: { top: '4%', left: '4%' } },
  
  // Right 1 (Mid-Top)
  { id: 7, name: "Vikram P.", role: "M.Tech", text: "Found cheap Arduino kits. Saved a ton of money.", pos: { top: '15%', left: '28%' }, rotate: '1.5deg', width: '230px', zDepth: 3.2, showOnMobile: true, mobilePos: { top: '15%', right: '4%' } },

  // Left 2 (Lower-Top, sits just above text)
  { id: 8, name: "Anita D.", role: "Design", text: "Sold my old T-square to a junior the same day I listed it.", pos: { top: '42%', left: '3%' }, rotate: '-1.5deg', width: '240px', zDepth: 2.5, showOnMobile: true, mobilePos: { top: '28%', left: '4%' } },

  // --- [ EXCLUSION ZONE: CENTER 38% IS RESERVED FOR TYPOGRAPHY ] ---

  // Right 2 (Upper-Bottom, sits just below text)
  { id: 3, name: "Aman K.", role: "Mechanical", text: "Listed 6 things, sold 5 in two days. Highly recommend.", pos: { bottom: '8%', left: '32%' }, rotate: '1deg', width: '245px', zDepth: 2.8, showOnMobile: true, mobilePos: { bottom: '28%', right: '4%' } },

  // Left 3 (Mid-Bottom)
  { id: 10, name: "Kritika S.", role: "Architecture", text: "The UI is so clean. Listed my tools and got inquiries fast.", pos: { top: '45%', right: '3%' }, rotate: '1.5deg', width: '250px', zDepth: 2.2, showOnMobile: true, mobilePos: { bottom: '15%', left: '4%' } },

  // Right 3 (Very Bottom)
  { id: 5, name: "Karan T.", role: "Comp. Sci", text: "Fast uploads, works perfectly on mobile.", pos: { bottom: '6%', right: '34%' }, rotate: '-1deg', width: '220px', zDepth: 2.7, showOnMobile: true, mobilePos: { bottom: '4%', right: '4%' } },

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

  useEffect(() => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Strict Sequenced Kinematics --- 

  // Phase 1 (Cards): Handled directly in the render loop to utilize individual zDepth indices.
  // Global fade forces all remaining straggler cards to disappear before the circle expands.
  const globalCardOpacity = Math.max(0, 1 - (scrollYProgress - 0.2) * 5);

  // Phase 2: Headline splits in half and fades out (Scroll 0.2 -> 0.4)
  const textSplitProgress = Math.max(0, Math.min((scrollYProgress - 0.2) / 0.2, 1));
  const textTranslate = textSplitProgress * 180;
  const textOpacity = Math.max(0, 1 - textSplitProgress * 1.5);

  // Phase 3: Circle expands from the empty focal center (Scroll 0.35 -> 0.65)
  const circleProgress = Math.max(0, Math.min((scrollYProgress - 0.35) / 0.3, 1));
  const circleScale = circleProgress * 1.55;

  // Phase 4: Terminal CTA snaps in instantly once the circle is fully expanded.
  // Binary: fully visible when circleProgress === 1, fully hidden otherwise.
  const ctaOpacity = circleProgress >= 1 ? 1 : 0;
  const isCtaInteractive = ctaOpacity > 0.5;

  return (
    <section ref={containerRef} className="relative w-full h-[350vh] bg-[#0a0a0f]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .mono { font-family: 'Space Mono', monospace; }

        .cta-container {
          opacity: 0;
          transform: scale(0.95);
          filter: blur(12px);
          transition: all 0.3s ease-out;
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
          background: #00D9FF;
          border-color: #00D9FF;
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

        .tech-grid-bg {
          background-color: #0A0A0A;
          background-image:
            radial-gradient(circle at center, transparent 0%, #0A0A0A 80%),
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 100% 100%, 40px 40px, 40px 40px;
        }
      `}</style>

      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* Stratum 1: Parallax Social Proof Field */}
        <div className="absolute inset-0 z-10 pointer-events-none origin-center">
          {REVIEWS.map((r) => {
            // Apply kinematic scaling inversely proportional to zDepth
            const scaleFactor = 1 + (scrollYProgress * 20) / r.zDepth;

            // Localized fade: The card fades as it physically "passes" the camera (scale > 3)
            let localOpacity = 1;
            if (scaleFactor > 3) {
              localOpacity = Math.max(0, 1 - (scaleFactor - 3) * 0.8);
            }

            // Final opacity is the stricter of its local fade and the global sequence fade
            const finalOpacity = Math.min(localOpacity, globalCardOpacity);

            return (
              <div
                key={r.id}
                className="absolute bg-[#1a1a24] shadow-[0_4px_28px_rgba(0,0,0,0.5)] p-4 md:p-5 rounded-2xl border border-white/10 hidden lg:flex flex-col gap-3"
                style={{
                  ...r.pos,
                  width: r.width,
                  transform: `scale(${scaleFactor}) rotate(${r.rotate})`,
                  opacity: finalOpacity,
                  willChange: 'transform, opacity'
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/70">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white/90 leading-tight">{r.name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{r.role}</p>
                  </div>
                </div>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  "{r.text}"
                </p>
              </div>
            );
          })}
        </div>

        {/* Stratum 1.5: Bifurcating Typography */}
        <div className="absolute inset-0 z-15 pointer-events-none flex flex-col items-center justify-center gap-2">
          {/* Top Half Ascends */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter text-center leading-none"
            style={{
              transform: `translateY(-${textTranslate}px)`,
              opacity: textOpacity,
              willChange: 'transform, opacity'
            }}
          >
            Trusted by
          </h1>
          {/* Bottom Half Descends */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter text-center leading-none"
            style={{
              transform: `translateY(${textTranslate}px)`,
              opacity: textOpacity,
              willChange: 'transform, opacity'
            }}
          >
            2,000+ students
          </h1>
        </div>

        {/* Stratum 2: Radial Expansion Plane */}
        <div
          className="absolute tech-grid-bg z-20"
          style={{
            width: '200vmax',
            height: '200vmax',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            marginTop: '-100vmax',
            marginLeft: '-100vmax',
            transform: `scale(${circleScale})`,
            border: '2px solid rgba(0,217,255,0.4)',
            boxShadow: '0 0 100px rgba(0,217,255,0.15) inset',
            opacity: circleScale > 0 ? 1 : 0,
            willChange: 'transform',
          }}
        />

        {/* Stratum 3: Terminal Interface Construction */}
        <div
          className={`absolute inset-0 z-30 flex items-center justify-center px-6 transition-opacity duration-300 ${isCtaInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ opacity: ctaOpacity }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />
            <div className="absolute right-6 top-0 bottom-0 w-px bg-white/5" />
          </div>

          <div className="max-w-7xl mx-auto relative w-full">
            <div className={`cta-container w-full relative bg-zinc-900 border border-white/10 overflow-hidden ${isCtaInteractive ? 'is-visible' : ''}`}>

              {/* Scrolling Ambient Telemetry */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                <div className="scrolling-text whitespace-nowrap text-[8rem] md:text-[12rem] font-black uppercase leading-none text-white">
                  CAMPUS MARKETPLACE /// INIT UPLOAD /// SECURE TRADE /// CAMPUS MARKETPLACE /// INIT UPLOAD /// SECURE TRADE ///
                </div>
              </div>

              {/* Geometric Interface Boundaries */}
              <div className="absolute top-0 left-0 border-l-2 border-t-2 border-[#00D9FF] w-12 h-12 md:w-16 md:h-16 pointer-events-none" />
              <div className="absolute bottom-0 right-0 border-r-2 border-b-2 border-[#00D9FF] w-12 h-12 md:w-16 md:h-16 pointer-events-none" />

              <div className="relative z-10 px-6 py-12 md:px-8 md:py-24 flex flex-col items-center text-center">

                <div className="flex items-center gap-2 mb-8 bg-black/40 border border-white/10 px-3 py-1 backdrop-blur-md">
                  <div className="w-2 h-2 bg-[#00D9FF] animate-pulse" />
                  <span className="mono text-[10px] md:text-xs text-[#00D9FF] tracking-widest uppercase">
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
                  // Join 2,000+ Campus students trading daily. <br />
                  // Upload latency: &lt; 30 seconds. Zero fees. Instant liquidity.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button className="btn-brutal flex items-center justify-center gap-3 text-sm md:text-base">
                    <UploadIcon />
                    <span>Initialize Upload</span>
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
    </section>
  );
};

export default CTA;