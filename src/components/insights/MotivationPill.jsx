import { computeStreak } from "@/lib/streak";

/**
 * MotivationPill — kleine motiverende hook bovenaan Insights.
 * - streak >= 3: felicitatie met vlam
 * - streak <= 1: zachte nudge zonder emoji
 */
export default function MotivationPill({ checkIns = [] }) {
  const streak = computeStreak(checkIns);

  const content =
    streak >= 3
      ? { icon: "🔥", text: `${streak} dagen op rij — goed bezig.` }
      : { icon: null, text: "Elke dag een beetje telt." };

  return (
    <div className="flex justify-start px-1 fade-slide-up">
      <span
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--line-subtle)",
          color: "var(--text-2)",
        }}
      >
        {content.icon && <span className="text-[13px] leading-none">{content.icon}</span>}
        <span className="text-[12.5px] font-medium" style={{ letterSpacing: "-0.1px" }}>
          {content.text}
        </span>
      </span>
    </div>
  );
}