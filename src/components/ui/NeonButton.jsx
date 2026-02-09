import React from 'react';

// 1. Add "...props" here to catch onClick, disabled, type, etc.
const NeonButton = ({ children, primary = false, className = "", ...props }) => (
  <button 
    // 2. Spread "...props" here so the button actually receives the click handler
    {...props} 
    className={`
    relative px-8 py-3 rounded-xl font-bold transition-all duration-300 group overflow-hidden border-2
    ${primary 
      ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent shadow-lg shadow-violet-500/30 hover:shadow-cyan-500/50 hover:scale-105" 
      : "bg-transparent border-indigo-400 dark:border-white/20 text-indigo-950 dark:text-white hover:bg-white/20 dark:hover:bg-white/5 hover:border-indigo-600 dark:hover:border-white/50"}
    ${className}
  `}>
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    {primary && (
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
    )}
  </button>
)

export default NeonButton