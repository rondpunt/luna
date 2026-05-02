export default function SectionCard({ children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-border/60 bg-card/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}