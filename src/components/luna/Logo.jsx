import LunaOrb from "./LunaOrb";

export default function Logo({ showOrb = false, size = "default" }) {
  const textSize = size === "small" ? "text-base" : "text-xl";
  
  return (
    <div className="flex items-center gap-2">
      {showOrb && <LunaOrb size={size === "small" ? 20 : 24} state="idle" />}
      <span
        className={`${textSize} font-semibold tracking-tight`}
        style={{ color: "var(--luna-text-primary)", letterSpacing: "-0.02em" }}
      >
        luna
      </span>
    </div>
  );
}