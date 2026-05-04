import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import CrisisButton from "@/components/luna/CrisisButton";
import { Save } from "lucide-react";

const EMOTIONS = [
  { key: "sadness",  label: "Verdriet",  color: "#6B8FD4" },
  { key: "shame",    label: "Schaamte",  color: "#A46BA8" },
  { key: "fear",     label: "Angst",     color: "#D4A86B" },
  { key: "anger",    label: "Boosheid",  color: "#D46B6B" },
  { key: "joy",      label: "Vreugde",   color: "#6BAD8A" },
];

const URGES_BPD = [
  { key: "urge_self_harm",     actKey: "acted_self_harm",     label: "Zelfbeschadiging" },
  { key: "urge_substance",     actKey: "acted_substance",     label: "Middelen" },
  { key: "urge_quit_therapy",  actKey: null,                  label: "Therapie afzeggen" },
  { key: "urge_lash_out",      actKey: "acted_lash_out",      label: "Uitvallen" },
];

const URGES_ADHD = [
  { key: "urge_lash_out",   actKey: "acted_lash_out",  label: "Impulsiviteit" },
  { key: "urge_substance",  actKey: "acted_substance", label: "Uitstelgedrag" },
  { key: "urge_self_harm",  actKey: null,              label: "Hyperfocus" },
  { key: "urge_quit_therapy", actKey: null,            label: "Vergeetachtigheid" },
];

const SKILLS = [
  "TIP", "STOP", "ACCEPTS", "IMPROVE", "DEAR MAN", "FAST", "GIVE", "Mindfulness", "Andere"
];

function EmotionRow({ label, value, onChange, color }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 28px", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>{label}</p>
      <div style={{ position: "relative", height: 32 }}>
        {/* Track */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
        {/* Fill */}
        <div style={{ position: "absolute", top: "50%", left: 0, height: 4, transform: "translateY(-50%)", borderRadius: 4, background: color, width: `${(value / 5) * 100}%`, transition: "width 0.15s ease" }} />
        {/* Tap zones */}
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`${label} ${n}`}
            style={{ position: "absolute", top: 0, bottom: 0, left: `${(n / 5) * 83}%`, width: "16.66%", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: value >= n ? color : "rgba(255,255,255,0.15)", transition: "background 0.15s" }} />
          </button>
        ))}
      </div>
      <p className="font-display" style={{ fontSize: 20, color, textAlign: "right", lineHeight: 1 }}>{value}</p>
    </div>
  );
}

export default function Diary() {
  const qc = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const autoSaveRef = useRef(null);

  const [emotions, setEmotions] = useState({ sadness: 0, shame: 0, fear: 0, anger: 0, joy: 0 });
  const [urges, setUrges] = useState({ urge_self_harm: 0, urge_substance: 0, urge_quit_therapy: 0, urge_lash_out: 0 });
  const [acted, setActed] = useState({ acted_self_harm: false, acted_substance: false, acted_lash_out: false });
  const [skills, setSkills] = useState([]);
  const [notes, setNotes] = useState("");
  const [overallScore, setOverallScore] = useState(5);
  const [saved, setSaved] = useState(false);

  // Check user concern for BPD vs ADHD urges
  const { data: prefs } = useQuery({
    queryKey: ["userprefs"],
    queryFn: () => base44.entities.UserPreferences.list(),
  });
  const concern = prefs?.[0]?.concern || "bpd";
  const urgeList = concern === "adhd" ? URGES_ADHD : URGES_BPD;

  // Load today's existing entry
  const { data: existing } = useQuery({
    queryKey: ["diary-today"],
    queryFn: () => base44.entities.DiaryEntry.filter({ date: today }),
  });

  useEffect(() => {
    if (existing?.length > 0) {
      const e = existing[0];
      setEmotions({ sadness: e.sadness || 0, shame: e.shame || 0, fear: e.fear || 0, anger: e.anger || 0, joy: e.joy || 0 });
      setUrges({ urge_self_harm: e.urge_self_harm || 0, urge_substance: e.urge_substance || 0, urge_quit_therapy: e.urge_quit_therapy || 0, urge_lash_out: e.urge_lash_out || 0 });
      setActed({ acted_self_harm: e.acted_self_harm || false, acted_substance: e.acted_substance || false, acted_lash_out: e.acted_lash_out || false });
      setSkills(e.skills_used || []);
      setNotes(e.notes || "");
      setOverallScore(e.overall_score || 5);
    }
  }, [existing]);

  const save = async () => {
    const data = { date: today, ...emotions, ...urges, ...acted, skills_used: skills, notes, overall_score: overallScore };
    try {
      if (existing?.length > 0) {
        await base44.entities.DiaryEntry.update(existing[0].id, data);
      } else {
        await base44.entities.DiaryEntry.create(data);
      }
      qc.invalidateQueries({ queryKey: ["diary-today"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  // Auto-save every 5 seconds after interaction
  const triggerAutoSave = () => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(save, 5000);
  };

  const setEmotion = (key, val) => { setEmotions(p => ({ ...p, [key]: val })); triggerAutoSave(); };
  const setUrge = (key, val) => { setUrges(p => ({ ...p, [key]: val })); triggerAutoSave(); };
  const toggleActed = (key) => { setActed(p => ({ ...p, [key]: !p[key] })); triggerAutoSave(); };
  const toggleSkill = (s) => { setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); triggerAutoSave(); };
  const fillPct = ((overallScore - 1) / 9) * 100;

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <CrisisButton />

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>DIARY CARD</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Vandaag.
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
          {format(new Date(), "EEEE d MMMM", { locale: nl })}
        </p>
      </div>

      {/* Emoties */}
      <div className="surface" style={{ padding: "20px 20px 8px", marginBottom: 16 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 16 }}>EMOTIES — schaal 0-5</p>
        {EMOTIONS.map(({ key, label, color }) => (
          <EmotionRow key={key} label={label} value={emotions[key]} onChange={(v) => setEmotion(key, v)} color={color} />
        ))}
      </div>

      {/* Urges */}
      <div className="surface" style={{ padding: "20px 20px 12px", marginBottom: 16 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 16 }}>URGES — schaal 0-5</p>
        {urgeList.map(({ key, actKey, label }) => (
          <div key={key}>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 28px", alignItems: "center", gap: 12, padding: "10px 0" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>{label}</p>
              <div style={{ position: "relative", height: 32 }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
                <div style={{ position: "absolute", top: "50%", left: 0, height: 4, transform: "translateY(-50%)", borderRadius: 4, background: urges[key] >= 4 ? "#D14D4D" : "#E8834A", width: `${(urges[key] / 5) * 100}%`, transition: "width 0.15s" }} />
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setUrge(key, n)} aria-label={`${label} ${n}`}
                    style={{ position: "absolute", top: 0, bottom: 0, left: `${(n / 5) * 83}%`, width: "16.66%", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: urges[key] >= n ? (urges[key] >= 4 ? "#D14D4D" : "#E8834A") : "rgba(255,255,255,0.15)" }} />
                  </button>
                ))}
              </div>
              <p className="font-display" style={{ fontSize: 20, color: urges[key] >= 4 ? "#D14D4D" : "#E8834A", textAlign: "right", lineHeight: 1 }}>{urges[key]}</p>
            </div>
            {actKey && urges[key] > 0 && (
              <div style={{ paddingLeft: 0, paddingBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => toggleActed(actKey)}
                  style={{ width: 20, height: 20, borderRadius: 6, border: acted[actKey] ? "1.5px solid #D14D4D" : "1.5px solid rgba(255,255,255,0.20)", background: acted[actKey] ? "rgba(209,77,77,0.15)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  aria-label="Gedaan vandaag"
                >
                  {acted[actKey] && <div style={{ width: 8, height: 8, borderRadius: 2, background: "#D14D4D" }} />}
                </button>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Gedaan vandaag</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="surface" style={{ padding: "20px", marginBottom: 16 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 16 }}>SKILLS GEBRUIKT</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SKILLS.map((s) => {
            const active = skills.includes(s);
            return (
              <button key={s} onClick={() => toggleSkill(s)} className="press"
                style={{ height: 34, padding: "0 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, background: active ? "rgba(232,131,74,0.10)" : "var(--surface)", border: active ? "1.5px solid #E8834A" : "1px solid var(--border)", color: active ? "#E8834A" : "var(--text-muted)", cursor: "pointer", transition: "all 0.15s" }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="surface" style={{ padding: "20px", marginBottom: 16 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>NOTITIES</p>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); triggerAutoSave(); }}
          placeholder="Optioneel. Wat wil je onthouden?"
          rows={3}
          style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none", fontSize: 15, color: "var(--text)", lineHeight: 1.6, fontFamily: "inherit" }}
        />
      </div>

      {/* Overall score */}
      <div className="surface" style={{ padding: "20px 20px 24px", marginBottom: 24 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 16 }}>ALGEMEEN</p>
        <input type="range" min={1} max={10} value={overallScore}
          onChange={(e) => { setOverallScore(Number(e.target.value)); triggerAutoSave(); }}
          className="mood-slider"
          style={{ background: `linear-gradient(to right, #E8834A ${fillPct}%, rgba(255,255,255,0.06) ${fillPct}%)` }}
          aria-label="Algemeen gevoel 1 tot 10"
        />
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span className="font-display" style={{ fontSize: 48, color: "#E8834A", display: "block", lineHeight: 1 }}>{overallScore}</span>
        </div>
      </div>

      {/* Save */}
      <button onClick={save} className="btn btn-primary press" style={{ fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Save size={16} strokeWidth={1.5} />
        {saved ? "Opgeslagen." : "Opslaan"}
      </button>
    </div>
  );
}
