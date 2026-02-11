const GlassCard = ({ children, className = "" }) => (
  <div className={`glass glass-hover rounded-2xl ${className}`}>
    {children}
  </div>
)

export default GlassCard