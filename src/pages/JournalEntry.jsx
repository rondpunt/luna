import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, Trash2, Check } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

/**
 * Journal detail/edit subscreen.
 * - Eigen header met terugknop (zoals Chat/FolderDetail subscreen pattern).
 * - React Navigation flow: header > date > title > body > sticky save.
 * - Keyboard-aware: sticky save bar met env(safe-area-inset-bottom).
 * - Discard-confirm bij onbedoeld terug bij wijzigingen.
 */
export default function JournalEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = id === "new";

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: entry, isLoading } = useQuery({
    queryKey: ["journal-entry", id],
    queryFn: async () => {
      if (isNew) return null;
      const list = await base44.entities.JournalEntry.filter({ id });
      return list?.[0] || null;
    },
    enabled: !isNew,
  });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const savedFlashRef = useRef(false);

  const bodyRef = useRef(null);

  // Hydrate when entry loads
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setBody(entry.content || "");
      setDirty(false);
    }
  }, [entry]);

  // Auto-grow textarea (controlled, no layout jumps)
  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.6) + "px";
  };
  useEffect(() => { autoGrow(bodyRef.current); }, [body]);

  const dateLabel = entry?.created_date
    ? format(new Date(entry.created_date), "EEEE d MMMM · HH:mm", { locale: nl })
    : format(new Date(), "EEEE d MMMM", { locale: nl });

  // Save (anti-double-tap via saving flag)
  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!body.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        await base44.entities.JournalEntry.create({
          userId: user.id,
          templateType: "vrij",
          title: title.trim() || "",
          content: body.trim(),
        });
      } else if (entry) {
        await base44.entities.JournalEntry.update(entry.id, {
          title: title.trim(),
          content: body.trim(),
        });
      }
      qc.invalidateQueries({ queryKey: ["journal-entries"] });
      qc.invalidateQueries({ queryKey: ["journal-entry", id] });
      savedFlashRef.current = true;
      setDirty(false);
      setTimeout(() => navigate("/journal"), 350);
    } finally {
      setSaving(false);
    }
  }, [saving, body, title, isNew, entry, user, qc, id, navigate]);

  const handleDelete = useCallback(async () => {
    if (!entry) return;
    await base44.entities.JournalEntry.delete(entry.id);
    qc.invalidateQueries({ queryKey: ["journal-entries"] });
    navigate("/journal");
  }, [entry, qc, navigate]);

  const handleBack = () => {
    if (dirty) {
      setConfirmDiscard(true);
      return;
    }
    navigate("/journal");
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "var(--bg)" }}>

      {/* Subscreen header — Luna pattern (zoals Chat/FolderDetail) */}
      <div
        className="flex items-center shrink-0 px-3 gap-2"
        style={{
          background: "rgba(10,10,11,0.94)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid var(--line)",
          paddingTop: "calc(12px + env(safe-area-inset-top, 0px))",
          paddingBottom: 12,
        }}
      >
        <button onClick={handleBack} className="flex items-center gap-0.5 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Dagboek</span>
        </button>
        <div className="flex-1" />
        {!isNew && entry && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl btn-press"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label="Verwijderen"
          >
            <Trash2 className="h-[16px] w-[16px]" style={{ color: "var(--text-2)" }} />
          </button>
        )}
      </div>

      {/* Body (scrollable, keyboard-aware) */}
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: 96 }}>

        {/* Date row */}
        <p className="text-[12px] mb-3" style={{ color: "var(--text-3)" }}>{dateLabel}</p>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
          placeholder="Titel (optioneel)"
          className="w-full bg-transparent text-[22px] font-bold outline-none mb-3"
          style={{ color: "var(--text)", letterSpacing: "-0.3px" }}
        />

        {/* Body */}
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => { setBody(e.target.value); setDirty(true); }}
          placeholder="Schrijf wat nu écht waar voelt…"
          className="w-full bg-transparent text-[16px] leading-[1.6] outline-none resize-none"
          style={{ color: "var(--text)", minHeight: 200 }}
          autoFocus={isNew && !isLoading}
        />
      </div>

      {/* Sticky save bar — keyboard-aware */}
      <div
        className="shrink-0 px-4"
        style={{
          background: "rgba(10,10,11,0.96)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderTop: "1px solid var(--line)",
          paddingTop: 10,
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <button
          onClick={handleSave}
          disabled={!body.trim() || saving}
          className="w-full rounded-xl py-3.5 text-[15px] font-semibold text-white btn-press disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ background: "#C25A32" }}
        >
          {saving ? "Bezig…" : (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              {isNew ? "Notitie bewaren" : "Wijzigingen bewaren"}
            </>
          )}
        </button>
      </div>

      {/* Discard confirm */}
      {confirmDiscard && (
        <ConfirmSheet
          title="Wijzigingen weggooien?"
          body="Je hebt nog niet opgeslagen."
          cancelLabel="Blijven"
          confirmLabel="Weggooien"
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={() => { setConfirmDiscard(false); navigate("/journal"); }}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <ConfirmSheet
          title="Notitie verwijderen?"
          body="Dit kan niet ongedaan gemaakt worden."
          cancelLabel="Annuleren"
          confirmLabel="Verwijderen"
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => { setConfirmDelete(false); handleDelete(); }}
        />
      )}
    </div>
  );
}

function ConfirmSheet({ title, body, cancelLabel, confirmLabel, danger, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl px-5 pt-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <p className="text-[16px] font-bold mb-1" style={{ color: "var(--text)" }}>{title}</p>
        <p className="text-[14px] mb-4" style={{ color: "var(--text-2)" }}>{body}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-3 text-[14px] font-medium btn-press"
            style={{ background: "var(--bg-elevated)", color: "var(--text)", border: "1px solid var(--line)" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl py-3 text-[14px] font-semibold text-white btn-press"
            style={{ background: danger ? "#F04747" : "#C25A32" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}