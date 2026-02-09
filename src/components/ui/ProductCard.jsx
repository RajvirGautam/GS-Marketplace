import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const ProductCard = ({ product, viewMode = 'grid', index = 0 }) => {
  const [isSaved, setIsSaved] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const animationStyle = {
    opacity: 0,
    animationDelay: `${0.5 + (index * 0.05)}s`
  }

  // Stop propagation helper — prevents Link navigation when clicking heart/share
  const stopNav = (e) => e.preventDefault()

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/product/${product.id}`}
        className="group relative bg-[#0F0F0F] border border-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,1)] flex anim-slide-up no-underline"
        style={animationStyle}
      >
        
        {/* Image Section */}
        <div className="relative w-64 flex-shrink-0 overflow-hidden bg-zinc-900 border-r border-white/10">
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
            style={{ background: `linear-gradient(to bottom, ${product.gradientStart}, #000)` }} 
          />
          <img 
            src={product.image} 
            alt={product.title}
            className="relative w-full h-full object-cover mix-blend-normal transition-transform duration-700 group-hover:scale-110"
          />

          {product.isTrending && (
            <div className="absolute top-3 left-3 bg-[#F59E0B] text-black px-2 py-1 mono text-[9px] font-bold">
              🔥 TRENDING
            </div>
          )}
          {product.isVerified && (
            <div className="absolute top-3 right-3 bg-[#00D9FF] text-black px-2 py-0.5 mono text-[9px] font-bold uppercase tracking-wider">
              Verified
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl leading-tight group-hover:text-[#00D9FF] transition-colors mb-1">
                  {product.title}
                </h3>
                <div className="mono text-[10px] text-white/40 uppercase tracking-wider">
                  {product.tag}
                </div>
              </div>
              
              <div className="flex gap-2" onClick={stopNav}>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSaved(!isSaved) }}
                  className="w-9 h-9 flex items-center justify-center bg-black/60 backdrop-blur border border-white/10 hover:border-white/40 transition-colors"
                >
                  <HeartIcon filled={isSaved} />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                  className="w-9 h-9 flex items-center justify-center bg-black/60 backdrop-blur border border-white/10 hover:border-white/40 transition-colors"
                >
                  <ShareIcon />
                </button>
              </div>
            </div>

            <p className="text-white/60 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-white/40 mono mb-4">
              <span className="flex items-center gap-1">
                <LocationIcon /> {product.location}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon /> {product.views} views
              </span>
              <span>⏰ {product.timeAgo}</span>
            </div>

            <div className="flex items-center gap-2 py-3 border-t border-dashed border-white/10">
              <div className="w-8 h-8 rounded-none bg-zinc-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                {product.user.charAt(0)}
              </div>
              <span className="text-sm text-white/70">{product.user}</span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 border-t border-white/10">
            <div>
              <div className="mono text-[9px] text-white/30 uppercase mb-1">Price</div>
              <div className="text-2xl font-black text-white" style={{ color: product.accent }}>
                {product.price}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                className="bg-transparent border border-white/20 text-white px-4 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <ChatIcon /> Chat
              </button>
              <span className="bg-white text-black border border-white px-4 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all">
                View Details
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid View
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative bg-[#0F0F0F] border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,1)] anim-slide-up no-underline block"
      style={animationStyle}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      
      {/* Accent Top Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{ background: product.accent }}
      />

      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 border-b border-white/10">
        
        <div 
          className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ background: `linear-gradient(to bottom, ${product.gradientStart}, #000)` }} 
        />
        
        <img 
          src={product.image} 
          alt={product.title}
          className="relative w-full h-full object-cover mix-blend-normal transition-transform duration-700 group-hover:scale-110"
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.stats && product.stats.map((stat, i) => (
             <div key={i} className="flex items-center gap-1 bg-black/80 backdrop-blur border border-white/10 px-2 py-1">
               <span className="w-2 h-2 rounded-full" style={{ background: product.accent }}></span>
               <span className="mono text-[9px] font-bold text-white">{stat.value}</span>
             </div>
          ))}
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.isTrending && (
            <div className="bg-[#F59E0B] text-black px-2 py-0.5 mono text-[9px] font-bold">
              🔥 TRENDING
            </div>
          )}
          {product.isVerified && (
            <div className="bg-[#00D9FF] text-black px-2 py-0.5 mono text-[9px] font-bold uppercase tracking-wider">
              Verified
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2" onClick={stopNav}>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSaved(!isSaved) }}
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur shadow-lg transition-all ${isSaved ? 'text-red-500' : 'text-black'} hover:scale-110`}
          >
            <HeartIcon filled={isSaved} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur shadow-lg transition-all hover:scale-110"
          >
            <ShareIcon />
          </button>
        </div>

        {/* Metadata Row */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-[10px] text-white/80 mono bg-black/60 backdrop-blur px-2 py-1">
          <span className="flex items-center gap-1">
            <LocationIcon /> {product.location}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon /> {product.views}
          </span>
          <span className="ml-auto">⏰ {product.timeAgo}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 relative">
        
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-200"
             style={{ background: `linear-gradient(45deg, transparent 40%, ${product.accent}10 40%, transparent 60%)` }}
        />

        <div className="mb-2">
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[#00D9FF] transition-colors truncate">
                {product.title}
            </h3>
            <div className="mono text-[10px] text-white/40 uppercase tracking-wider mt-1">
                {product.tag}
            </div>
        </div>

        <div className="flex items-center gap-2 mb-4 py-3 border-t border-dashed border-white/10">
            <div className="w-6 h-6 rounded-none bg-zinc-800 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                {product.user.charAt(0)}
            </div>
            <span className="text-xs text-white/70">{product.user.split(' ')[0]}</span>
            {product.isVerified && (
              <span className="text-[#00D9FF] text-xs">✓</span>
            )}
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="mono text-[9px] text-white/30 uppercase mb-0.5">Price</div>
              <div className="text-xl font-black text-white" style={{ color: product.accent }}>
                {product.price}
              </div>
            </div>
            
            {product.condition && (
              <span className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] mono text-white/60">
                {product.condition.toUpperCase()}
              </span>
            )}
          </div>

          <div className={`grid grid-cols-2 gap-2 transition-all duration-300 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'} md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto`}>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              className="bg-transparent border border-white/20 text-white px-3 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-all flex items-center justify-center gap-1"
            >
              <ChatIcon /> Chat
            </button>
            <span className="bg-white text-black border border-white px-3 py-2 mono text-[10px] font-bold uppercase tracking-wider hover:bg-transparent hover:text-white transition-all text-center">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard