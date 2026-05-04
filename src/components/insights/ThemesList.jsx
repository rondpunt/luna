/**
 * Terugkerende thema's — uit echte Base44 data.
 * Premium balk-rendering, max 4 thema's, no clutter.
 */

const COLORS = ["#C25A32", "#4A9EFF", "#34C77B", "#F5A623"];

function buildThemes(conversations, entries) {
  const counts = new Map();

  conversations.forEach((c) => {
    const k = (c.folderName || "").trim();
    if (!k) return;
    counts.set(k, (counts.get(k) || 0) + 1);
  });

  entries.forEach((e) => {
    const k = (e.templateType || "").trim();
    if (!k) return;
    counts.set(k, (counts.get(k) || 0) + 1);
  });

  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, n], i) => ({
      label,
      pct: Math.round((n / total) * 100),
      color: COLORS[i % COLORS.length],
    }));
}

export default function ThemesList({ conversations = [], entries = [] }) {
  const themes = buildThemes(conversations, entries);

  if (themes.length === 0) {
    return (
      <div className="card px-5 py-6 text-center">
        <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
          Nog geen thema's zichtbaar
        </p>
        <p className="text-[12px] mt-1.5" style={{ color: "var(--text-3)" }}>
          Gesprekken en notities vormen je terugkerende thema's.
        </p>
      </div>
    );
  }

  return (
    <div className="card px-5 py-5 space-y-4">
      {themes.map(({ label, pct, color }) => (
        <div key={label}>
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[13.5px] font-medium truncate pr-3"
              style={{ color: "var(--text)" }}
            >
              {label}
            </span>
            <span
              className="text-[12px] font-semibold tabular-nums shrink-0"
              style={{ color: "var(--text-3)" }}
            >
              {pct}%
            </span>
          </div>
          <div
            className="h-[6px] rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: color,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}