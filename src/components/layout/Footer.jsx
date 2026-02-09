import React from 'react'

// --- Internal Icons ---
const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
)
const ArrowUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
)
const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
)
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
)

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 text-white overflow-hidden">
      
      {/* --- STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        .mono { font-family: 'Space Mono', monospace; }
        
        .grid-bg {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        .hover-underline-animation {
          display: inline-block;
          position: relative;
        }
        .hover-underline-animation::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: 0;
          left: 0;
          background-color: #00D9FF;
          transform-origin: bottom right;
          transition: transform 0.25s ease-out;
        }
        .hover-underline-animation:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>

      {/* Background Pattern */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 pt-20 pb-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00D9FF] flex items-center justify-center text-black">
                <ZapIcon />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">
                  SGSITS<span className="text-[#00D9FF]">.MARKET</span>
                </h2>
                <div className="mono text-[10px] text-white/40 tracking-widest">
                  SYS_VER_2.4.0 // STABLE
                </div>
              </div>
            </div>
            
            <p className="text-white/60 mono text-sm leading-relaxed max-w-md border-l-2 border-white/10 pl-4">
              // The decentralized marketplace for SGSITS Indore. 
              <br/>
              // Built by students, for students. 
              <br/>
              // Zero fees. Instant trade.
            </p>

            {/* Newsletter / Input Mock */}
            <div className="max-w-xs">
              <label className="mono text-[10px] text-white/40 uppercase mb-2 block">
                Stay Updated
              </label>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="ENTER_EMAIL_ID" 
                  className="bg-zinc-900 border border-white/20 px-4 py-2 text-xs mono text-white w-full focus:outline-none focus:border-[#00D9FF] placeholder:text-white/20"
                />
                <button className="bg-white text-black px-4 py-2 text-xs font-bold uppercase hover:bg-[#00D9FF] transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* LINKS COLUMN 1 */}
          <div className="md:col-span-2">
            <h4 className="mono text-xs text-[#00D9FF] uppercase tracking-widest mb-6 font-bold">
              / Platform
            </h4>
            <ul className="space-y-4 mono text-sm text-white/60">
              {['Browse All', 'Sell Item', 'Categories', 'Leaderboard'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white hover-underline-animation transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* LINKS COLUMN 2 */}
          <div className="md:col-span-2">
            <h4 className="mono text-xs text-[#00D9FF] uppercase tracking-widest mb-6 font-bold">
              / Connect
            </h4>
            <ul className="space-y-4 mono text-sm text-white/60">
              {[
                { label: 'Instagram', icon: <InstagramIcon /> },
                { label: 'Github', icon: <GithubIcon /> },
                { label: 'Contact', icon: <MailIcon /> }
              ].map((item) => (
                <li key={item.label}>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-colors group">
                    <span className="text-white/40 group-hover:text-[#00D9FF] transition-colors">{item.icon}</span>
                    <span className="hover-underline-animation">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* STATUS COLUMN */}
          <div className="md:col-span-3">
             <div className="bg-zinc-900 border border-white/10 p-6">
               <h4 className="mono text-xs text-white/40 uppercase mb-4 border-b border-white/10 pb-2">
                 System Status
               </h4>
               <div className="space-y-3">
                 <div className="flex justify-between items-center mono text-xs">
                   <span className="text-white/60">SERVER UPTIME</span>
                   <span className="text-[#10B981]">99.9%</span>
                 </div>
                 <div className="flex justify-between items-center mono text-xs">
                   <span className="text-white/60">ACTIVE TRADES</span>
                   <span className="text-white">1,248</span>
                 </div>
                 <div className="flex justify-between items-center mono text-xs">
                   <span className="text-white/60">LAST UPDATE</span>
                   <span className="text-[#FF6B35]">JUST NOW</span>
                 </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="mono text-[10px] text-green-500 uppercase">All Systems Operational</span>
               </div>
             </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 mono text-xs">
            © 2026 SGSITS Market. Open Source Project.
          </p>

          <div className="flex items-center gap-8">
            <a href="#" className="mono text-xs text-white/40 hover:text-white uppercase">Privacy Policy</a>
            <a href="#" className="mono text-xs text-white/40 hover:text-white uppercase">Terms of Service</a>
            
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-2 bg-white text-black px-4 py-2 text-xs font-bold uppercase hover:bg-[#00D9FF] transition-colors"
            >
              Top <ArrowUpIcon />
            </button>
          </div>
        </div>

      </div>

      {/* MARQUEE FOOTER */}
      <div className="border-t border-white/10 bg-black py-2 overflow-hidden select-none">
        <div className="whitespace-nowrap animate-marquee flex gap-8">
          {[...Array(10)].map((_, i) => (
             <span key={i} className="mono text-xs font-bold text-white/20 uppercase tracking-[0.2em]">
               /// SGSITS EXCLUSIVE /// VERIFIED STUDENTS /// SECURE TRADE /// NO MIDDLEMEN
             </span>
          ))}
        </div>
      </div>

    </footer>
  )
}

export default Footer