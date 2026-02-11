import React, { useEffect } from 'react'

// --- Internal Icons ---
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
)
const ArrowUpRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
)

const RecentListings = () => {
  const listings = [
    { id: 'ITEM_892', title: 'Drafter (Roller Scale)', price: '₹250', user: 'Amit K.', tag: 'MECH', time: '2m ago', color: '#FF6B35' },
    { id: 'ITEM_893', title: "Shivani 'C' Guide", price: '₹150', user: 'Priya S.', tag: 'CSE', time: '15m ago', color: '#00D9FF' },
    { id: 'ITEM_894', title: 'Arduino Uno Kit', price: '₹600', user: 'Rahul M.', tag: 'E&I', time: '42m ago', color: '#10B981' },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden border-b border-white/10">
      <style>{`
        .mono { font-family: 'Space Mono', monospace; }

        .reveal-item {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal-item.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .listing-card:hover {
          box-shadow: 0 0 30px var(--glow);
          border-color: color-mix(in srgb, var(--glow) 40%, transparent);
        }

        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        .scan-bg {
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent);
          background-size: 100% 200%;
          animation: scan 2s linear infinite;
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase">
            Incoming <span className="text-[#00D9FF]">Transmissions</span>
          </h2>
          <div className="mono text-xs text-white/60 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
            SYSTEM ONLINE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listings.map((item, idx) => (
            <div
              key={item.id}
              className="reveal-item listing-card group bg-zinc-900 border border-white/10 transition-all duration-300 flex flex-col"
              style={{
                '--glow': item.color,
                transitionDelay: `${0.2 + idx * 0.1}s`,
              }}
            >
              <div className="h-56 relative overflow-hidden bg-black border-b border-white/10">
                <div className="absolute inset-0 scan-bg" />
                <div className="absolute top-4 left-4 mono text-[10px] uppercase px-2 py-1 border"
                  style={{ color: item.color, borderColor: item.color }}>
                  {item.tag}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="mono text-4xl font-black text-white/5">IMG_0{idx + 1}</div>
                  <div className="mono text-[9px] text-white/20 mt-2">NO SIGNAL INPUT</div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between mb-4">
                  <h3 className="text-xl font-bold text-white uppercase max-w-[70%]">
                    {item.title}
                  </h3>
                  <span className="text-2xl font-black" style={{ color: item.color }}>
                    {item.price}
                  </span>
                </div>

                <div className="mono text-[10px] text-white/40 mb-6 border-b border-white/10 pb-4 flex gap-4">
                  <span>{item.id}</span>
                  <span>{item.time}</span>
                </div>

                <div className="mt-auto flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 bg-zinc-800 border border-white/10 flex items-center justify-center">
                      <UserIcon />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">{item.user}</div>
                      <div className="flex items-center gap-1 mono text-[9px] text-[#10B981]">
                        <BoltIcon /> 98% TRUST
                      </div>
                    </div>
                  </div>
                  <button className="mono text-[10px] border border-white/20 text-white px-3 py-2 hover:bg-white hover:text-black uppercase font-bold">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentListings