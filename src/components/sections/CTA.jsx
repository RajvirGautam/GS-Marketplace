import React, { useEffect } from 'react'

// --- Internal Icons ---
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
)
const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
)

const CTA = () => {
  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.3 });

    const el = document.querySelector(".cta-container");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-8 px-6 bg-[#0A0A0A] relative overflow-hidden border-b border-white/10">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        .mono { font-family: 'Space Mono', monospace; }

        .cta-container {
          opacity: 0;
          transform: scale(0.95);
          filter: blur(10px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cta-container.is-visible {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }

        /* Scrolling Background Text */
        @keyframes scrollText {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrolling-text {
          animation: scrollText 30s linear infinite;
        }

        /* Brutalist Button */
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
      `}</style>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5"></div>
        <div className="absolute right-6 top-0 bottom-0 w-px bg-white/5"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main CTA Box */}
        <div className="cta-container relative bg-zinc-900 border border-white/10 overflow-hidden group">
          
          {/* Dynamic Background: Scrolling Text */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
            <div className="scrolling-text whitespace-nowrap text-[12rem] font-black uppercase leading-none text-white">
              SGSITS MARKETPLACE /// INIT UPLOAD /// SECURE TRADE /// SGSITS MARKETPLACE /// INIT UPLOAD /// SECURE TRADE ///
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 p-4 border-l-2 border-t-2 border-[#00D9FF] w-16 h-16 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 p-4 border-r-2 border-b-2 border-[#00D9FF] w-16 h-16 pointer-events-none"></div>
          
          {/* Content Wrapper */}
          <div className="relative z-10 px-8 md:py-16 flex flex-col items-center text-center">
            
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-8 bg-black/40 border border-white/10 px-3 py-1 backdrop-blur-md">
              <div className="w-2 h-2 bg-[#00D9FF] animate-pulse"></div>
              <span className="mono text-xs text-[#00D9FF] tracking-widest uppercase">
                Network Status: Active
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 max-w-4xl">
              Ready to clear<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                Your Inventory?
              </span>
            </h2>

            {/* Description */}
            <p className="text-white/60 mono text-sm md:text-base max-w-xl mb-12 leading-relaxed">
              // Join 2,000+ SGSITS students trading daily. <br/>
              // Upload latency: &lt; 30 seconds. Zero fees. Instant liquidty.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="btn-brutal flex items-center justify-center gap-3 group">
                <UploadIcon />
                <span>Initialize Upload</span>
              </button>
              
              <button className="btn-brutal btn-outline flex items-center justify-center gap-3">
                <span>View Guidelines</span>
                <ArrowRight />
              </button>
            </div>

            {/* Decorative Footer Code */}
            <div className="absolute bottom-6 left-0 right-0 text-center hidden md:block">
               <span className="mono text-[10px] text-white/20">
                 System_ID: CTA_MOD_V2.4 // READY_TO_EXECUTE
               </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA