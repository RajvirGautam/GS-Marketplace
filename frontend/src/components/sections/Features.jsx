import React, { useEffect, useRef } from 'react';

// --- Internal Icons ---
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const ZapIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const BagIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);
const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

const FEATURES_DATA = [
  {
    id: 1,
    icon: <ShieldIcon />,
    subtitle: "Authentication Protocol",
    title: "Campus Shield",
    desc: "The walled garden. Access is cryptographically restricted to official institute emails (@sgsits.ac.in). No outsiders. Zero spam.",
    techContext: "AES-256 / JWT Auth",
    color: "#00D9FF",
  },
  {
    id: 2,
    icon: <ZapIcon />,
    subtitle: "Low Latency",
    title: "Real-Time Comms",
    desc: "Negotiate in real-time. Direct peer-to-peer messaging designed for rapid campus meetups.",
    techContext: "WSS / Socket.io",
    color: "#8B5CF6",
  },
  {
    id: 3,
    icon: <BagIcon />,
    subtitle: "Economy",
    title: "Zero Commission",
    desc: "Keep 100% of your sale value. We facilitate the handshake; you handle the exchange.",
    techContext: "P2P Settlement",
    color: "#10B981",
  },
  {
    id: 4,
    icon: <SearchIcon />,
    subtitle: "Intelligence",
    title: "Deep Query Search",
    desc: "Don't just scroll. Filter by branch, specific years, condition, or edition. Find exactly what you need in milliseconds.",
    techContext: "Full-Text Indexing",
    color: "#FF6B35",
  }
];

const Features = () => {
  const containerRef = useRef(null);
  const tickingRef = useRef(false);

  // High-performance DOM refs
  const cardsRef = useRef([]);
  const ambientGlowRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const dataStreamsRef = useRef([]);

  useEffect(() => {
    // Initial ref arrays setup
    cardsRef.current = cardsRef.current.slice(0, FEATURES_DATA.length);
    dataStreamsRef.current = dataStreamsRef.current.slice(0, 3);

    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const { top, height } = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          const maxScroll = height - windowHeight;
          const currentScroll = -top;

          const progress = Math.max(0, Math.min(currentScroll / maxScroll, 1));
          const stackProgress = progress * (FEATURES_DATA.length - 1);

          const activeIndex = Math.min(FEATURES_DATA.length - 1, Math.max(0, Math.round(stackProgress)));
          const activeColor = FEATURES_DATA[activeIndex].color;

          // Update ambient glow directly
          if (ambientGlowRef.current) {
            ambientGlowRef.current.style.background = `radial-gradient(circle at 70% 50%, ${activeColor}, transparent 60%)`;
          }

          // Update data streams directly
          dataStreamsRef.current.forEach(stream => {
            if (stream) stream.style.color = activeColor;
          });

          // Update progress indicator directly
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress * 100}%`;
            progressBarRef.current.style.background = activeColor;
          }
          if (progressTextRef.current) {
            progressTextRef.current.innerText = `${Math.round(progress * 100)}%`;
          }

          // Safely update all cards independently
          cardsRef.current.forEach((card, index) => {
            if (!card) return;
            const relativeScroll = stackProgress - index;
            const isMobile = window.innerWidth < 768;

            let translateX = 0;
            let translateY = 0;
            let rotateZ = 0;
            let scale = 1;
            let opacity = 1;
            const zIndex = FEATURES_DATA.length - index;

            if (relativeScroll > 0) {
              // EXIT: easeInQuad sweep left with tilt — NO opacity, card stays solid
              const t = Math.min(relativeScroll, 1);
              translateX = isMobile ? -(t * t * (window.innerWidth + 100)) : -(t * t * 750);
              translateY = -(t * 20);
              rotateZ = -(t * 7);
              scale = Math.max(0.92, 1 - t * 0.08);
              opacity = 1;
            } else {
              // WAITING DECK: vertical depth stacking, no horizontal drift
              const depth = Math.abs(relativeScroll);
              scale = Math.max(0.88, 1 - depth * 0.04);
              translateY = depth * (isMobile ? 8 : 10);
              translateX = 0;
              opacity = 1;
            }

            card.style.zIndex = zIndex;
            card.style.opacity = opacity;
            card.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotate(${rotateZ}deg)`;
            card.style.pointerEvents = relativeScroll > 0.5 ? 'none' : 'auto';

            // Sub-element active styling manipulation
            const isActive = Math.abs(relativeScroll) < 0.15;
            const topStrip = card.querySelector('.top-accent-strip');
            if (topStrip) topStrip.style.opacity = isActive ? 1 : 0.2;

            const iconGlow = card.querySelector('.icon-glow-bg');
            if (iconGlow) iconGlow.style.opacity = isActive ? 0.35 : 0;

            const iconBox = card.querySelector('.icon-box');
            if (iconBox) {
              iconBox.style.boxShadow = isActive ? `inset 0 0 20px ${FEATURES_DATA[index].color}15, 0 10px 40px -10px ${FEATURES_DATA[index].color}50` : 'none';
              iconBox.style.borderColor = isActive ? `${FEATURES_DATA[index].color}40` : 'rgba(255,255,255,0.05)';
              iconBox.style.background = isActive ? `${FEATURES_DATA[index].color}10` : 'rgba(255,255,255,0.02)';
            }

            const techContext = card.querySelector('.tech-context');
            if (techContext) techContext.style.color = isActive ? FEATURES_DATA[index].color : '';
          });

          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial state mapping immediately
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-[#050508]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        .mono { font-family: 'Space Mono', monospace; }

        .glass-monolith {
          background: #10101a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 40px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.12);
          border-radius: 32px;
          height: 100%;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease;
          /* Removed CSS transition for op/tr to lean entirely on hyper-fast direct DOM kinematics */
          will-change: transform, opacity;
        }

        .glass-monolith:hover {
          border-color: rgba(255, 255, 255, 0.15);
        }

        .ambient-glow {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }

        .technical-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 1;
        }

        .data-stream {
          position: absolute;
          width: 1px;
          height: 200px;
          background: linear-gradient(to bottom, transparent, currentColor, transparent);
          opacity: 0.3;
          animation: streamDrop 4s linear infinite;
        }

        @keyframes streamDrop {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @media (max-width: 768px) {
          .glass-monolith {
            min-height: 100%;
            border-radius: 24px;
          }
        }
      `}</style>

      {/* Sticky Checkpoint */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row">

        <div
          ref={ambientGlowRef}
          className="ambient-glow"
        />
        <div className="technical-grid mask-radial-fade-out" />

        <div ref={el => dataStreamsRef.current[0] = el} className="data-stream left-[10%]" style={{ animationDelay: '0s' }} />
        <div ref={el => dataStreamsRef.current[1] = el} className="data-stream left-[45%]" style={{ animationDelay: '2s' }} />
        <div ref={el => dataStreamsRef.current[2] = el} className="data-stream right-[20%]" style={{ animationDelay: '1.5s' }} />

        {/* --- LEFT: Static Pinned Information --- */}
        <div className="w-full md:w-[35%] lg:w-[40%] h-[45vh] md:h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 z-10 relative pt-10 md:pt-0">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#050508] to-transparent pointer-events-none md:hidden" />

          <div className="inline-block border border-white/10 px-3 py-1 md:px-4 md:py-1.5 mono text-[9px] md:text-xs text-white/50 tracking-[0.2em] mb-4 md:mb-8 bg-black/40 backdrop-blur-md self-start">
            SYSTEM CAPABILITIES
          </div>

          <h2 className="text-[3.5rem] md:text-7xl lg:text-[7rem] font-black text-white uppercase tracking-tighter leading-[0.85] mb-4 md:mb-6">
            BUILT FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
              VELOCITY
            </span>
          </h2>

          <p className="text-white/40 mono text-[10px] md:text-[13px] leading-relaxed border-l-2 border-white/10 pl-3 md:pl-6 max-w-sm">
            <span className="block md:inline">// A marketplace engineered specifically for the Campus ecosystem.</span>
            <br className="hidden md:block" /><br className="hidden md:block" />
            <span className="hidden md:inline">Scroll down to explore the core modules powering the GS-MARK engine.</span>
            <span className="inline md:hidden mt-2 block opacity-70">Scroll to initialize core modules.</span>
          </p>

          <div className="mt-6 md:mt-12 w-full max-w-sm">
            <div className="flex justify-between items-end mb-2 md:mb-3 mono text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest">
              <span>Initialization</span>
              <span ref={progressTextRef}>0%</span>
            </div>
            <div className="h-0.5 w-full bg-white/5 relative overflow-hidden">
              <div
                ref={progressBarRef}
                className="absolute top-0 left-0 h-full ease-out"
                style={{ width: '0%', background: FEATURES_DATA[0].color }}
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT: Stacked Card Swiper System --- */}
        <div className="w-full md:w-[65%] lg:w-[60%] h-[55vh] md:h-full relative z-20 flex items-center justify-center md:justify-start md:pl-24 lg:pl-32 overflow-hidden perspective-[1200px]">

          <div className="relative w-[90vw] max-w-[360px] md:max-w-none md:w-[450px] h-[380px] md:h-[500px]">
            {FEATURES_DATA.map((feature, index) => (
              <div
                key={feature.id}
                ref={el => cardsRef.current[index] = el}
                className="absolute inset-0 will-change-transform"
                style={{ transition: 'transform 0.07s cubic-bezier(0.25,0.46,0.45,0.94)' }}
              >
                <div className="glass-monolith group w-full h-full bg-[#0B0B13]">
                  <div
                    className="absolute top-0 left-0 w-full h-1 transition-opacity duration-300 top-accent-strip"
                    style={{ background: feature.color }}
                  />

                  {/* Subtle top gradient */}
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

                  <div className="p-8 md:p-10 flex flex-col z-10 w-full h-full relative">
                    {/* Inner Glow */}
                    <div
                      className="absolute top-12 left-8 w-24 h-24 rounded-full opacity-0 transition-opacity duration-500 blur-[40px] pointer-events-none icon-glow-bg"
                      style={{ background: feature.color }}
                    />

                    <div className="flex justify-between items-start mb-8 md:mb-16 relative z-10">
                      <div
                        className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-[18px] transition-all duration-300 icon-box bg-white/5"
                        style={{ color: feature.color, border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <div className="scale-[1.2] md:scale-[1.4] flex items-center justify-center" style={{ filter: `drop-shadow(0 0 12px ${feature.color})` }}>
                          {feature.icon}
                        </div>
                      </div>
                      <div className="mono text-[10px] md:text-xs text-white/40 uppercase tracking-widest border border-white/5 px-3 py-1.5 bg-black/40 rounded-lg backdrop-blur-md shadow-inner">
                        MDL_{feature.id.toString().padStart(2, '0')}
                      </div>
                    </div>

                    <div className="mt-auto relative z-10">
                      <div
                        className="mono text-[11px] md:text-[13px] uppercase tracking-[0.15em] mb-3 md:mb-4 font-bold"
                        style={{ color: feature.color }}
                      >
                         // {feature.subtitle}
                      </div>
                      <h3 className="text-[2rem] md:text-[2.5rem] font-black mb-4 md:mb-6 text-white uppercase tracking-tighter leading-[1.1]">
                        {feature.title}
                      </h3>
                      <p className="text-[#a0a0ab] text-[13px] md:text-[15px] leading-[1.7] mono mb-8 font-medium">
                        {feature.desc}
                      </p>

                      <div className="pt-5 md:pt-6 mt-4 md:mt-6 border-t border-white/10 flex justify-between items-center mono text-[9px] md:text-[11px] text-[#60606b] uppercase tracking-wider font-semibold">
                        <span>Tech Infrastructure</span>
                        <span className="transition-colors duration-300 tech-context text-right ml-2 font-bold" style={{ color: feature.color }}>
                          [{feature.techContext}]
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;