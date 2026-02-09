import Badge from '../ui/Badge'
import GlassCard from '../ui/GlassCard'

const RecentListings = () => {
  const listings = [
    { title: "Drafter (Roller Scale)", price: "₹250", user: "Amit K.", tag: "Mech" },
    { title: "Shivani 'C' Programming", price: "₹150", user: "Priya S.", tag: "CSE" },
    { title: "Arduino Uno Kit", price: "₹600", user: "Rahul M.", tag: "E&I" },
  ]

  return (
    <section className="py-20 bg-indigo-300/10 dark:bg-black/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-16 transition-colors duration-300">
          Fresh from the <span className="text-violet-700 dark:text-violet-400">Grid</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listings.map((item, idx) => (
            <GlassCard key={idx} className="overflow-hidden group p-0 !bg-white/40 dark:!bg-white/5">
              <div className={`h-48 bg-indigo-100/50 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 relative overflow-hidden transition-colors duration-300 border-b-2 border-white/30 dark:border-none`}>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-300 dark:text-slate-600 font-mono text-sm group-hover:scale-110 transition-transform duration-500 font-bold">
                  IMG_0{idx+1}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <Badge>{item.tag}</Badge>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold text-lg">
                    {item.price}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-secondary border-t border-indigo-200 dark:border-white/5 pt-4 mt-4 transition-colors duration-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-200 dark:bg-slate-700" />
                  <span>Sold by {item.user}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentListings