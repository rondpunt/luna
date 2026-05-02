export default function NoraLogo({ className = "" }) {
  return (
    <div
      className={`relative h-8 w-8 rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle at 30% 30%, #fbd5b8 0%, #ee9670 40%, #c25a32 75%, #5a2410 100%)",
        boxShadow: "0 4px 14px rgba(194,90,50,0.30)",
      }}
    >
      <div className="absolute left-[18%] top-[22%] h-[28%] w-[40%] rounded-full bg-white/40 blur-[2px]" />
    </div>
  );
}