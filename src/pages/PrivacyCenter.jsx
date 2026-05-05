import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Download, Trash2, AlertTriangle } from "lucide-react";

export default function PrivacyCenter() {
  const [memoryOn, setMemoryOn] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClear = async () => {
    setClearing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setClearing(false);
    setCleared(true);
  };

  return (
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      <div className="flex items-center gap-2">
        <Link to="/profiel" className="flex items-center gap-1 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[30px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>Privacycentrum</h1>

      {/* Memory toggle */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5 px-1" style={{ color: "var(--text-3)" }}>Geheugen</p>
        <div className="list-group">
          <div className="list-row justify-between">
            <div className="flex-1">
              <p className="text-[15px] font-medium" style={{ color: "var(--text)" }}>Luna-geheugen</p>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>
                Luna onthoudt context over gesprekken heen
              </p>
            </div>
            <button
              onClick={() => setMemoryOn((v) => !v)}
              className="relative h-7 w-12 rounded-full transition-colors duration-200 shrink-0 ml-4"
              style={{ background: memoryOn ? "#C25A32" : "rgba(255,255,255,0.12)" }}
            >
              <div
                className="absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform duration-200"
                style={{ transform: memoryOn ? "translateX(20px)" : "translateX(2px)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data actions */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5 px-1" style={{ color: "var(--text-3)" }}>Jouw data</p>
        <div className="list-group">
          <button className="list-row gap-3.5 w-full btn-press">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(74,158,255,0.12)" }}>
              <Download className="h-[17px] w-[17px]" style={{ color: "#4A9EFF" }} strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] font-medium" style={{ color: "var(--text)" }}>Data exporteren</p>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>Alles als JSON downloaden</p>
            </div>
          </button>
          <button
            onClick={handleClear}
            disabled={clearing || cleared}
            className="list-row gap-3.5 w-full btn-press disabled:opacity-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(240,71,71,0.10)" }}>
              <Trash2 className="h-[17px] w-[17px]" style={{ color: "#F04747" }} strokeWidth={1.8} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] font-medium" style={{ color: cleared ? "#34C77B" : "#F04747" }}>
                {cleared ? "Geschiedenis gewist" : clearing ? "Bezig…" : "Gespreksgeschiedenis wissen"}
              </p>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>Gesprekken en herinneringen verwijderen</p>
            </div>
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-2.5 px-1" style={{ color: "var(--text-3)" }}>Account</p>
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(240,71,71,0.06)", border: "1px solid rgba(240,71,71,0.22)" }}
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#F04747" }} strokeWidth={1.8} />
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "#F04747" }}>Account verwijderen</p>
              <p className="text-[13px] mt-1 leading-[1.5]" style={{ color: "var(--text-2)" }}>
                Dit verwijdert permanent je account, alle gesprekken, dagboeknotities en herinneringen. Dit kan niet ongedaan worden.
              </p>
            </div>
          </div>
          <button
            className="w-full rounded-xl py-3 text-[14px] font-semibold btn-press"
            style={{ background: "rgba(240,71,71,0.14)", color: "#F04747", border: "1px solid rgba(240,71,71,0.30)" }}
          >
            Account permanent verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}