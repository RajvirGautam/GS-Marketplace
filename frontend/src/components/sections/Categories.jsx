import React from 'react'

// --- Internal Icons ---
const DraftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/></svg>
)
const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><rect x="4" y="4" width="16" height="16"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
)
const TerminalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
)
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
)
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
)

const Categories = () => {
  const categories = [
    { 
      id: "01",
      name: "Engineering Graphics", 
      sub: "DRAFTING_TOOLS",
      icon: <DraftIcon />, 
      count: "120+ ITEMS",
      accent: "#FF6B35", // Orange
      bgGradient: "from-[#FF6B35]/5 to-transparent"
    },
    { 
      id: "02",
      name: "Electronics & IoT", 
      sub: "HARDWARE_COMPONENTS",
      icon: <CpuIcon />, 
      count: "85+ ITEMS",
      accent: "#00D9FF", // Cyan
      bgGradient: "from-[#00D9FF]/5 to-transparent"
    },
    { 
      id: "03",
      name: "Coding Bootcamps", 
      sub: "DEV_RESOURCES",
      icon: <TerminalIcon />, 
      count: "40+ COURSES",
      accent: "#10B981", // Green
      bgGradient: "from-[#10B981]/5 to-transparent"
    },
    { 
      id: "04",
      name: "Sem Quantums", 
      sub: "ACADEMIC_ARCHIVES",
      icon: <BookIcon />, 
      count: "500+ BOOKS",
      accent: "#8B5CF6", // Purple
      bgGradient: "from-[#8B5CF6]/5 to-transparent"
    },
  ]

  return (
    <section className="relative bg-[#0A0A0A] py-24 border-b border-white/10 overflow-hidden">
      
      {/* --- STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        .mono { font-family: 'Space Mono', monospace; }
        
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px),
            repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.02) 99px, rgba(255,255,255,0.02) 100px);
          pointer-events: none;
          z-index: 1;
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .anim-slide-up { animation: slideInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        /* Hollow Text Effect for Background Numbers */
        .text-stroke {
          -webkit-text-stroke: 1px rgba(255,255,255,0.05);
          color: transparent;
        }
        .group:hover .text-stroke {
          -webkit-text-stroke: 1px rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Background Layers */}
      <div className="noise-overlay" />
      <div className="grid-lines" />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
          <div className="anim-slide-up" style={{opacity: 0, animationDelay: '0s'}}>
             <div className="inline-block border border-white/20 px-3 py-1 mono text-[10px] text-white/60 tracking-wider mb-4">
               SECTOR_INDEX
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
              Inventory <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                Categories
              </span>
            </h2>
          </div>
          <div className="anim-slide-up text-right md:text-left" style={{opacity: 0, animationDelay: '0.1s'}}>
             <p className="text-white/60 mono text-xs max-w-sm ml-auto">
               // Essential supplies for the SGSITS ecosystem. <br/>
               // Select a module to initialize search query.
             </p>
          </div>
        </div>

        {/* Categories Grid - Added gaps instead of borders for separation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="group relative bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer p-8 min-h-[320px] flex flex-col justify-between overflow-hidden anim-slide-up"
              style={{ opacity: 0, animationDelay: `${0.2 + (idx * 0.1)}s` }}
            >
              
              {/* Active Gradient Background on Hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} 
              />

              {/* Top Accent Signal Bar */}
              <div 
                className="absolute top-0 left-0 w-full h-[4px] opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: cat.accent }}
              />

              {/* Giant Watermark Number */}
              <div className="absolute -right-4 -bottom-10 text-[10rem] font-black leading-none text-stroke select-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-4 group-hover:-translate-x-4">
                {cat.id}
              </div>

              {/* Icon Section */}
              <div className="relative z-10 flex justify-between items-start">
                 {/* Tinted Icon Box */}
                 <div 
                   className="w-14 h-14 flex items-center justify-center border border-white/10 transition-all duration-300"
                   style={{ 
                     backgroundColor: `${cat.accent}10`, // 10% opacity hex
                     color: cat.accent 
                   }}
                 >
                   <div className="transform group-hover:scale-110 transition-transform duration-300">
                     {React.cloneElement(cat.icon, { strokeWidth: 1.5 })}
                   </div>
                 </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 mt-auto">
                <div 
                  className="mono text-[9px] uppercase tracking-widest mb-3 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: cat.accent }}
                >
                  {cat.sub}
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 uppercase leading-tight group-hover:translate-x-2 transition-transform duration-300">
                  {cat.name}
                </h3>
                
                <div className="flex items-center gap-4 pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
                  <div 
                    className="w-8 h-8 flex items-center justify-center bg-white text-black opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  >
                    <ArrowRight />
                  </div>
                  <span className="mono text-xs text-white/40 group-hover:text-white transition-colors group-hover:-translate-x-2 duration-300">
                    {cat.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories