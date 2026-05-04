import { useState } from "react";
import { base44 } from "@/api/base44Client";

const OPTIONS = [
  { key: "better",    label: "Beter",     emoji: "🙂", intensity: 7 },
  { key: "same",      label: "Hetzelfde", emoji: "😐", intensity: 5 },
  { key: "heavier",   label: "Zwaarder",  emoji: "😔", intensity: 3 },
];

/**
 * MoodCheckBanner — subtiele inline check na ~5 assistant-berichten.
 * Slaat op als MoodCheckin, sluit zichzelf, onderbreekt gesprek niet.
 */
export default function MoodCheckBanner({ userId, onDismiss }) {
  const [submitting, setSubmitting] = useState(false);

  const submit = async (opt) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (userId) {
        await base44.entities.MoodCheckin.create({
          userId,
          mood: opt.key,
          intensity: opt.intensity,
          notes: "in-chat check",
        }).catch(() => {});
      }
    } finally {
      onDismiss?.();
    }
  };

  return (
    <div
      className="mb-2 px-4 py-3 rounded-[16px] fade-in"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--line-subtle)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <p className="text-[13px] leading-[1.45]" style={{ color: "var(--text-2)" }}>
          Hoe voel je je nu vergeleken met het begin?
        </p>
        <button
          onClick={onDismiss}
          className="text-[18px] leading-none btn-press shrink-0 -mt-0.5"
          style={{ color: "var(--text-3)" }}
          aria-label="Sluiten"
        >
          ×
        </button>
      </div>
      <div className="flex gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => submit(o)}
            disabled={submitting}
            className="flex-1 h-9 rounded-full text-[12.5px] font-medium btn-press disabled:opacity-50 flex items-center justify-center gap-1.5"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--line-subtle)",
              color: "var(--text)",
            }}
          >
            <span>{o.emoji}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}