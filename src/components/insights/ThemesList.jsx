/**
 * Terugkerende thema's — afgeleid uit echte Base44 data:
 *   - Conversation.folderName (frequentie per map)
 *   - JournalEntry.templateType (frequentie per template)
 * Geen dummy data. Geen tag cloud. Max 4 thema's.
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
      <div className="card px-4 py-5 text-center">
        <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
          Nog geen thema's zichtbaar.
        </p>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>
          Gesprekken en notities vormen je terugkerende thema's.
        </p>
      </div>
    );
  }

  return (
    <div className="list-group">
      {themes.map(({ label, pct, color }) => (
        <div key={label} className="list-row gap-4" style={{ minHeight: 56 }}>
          <span
            className="text-[14px] font-medium shrink-0 truncate"
            style={{ color: "var(--text)", maxWidth: "40%" }}
          >
            {label}
          </span>
          <div
            className="flex-1 h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-2 rounded-full"
              style={{ width: `${pct}%`, background: color, transition: "width 0.4s ease" }}
            />
          </div>
          <span
            className="text-[12px] font-medium w-10 text-right shrink-0 tabular-nums"
            style={{ color: "var(--text-3)" }}
          >
            {pct}%
          </span>
        </div>
      ))}
    </div>
  );
}