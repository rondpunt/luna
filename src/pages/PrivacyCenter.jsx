import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Trash2, AlertTriangle, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyCenter() {
  const navigate = useNavigate();
  const [memoryOn, setMemoryOn] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClear = async () => {
    setClearing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setClearing(false);
    setCleared(true);
  };

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 40, minHeight: "100dvh", background: "var(--bg)" }}>
      <button onClick={() => navigate(-1)} className="press" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", padding: "4px 0", marginBottom: 24 }}>
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.05 }}>
          Privacy Center.
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
          Jij bepaalt wat Luna onthoudt en wat er met je data gebeurt.
        </p>

        {/* Memory toggle */}
        <div style={{ marginBottom: 32 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>GEHEUGEN</p>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Luna-geheugen</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Laat Luna context over gesprekken heen onthouden.</p>
            </div>
            <button
              onClick={() => setMemoryOn(!memoryOn)}
              style={{
                width: 48, height: 28, borderRadius: 14,
                background: memoryOn ? "#E8834A" : "rgba(255,255,255,0.1)",
                position: "relative", border: "none", cursor: "pointer", transition: "all 0.2s ease"
              }}
            >
              <div style={{
                position: "absolute", top: 2, left: memoryOn ? 22 : 2, width: 24, height: 24,
                borderRadius: "50%", background: "#1A0E08", transition: "all 0.2s ease",
              }} />
            </button>
          </div>
        </div>

        {/* Data actions */}
        <div style={{ marginBottom: 32 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>JOUW DATA</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="press" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", width: "100%", textAlign: "left" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(107,143,212,0.1)", border: "1px solid rgba(107,143,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Download size={18} style={{ color: "#6B8FD4" }} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Data exporteren</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Download al je logboeken als JSON</p>
              </div>
            </button>

            <button onClick={handleClear} disabled={clearing || cleared} className="press" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", width: "100%", textAlign: "left", opacity: cleared ? 0.6 : 1 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(201,64,64,0.1)", border: "1px solid rgba(201,64,64,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 size={18} style={{ color: "var(--crisis)" }} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: cleared ? "#6BAD8A" : "var(--crisis)", marginBottom: 2 }}>
                  {cleared ? "Geschiedenis gewist" : clearing ? "Bezig…" : "Gespreksgeschiedenis wissen"}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Verwijder alle chats en AI-herinneringen</p>
              </div>
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <p className="eyebrow" style={{ marginBottom: 12, color: "var(--crisis)" }}>GEVARENZONE</p>
          <div style={{ background: "rgba(201,64,64,0.04)", border: "1px solid rgba(201,64,64,0.15)", borderRadius: 20, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <AlertTriangle size={18} style={{ color: "var(--crisis)", marginTop: 2, flexShrink: 0 }} strokeWidth={2} />
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--crisis)", marginBottom: 4 }}>Account permanent wissen</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Dit verwijdert onherroepelijk je profiel, al je data en je actieve abonnementen. Dit kan niet ongedaan worden gemaakt.
                </p>
              </div>
            </div>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-ghost-crisis press" style={{ width: "100%", height: 48, fontSize: 14 }}>
              Verwijder mijn account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}