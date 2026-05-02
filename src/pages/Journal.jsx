import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle } from "lucide-react";

const TEMPLATES = ["Vrij schrijven", "Dankbaarheid", "Angst loslaten", "Slaapreflectie"];
const MOODS = ["😔", "😐", "🙂", "😊", "🤩"];

export default function Journal() {
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [moodBefore, setMoodBefore] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!body.trim() || saving) return;
    setSaving(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.JournalEntry.create({
        userId: user.id,
        templateType: template,
        title: title || template,
        content: body,
        moodBefore: moodBefore ? MOODS[moodBefore] : "",
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setTitle("");
        setBody("");
        setMoodBefore(null);
      }, 2000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 pt-6 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Dagboek</p>
        <h1 className="text-2xl font-bold text-white">Een plek voor jezelf.</h1>
      </div>

      {/* Template pills */}
      <div className="flex gap-2 flex-wrap">
        {TEMPLATES.map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
            style={{
              background: template === t ? "#c25a32" : "#1c1c1e",
              color: template === t ? "#fff" : "rgba(255,255,255,0.55)",
              border: `1px solid ${template === t ? "#c25a32" : "rgba(255,255,255,0.10)"}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Mood before */}
      <div>
        <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.40)" }}>Hoe voel je je nu?</p>
        <div className="flex gap-3">
          {MOODS.map((m, i) => (
            <button
              key={i}
              onClick={() => setMoodBefore(i)}
              className="text-2xl rounded-xl p-2 transition-all"
              style={{ background: moodBefore === i ? "rgba(194,90,50,0.25)" : "transparent" }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titel (optioneel)"
        className="w-full rounded-2xl px-4 py-3 text-sm text-white outline-none"
        style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.10)" }}
      />

      {/* Body */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Schrijf wat nu écht waar voelt…"
        rows={10}
        className="w-full rounded-2xl px-4 py-4 text-sm text-white leading-6 outline-none resize-none"
        style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.10)" }}
      />

      <button
        onClick={handleSave}
        disabled={!body.trim() || saving || saved}
        className="w-full rounded-2xl py-4 text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        style={{
          background: saved ? "#34c759" : "linear-gradient(135deg, #ee9670, #c25a32)",
          boxShadow: saved ? "0 4px 20px rgba(52,199,89,0.30)" : "0 4px 20px rgba(194,90,50,0.30)",
        }}
      >
        {saved ? <><CheckCircle className="h-4 w-4" /> Bewaard!</> : saving ? "Bezig…" : "Notitie bewaren"}
      </button>
    </div>
  );
}