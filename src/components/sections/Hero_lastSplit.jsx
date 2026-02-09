import React, { useState, useEffect } from 'react'
import Icons from '../../assets/icons/Icons'
import NeonButton from '../ui/NeonButton'
import HeroCards from './HeroCards'

// --- HELPER COMPONENT: Interpolation Logic ---
const AnimatedCounter = ({ end, duration = 4000, decimals = 0, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * end);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{prefix}{count.toFixed(decimals)}{suffix}</span>;
};

// --- Styles ---
const styleTag = `
  /* FXIFY GRID BACKGROUND */
  .grid-bg {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 100px 100px;
  }
  
  /* CENTRAL GLOW */
  .glow-orb {
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
    filter: blur(60px);
  }

  /* TEXT GRADIENT */
  .text-gradient-hero {
    background: linear-gradient(to right, #fff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* ANIMATIONS */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 12s linear infinite; }
`;

const Hero = () => {
  
  // --- Background Vectors ---
  const bgVectors = [
    { icon: Icons.DrafterTools, color: 'text-blue-400/30', position: '-top-10 -left-12', size: 'w-32 h-32', animation: 'animate-float' },
    { icon: Icons.Calculator, color: 'text-cyan-400/30', position: 'top-20 left-0', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
    { icon: Icons.LaptopCode, color: 'text-violet-400/30', position: '-top-12 -right-12', size: 'w-32 h-32', animation: 'animate-float' },
    { icon: Icons.Notebook, color: 'text-indigo-400/30', position: 'top-20 right-0', size: 'w-20 h-20', animation: 'animate-spin-slow' },
    { icon: Icons.LogicGate, color: 'text-fuchsia-400/30', position: 'top-1/2 -right-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-pulse-slow' },
    { icon: Icons.Apron, color: 'text-indigo-400/30', position: 'top-1/2 -left-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-float' },
    { icon: Icons.Multimeter, color: 'text-yellow-400/30', position: '-bottom-8 -left-8', size: 'w-24 h-24', animation: 'animate-spin-slow' },
    { icon: Icons.SolderingIron, color: 'text-orange-400/30', position: 'bottom-20 left-4', size: 'w-16 h-16', animation: 'animate-float' },
    { icon: Icons.Arduino, color: 'text-emerald-400/30', position: '-bottom-10 -right-4', size: 'w-28 h-28', animation: 'animate-float' },
    { icon: Icons.Breadboard, color: 'text-teal-400/30', position: 'bottom-24 right-4', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
  ];

  return (
    <section className="relative min-h-screen bg-[#030610] text-white overflow-hidden flex items-center pt-32 pb-12 lg:pt-24 font-sans selection:bg-blue-500/30">
      <style>{styleTag}</style>
      
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] glow-orb z-0 pointer-events-none" />

      {/* --- Main Layout --- */}
      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        {/* CHANGED: 'gap-12' for mobile spacing, 'lg:gap-8' for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* --- LEFT COLUMN: Title & Stats (Order 1) --- */}
          <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300 mb-8 w-fit mx-auto lg:mx-0 backdrop-blur-md">
              <span className="text-blue-400 font-semibold">Campus Market</span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1">Exclusive for SGSITS <Icons.ChevronRight className="w-3 h-3" /></span>
            </div>

            {/* Responsive Text Size: text-4xl on mobile, text-7xl on desktop */}
            <h1 className="text-5xl md:text-7xl font-black text-white mt-6 leading-[1.1] tracking-tight">
                The Future of 
                <span className="neon-text text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500"> Campus Market</span>
            </h1>

            <div className="flex justify-center lg:justify-start gap-8 lg:gap-12 border-t border-white/5 pt-8">
              <div className="text-left">
                <h3 className="text-xl lg:text-2xl font-bold text-white">
                  <AnimatedCounter end={100} suffix="%" />
                </h3>
                <p className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-wider mt-1">Verified Students</p>
              </div>
              <div className="text-left">
                <h3 className="text-xl lg:text-2xl font-bold text-white">
                  <AnimatedCounter end={24} suffix="/7" />
                </h3>
                <p className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-wider mt-1">Live Listings</p>
              </div>
              <div className="text-left">
                <h3 className="text-xl lg:text-2xl font-bold text-white">
                   <AnimatedCounter end={0} suffix="" />
                </h3>
                <p className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-wider mt-1">Middlemen</p>
              </div>
            </div>
          </div>

          {/* --- CENTER COLUMN: The Stage (Order 2 on Mobile, Order 2 on Desktop) --- */}
          {/* CHANGED: h-[350px] on mobile to fit screen better, h-[500px] on desktop */}
          <div className="lg:col-span-4 flex justify-center items-center relative order-2 h-[350px] lg:h-[500px] my-4 lg:my-0">
             
             {/* Background Vectors */}
             <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible opacity-50 lg:opacity-100">
                {bgVectors.map((vec, idx) => (
                  <div 
                    key={idx} 
                    className={`absolute ${vec.position} ${vec.color} ${vec.size} ${vec.animation} transition-all duration-500 ease-in-out`}
                  >
                    <vec.icon />
                  </div>
                ))}
             </div>

             {/* The Cards Component */}
             <HeroCards />
             
          </div>

          {/* --- RIGHT COLUMN: Description & CTA (Order 3) --- */}
          <div className="lg:col-span-4 flex flex-col justify-center lg:justify-end h-full pl-0 lg:pl-10 order-3 text-center lg:text-left">
             <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Engineering Essentials</h3>
             <p className="text-slate-400 text-base lg:text-lg leading-relaxed mb-8">
                Find the specific tools you need for your semester. From Drafters and Quantums to Lab Coats and Microcontrollers. Exchange items directly on campus without the hassle of shipping.
             </p>

             <ul className="text-left space-y-3 mb-10 mx-auto lg:mx-0 inline-block">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0"><Icons.CheckCircle className="w-3 h-3" /></span>
                    Verified SGSITS Students Only
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0"><Icons.Zap className="w-3 h-3" /></span>
                    Instant Campus Handover
                </li>
             </ul>

             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
                <NeonButton primary className="!w-full sm:!w-auto !px-8 !py-3 shadow-[0_0_30px_rgba(37,99,235,0.3)] justify-center">
                    Browse Market <Icons.ChevronRight />
                </NeonButton>
                <NeonButton className="!w-full sm:!w-auto !px-8 !py-3 !border-white/10 hover:!bg-white/5 justify-center">
                    List Item
                </NeonButton>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero