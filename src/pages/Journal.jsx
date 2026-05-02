import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2 } from "lucide-react";

const TEMPLATES = ["Vrij schrijven", "Dankbaarheid", "Angst loslaten", "Slaapreflectie"];
const MOODS = ["😔", "😕", "😐", "🙂", "😊"];

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
        moodBefore: moodBefore !== null ? MOODS[moodBefore] : "",
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setTitle("");
        setBody("");
        setMoodBefore(null);
      }, 2500);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 pt-6 pb-6 space-y-6">

      {/* Header */}
      <div className="px-1">
        <p className="text-[15px]" style={{ color: "rgba(235,235,245,0.60)" }}>Dagboek</p>
        <h1 className="mt-0.5 text-[34px] font-bold leading-tight" style={{ color: "#fff", letterSpacing: "-0.5px" }}>
          Jouw plek.
        </h1>
      </div>

      {/* Template selector */}
      <div>
        <p className="text-[13px] font-medium uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(235,235,245,0.55)" }}>
          Soort notitie
        </p>
        <div className="flex gap-2 flex-wrap">
          {TEMPLATES.map((t) => (
            <button
              key={t}
              onClick={() => setTemplate(t)}
              className="rounded-full px-4 py-2 text-[14px] font-medium transition-all active:scale-95"
              style={{
                background: template === t ? "#C25A32" : "rgba(120,120,128,0.24)",
                color: template === t ? "#fff" : "rgba(235,235,245,0.75)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div>
        <p className="text-[13px] font-medium uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(235,235,245,0.55)" }}>
          Hoe voel je je nu?
        </p>
        <div className="flex gap-3 px-1">
          {MOODS.map((m, i) => (
            <button
              key={i}
              onClick={() => setMoodBefore(i)}
              className="text-[26px] rounded-xl p-2 transition-all"
              style={{
                background: moodBefore === i ? "rgba(194,90,50,0.25)" : "rgba(120,120,128,0.18)",
                outline: moodBefore === i ? "2px solid #C25A32" : "none",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* iOS-style input group */}
      <div className="ios-list">
        <div className="ios-list-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel (optioneel)"
            className="flex-1 bg-transparent text-[15px] outline-none"
            style={{ color: "#fff" }}
          />
        </div>
        <div style={{ borderTop: "0.5px solid rgba(84,84,88,0.65)" }}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Schrijf wat nu écht waar voelt…"
            rows={8}
            className="w-full bg-transparent text-[15px] leading-6 outline-none resize-none px-4 py-3"
            style={{ color: "#fff" }}
          />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!body.trim() || saving || saved}
        className="w-full rounded-2xl py-3.5 text-[15px] font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        style={{
          background: saved
            ? "#30D158"
            : "linear-gradient(135deg, #ee9670, #c25a32)",
        }}
      >
        {saved ? (
          <><CheckCircle2 className="h-5 w-5" /> Bewaard!</>
        ) : saving ? "Bezig…" : "Notitie bewaren"}
      </button>
    </div>
  );
}