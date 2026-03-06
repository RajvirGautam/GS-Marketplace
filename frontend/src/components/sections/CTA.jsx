import React, { useEffect, useRef, useState } from 'react';

// Added `zDepth` to establish a kinematic parallax field.
// Values closer to 1.0 are "closer" to the camera and fly by faster.
// Values closer to 4.0 are "further" away and move slower.
const REVIEWS = [
  { id: 1, name: "Rahul S.", role: "Engineering", text: "Got my textbooks in literally 10 minutes. Safe and easy.", pos: { top: '8%', left: '4%' }, rotate: '-3deg', width: '230px', zDepth: 1.2 },
  { id: 8, name: "Anita D.", role: "Design", text: "Sold my old T-square to a junior the same day I listed it.", pos: { top: '35%', left: '6%' }, rotate: '2.5deg', width: '240px', zDepth: 2.8 },
  { id: 7, name: "Vikram P.", role: "M.Tech", text: "Found cheap Arduino kits. Saved a ton of money.", pos: { top: '12%', left: '32%' }, rotate: '1deg', width: '220px', zDepth: 3.5 },
  { id: 15, name: "Arjun N.", role: "Electronics", text: "Verified profiles mean I actually trust the person I'm meeting.", pos: { bottom: '25%', left: '8%' }, rotate: '-1.8deg', width: '248px', zDepth: 1.5 },
  { id: 13, name: "Rishabh K.", role: "Pharmacy", text: "Got lab coats for half the price. Great for juniors.", pos: { top: '55%', left: '2%' }, rotate: '4deg', width: '215px', zDepth: 3.2 },
  { id: 3, name: "Aman K.", role: "Mechanical", text: "Listed 6 things, sold 5 in two days. Highly recommend.", pos: { bottom: '8%', left: '28%' }, rotate: '-2.2deg', width: '260px', zDepth: 2.1 },
  { id: 2, name: "Priya M.", role: "B.Tech", text: "Met near the library for the handoff. Super convenient.", pos: { top: '10%', right: '12%' }, rotate: '-1deg', width: '250px', zDepth: 1.1 },
  { id: 10, name: "Kritika S.", role: "Architecture", text: "The UI is so clean. Listed my tools and got inquiries fast.", pos: { top: '28%', right: '4%' }, rotate: '3.5deg', width: '235px', zDepth: 2.5 },
  { id: 14, name: "Dev V.", role: "Comp. Sci", text: "Zero latency on image uploads. Works flawlessly.", pos: { top: '50%', right: '6%' }, rotate: '-2.8deg', width: '240px', zDepth: 1.8 },
  { id: 4, name: "Neha J.", role: "Arts", text: "Smooth experience, zero platform fees. Love it.", pos: { bottom: '22%', right: '8%' }, rotate: '1.2deg', width: '245px', zDepth: 3.8 },
  { id: 9, name: "Rohan J.", role: "Business", text: "Way better than WhatsApp groups. Listings stay fresh.", pos: { top: '18%', right: '35%' }, rotate: '-4deg', width: '220px', zDepth: 2.4 },
  { id: 5, name: "Karan T.", role: "Comp. Sci", text: "Fast uploads, works perfectly on mobile.", pos: { bottom: '8%', right: '30%' }, rotate: '2.1deg', width: '210px', zDepth: 1.6 },
];

const CTA = () => {
  const containerRef = useRef(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const maxScroll = height - windowHeight;
      const currentScroll = -top;
      const progress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
      setScrollYProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1: Each card zooms toward camera at its own zDepth-driven rate
  const globalCardOpacity = Math.max(0, 1 - (scrollYProgress - 0.2) * 5);

  // Phase 2 (stub): Circle grows from scroll 0.35 to 0.65
  const circleProgress = Math.max(0, Math.min((scrollYProgress - 0.35) / 0.3, 1));
  const circleScale = circleProgress * 1.55;

  return (
    <section ref={containerRef} className="relative w-full h-[350vh] bg-[#F5F5F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        .mono { font-family: 'Space Mono', monospace; }

        .tech-grid-bg {
          background-color: #0A0A0A;
          background-image:
            radial-gradient(circle at center, transparent 0%, #0A0A0A 80%),
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 100% 100%, 40px 40px, 40px 40px;
        }
      `}</style>

      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* Stratum 1: Parallax Social Proof Field */}
        <div className="absolute inset-0 z-10 pointer-events-none origin-center">

          {/* Centred headline fades with cards */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: globalCardOpacity }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 tracking-tighter text-center leading-none">
              Trusted by<br />
              <span className="text-black">2,000+ students</span>
            </h1>
          </div>

          {REVIEWS.map((r) => {
            const scaleFactor = 1 + (scrollYProgress * 20) / r.zDepth;
            let localOpacity = 1;
            if (scaleFactor > 3) {
              localOpacity = Math.max(0, 1 - (scaleFactor - 3) * 0.8);
            }
            const finalOpacity = Math.min(localOpacity, globalCardOpacity);
            return (
              <div
                key={r.id}
                className="absolute bg-white shadow-[0_4px_28px_rgba(0,0,0,0.08)] p-4 md:p-5 rounded-2xl border border-zinc-100 hidden lg:flex flex-col gap-3"
                style={{
                  ...r.pos,
                  width: r.width,
                  transform: `scale(${scaleFactor}) rotate(${r.rotate})`,
                  opacity: finalOpacity,
                  willChange: 'transform, opacity',
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black leading-tight">{r.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{r.role}</p>
                  </div>
                </div>
                <p className="text-[13px] text-zinc-700 leading-relaxed">"{r.text}"</p>
              </div>
            );
          })}
        </div>

        {/* Stratum 2: Radial Expansion Plane — dark grid circle grows on scroll */}
        <div
          className="absolute tech-grid-bg z-20"
          style={{
            width: '200vmax',
            height: '200vmax',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            marginTop: '-100vmax',
            marginLeft: '-100vmax',
            transform: `scale(${circleScale})`,
            border: '2px solid rgba(0,217,255,0.4)',
            boxShadow: '0 0 100px rgba(0,217,255,0.15) inset',
            opacity: circleScale > 0 ? 1 : 0,
            willChange: 'transform',
          }}
        />

      </div>
    </section>
  );
};

export default CTA;