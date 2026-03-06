import React, { useEffect, useRef, useState } from 'react';

// Scattered review cards pushed to viewport edges, hollow centre to frame typography.
const REVIEWS = [
  { id: 1, name: "Rahul S.", role: "Engineering", text: "Got my textbooks in literally 10 minutes. Safe and easy.", pos: { top: '8%', left: '4%' }, rotate: '-3deg', width: '230px' },
  { id: 8, name: "Anita D.", role: "Design", text: "Sold my old T-square to a junior the same day I listed it.", pos: { top: '35%', left: '6%' }, rotate: '2.5deg', width: '240px' },
  { id: 7, name: "Vikram P.", role: "M.Tech", text: "Found cheap Arduino kits. Saved a ton of money.", pos: { top: '12%', left: '32%' }, rotate: '1deg', width: '220px' },
  { id: 15, name: "Arjun N.", role: "Electronics", text: "Verified profiles mean I actually trust the person I'm meeting.", pos: { bottom: '25%', left: '8%' }, rotate: '-1.8deg', width: '248px' },
  { id: 13, name: "Rishabh K.", role: "Pharmacy", text: "Got lab coats for half the price. Great for juniors.", pos: { top: '55%', left: '2%' }, rotate: '4deg', width: '215px' },
  { id: 3, name: "Aman K.", role: "Mechanical", text: "Listed 6 things, sold 5 in two days. Highly recommend.", pos: { bottom: '8%', left: '28%' }, rotate: '-2.2deg', width: '260px' },
  { id: 2, name: "Priya M.", role: "B.Tech", text: "Met near the library for the handoff. Super convenient.", pos: { top: '10%', right: '12%' }, rotate: '-1deg', width: '250px' },
  { id: 10, name: "Kritika S.", role: "Architecture", text: "The UI is so clean. Listed my tools and got inquiries fast.", pos: { top: '28%', right: '4%' }, rotate: '3.5deg', width: '235px' },
  { id: 14, name: "Dev V.", role: "Comp. Sci", text: "Zero latency on image uploads. Works flawlessly.", pos: { top: '50%', right: '6%' }, rotate: '-2.8deg', width: '240px' },
  { id: 4, name: "Neha J.", role: "Arts", text: "Smooth experience, zero platform fees. Love it.", pos: { bottom: '22%', right: '8%' }, rotate: '1.2deg', width: '245px' },
  { id: 9, name: "Rohan J.", role: "Business", text: "Way better than WhatsApp groups. Listings stay fresh.", pos: { top: '18%', right: '35%' }, rotate: '-4deg', width: '220px' },
  { id: 5, name: "Karan T.", role: "Comp. Sci", text: "Fast uploads, works perfectly on mobile.", pos: { bottom: '8%', right: '30%' }, rotate: '2.1deg', width: '210px' },
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

  const reviewsOpacity = Math.max(0, 1 - scrollYProgress * 5);

  return (
    <section ref={containerRef} className="relative w-full h-[350vh] bg-[#F5F5F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        .mono { font-family: 'Space Mono', monospace; }
      `}</style>

      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* Social proof layer */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: reviewsOpacity }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 tracking-tighter text-center leading-none">
              Trusted by<br />
              <span className="text-black">2,000+ students</span>
            </h1>
          </div>

          {REVIEWS.map((r) => (
            <div
              key={r.id}
              className="absolute bg-white shadow-[0_4px_28px_rgba(0,0,0,0.08)] p-4 md:p-5 rounded-2xl border border-zinc-100 hidden lg:flex flex-col gap-3"
              style={{ ...r.pos, width: r.width, transform: `rotate(${r.rotate})` }}
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
          ))}
        </div>

      </div>
    </section>
  );
};

export default CTA;