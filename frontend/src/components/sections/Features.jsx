import React, { useEffect, useRef } from 'react'

// --- Internal Icons ---
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
)
const BagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
)
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><polyline points="20 6 9 17 4 12"/></svg>
)
const ArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
)

// Reusable Card Component
const FeatureCard = ({ icon, subtitle, title, desc, delay, color, gradient }) => (
  <div 
    className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-8 hover:border-white/20 transition-all duration-300 h-full flex flex-col overflow-hidden reveal-on-scroll"
    style={{ transitionDelay: delay }}
  >
    {/* Colorful Gradient Leak */}
    <div 
      className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-100"
      style={{ background: gradient }}
    />

    {/* Top Color Bar */}
    <div 
      className="absolute top-0 left-0 w-full h-1"
      style={{ background: color }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
        <div 
            className="w-12 h-12 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
            style={{ background: color }}
        >
            {icon}
        </div>
        <div 
            className="mono text-[10px] uppercase tracking-widest border border-white/10 px-2 py-1 backdrop-blur-md"
            style={{ color: color, borderColor: `${color}40` }}
        >
            {subtitle}
        </div>
        </div>

        <div className="mt-auto">
        <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-300">
            {title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed mono">
            {desc}
        </p>
        </div>
    </div>
  </div>
)

const Features = () => {
  // Intersection Observer Logic
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15, // Trigger when 15% of the element is visible
      rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before bottom
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Run animation only once
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden font-sans py-32 border-b border-white/10">
      
      {/* --- STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        .mono { font-family: 'Space Mono', monospace; }
        
        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px),
            repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px);
          pointer-events: none;
          z-index: 1;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .scanline-effect {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.05), transparent);
          height: 50%;
          animation: scanline 4s linear infinite;
          opacity: 0.5;
          pointer-events: none;
        }

        /* --- SCROLL REVEAL ANIMATIONS --- */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px) scale(0.98);
          filter: blur(4px);
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), 
                      transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), 
                      filter 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform, filter;
        }

        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
      `}</style>

      {/* Background Layers */}
      <div className="grid-lines" />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="grid grid-cols-12 gap-8 mb-20 items-end">
          <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
            <div className="inline-block border border-[#00D9FF] px-4 py-1 mono text-xs text-[#00D9FF] tracking-wider mb-6">
              SYSTEM ARCHITECTURE
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              BUILT FOR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-white">
                MAXIMUM VELOCITY
              </span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <p className="text-white/60 mono text-sm leading-relaxed border-l-2 border-white/20 pl-6">
              // A marketplace engineered specifically for the SGSITS ecosystem. 
              <br/>
              // Secure protocol. Low latency. Zero friction.
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* --- TILE 1: CAMPUS SHIELD (BIG) --- */}
          <div 
            className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-10 relative overflow-hidden group hover:border-white/20 transition-colors duration-500 reveal-on-scroll"
            style={{ transitionDelay: '0.2s' }}
          >
            {/* Color Identity: Cyan */}
            <div className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(0,217,255,0.15) 0%, rgba(0,0,0,0) 100%)' }} />
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00D9FF]" />
            <div className="scanline-effect opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                 <div className="w-16 h-16 bg-[#00D9FF] flex items-center justify-center text-black mb-8 transform group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                  <ShieldIcon />
                </div>
                <div className="mono text-xs text-[#00D9FF] mb-2 uppercase tracking-widest font-bold">
                  Authentication Protocol
                </div>
                <h3 className="text-3xl font-black mb-4 text-white uppercase">
                  Campus Shield
                </h3>
                <p className="text-white/60 mono text-sm leading-relaxed max-w-md">
                  The walled garden. Access is cryptographically restricted to official institute emails (@sgsits.ac.in). No outsiders. Zero spam.
                </p>
              </div>

              {/* Visual: System Status Box */}
              <div className="w-full md:w-auto bg-black/80 border border-[#00D9FF]/20 p-6 min-w-[280px] backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <span className="mono text-[10px] text-white/40">STATUS CHECK</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00D9FF] animate-pulse"/>
                    <span className="mono text-[10px] text-[#00D9FF] font-bold">ONLINE</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between mono text-xs">
                    <span className="text-white/60">DOMAIN</span>
                    <span className="text-white">sgsits.ac.in</span>
                  </div>
                  <div className="flex items-center justify-between mono text-xs">
                    <span className="text-white/60">ENCRYPTION</span>
                    <span className="text-white">AES-256</span>
                  </div>
                  <div className="mt-4 bg-[#00D9FF]/10 border border-[#00D9FF]/30 p-2 flex items-center gap-2 text-[#00D9FF]">
                    <CheckIcon />
                    <span className="text-[10px] font-bold tracking-wider">VERIFIED STUDENT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- TILE 2: LIVE COMMS (SMALL) - Purple --- */}
          <FeatureCard 
            icon={<ZapIcon />} 
            subtitle="LOW LATENCY"
            title="Real-Time Comms"
            desc="Negotiate in real-time. Direct peer-to-peer messaging designed for rapid campus meetups."
            delay="0.3s"
            color="#8B5CF6"
            gradient="linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 100%)"
          />

          {/* --- TILE 3: ZERO COMMISSION (SMALL) - Emerald --- */}
          <FeatureCard 
            icon={<BagIcon />}
            subtitle="ECONOMY"
            title="Zero Commission"
            desc="Keep 100% of your sale value. We facilitate the handshake; you handle the exchange."
            delay="0.4s"
            color="#10B981"
            gradient="linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 100%)"
          />

          {/* --- TILE 4: DEEP QUERY SEARCH (BIG) - Orange --- */}
          <div 
            className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-10 relative overflow-hidden group hover:border-white/20 transition-colors duration-500 reveal-on-scroll"
            style={{ transitionDelay: '0.5s' }}
          >
             {/* Color Identity: Orange */}
             <div className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(0,0,0,0) 100%)' }} />
             <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B35]" />
             
             <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight />
             </div>

             <div className="relative z-10 flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="flex-1 w-full">
                 <div className="w-16 h-16 bg-[#FF6B35] flex items-center justify-center text-black mb-8 transform group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,107,53,0.3)]">
                  <SearchIcon />
                </div>
                <div className="mono text-xs text-[#FF6B35] mb-2 uppercase tracking-widest font-bold">
                  Intelligence
                </div>
                <h3 className="text-3xl font-black mb-4 text-white uppercase">
                  Deep Query Search
                </h3>
                <p className="text-white/60 mono text-sm leading-relaxed">
                  Don't just scroll. Filter by branch, specific years, condition, or edition. Find exactly what you need in milliseconds.
                </p>
              </div>

              {/* Visual: Search Terminal */}
              <div className="w-full md:w-1/2 bg-black/80 border border-[#FF6B35]/20 p-1 font-mono text-xs backdrop-blur-md">
                <div className="bg-white/5 p-2 flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#FF6B35]"/>
                  <span className="text-white/40">QUERY_TERMINAL_V1</span>
                </div>
                <div className="p-4 space-y-2 text-white/80 h-40">
                  <div className="flex gap-2">
                    <span className="text-[#FF6B35]">{'>'}</span>
                    <span>search --tag "drafter"</span>
                  </div>
                  <div className="text-[#FF6B35]/50 pl-4">Searching database...</div>
                  <div className="pl-4">
                    [RESULT] Omega Drafter (Mech) <span className="text-[#10B981]">[AVAILABLE]</span>
                  </div>
                   <div className="flex gap-2 mt-4">
                    <span className="text-[#FF6B35]">{'>'}</span>
                    <span className="animate-pulse">_</span>
                  </div>
                  
                  {/* Floating Tags */}
                  <div className="absolute bottom-6 right-6 flex flex-col gap-2 items-end opacity-50">
                     <span className="bg-white/10 px-2 py-1 text-[10px] text-[#FF6B35]">#Civil</span>
                     <span className="bg-white/10 px-2 py-1 text-[10px] text-[#FF6B35]">#1stYear</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Features