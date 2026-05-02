export default function NoraLogo({ className = "" }) {
  return (
    <div className={`relative h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,#d7f7ef_0%,#8fd7c9_38%,#6e7ef7_68%,#2d335f_100%)] shadow-[0_12px_40px_rgba(110,126,247,0.25)] ${className}`}>
      <div className="absolute inset-[20%] rounded-full bg-white/18 blur-md" />
      <div className="absolute left-[18%] top-[38%] h-[18%] w-[64%] rounded-full bg-white/45 blur-[2px]" />
    </div>
  );
}