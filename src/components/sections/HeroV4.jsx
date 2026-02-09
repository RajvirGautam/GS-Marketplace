import React from 'react'
import Icons from '../../assets/icons/Icons'
import Badge from '../ui/Badge'
import NeonButton from '../ui/NeonButton'
import HeroCards from './HeroCards'

// Styles specifically for the Cosmic Liquid effect
const styleTag = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes drift {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-blob { animation: blob 10s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
  
  /* Text gradient for the main heading */
  .text-glow {
    text-shadow: 0 0 40px rgba(56, 189, 248, 0.3);
  }
`;

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#050505] flex flex-col items-center justify-center pt-32 pb-20">
      <style>{styleTag}</style>
      
      {/* --- COSMIC LIQUID BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Main Blue Nebula */}
        <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob" />
        {/* Cyan Flow */}
        <div className="absolute top-0 right-1/4 w-[45rem] h-[45rem] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000" />
        {/* Purple Depth */}
        <div className="absolute -bottom-32 left-1/3 w-[55rem] h-[55rem] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-4000" />
        
        {/* Grid Overlay for texture (Optional, adds tech feel) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="mb-6 animate-fade-in-up">
           <span className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md">
             Exclusive for SGSITS
           </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up text-glow max-w-5xl">
          THE FUTURE OF <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400">
            CAMPUS MARKET
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium animate-fade-in-up animation-delay-200">
          Buy, sell, and trade drafters, electronics, and notes within the secure college network. 
          Zero friction. Pure velocity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up animation-delay-200">
          <NeonButton primary className="h-12 px-8 text-base">
            Start Trading
          </NeonButton>
          <button className="h-12 px-8 rounded-lg border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
            View Listings
          </button>
        </div>

        {/* --- HERO CARDS (Replacing the Astronaut) --- */}
        {/* We use perspective to give it that floating 3D feel in the void */}
        <div className="w-full max-w-4xl relative perspective-1000 animate-fade-in-up animation-delay-400">
            {/* An atmospheric glow behind the cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <HeroCards />
        </div>

      </div>
    </section>
  )
  
}

export default Hero