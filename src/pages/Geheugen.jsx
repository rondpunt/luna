import { Link } from "react-router-dom";
import { Trash2, Brain, Lock } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import { useMemoryList } from "@/hooks/useMemoryList";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Geheugen() {
  const { isPlus } = usePremium();
  const { activeMemories, loading, removeById, removing } = useMemoryList();
  useDocumentTitle("Geheugen");

  if (!isPlus) {
    return (
      <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 120 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>CONTEXT</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em" }}>Geheugen.</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.55 }}>
          Luna Plus bewaart en beheert herinneringen die je gesprek rijker maken. Hier zie je wat Luna onthoudt — en kan je het wissen.
        </p>
        <div className="surface mt-8 p-6 text-center">
          <Lock className="mx-auto mb-3" size={22} style={{ color: "#E8834A" }} strokeWidth={1.5} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Alleen met Luna Plus</p>
          <Link to="/pricing" className="btn btn-primary press inline-block mt-2" style={{ fontSize: 14 }}>
            Upgrade
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 120 }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>LUNA PLUS</p>
          <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em" }}>Geheugen.</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
            {loading ? "Laden…" : `${activeMemories.length} actieve herinneringen`}
          </p>
        </div>
        <Brain size={28} style={{ color: "#E8834A", opacity: 0.9 }} strokeWidth={1.25} />
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16, lineHeight: 1.55 }}>
        Dit is wat meegegeven wordt als zachte context in chat (subtiel, nooit letterlijk voorgelezen). Verwijderen kan niet ongedaan worden.
      </p>

      <div className="mt-6 space-y-3">
        {activeMemories.length === 0 && !loading && (
          <div className="surface p-5 text-center" style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Nog geen herinneringen. Die ontstaan wanneer Luna iets belangrijks bewaart.
          </div>
        )}
        {activeMemories.map((m) => (
          <div key={m.id} className="surface" style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div className="flex-1 min-w-0">
              {m.category && (
                <p className="eyebrow-muted" style={{ marginBottom: 6 }}>{String(m.category).toUpperCase()}</p>
              )}
              <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{m.content}</p>
            </div>
            <button
              type="button"
              aria-label="Herinnering wissen"
              disabled={removing}
              className="press haptic-press"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={() => removeById(m.id).catch(() => {})}
            >
              <Trash2 size={16} style={{ color: "var(--text-muted)" }} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
