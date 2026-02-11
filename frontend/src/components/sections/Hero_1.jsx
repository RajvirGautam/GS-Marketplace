import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Ruler, 
  Calculator, 
  Laptop, 
  BookOpen, 
  Cpu, 
  Shirt, 
  Activity, 
  Zap, 
  HardDrive, 
  Grid 
} from 'lucide-react';

// --- Styles for Animation ---
const styleTag = `
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
  /* CATCHY NEW EFFECT: Slide Up + Blur + Scale */
  @keyframes slideInBlur {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.9) skewX(-2deg);
      filter: blur(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1) skewX(0);
      filter: blur(0);
    }
  }
  /* Progress Bar Animation */
  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 12s linear infinite; }
  
  /* Applied when key changes */
  .animate-catchy-content {
    animation: slideInBlur 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  
  .animate-progress-bar {
    animation: progress 1s linear infinite;
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  .dark .glass-card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .neon-text {
    color: #4f46e5;
    text-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
  }
  .dark .neon-text {
    color: #818cf8;
    text-shadow: 0 0 10px rgba(129, 140, 248, 0.5);
  }
`;

// --- UI Components ---

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700 ${className}`}>
    {children}
  </span>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`glass-card rounded-2xl ${className}`}>
    {children}
  </div>
);

const NeonButton = ({ children, primary, className = "" }) => {
  const baseClass = "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1";
  const primaryClass = "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)]";
  const secondaryClass = "bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-indigo-900 dark:text-indigo-100 backdrop-blur-md border border-white/20";
  
  return (
    <button className={`${baseClass} ${primary ? primaryClass : secondaryClass} ${className}`}>
      {children}
    </button>
  );
};

// --- Main Hero Component ---

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Data Array
  const cards = [
    {
      id: 1,
      user: "Shivani (CSE)",
      price: "₹8,000",
      title: "Raspberry Pi 4 Model B",
      tag: "Electronics",
      color: "from-pink-500 to-orange-400",
      bgClass: "bg-indigo-100/50 dark:bg-slate-800"
    },
    {
      id: 2,
      user: "Amit (Mech)",
      price: "₹450",
      title: "Roller Drafter (Omega)",
      tag: "Engineering",
      color: "from-cyan-500 to-blue-600",
      bgClass: "bg-orange-50/50 dark:bg-slate-800"
    },
    {
      id: 3,
      user: "Rahul (IT)",
      price: "₹1,200",
      title: "Casio FX-991EX Classwiz",
      tag: "Tools",
      color: "from-purple-500 to-indigo-500",
      bgClass: "bg-purple-100/50 dark:bg-slate-800"
    },
    {
      id: 4,
      user: "Priya (EI)",
      price: "₹150",
      title: "Shivani Guide (Data Structs)",
      tag: "Books",
      color: "from-green-400 to-emerald-600",
      bgClass: "bg-green-50/50 dark:bg-slate-800"
    },
    {
      id: 5,
      user: "Vikram (EC)",
      price: "₹1,500",
      title: "Arduino Uno R3 Kit",
      tag: "Electronics",
      color: "from-teal-400 to-cyan-500",
      bgClass: "bg-teal-50/50 dark:bg-slate-800"
    },
    {
      id: 6,
      user: "Neha (Civil)",
      price: "₹200",
      title: "Workshop Apron (White)",
      tag: "Uniform",
      color: "from-slate-400 to-gray-600",
      bgClass: "bg-gray-100/50 dark:bg-slate-800"
    },
    {
      id: 7,
      user: "Arjun (IP)",
      price: "₹300",
      title: "ED Instrument Box",
      tag: "Tools",
      color: "from-red-400 to-orange-500",
      bgClass: "bg-red-50/50 dark:bg-slate-800"
    },
    {
      id: 8,
      user: "Sanya (CS)",
      price: "₹600",
      title: "GATE Solved Papers (2024)",
      tag: "Books",
      color: "from-yellow-400 to-amber-600",
      bgClass: "bg-yellow-50/50 dark:bg-slate-800"
    },
    {
      id: 9,
      user: "Rohan (EE)",
      price: "₹400",
      title: "Digital Multimeter",
      tag: "Electronics",
      color: "from-blue-400 to-indigo-600",
      bgClass: "bg-blue-50/50 dark:bg-slate-800"
    },
    {
      id: 10,
      user: "Kavya (BM)",
      price: "₹800",
      title: "Laptop Stand (Adjustable)",
      tag: "Accessories",
      color: "from-violet-400 to-fuchsia-500",
      bgClass: "bg-violet-50/50 dark:bg-slate-800"
    }
  ];

  // Decoration Icons
  const bgVectors = [
    { icon: Ruler, color: 'text-blue-300/60 dark:text-blue-400/30', position: '-top-10 -left-12', size: 'w-32 h-32', animation: 'animate-float' },
    { icon: Calculator, color: 'text-cyan-300/60 dark:text-cyan-400/30', position: 'top-20 left-0', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
    { icon: Laptop, color: 'text-violet-300/60 dark:text-violet-400/30', position: '-top-12 -right-12', size: 'w-32 h-32', animation: 'animate-float' },
    { icon: BookOpen, color: 'text-indigo-300/60 dark:text-indigo-400/30', position: 'top-20 right-0', size: 'w-20 h-20', animation: 'animate-spin-slow' },
    { icon: Cpu, color: 'text-fuchsia-300/60 dark:text-fuchsia-400/30', position: 'top-1/2 -right-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-pulse-slow' },
    { icon: Shirt, color: 'text-indigo-300/60 dark:text-indigo-400/30', position: 'top-1/2 -left-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-float' },
    { icon: Activity, color: 'text-yellow-300/60 dark:text-yellow-400/30', position: '-bottom-8 -left-8', size: 'w-24 h-24', animation: 'animate-spin-slow' },
    { icon: Zap, color: 'text-orange-300/60 dark:text-orange-400/30', position: 'bottom-20 left-4', size: 'w-16 h-16', animation: 'animate-float' },
    { icon: HardDrive, color: 'text-emerald-300/60 dark:text-emerald-400/30', position: '-bottom-10 -right-4', size: 'w-28 h-28', animation: 'animate-float' },
    { icon: Grid, color: 'text-teal-300/60 dark:text-teal-400/30', position: 'bottom-24 right-4', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 1000); 

    return () => clearInterval(interval);
  }, [cards.length]);

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-300 font-sans">
      <style>{styleTag}</style>
      <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[80px] bg-purple-400/30 dark:bg-indigo-600/30 animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[80px] bg-cyan-400/30 dark:bg-cyan-600/20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="animate-catchy-content">
            <Badge>Exclusive for SGSITS Students</Badge>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mt-6 leading-[1.1] tracking-tight">
              The Future of <br />
              <span className="neon-text">Campus Market</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg mt-6 max-w-lg leading-relaxed font-semibold">
              Buy, sell, and trade drafters, quantums, electronics, and notes within the SGSITS secure network. No middlemen. Pure velocity.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <NeonButton primary>
                Start Trading <ChevronRight size={20} />
              </NeonButton>
              <NeonButton>View Listings</NeonButton>
            </div>

            <div className="mt-12 flex gap-8 text-slate-600 dark:text-slate-400">
              <div>
                <h4 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2.5k+</h4>
                <p className="text-xs uppercase tracking-wider mt-1 font-bold">Active Students</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹12L+</h4>
                <p className="text-xs uppercase tracking-wider mt-1 font-bold">Volume Traded</p>
              </div>
            </div>
          </div>

          {/* Right Floating Card Section */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Background Icons */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
              {bgVectors.map((vec, idx) => {
                const Icon = vec.icon;
                return (
                  <div 
                    key={idx} 
                    className={`absolute ${vec.position} ${vec.color} ${vec.size} ${vec.animation} transition-all duration-500 ease-in-out opacity-80 dark:opacity-60`}
                  >
                    <Icon className="w-full h-full" />
                  </div>
                )
              })}
            </div>
            
            {/* Main Card Container with FLOAT animation restored */}
            <div className="relative w-full max-w-md h-[380px] perspective-1000 animate-float">
               <div className="w-full h-full relative z-20 transition-all duration-500 hover:scale-[1.02]">
                  <GlassCard className="h-full p-6 !bg-white/80 dark:!bg-slate-900/90 !border-white/50 dark:!border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden">
                    
                    {/* Progress Bar at top to indicate switch time */}
                    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 z-50 animate-progress-bar w-full opacity-70" />

                    {/* Content Wrapper with Catchy Animation */}
                    <div 
                      key={currentCard.id} 
                      className="flex flex-col h-full animate-catchy-content"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentCard.color} shadow-md border-2 border-white dark:border-slate-700`} />
                          <div>
                            <h3 className="text-slate-900 dark:text-white font-bold transition-colors duration-300">{currentCard.user}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Just Now</p>
                          </div>
                        </div>
                        <span className="text-indigo-700 dark:text-cyan-400 font-bold bg-white/50 dark:bg-transparent px-3 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                          {currentCard.price}
                        </span>
                      </div>

                      <div className={`flex-1 rounded-xl ${currentCard.bgClass} mb-4 overflow-hidden relative group w-full transition-colors duration-500 border border-indigo-200 dark:border-slate-700/50 flex items-center justify-center`}>
                         <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
                        <span className="text-indigo-400 dark:text-slate-500 font-bold tracking-widest uppercase text-sm animate-pulse-slow relative z-10">
                          {currentCard.tag}_IMG
                        </span>
                      </div>

                      <div>
                          <h4 className="text-xl text-slate-900 dark:text-white font-bold transition-colors duration-300 truncate mb-3">
                          {currentCard.title}
                          </h4>
                          <div className="flex gap-2">
                          <Badge>{currentCard.tag}</Badge>
                          <Badge>Verified</Badge>
                          </div>
                      </div>
                    </div>
                  </GlassCard>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero