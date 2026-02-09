import Icons from '../../assets/icons/Icons'
import GlassCard from '../ui/GlassCard'

const Categories = () => {
  const categories = [
    { name: "Engineering Graphics", icon: <Icons.TrendingUp />, count: "120+ Items" },
    { name: "Electronics & IoT", icon: <Icons.Cpu />, count: "85+ Items" },
    { name: "Coding Bootcamps", icon: <Icons.Code />, count: "40+ Courses" },
    { name: "Sem Quantums", icon: <Icons.ShoppingBag />, count: "500+ Books" },
  ]

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary transition-colors duration-300">
              Curated <span className="text-cyan-700 dark:text-cyan-400">Categories</span>
            </h2>
            <p className="text-secondary mt-2 font-medium">
              Everything an SGSITS engineer needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <GlassCard key={idx} className="p-6 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-1 transition-colors duration-300">
                {cat.name}
              </h3>
              <p className="text-sm text-secondary font-bold group-hover:text-violet-600 dark:group-hover:text-cyan-400 transition-colors">
                {cat.count}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories