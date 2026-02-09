import React from 'react'
import Icons from '../../assets/icons/Icons'

// --- 10/10 VELOCITY ENGINE ---
const styleTag = `
  @keyframes hyper-flux {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
  
  .velocity-text {
    /* The "Plasma" Gradient */
    background: linear-gradient(
      90deg, 
      #4f46e5 0%,   /* Indigo */
      #06b6d4 40%,  /* Cyan */
      #ffffff 50%,  /* White-Hot Core */
      #06b6d4 60%,  /* Cyan */
      #4f46e5 100%  /* Indigo */
    );
    background-size: 200% auto;
    
    /* Clipping to Text */
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    
    /* The Engine */
    animation: hyper-flux 2s linear infinite;
    
    /* The Afterburner Glow */
    filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.5));
  }
`;

// Reusable Card Component
const FeatureCard = ({ icon, subtitle, title, desc }) => (
  <div className="bg-[#0b0f25]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:bg-white/5 transition-all cursor-default group relative overflow-hidden h-full flex flex-col">
    {/* Hover Arrow Effect */}
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
    </div>

    {/* Icon Wrapper */}
    <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>

    {/* Content */}
    <div className="mt-auto">
      <div className="text-xs font-medium text-blue-400 mb-2 uppercase tracking-wider">
        {subtitle}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
)

const Features = () => {
  return (
    <section className="py-32 relative bg-[#030511] overflow-hidden font-sans">
      <style>{styleTag}</style>

      {/* Background Glow Effects */}
      <div className="absolute w-[600px] h-[600px] bg-purple-800 rounded-full blur-[100px] opacity-20 top-[20%] right-[-10%] z-0" />
      <div className="absolute w-[500px] h-[500px] bg-blue-900 rounded-full blur-[100px] opacity-20 bottom-[-10%] left-[-10%] z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Built for <br className="md:hidden" />
            
            {/* --- THE VELOCITY COMPONENT --- */}
            <span className="inline-block relative">
                <span className="velocity-text italic pr-2 transform -skew-x-12 inline-block">
                    Velocity
                </span>
                {/* Optional: A subtle blur clone behind it for extra speed perception */}
                <span className="velocity-text italic pr-2 transform -skew-x-12 absolute inset-0 blur-md opacity-50 -z-10">
                    Velocity
                </span>
            </span>
            {/* ----------------------------- */}
            
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            A marketplace engineered specifically for the SGSITS ecosystem. Secure, instant, and hyper-local.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* --- TILE 1: CAMPUS SHIELD (BIG) --- */}
          <div className="lg:col-span-2 bg-[#0b0f25]/60 backdrop-blur-xl border border-white/5 p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:bg-white/5 transition-all">
            <div className="flex-1 z-10">
              <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icons.Shield />
              </div>
              <div className="text-xs font-medium text-purple-400 mb-2 uppercase tracking-wider">
                Exclusivity
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Campus Shield Verification
              </h3>
              <p className="text-gray-400 leading-relaxed">
                The walled garden. Access is cryptographically restricted to official institute emails (@sgsits.ac.in). No outsiders, zero spam, 100% verified students.
              </p>
            </div>
            
            {/* Visual: Abstract Wave + Badge */}
            <div className="flex-1 h-full w-full flex items-center justify-center relative min-h-[200px]">
              <div className="absolute w-40 h-40 bg-purple-600 blur-3xl opacity-20 animate-pulse-slow"></div>
              <svg viewBox="0 0 100 50" className="w-full text-purple-500 opacity-50 absolute">
                <path d="M20,25 C20,10 40,10 50,25 C60,40 80,40 80,25 C80,10 60,10 50,25 C40,40 20,40 20,25" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="bg-[#030511] border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(74,222,128,0.2)] z-10 animate-float">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2 animate-pulse"/>
                VERIFIED
              </div>
            </div>
          </div>

          {/* --- TILE 2: LIVE COMMS (SMALL) --- */}
          <FeatureCard 
            icon={<Icons.Zap />} 
            subtitle="Real-Time"
            title="Live Comms"
            desc="Negotiate in real-time. Low-latency internal messaging designed for rapid meetups on campus."
          />

          {/* --- TILE 3: ZERO COMMISSION (SMALL) --- */}
          <FeatureCard 
            icon={<Icons.ShoppingBag />}
            subtitle="Marketplace"
            title="Zero Commission"
            desc="Keep 100% of your sale value. We facilitate the connection; you handle the exchange."
          />

          {/* --- TILE 4: DEEP QUERY SEARCH (BIG) --- */}
          <div className="lg:col-span-2 bg-[#0b0f25]/60 backdrop-blur-xl border border-white/5 p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:bg-white/5 transition-all">
            <div className="flex-1 z-10 order-2 md:order-1">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icons.Search />
              </div>
              <div className="text-xs font-medium text-cyan-400 mb-2 uppercase tracking-wider">
                Intelligence
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Deep Query Search
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Don't just scroll. Filter by branch, year, condition, or specific textbook editions. Find exactly what you need in milliseconds.
              </p>
            </div>
            
            {/* Visual: Search UI & Tags */}
            <div className="flex-1 h-full w-full flex items-center justify-center relative min-h-[200px] order-1 md:order-2">
              <div className="absolute w-40 h-40 bg-cyan-600 blur-3xl opacity-20 animate-pulse-slow"></div>
              
              {/* Mock Search Bar */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[240px] h-10 bg-[#030511] border border-cyan-500/30 rounded-lg flex items-center px-3 shadow-[0_0_30px_rgba(34,211,238,0.1)] z-10">
                 <Icons.Search className="w-4 h-4 text-cyan-500 mr-2" />
                 <div className="h-2 w-24 bg-gray-700/50 rounded-full animate-pulse"></div>
              </div>

              {/* Floating Tags */}
              <div className="absolute top-[20%] right-[10%] bg-blue-900/40 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-md text-[10px] font-bold animate-float" style={{animationDelay: '0s'}}>
                #Civil
              </div>
              <div className="absolute bottom-[20%] left-[10%] bg-purple-900/40 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-md text-[10px] font-bold animate-float" style={{animationDelay: '1s'}}>
                #1stYear
              </div>
              <div className="absolute top-[15%] left-[15%] bg-green-900/40 border border-green-500/30 text-green-300 px-3 py-1 rounded-md text-[10px] font-bold animate-float" style={{animationDelay: '2s'}}>
                #Drafter
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Features