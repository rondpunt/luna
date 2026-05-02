import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, BookHeart, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

const TEMPLATES = [
  { key: "vrij",        label: "Vrij schrijven", emoji: "✍️",  desc: "Geen structuur, gewoon schrijven" },
  { key: "dankbaar",    label: "Dankbaarheid",   emoji: "🙏",  desc: "Drie dingen die toch fijn waren" },
  { key: "angst",       label: "Angst loslaten", emoji: "🌊",  desc: "Wat je bezighoudt neerschrijven" },
  { key: "slaap",       label: "Slaapreflectie", emoji: "🌙",  desc: "Hoe was je dag en nacht?" },
  { key: "adhd",        label: "ADHD-dump",      emoji: "⚡",  desc: "Alles wat in je hoofd zit, gewoon leegschrijven" },
  { key: "triggers",    label: "Triggers",       emoji: "🎯",  desc: "Wat bracht me uit balans vandaag?" },
];

const MOODS = [
  { emoji: "😔", label: "Zwaar",    score: 1 },
  { emoji: "😟", label: "Moeilijk", score: 3 },
  { emoji: "😐", label: "Vlak",     score: 5 },
  { emoji: "🙂", label: "Goed",     score: 7 },
  { emoji: "😊", label: "Fijn",     score: 9 },
];

export default function Journal() {
  const [tab, setTab] = useState("write");
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: entries = [], refetch } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 20),
  });

  const myEntries = entries.filter((e) => e.userId === user?.id);

  const handleSave = async () => {
    if (!body.trim() || saving) return;
    setSaving(true);
    try {
      await base44.entities.JournalEntry.create({
        userId: user.id,
        templateType: template.key,
        title: title || template.label,
        content: body,
        moodBefore: mood !== null ? MOODS[mood].emoji : "",
      });
      if (mood !== null) {
        await base44.entities.CheckIn.create({
          score: MOODS[mood].score,
          date: format(new Date(), "yyyy-MM-dd"),
        }).catch(() => {});
      }
      setSaved(true);
      refetch();
      setTimeout(() => {
        setSaved(false);
        setTitle("");
        setBody("");
        setMood(null);
        setTemplate(TEMPLATES[0]);
      }, 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 pt-6 pb-6" style={{ minHeight: "100dvh" }}>

      {/* Header */}
      <div className="px-1 mb-6">
        <p className="text-[14px] font-medium mb-1" style={{ color: "var(--text-2)" }}>Dagboek</p>
        <h1 className="text-[30px] font-bold leading-tight" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>
          Jouw plek.
        </h1>
      </div>

      {/* Tab toggle */}
      <div
        className="flex gap-1 rounded-2xl p-1 mb-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
      >
        {["write", "history"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-xl py-2.5 text-[14px] font-semibold transition-all btn-press"
            style={{
              background: tab === t ? "#C25A32" : "transparent",
              color: tab === t ? "#fff" : "var(--text-2)",
            }}
          >
            {t === "write" ? "Schrijven" : "Geschiedenis"}
          </button>
        ))}
      </div>

      {tab === "write" && (
        <div className="space-y-5">

          {/* Template */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: "var(--text-3)" }}>
              Soort notitie
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTemplate(t)}
                  className="flex items-start gap-2.5 rounded-2xl px-3.5 py-3 text-left transition-all btn-press"
                  style={{
                    background: template.key === t.key ? "rgba(194,90,50,0.15)" : "var(--bg-card)",
                    border: `1px solid ${template.key === t.key ? "#C25A32" : "var(--line)"}`,
                  }}
                >
                  <span className="text-[20px] mt-0.5">{t.emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold leading-tight" style={{ color: template.key === t.key ? "#C25A32" : "var(--text)" }}>
                      {t.label}
                    </p>
                    <p className="text-[11px] mt-0.5 leading-tight" style={{ color: "var(--text-3)" }}>{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: "var(--text-3)" }}>
              Stemming
            </p>
            <div className="flex justify-between px-1">
              {MOODS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-2.5 transition-all btn-press"
                  style={{
                    background: mood === i ? "rgba(194,90,50,0.15)" : "transparent",
                    border: `1px solid ${mood === i ? "#C25A32" : "transparent"}`,
                  }}
                >
                  <span className="text-[26px]">{m.emoji}</span>
                  <span className="text-[11px] font-medium" style={{ color: mood === i ? "#C25A32" : "var(--text-3)" }}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Write area */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel (optioneel)"
              className="w-full bg-transparent px-4 py-3.5 text-[15px] outline-none"
              style={{ color: "var(--text)", borderBottom: "1px solid var(--line-subtle)" }}
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={template.key === "adhd" ? "Dump alles uit je hoofd hier. Geen structuur nodig, gewoon schrijven…" : "Schrijf wat nu écht waar voelt…"}
              rows={8}
              className="w-full bg-transparent px-4 py-3.5 text-[16px] leading-[1.6] outline-none resize-none"
              style={{ color: "var(--text)" }}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!body.trim() || saving || saved}
            className="w-full rounded-2xl py-4 text-[15px] font-semibold text-white transition-all flex items-center justify-center gap-2 btn-press disabled:opacity-40"
            style={{ background: saved ? "var(--green)" : "linear-gradient(135deg, #ee9670, #c25a32)" }}
          >
            {saved ? <><CheckCircle2 className="h-5 w-5" /> Bewaard!</> : saving ? "Bezig…" : "Notitie bewaren"}
          </button>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {myEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <BookHeart className="h-10 w-10" style={{ color: "var(--text-3)" }} strokeWidth={1.3} />
              <p className="text-[16px] font-medium" style={{ color: "var(--text-2)" }}>Nog niets geschreven</p>
              <button onClick={() => setTab("write")} className="text-[14px] font-medium" style={{ color: "#C25A32" }}>
                Begin je eerste notitie →
              </button>
            </div>
          ) : (
            <div className="list-group">
              {myEntries.map((entry) => (
                <div key={entry.id} className="list-row gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(74,158,255,0.12)" }}>
                    <span className="text-[18px]">
                      {TEMPLATES.find((t) => t.key === entry.templateType)?.emoji || "✍️"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium truncate" style={{ color: "var(--text)" }}>{entry.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {entry.moodBefore && <span className="text-[13px]">{entry.moodBefore}</span>}
                      <Clock className="h-3 w-3" style={{ color: "var(--text-3)" }} />
                      <span className="text-[12px]" style={{ color: "var(--text-3)" }}>
                        {format(new Date(entry.created_date), "d MMM · HH:mm", { locale: nl })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}