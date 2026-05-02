/**
 * GlassCard — reusable premium glass surface used across all screens.
 */
export default function GlassCard({ children, className = "", style = {}, onClick }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}