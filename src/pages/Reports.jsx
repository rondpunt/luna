import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { FileText, Download, ChevronRight, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CrisisButton from "@/components/luna/CrisisButton";
import ReactMarkdown from "react-markdown";

const TYPE_LABEL = {
  weekly:   "Weekrapport",
  session:  "Sessie-samenvatting",
  monthly:  "Maandrapport",
  therapist:"Therapeut-export",
};

const TYPE_COLOR = {
  weekly:   "#E8834A",
  session:  "#6B8FD4",
  monthly:  "#A46BA8",
  therapist:"#6BAD8A",
};

export default function Reports() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [generating, setGenerating] = useState(false);

  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: () => base44.entities.Report?.list?.("-created_date", 50) || Promise.resolve([]),
  });

  async function generateWeeklyReport() {
    setGenerating(true);
    try {
      // Fetch last 7 days of diary + skills
      const [diaryEntries, skillUses] = await Promise.all([
        base44.entities.DiaryEntry?.list?.("-date", 7) || Promise.resolve([]),
        base44.entities.SkillUse?.list?.("-created_date", 50) || Promise.resolve([]),
      ]);

      const today = format(new Date(), "yyyy-MM-dd");
      const weekAgo = format(new Date(Date.now() - 7 * 86400000), "yyyy-MM-dd");

      // Build data summary for AI
      const diaryText = diaryEntries.length
        ? diaryEntries.map((e) =>
            `Datum: ${e.date}\nStemming: ${e.overall_score || "?"}/10\nVerdriet:${e.sadness||0} Schaamte:${e.shame||0} Angst:${e.fear||0} Boosheid:${e.anger||0} Vreugde:${e.joy||0}\nUrges: ZB=${e.urge_self_harm||0} Mid=${e.urge_substance||0} Uit=${e.urge_lash_out||0}\nGehandeld: ZB=${e.acted_self_harm?"ja":"nee"} Mid=${e.acted_substance?"ja":"nee"} Uit=${e.acted_lash_out?"ja":"nee"}\nNotes: ${e.notes||"-"}`
          ).join("\n---\n")
        : "Geen dagboek-entries deze week.";

      const skillText = skillUses.length
        ? skillUses.map((s) => `Skill: ${s.skillKey} | Effectief: ${s.effective}/5 | Context: ${s.context||"-"}`).join("\n")
        : "Geen skills gebruikt.";

      const prompt = `Je bent Luna's rapport-generator. Schrijf een wekelijks rapport in markdown, in het Nederlands, 250-400 woorden. Stijl: warm, niet-oordelend, observerend. Geen diagnose, geen schrik-woorden.

Structuur:
## Hoe was het deze week?
(2-3 zinnen over de algemene toon van de week)

## Wat je hebt gevoeld
(patronen in emoties, zonder te overdrijven)

## Skills in actie
(welke skills gebruikt, wat leek te helpen)

## Wat terugkomt
(terugkerende patronen, urges — neutraal beschreven)

## Een kleine observatie
(één zachte, bemoedigende observatie — geen advies)

---
DAGBOEK-DATA:
${diaryText}

SKILL-GEBRUIK:
${skillText}`;

      const result = await base44.functions.invoke("noraChat", { messages: [{ role: "user", content: prompt }], style: "weekly_report" });
      const content = result?.data?.reply || "Rapport kon niet worden gegenereerd.";

      await base44.entities.Report?.create?.({
        type: "weekly",
        title: `Week van ${format(parseISO(weekAgo), "d MMM", { locale: nl })} – ${format(parseISO(today), "d MMM yyyy", { locale: nl })}`,
        period_start: weekAgo,
        period_end: today,
        content,
        preview: content.replace(/[#*`]/g, "").substring(0, 120) + "…",
      });

      await refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  if (selected) {
    return <ReportDetail report={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <CrisisButton />

      <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>Rapporten.</h1>
      <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 6, marginBottom: 28 }}>Voor jou. Of voor je therapeut.</p>

      {/* Genereer weekrapport */}
      <div className="surface" style={{ padding: "20px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Weekrapport aanmaken</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>AI analyseert je dagboek van de afgelopen 7 dagen</p>
        </div>
        <button
          onClick={generateWeeklyReport}
          disabled={generating}
          className="press"
          style={{ height: 36, padding: "0 16px", borderRadius: 18, fontSize: 13, fontWeight: 500, background: generating ? "rgba(232,131,74,0.15)" : "rgba(232,131,74,0.12)", border: "1px solid rgba(232,131,74,0.25)", color: "#E8834A", cursor: generating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}
        >
          {generating ? <><Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> Bezig…</> : "Aanmaken"}
        </button>
      </div>

      {/* Lijst */}
      {isLoading ? (
        <div style={{ textAlign: "center", paddingTop: 60, color: "var(--text-muted)", fontSize: 14 }}>Laden…</div>
      ) : reports.length === 0 ? (
        <div className="surface" style={{ padding: "40px 24px", textAlign: "center" }}>
          <FileText size={32} style={{ color: "var(--text-faint)", margin: "0 auto 12px" }} strokeWidth={1.2} />
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>Nog geen rapporten. Maak je eerste weekrapport aan.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className="surface press"
              style={{ padding: "16px 18px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, width: "100%" }}
            >
              {/* Kleur-dot */}
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLOR[r.type] || "#E8834A", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TYPE_COLOR[r.type] || "#E8834A", letterSpacing: "0.08em", textTransform: "uppercase" }}>{TYPE_LABEL[r.type] || r.type}</span>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                    {format(parseISO(r.created_date), "d MMM yyyy", { locale: nl })}
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</p>
                {r.preview && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.preview}</p>
                )}
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Report detail view ────────────────────────────────────────────
function ReportDetail({ report, onBack }) {
  const [downloading, setDownloading] = useState(false);

  async function downloadPDF() {
    setDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");
      const { TherapistReportDoc } = await import("@/components/reports/TherapistExportPDF");

      const user = await base44.auth.me();
      const profile = { display_name: user?.full_name || user?.email || "Gebruiker" };
      const period = { start: report.period_start || "–", end: report.period_end || "–" };
      const data = report.pdf_data || {};
      const narrative = { summary: report.content || "", patterns: [], flags: [] };

      const blob = await pdf(<TherapistReportDoc profile={profile} period={period} data={data} narrative={narrative} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LUNA_rapport_${report.period_start || report.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF error:", e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <CrisisButton />

      {/* Back + acties */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#E8834A", cursor: "pointer", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Terug
        </button>
        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="press"
          style={{ height: 34, padding: "0 14px", borderRadius: 17, fontSize: 12, fontWeight: 500, background: "rgba(232,131,74,0.10)", border: "1px solid rgba(232,131,74,0.25)", color: "#E8834A", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Download size={13} />
          {downloading ? "Bezig…" : "PDF"}
        </button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: TYPE_COLOR[report.type] || "#E8834A", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {TYPE_LABEL[report.type] || report.type}
        </span>
      </div>
      <h1 className="font-display" style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 6 }}>{report.title}</h1>
      <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 28 }}>
        {format(parseISO(report.created_date), "d MMMM yyyy 'om' HH:mm", { locale: nl })}
      </p>

      {/* Markdown content */}
      <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.65 }} className="report-markdown">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="font-display" style={{ fontSize: 22, color: "var(--text)", letterSpacing: "-0.01em", marginTop: 28, marginBottom: 10 }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 8 }}>{children}</h3>
            ),
            p: ({ children }) => (
              <p style={{ marginBottom: 14, color: "var(--text)", lineHeight: 1.65 }}>{children}</p>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: 6, color: "var(--text-muted)", lineHeight: 1.55, paddingLeft: 4 }}>{children}</li>
            ),
            hr: () => (
              <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "24px 0" }} />
            ),
            strong: ({ children }) => (
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>{children}</strong>
            ),
          }}
        >
          {report.content || "Geen inhoud beschikbaar."}
        </ReactMarkdown>
      </div>
    </div>
  );
}