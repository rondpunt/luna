import { Gift, Sparkles, Flame } from "lucide-react";

export default function DailyRewardCard({ streak, saved, checkedToday }) {
  const title = saved
    ? "Check-in ontvangen."
    : checkedToday
      ? "Vandaag al ingecheckt."
      : "Kleine beloning wacht.";

  const text = saved
    ? "Je hebt vandaag even naar jezelf geluisterd. Dat telt."
    : checkedToday
      ? "Kom morgen terug voor je volgende check-in."
      : "Registreer vandaag en bouw verder aan je ritme.";

  return (
    <div
      className="fade-up"
      style={{
        marginTop: 18,
        padding: 18,
        borderRadius: 22,
        border: saved ? "1px solid rgba(232,131,74,0.34)" : "1px solid rgba(255,255,255,0.08)",
        background: saved
          ? "linear-gradient(145deg, rgba(232,131,74,0.14), rgba(242,237,227,0.045))"
          : "rgba(255,255,255,0.035)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(232,131,74,0.12)",
            border: "1px solid rgba(232,131,74,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {saved ? <Sparkles size={18} color="#E8834A" /> : <Gift size={18} color="#E8834A" />}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, color: "var(--text)", fontWeight: 500 }}>{title}</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.45, marginTop: 3 }}>{text}</p>
        </div>
      </div>

      {streak > 1 && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#E8834A" }}>
          <Flame size={15} strokeWidth={1.8} />
          {streak} dagen op rij even ingecheckt
        </div>
      )}
    </div>
  );
}