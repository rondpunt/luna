import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Lock, Sparkles, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

export default function Reports() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => base44.entities.Report.list("-created_date", 20),
  });

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const isPro = user?.plan === "plus" || user?.plan === "pro";

  const handleLogin = () => base44.auth.redirectToLogin(window.location.href);

  if (selectedReport) {
    return (
      <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 40, minHeight: "100dvh", background: "var(--bg)" }}>
        <button onClick={() => setSelectedReport(null)} className="press" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", marginBottom: 20, display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span style={{ fontSize: 14 }}>Terug</span>
        </button>

        <div style={{ marginBottom: 32 }}>
          <p className="eyebrow" style={{ marginBottom: 6 }}>{selectedReport.type === "weekly" ? "WEEKSAMENVATTING" : "RAPPORT"}</p>
          <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            {selectedReport.title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>
            Gegenereerd op {format(parseISO(selectedReport.created_date), "d MMM yyyy", { locale: nl })}
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, padding: "28px 24px", color: "var(--text)", lineHeight: 1.6, fontSize: 15 }}>
          <ReactMarkdown
            components={{
              h3: ({ children }) => <h3 className="font-display" style={{ fontSize: 24, color: "#E8834A", marginTop: 24, marginBottom: 12 }}>{children}</h3>,
              p: ({ children }) => <p style={{ marginBottom: 16, color: "var(--text)" }}>{children}</p>,
              ul: ({ children }) => <ul style={{ marginBottom: 16, paddingLeft: 20, listStyleType: "disc", color: "var(--text-muted)" }}>{children}</ul>,
              li: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>,
            }}
          >
            {selectedReport.content}
          </ReactMarkdown>
        </div>

        {selectedReport.pdf_url && (
          <button className="btn btn-primary press" style={{ marginTop: 24, width: "100%", height: 56, fontSize: 16 }}>
            <Download size={18} strokeWidth={2} />
            Download PDF
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="fade-in px-5" style={{ paddingTop: "calc(28px + env(safe-area-inset-top, 0px))", paddingBottom: 40, minHeight: "100dvh", background: "var(--bg)" }}>
      <button onClick={() => navigate(-1)} className="press" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 24, display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <div style={{ marginBottom: 32 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>JOUW DATA</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Rapporten.
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.6 }}>
          Wekelijkse AI-samenvattingen van je dagboek en gesprekken, klaar om te bespreken met je therapeut.
        </p>
      </div>

      {!isPro ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 24, borderRadius: 24,
            background: "linear-gradient(145deg, rgba(232,131,74,0.12), rgba(232,131,74,0.02))",
            border: "1px solid rgba(232,131,74,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(232,131,74,0.15)", border: "1px solid rgba(232,131,74,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={16} style={{ color: "#E8834A" }} strokeWidth={2} />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 2, color: "#E8834A" }}>LUNA PLUS</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Premium feature</p>
            </div>
          </div>
          <h2 className="font-display" style={{ fontSize: 26, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>
            Jouw patroon, objectief in kaart.
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
            Krijg wekelijks een therapeut-klare PDF-samenvatting met emotie-grafieken, triggers en de DBT-skills die je hielpen.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => navigate("/pricing")} className="btn btn-primary press" style={{ height: 48, fontSize: 15 }}>Bekijk Premium</button>
            <button onClick={handleLogin} className="btn btn-ghost press" style={{ height: 48, fontSize: 14, gap: 10 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#F0EBE1", color: "#11131A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>G</span>
              Inloggen
            </button>
          </div>
        </motion.div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {isLoading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", marginTop: 40 }}>Rapporten laden…</p>
          ) : reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: 20 }}>
              <FileText size={32} style={{ color: "var(--text-faint)", margin: "0 auto 16px" }} strokeWidth={1.5} />
              <p style={{ fontSize: 15, color: "var(--text)" }}>Nog geen rapporten</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>Vul je dagboek in en voer gesprekken. Je eerste rapport verschijnt hier na 7 dagen.</p>
            </div>
          ) : (
            reports.map((report, idx) => (
              <motion.button
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                onClick={() => setSelectedReport(report)}
                className="press"
                style={{
                  display: "flex", alignItems: "flex-start", gap: 16, padding: 20, textAlign: "left", width: "100%",
                  background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20, cursor: "pointer", transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(164,107,168,0.15)", border: "1px solid rgba(164,107,168,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={20} style={{ color: "#A46BA8" }} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{report.title}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{format(parseISO(report.created_date), "d MMM yyyy", { locale: nl })}</p>
                  <p style={{ fontSize: 13, color: "var(--text-faint)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {report.preview || report.content?.substring(0, 100) + "..."}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </div>
      )}
    </div>
  );
}