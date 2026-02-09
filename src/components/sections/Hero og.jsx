import { useState } from 'react'
import Icons from '../../assets/icons/Icons'
import Badge from '../ui/Badge'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

const Hero = () => {
  const [activeCard, setActiveCard] = useState(1)

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
    }
  ]

  const bgVectors = [
    { icon: Icons.DrafterTools, color: 'text-blue-300/60 dark:text-blue-400/30', position: '-top-10 -left-12', size: 'w-32 h-32', animation: 'animate-float' },
    { icon: Icons.Calculator, color: 'text-cyan-300/60 dark:text-cyan-400/30', position: 'top-20 left-0', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
    { icon: Icons.LaptopCode, color: 'text-violet-300/60 dark:text-violet-400/30', position: '-top-12 -right-12', size: 'w-32 h-32', animation: 'animate-float animation-delay-1000' },
    { icon: Icons.Notebook, color: 'text-indigo-300/60 dark:text-indigo-400/30', position: 'top-20 right-0', size: 'w-20 h-20', animation: 'animate-spin-reverse' },
    { icon: Icons.LogicGate, color: 'text-fuchsia-300/60 dark:text-fuchsia-400/30', position: 'top-1/2 -right-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-pulse-slow' },
    { icon: Icons.Apron, color: 'text-indigo-300/60 dark:text-indigo-400/30', position: 'top-1/2 -left-8 -translate-y-1/2', size: 'w-24 h-24', animation: 'animate-float' },
    { icon: Icons.Multimeter, color: 'text-yellow-300/60 dark:text-yellow-400/30', position: '-bottom-8 -left-8', size: 'w-24 h-24', animation: 'animate-spin-slow' },
    { icon: Icons.SolderingIron, color: 'text-orange-300/60 dark:text-orange-400/30', position: 'bottom-20 left-4', size: 'w-16 h-16', animation: 'animate-float animation-delay-500' },
    { icon: Icons.Arduino, color: 'text-emerald-300/60 dark:text-emerald-400/30', position: '-bottom-10 -right-4', size: 'w-28 h-28', animation: 'animate-float' },
    { icon: Icons.Breadboard, color: 'text-teal-300/60 dark:text-teal-400/30', position: 'bottom-24 right-4', size: 'w-16 h-16', animation: 'animate-pulse-slow' },
  ]

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[80px] bg-purple-400/30 dark:bg-indigo-600/30 animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[80px] bg-cyan-400/30 dark:bg-cyan-600/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <Badge>Exclusive for SGSITS Students</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-primary mt-6 leading-[1.1] tracking-tight">
            The Future of <br />
            <span className="neon-text">Campus Market</span>
          </h1>
          <p className="text-secondary text-lg mt-6 max-w-lg leading-relaxed font-semibold">
            Buy, sell, and trade drafters, quantums, electronics, and notes within the SGSITS secure network. No middlemen. Pure velocity.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <NeonButton primary>
              Start Trading <Icons.ChevronRight />
            </NeonButton>
            <NeonButton>View Listings</NeonButton>
          </div>

          <div className="mt-12 flex gap-8 text-secondary">
            <div>
              <h4 className="text-2xl font-bold text-primary transition-colors duration-300">2.5k+</h4>
              <p className="text-xs uppercase tracking-wider mt-1 font-bold">Active Students</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-primary transition-colors duration-300">₹12L+</h4>
              <p className="text-xs uppercase tracking-wider mt-1 font-bold">Volume Traded</p>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] flex items-center justify-center">
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
          
          <div className="relative w-full max-w-md h-[320px] animate-float perspective-1000">
            {cards.map((card) => {
              const isActive = activeCard === card.id
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  className={`
                    absolute top-0 left-0 w-full transition-all duration-500 ease-out cursor-pointer
                    ${isActive 
                      ? 'z-20 scale-100 translate-x-0 translate-y-0 cursor-default' 
                      : 'z-10 scale-95 translate-x-20 translate-y-24 hover:scale-100 hover:brightness-110'
                    }
                  `}
                >
                  <GlassCard className={`p-6 !bg-white/60 dark:!bg-slate-900/80 !border-white/50 dark:!border-white/10 backdrop-blur-xl ${isActive ? 'shadow-2xl' : 'shadow-lg'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${card.color} shadow-md`} />
                        <div>
                          <h3 className="text-primary font-bold transition-colors duration-300">{card.user}</h3>
                          <p className="text-xs text-secondary font-bold">Just Now</p>
                        </div>
                      </div>
                      <span className="text-indigo-700 dark:text-cyan-400 font-bold bg-white/50 dark:bg-transparent px-2 py-1 rounded-md border border-white dark:border-none">
                        {card.price}
                      </span>
                    </div>
                    <div className={`h-40 rounded-xl ${card.bgClass} mb-4 overflow-hidden relative group w-full transition-colors duration-300 border border-indigo-200 dark:border-none flex items-center justify-center`}>
                      <span className="text-indigo-400 dark:text-slate-500 font-bold tracking-widest uppercase text-sm">
                        {card.tag}_IMG
                      </span>
                    </div>
                    <h4 className="text-lg text-primary font-bold transition-colors duration-300 truncate">
                      {card.title}
                    </h4>
                    <div className="flex gap-2 mt-3">
                      <Badge>{card.tag}</Badge>
                      <Badge>Used</Badge>
                    </div>
                  </GlassCard>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero