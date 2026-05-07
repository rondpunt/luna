import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { motion } from "framer-motion";
import { Save, Check } from "lucide-react";

const EMOTIONS = [
  { key: "sadness", label: "Verdriet", color: "#6B8FD4" },
  { key: "shame",   label: "Schaamte", color: "#A46BA8" },
  { key: "fear",    label: "Angst",    color: "#D4A86B" },
  { key: "anger",   label: "Boosheid", color: "#D46B6B" },
  { key: "joy",     label: "Vreugde",  color: "#6BAD8A" },
];

const URGES_BPD = [
  { key: "urge_self_harm",     actKey: "acted_self_harm",     label: "Zelfbeschadiging" },
  { key: "urge_substance",     actKey: "acted_substance",     label: "Middelen" },
  { key: "urge_quit_therapy",  actKey: null,                  label: "Therapie afzeggen" },
  { key: "urge_lash_out",      actKey: "acted_lash_out",      label: "Uitvallen" },
];

const SKILLS = ["TIP", "STOP", "ACCEPTS", "IMPROVE", "DEAR MAN", "FAST", "GIVE", "Mindfulness", "Andere"];

function EmotionRow({ label, value, onChange, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.035)" }}>
      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{label}</p>
      <div style={{ flex: 1, position: "relative", height: 28, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }} />
        <div style={{ position: "absolute", left: 0, height: 3, borderRadius: 2, background: color, width: `${(value / 5) * 100}%`, transition: "width 0.15s ease" }} />
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} aria-label={`${label} ${n}`}
            style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: `${(n / 5) * (100 - 12)}%`, width: 14, height: 28, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: n === 0 ? 10 : 12, height: n === 0 ? 10 : 12, borderRadius: "50%", background: value >= n ? color : "rgba(255,255,255,0.10)", transition: "all 0.12s", boxShadow: value === n ? `0 0 8px ${color}80` : "none" }} />
          </button>
        ))}
      </div>
      <span className="font-display" style={{ fontSize: 20, color, width: 22, textAlign: "right", lineHeight: 1, flexShrink: 0 }}>{value}</span>
    </div>
  );
}

function Section({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.055)",
        borderRadius: 20, padding: "18px 20px 14px", marginBottom: 12,
      }}
    >
      <p className="eyebrow-muted" style={{ marginBottom: 14 }}>{title}</p>
      {children}
    </motion.div>
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
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 8 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 6 }}>DIARY CARD</p>
        <h1 className="font-display" style={{ fontSize: 34, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.0 }}>
          Vandaag.
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
          {format(new Date(), "EEEE d MMMM", { locale: nl })}
        </p>
      </div>

      {/* Emoties */}
      <Section title="EMOTIES — SCHAAL 0-5" delay={0.05}>
        {EMOTIONS.map(({ key, label, color }) => (
          <EmotionRow key={key} label={label} value={emotions[key]} onChange={(v) => setEmotion(key, v)} color={color} />
        ))}
      </Section>

      {/* Urges */}
      <Section title="URGES — SCHAAL 0-5" delay={0.1}>
        {URGES_BPD.map(({ key, actKey, label }) => {
          const urgeVal = urges[key] || 0;
          const urgColor = urgeVal >= 4 ? "#C94040" : "#E8834A";
          return (
            <div key={key} style={{ borderBottom: "1px solid rgba(255,255,255,0.035)", paddingBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0 8px" }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{label}</p>
                <div style={{ flex: 1, position: "relative", height: 28, display: "flex", alignItems: "center" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }} />
                  <div style={{ position: "absolute", left: 0, height: 3, borderRadius: 2, background: urgColor, width: `${(urgeVal / 5) * 100}%`, transition: "width 0.15s" }} />
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setUrge(key, n)} aria-label={`${label} ${n}`}
                      style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: `${(n / 5) * (100 - 12)}%`, width: 14, height: 28, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: urgeVal >= n ? urgColor : "rgba(255,255,255,0.10)", transition: "all 0.12s" }} />
                    </button>
                  ))}
                </div>
                <span className="font-display" style={{ fontSize: 20, color: urgColor, width: 22, textAlign: "right", lineHeight: 1, flexShrink: 0 }}>{urgeVal}</span>
              </div>
              {actKey && urgeVal > 0 && (
                <div style={{ paddingBottom: 8, display: "flex", alignItems: "center", gap: 10, paddingLeft: 104 }}>
                  <button onClick={() => toggleActed(actKey)}
                    style={{ width: 20, height: 20, borderRadius: 6, border: acted[actKey] ? "1.5px solid #C94040" : "1.5px solid rgba(255,255,255,0.18)", background: acted[actKey] ? "rgba(201,64,64,0.14)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s" }}
                    aria-label="Gedaan vandaag">
                    {acted[actKey] && <Check size={10} style={{ color: "#C94040" }} strokeWidth={3} />}
                  </button>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Gedaan vandaag</span>
                </div>
              )}
            </div>
          );
        })}
      </Section>

      {/* Skills */}
      <Section title="SKILLS GEBRUIKT" delay={0.15}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SKILLS.map((s) => {
            const active = skills.includes(s);
            return (
              <button key={s} onClick={() => toggleSkill(s)} className="press"
                style={{ height: 32, padding: "0 14px", borderRadius: 16, fontSize: 12, fontWeight: 500, background: active ? "rgba(232,131,74,0.10)" : "rgba(255,255,255,0.03)", border: active ? "1.5px solid rgba(232,131,74,0.40)" : "1px solid rgba(255,255,255,0.07)", color: active ? "#E8834A" : "var(--text-muted)", cursor: "pointer", transition: "all 0.12s" }}>
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Notes */}
      <Section title="NOTITIES" delay={0.2}>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); triggerAutoSave(); }}
          placeholder="Optioneel. Wat wil je onthouden?"
          rows={3}
          style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none", fontSize: 14, color: "var(--text)", lineHeight: 1.65, fontFamily: "inherit", caretColor: "#E8834A" }}
        />
      </Section>

      {/* Overall score */}
      <Section title="ALGEMEEN GEVOEL" delay={0.25}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <motion.span
            key={overallScore}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="font-display"
            style={{ fontSize: 56, color: "#E8834A", lineHeight: 1, letterSpacing: "-0.04em", flexShrink: 0, minWidth: 52 }}
          >
            {overallScore}
          </motion.span>
          <div style={{ flex: 1 }}>
            <input type="range" min={1} max={10} value={overallScore}
              onChange={(e) => { setOverallScore(Number(e.target.value)); triggerAutoSave(); }}
              className="mood-slider"
              style={{ background: `linear-gradient(to right, #E8834A ${fillPct}%, rgba(255,255,255,0.05) ${fillPct}%)` }}
              aria-label="Algemeen gevoel 1 tot 10"
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>zwaar</span>
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>uitstekend</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Save button */}
      <motion.button
        onClick={save}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="btn btn-primary press"
        style={{ fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}
      >
        {saved ? <Check size={16} strokeWidth={2.5} /> : <Save size={15} strokeWidth={1.8} />}
        {saved ? "Opgeslagen!" : "Opslaan"}
      </motion.button>

      <div style={{ height: 16 }} />
    </div>
  );
}