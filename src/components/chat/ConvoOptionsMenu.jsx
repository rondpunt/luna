import { useEffect, useRef } from "react";
import { Pencil, FolderInput, Pin, PinOff, Archive, Trash2, X } from "lucide-react";

/**
 * Action sheet for a conversation. Mobile-friendly bottom-sheet.
 */
export default function ConvoOptionsMenu({
  conv,
  onClose,
  onRename,
  onMove,
  onTogglePin,
  onArchive,
  onDelete,
  showPin = false,
  showArchive = false,
}) {
  const sheetRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const Item = ({ icon: Icon, label, color, onClick, danger }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left btn-press"
      style={{ borderTop: "1px solid var(--line-subtle)" }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: danger ? "rgba(240,71,71,0.12)" : "rgba(255,255,255,0.06)" }}
      >
        <Icon className="h-4 w-4" style={{ color: color || "var(--text-2)" }} strokeWidth={1.8} />
      </div>
      <span className="flex-1 text-[15px] font-medium" style={{ color: danger ? "#F04747" : "var(--text)" }}>
        {label}
      </span>
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-lg rounded-t-3xl"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full" style={{ background: "var(--text-4)" }} />
        </div>
        <p className="text-center text-[13px] font-semibold px-6 truncate" style={{ color: "var(--text-2)" }}>
          {conv?.title || "Gesprek"}
        </p>

        <div className="mt-3">
          <Item icon={Pencil}      label="Hernoemen"               onClick={onRename} />
          <Item icon={FolderInput} label="Verplaatsen naar map…"   onClick={onMove} />
          {showPin && (
            <Item
              icon={conv?.pinned ? PinOff : Pin}
              label={conv?.pinned ? "Losmaken" : "Vastpinnen"}
              onClick={onTogglePin}
            />
          )}
          {showArchive && (
            <Item icon={Archive} label={conv?.archived ? "Terug uit archief" : "Archiveren"} onClick={onArchive} />
          )}
          <Item icon={Trash2} label="Verwijderen" danger color="#F04747" onClick={onDelete} />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 flex items-center justify-center gap-1.5 text-[14px] font-medium"
          style={{ color: "var(--text-3)" }}
        >
          <X className="h-4 w-4" />
          Sluiten
        </button>
      </div>
    </div>
  );
}