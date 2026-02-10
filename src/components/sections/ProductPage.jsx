// src/pages/ProductPage.jsx

import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products } from '/Users/vkgautam/Desktop/GS-MARK-II/sgsits-market/src/components/sections/Products.js' // Importing shared data

/* --- Icons --- */
const ArrowLeft = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>)
const Heart = ({ filled }) => (<svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>)
const Shield = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>)
const Message = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>)
const Zap = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>)
const GridIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>)
const Clock = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>)
const Eye = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>)
const ShareIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>)
const SparklesIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>)

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // DYNAMIC LOOKUP
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [activeImg, setActiveImg] = useState(0)
  const [saved, setSaved] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    // Simulate lookup delay for effect
    setLoading(true)
    const foundProduct = products.find(p => p.id === parseInt(id))
    
    if (foundProduct) {
      setProduct(foundProduct)
      // Reset active image when ID changes
      setActiveImg(0)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50 font-mono">Loading Neural Data...</div>
  
  if (!product) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-white/60 mb-8">Product not found in the mainframe.</p>
      <button onClick={() => navigate('/marketplace')} className="px-6 py-2 bg-white text-black font-bold rounded-full">Back to Market</button>
    </div>
  )

  // Dynamic ambient background matching product accent
  // Note: We use the product.accent from data, adding transparency
  const bgStyle = {
    background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${product.accent}20 0%, transparent 40%), #050505`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Newsreader:ital,wght@1,300;1,400&display=swap');
        
        :root {
          --font-main: 'Outfit', sans-serif;
          --font-serif: 'Newsreader', serif;
          --bg-card: rgba(20, 20, 20, 0.6);
          --border: rgba(255, 255, 255, 0.08);
          --accent: ${product.accent}; /* Dynamic CSS Variable */
        }

        body { margin: 0; background: #050505; color: #fff; font-family: var(--font-main); overflow-x: hidden; }
        
        .wrapper { max-width: 1400px; margin: 0 auto; padding: 80px 24px 40px 24px; }

        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(12, 1fr);
            align-items: start;
          }
        }

        .card {
          background: var(--bg-card);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 24px;
          position: relative;
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .card:hover { border-color: rgba(255,255,255,0.2); }
        
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 8px; }

        /* Areas */
        .area-main-img { grid-column: span 12; aspect-ratio: 4/3; padding: 0; overflow: hidden; }
        .area-header { grid-column: span 12; }
        .area-price { grid-column: span 12; }
        .area-seller { grid-column: span 12; }
        .area-desc { grid-column: span 12; }
        .area-specs { grid-column: span 12; }
        .area-actions { grid-column: span 12; }

        @media (min-width: 1024px) {
          .area-main-img { grid-column: 1 / 8; grid-row: span 4; aspect-ratio: 4/3; position: sticky; top: 100px; }
          .area-header { grid-column: 8 / 13; }
          .area-seller { grid-column: 8 / 10; }
          .area-price { grid-column: 10 / 13; }
          .area-desc { grid-column: 8 / 13; }
          .area-specs { grid-column: 8 / 13; }
          .area-actions { grid-column: 8 / 13; }
        }

        /* Buttons & Tags */
        .btn-glass {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: white; border-radius: 50px; padding: 10px 18px; font-weight: 600; font-size: 13px;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
          backdrop-filter: blur(10px);
        }
        .btn-glass:hover { background: rgba(255,255,255,0.15); border-color: white; }
        
        .btn-primary {
          background: #fff; color: #000; border: none;
          border-radius: 16px; width: 100%; padding: 18px; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(255,255,255,0.5); }

        .btn-ai {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; width: 100%; padding: 12px; font-weight: 600; font-size: 12px;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Space Mono', monospace; letter-spacing: -0.5px; color: rgba(255,255,255,0.7);
        }
        .btn-ai:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: var(--accent); }

        .tag-pill {
          padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
        }

        .serif-italic { font-family: var(--font-serif); font-style: italic; font-weight: 300; }
        
        .thumb-cont {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 10px; padding: 8px; background: rgba(0,0,0,0.6); 
          backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
        }
        .thumb-btn {
          width: 48px; height: 48px; border-radius: 8px; overflow: hidden; border: 2px solid transparent; 
          cursor: pointer; opacity: 0.6; transition: all 0.2s;
        }
        .thumb-btn.active { opacity: 1; border-color: white; transform: scale(1.1); }
        .thumb-btn img { width: 100%; height: 100%; object-fit: cover; }

        .fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transform: translateY(10px); }
        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; }

        .noise { position: fixed; inset: 0; pointer-events: none; opacity: 0.04; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); z-index: 50; }
      `}</style>

      <div className="noise" />
      {/* Dynamic Ambient Background */}
      <div style={bgStyle} className="fixed inset-0 transition-all duration-1000 ease-out z-0" />

      <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center pointer-events-none">
        <Link to="/marketplace" className="btn-glass pointer-events-auto shadow-lg"><ArrowLeft /> <span className="hidden sm:inline">Back</span></Link>
        <div className="flex gap-3 pointer-events-auto">
           <button className="btn-glass shadow-lg"><ShareIcon/></button>
           <button className="btn-glass shadow-lg" onClick={() => setSaved(!saved)}><Heart filled={saved} /></button>
        </div>
      </nav>

      <div className="wrapper relative z-10">
        <div className="bento-grid">
          
          {/* 1. Main Image */}
          <div className="card area-main-img fade-in group cursor-zoom-in">
             <img 
                src={product.images && product.images.length > 0 ? product.images[activeImg] : product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
             />
             
             <div className="absolute top-6 left-6 flex gap-2 z-10">
               {product.isVerified && <span className="bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1"><Shield size={12}/> Verified</span>}
               {product.isTrending && <span className="bg-[#FF5733] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">🔥 Trending</span>}
             </div>
             
             {/* Dynamic Thumbnails */}
             {product.images && product.images.length > 1 && (
               <div className="thumb-cont">
                 {product.images.map((img, i) => (
                   <div key={i} className={`thumb-btn ${activeImg===i?'active':''}`} onClick={(e)=>{e.stopPropagation(); setActiveImg(i)}}>
                     <img src={img} alt="" />
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* 2. Header */}
          <div className="card area-header fade-in delay-1 flex flex-col justify-between min-h-[180px]">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="tag-pill">{product.category}</span>
                <span className="tag-pill" style={{color: product.accent, borderColor: product.accent}}>{product.condition}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">{product.title}</h1>
            </div>
            <div className="flex gap-6 opacity-60 text-sm mt-6 border-t border-white/10 pt-4">
              <span className="flex items-center gap-2"><Clock /> Posted {product.timeAgo}</span>
              <span className="flex items-center gap-2"><Eye /> {product.views} views</span>
            </div>
          </div>

          {/* 3. Seller */}
          <div className="card area-seller fade-in delay-2 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 p-[2px] mb-3">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xl font-serif italic">
                {product.user.charAt(0)}
              </div>
            </div>
            <div className="font-bold text-lg">{product.user}</div>
            <div className="text-xs opacity-50 mb-3">{product.branch} • Year {product.year}</div>
            <div className="bg-white/5 rounded-full px-3 py-1 text-xs font-bold border border-white/5">{product.sellerRating || 'New'} ★ Rating</div>
          </div>

          {/* 4. Price & AI Button */}
          <div className="card area-price fade-in delay-2 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full blur-[80px] opacity-20"></div>
            <div className="card-title mb-2"><Zap size={14} /> Asking Price</div>
            <div className="text-4xl lg:text-5xl font-black tracking-tighter mb-4">
              <span className="text-xl opacity-50 align-top mr-1"></span>{product.price}
            </div>
            
            {/* CHECK WITH AI BUTTON */}
            <button className="btn-ai">
                <SparklesIcon /> CHECK FAIR PRICE WITH AI
            </button>
          </div>

          {/* 5. Description */}
          <div className="card area-desc fade-in delay-3">
            <div className="card-header"><div className="card-title">Analysis</div></div>
            <p className="text-lg font-light leading-relaxed opacity-90 mb-8">
              <span className="serif-italic text-2xl opacity-60 mr-1">"</span>{product.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {product.highlights && product.highlights.map((h,i) => (
                 <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="w-1.5 h-1.5 rounded-full" style={{background: product.accent}}></div>
                   <span className="text-sm font-medium">{h}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* 6. Specs */}
          {product.specs && (
            <div className="card area-specs fade-in delay-3">
              <div className="card-header"><div className="card-title"><GridIcon size={14}/> Specifications</div></div>
              <div className="grid grid-cols-2 gap-4">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex flex-col p-3 border-b border-white/10 last:border-0">
                    <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1">{s.label}</span>
                    <span className="font-semibold text-sm">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Actions */}
          <div className="card area-actions fade-in delay-3 bg-white/5 border-white/10 flex flex-col gap-4 justify-center">
            <button className="btn-primary group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">Contact Seller <Message size={18}/></span>
              <div className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <div className="text-center text-[10px] uppercase tracking-widest opacity-30">
              Campus Handover • Verified Student • Safe
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default ProductPage