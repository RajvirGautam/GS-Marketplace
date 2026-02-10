import React, { useState, useEffect } from 'react'
import Icons from '../../assets/icons/Icons'
import Badge from '../ui/Badge'
import GlassCard from '../ui/GlassCard'

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
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 12s linear infinite; }
  
  .animate-catchy-content {
    animation: slideInBlur 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  
 {/* @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  .animate-progress-bar {
    animation: progress 1.2s linear infinite;
  } */}
`;

const HeroCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Full Data Array ---
  const cards = [
    {
      id: 1,
        user: "Amit (Mech)",
      price: "₹450",
      title: "Roller Drafter (Omega)",
      tag: "Engineering",
      image: "https://preview.redd.it/selling-mini-drafter-v0-rmjq1zd5od4e1.jpeg?width=1080&crop=smart&auto=webp&s=b857f686d39719cac2139b19136d4c28214028e7",
      color: "from-cyan-500 to-blue-600",
      bgClass: "bg-orange-50/50 dark:bg-slate-800"
      
    },
    {
      id: 2,
      user: "Shivani (CSE)",
      price: "₹8,000",
      title: "Raspberry Pi 4 Model B",
      tag: "Electronics",
      image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
      color: "from-pink-500 to-orange-400",
      bgClass: "bg-indigo-100/50 dark:bg-slate-800"
    },
    {
      id: 3,
      user: "Rahul (IT)",
      price: "₹1,200",
      title: "Casio FX-991EX Calculator",
      tag: "Tools",
      image: "https://sppbook.com.my/image/sppbook/image/cache/data/all_product_images/product-3540/wO1NXWnS1626487064-1280x960.jpeg",
      color: "from-purple-500 to-indigo-500",
      bgClass: "bg-purple-100/50 dark:bg-slate-800"
    },
    {
      id: 4,
      user: "Priya (EI)",
      price: "₹150",
      title: "Shivani Guide (Data Structures)",
      tag: "Books",
      image: "https://cdn-ilblhlh.nitrocdn.com/GPZeMEUHDphHkVuSHXUfUfAmIVwnktTp/assets/images/optimized/rev-ecdaa54/notes.newtondesk.com/wp-content/uploads/2024/02/Data-structures-DSA-study-notes-pdf-samp3.jpg",
      color: "from-green-400 to-emerald-600",
      bgClass: "bg-green-50/50 dark:bg-slate-800"
    },
    {
      id: 5,
      user: "Vikram (EC)",
      price: "₹1,500",
      title: "Arduino Uno R3 Kit",
      tag: "Electronics",
      image: "https://i.pinimg.com/736x/35/81/e9/3581e9c6a6d7d26c57ee25ea722a8110.jpg", 
      color: "from-teal-400 to-cyan-500",
      bgClass: "bg-teal-50/50 dark:bg-slate-800"
    },
    {
      id: 6,
      user: "Neha (Civil)",
      price: "₹200",
      title: "Workshop Apron (White)",
      tag: "Uniform",
      image: "https://www.justlabcoats.com/cdn/shop/files/PA-ST1005015LRL_c78fb52c-8cf0-41cc-9a41-de8f9d160fa1.jpg?v=1751371276",
      color: "from-slate-400 to-gray-600",
      bgClass: "bg-gray-100/50 dark:bg-slate-800"
    },
    {
      id: 7,
      user: "Arjun (IP)",
      price: "₹300",
      title: "ED Instrument Box",
      tag: "Tools",
      image: "https://preview.redd.it/selling-mini-drafter-v0-rmjq1zd5od4e1.jpeg?width=1080&crop=smart&auto=webp&s=b857f686d39719cac2139b19136d4c28214028e7",
      color: "from-red-400 to-orange-500",
      bgClass: "bg-red-50/50 dark:bg-slate-800"
    },
    {
      id: 8,
      user: "Sanya (CS)",
      price: "₹600",
      title: "GATE Solved Papers (2024)",
      tag: "Books",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      color: "from-yellow-400 to-amber-600",
      bgClass: "bg-yellow-50/50 dark:bg-slate-800"
    },
    {
      id: 9,
      user: "Rohan (EE)",
      price: "₹400",
      title: "Digital Multimeter",
      tag: "Electronics",
      image: "https://cdn.klium.com/images/fe6eef29-ed67-475c-8c5d-9d54bfee7a19/fluke_2583583_6/fluke_2583583_6.jpg",
      color: "from-blue-400 to-indigo-600",
      bgClass: "bg-blue-50/50 dark:bg-slate-800"
    },
    {
      id: 10,
      user: "Kavya (BM)",
      price: "₹800",
      title: "Laptop Stand (Adjustable)",
      tag: "Accessories",
      image: "https://deq64r0ss2hgl.cloudfront.net/images/product/laptop-stand-96949611553662.jpg",
      color: "from-violet-400 to-fuchsia-500",
      bgClass: "bg-violet-50/50 dark:bg-slate-800"
    }
  ];

  // --- Background Vectors ---
  const bgVectors = [
    { icon: Icons.DrafterTools, color: 'text-blue-300/60 dark:text-blue-400/30', position: '-top-10 -left-12', size: 'w-32 h-32', animation: 'animate-float' },
    { icon: Icons.Calculator, color: 'text-cyan-300/60 dark:text-cyan-400/30', position: 'top-20 left-0', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
    { icon: Icons.LaptopCode, color: 'text-violet-300/60 dark:text-violet-400/30', position: '-top-12 -right-12', size: 'w-32 h-32', animation: 'animate-float' },
    { icon: Icons.Notebook, color: 'text-indigo-300/60 dark:text-indigo-400/30', position: 'top-20 right-0', size: 'w-20 h-20', animation: 'animate-spin-slow' },
    { icon: Icons.LogicGate, color: 'text-fuchsia-300/60 dark:text-fuchsia-400/30', position: 'top-1/2 -right-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-pulse-slow' },
    { icon: Icons.Apron, color: 'text-indigo-300/60 dark:text-indigo-400/30', position: 'top-1/2 -left-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-float' },
    { icon: Icons.Multimeter, color: 'text-yellow-300/60 dark:text-yellow-400/30', position: '-bottom-8 -left-8', size: 'w-24 h-24', animation: 'animate-spin-slow' },
    { icon: Icons.SolderingIron, color: 'text-orange-300/60 dark:text-orange-400/30', position: 'bottom-20 left-4', size: 'w-16 h-16', animation: 'animate-float' },
    { icon: Icons.Arduino, color: 'text-emerald-300/60 dark:text-emerald-400/30', position: '-bottom-10 -right-4', size: 'w-28 h-28', animation: 'animate-float' },
    { icon: Icons.Breadboard, color: 'text-teal-300/60 dark:text-teal-400/30', position: 'bottom-24 right-4', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
  ]

  // --- Interval Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 1000); 

    return () => clearInterval(interval);
  }, [cards.length]);

  const currentCard = cards[currentIndex];

  return (
    <div className="relative h-[500px] flex items-center justify-center">
      <style>{styleTag}</style>
      
      {/* Background Icons */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
        {bgVectors.map((vec, idx) => (
          <div 
            key={idx} 
            className={`absolute ${vec.position} ${vec.color} ${vec.size} ${vec.animation} transition-all duration-500 ease-in-out opacity-80 dark:opacity-60`}
          >
            <vec.icon />
          </div>
        ))}
      </div>
      
      {/* Main Card Container */}
      <div className="relative w-full max-w-md h-[380px] perspective-1000 animate-float">
         <div className="w-full h-full relative z-20 transition-all duration-500 hover:scale-[1.02]">
            <GlassCard className="h-full p-6 !bg-white/80 dark:!bg-slate-900/90 !border-white/50 dark:!border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden">
              
              {/* Progress Bar */}
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
                      <h3 className="text-primary font-bold transition-colors duration-300">{currentCard.user}</h3>
                      <p className="text-xs text-secondary font-bold">Just Now</p>
                    </div>
                  </div>
                  <span className="text-indigo-700 dark:text-cyan-400 font-bold bg-white/50 dark:bg-transparent px-3 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                    {currentCard.price}
                  </span>
                </div>

                <div className={`flex-1 rounded-xl ${currentCard.bgClass} mb-4 overflow-hidden relative group w-full transition-colors duration-500 border border-indigo-200 dark:border-slate-700/50 flex items-center justify-center`}>
                   {/* Background Grid Pattern */}
                   <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 z-0" />
                   {/* Image */}
                   <img 
                     src={currentCard.image} 
                     alt={currentCard.title} 
                     className="relative z-10 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                   />
                </div>

                <div>
                    <h4 className="text-xl text-primary font-bold transition-colors duration-300 truncate mb-3">
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
  )
}

export default HeroCards