import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

const COLORS = ["#C25A32", "#4A9EFF", "#34C77B", "#F5A623", "#A855F7", "#F04747", "#EC4899", "#14B8A6"];
const EMOJIS = ["💬", "😔", "😤", "🧠", "❤️", "🌙", "⚡", "🎯", "🌊", "🔥", "🪞", "🧘", "📖", "🌱", "🦋", "🫂"];

export default function FolderFormSheet({ defaults, isEdit, onSave, onClose, saving }) {
  const [name, setName] = useState(defaults?.name || "");
  const [emoji, setEmoji] = useState(defaults?.emoji || "💬");
  const [color, setColor] = useState(defaults?.color || "#C25A32");
  const [description, setDescription] = useState(defaults?.description || "");
  const [context, setContext] = useState(defaults?.context || "");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), emoji, color, description: description.trim(), context: context.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div className="flex-1" onClick={onClose} />
      <div
        className="rounded-t-3xl pb-safe"
        style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full" style={{ background: "var(--line)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-[17px] font-bold" style={{ color: "var(--text)" }}>
            {isEdit ? "Map aanpassen" : "Nieuwe map"}
          </p>
          <button onClick={onClose} className="btn-press">
            <X className="h-5 w-5" style={{ color: "var(--text-3)" }} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 overflow-y-auto" style={{ maxHeight: "70vh" }}>

          {/* Emoji picker */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-3)" }}>Emoji</p>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="h-10 w-10 rounded-xl text-[20px] flex items-center justify-center btn-press"
                  style={{
                    background: emoji === e ? "rgba(194,90,50,0.20)" : "var(--bg-elevated)",
                    border: `1px solid ${emoji === e ? "#C25A32" : "var(--line)"}`,
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-3)" }}>Kleur</p>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="h-8 w-8 rounded-full btn-press transition-all relative"
                  style={{ background: c }}
                >
                  {color === c && (
                    <Check className="h-4 w-4 text-white absolute inset-0 m-auto" strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-3)" }}>Naam</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bv. Angst & piekeren"
              autoFocus={!isEdit}
              className="w-full rounded-xl px-4 py-3.5 text-[16px] outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-3)" }}>Omschrijving <span style={{ color: "var(--text-4)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optioneel)</span></p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bv. Alles rond mijn werkstress"
              className="w-full rounded-xl px-4 py-3.5 text-[15px] outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>

          {/* Context */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>Jouw context</p>
            <p className="text-[12px] mb-2.5 leading-[1.5]" style={{ color: "var(--text-4)" }}>
              Luna leest dit als achtergrond bij elk gesprek in deze map. Schrijf in de ik-vorm wat Luna moet weten.
            </p>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Bv. Ik heb last van angst en piekeren, vooral 's avonds. Ik heb ADHD en vind het moeilijk om mijn gedachten te stoppen…"
              rows={4}
              className="w-full rounded-xl px-4 py-3.5 text-[15px] outline-none resize-none leading-[1.6]"
              style={{ background: "var(--bg-input)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full rounded-2xl py-4 text-[16px] font-semibold text-white btn-press disabled:opacity-40 accent-gradient"
          >
            {saving ? "Bezig…" : isEdit ? "Opslaan" : "Map aanmaken"}
          </button>
        </div>
      </div>
    </div>
  );
}