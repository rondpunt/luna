import { useEffect, useRef } from "react";
import { Check, FolderMinus } from "lucide-react";

/**
 * Bottom-sheet to move a conversation to a different folder.
 */
export default function MoveToFolderMenu({ folders = [], currentFolderId, onSelect, onClose }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-lg rounded-t-3xl pb-safe"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full" style={{ background: "var(--text-4)" }} />
        </div>
        <p className="text-center text-[14px] font-semibold mb-2" style={{ color: "var(--text)" }}>
          Verplaatsen naar map
        </p>

        <div className="max-h-[60vh] overflow-y-auto">
          {/* Remove from folder */}
          <button
            onClick={() => onSelect(null)}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left btn-press"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
              <FolderMinus className="h-4 w-4" style={{ color: "var(--text-3)" }} />
            </div>
            <span className="flex-1 text-[14px]" style={{ color: "var(--text-2)" }}>Geen map</span>
            {!currentFolderId && <Check className="h-4 w-4" style={{ color: "var(--accent)" }} />}
          </button>

          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelect(f)}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left btn-press"
              style={{ borderTop: "1px solid var(--line-subtle)" }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[18px]"
                style={{ background: `${f.color || "#C25A32"}18` }}
              >
                {f.emoji || "📁"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium truncate" style={{ color: "var(--text)" }}>{f.name}</p>
                {f.description && (
                  <p className="text-[12px] truncate" style={{ color: "var(--text-3)" }}>{f.description}</p>
                )}
              </div>
              {currentFolderId === f.id && <Check className="h-4 w-4" style={{ color: f.color || "var(--accent)" }} />}
            </button>
          ))}

          {folders.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                Je hebt nog geen mappen aangemaakt.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 mx-4 mb-2 py-3 rounded-xl text-[14px] font-medium btn-press"
          style={{ background: "var(--bg-elevated)", color: "var(--text-2)", width: "calc(100% - 32px)" }}
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}