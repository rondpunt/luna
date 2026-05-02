export default function NoraLogo({ className = "" }) {
  return (
    <div
      className={`relative h-8 w-8 rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle at 30% 30%, #c8e8d0 0%, #6fb284 40%, #3f8a55 75%, #1f4a2e 100%)",
        boxShadow: "0 4px 14px rgba(63,138,85,0.25)",
      }}
    >
      <div className="absolute left-[18%] top-[22%] h-[28%] w-[40%] rounded-full bg-white/40 blur-[2px]" />
    </div>
  );
}