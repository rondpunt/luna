import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteConvoDialog({ conv, onConfirm, onCancel, deleting }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-5"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "rgba(240,71,71,0.12)" }}>
            <Trash2 className="h-5 w-5" style={{ color: "#F04747" }} />
          </div>
          <p className="text-[17px] font-bold" style={{ color: "var(--text)" }}>Gesprek verwijderen?</p>
          <p className="text-[14px] leading-[1.5]" style={{ color: "var(--text-2)" }}>
            "{conv?.title || "Naamloos gesprek"}" wordt definitief verwijderd. Dit kan niet ongedaan gemaakt worden.
          </p>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl py-3 text-[14px] font-medium btn-press"
            style={{ background: "var(--bg-elevated)", color: "var(--text-2)" }}
          >
            Annuleren
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl py-3 text-[14px] font-semibold text-white btn-press"
            style={{ background: "#F04747", opacity: deleting ? 0.6 : 1 }}
          >
            {deleting ? "Bezig…" : "Verwijderen"}
          </button>
        </div>
      </div>
    </div>
  );
}