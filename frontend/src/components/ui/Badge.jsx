const Badge = ({ children }) => (
  <span className="px-3 py-1 rounded-full text-xs font-bold 
    bg-indigo-500/20 border border-indigo-500/50 text-indigo-900 
    dark:bg-indigo-500/10 dark:text-cyan-300 dark:shadow-[0_0_10px_rgba(99,102,241,0.3)]
    transition-colors duration-300">
    {children}
  </span>
)

export default Badge