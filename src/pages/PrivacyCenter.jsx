import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Trash2, Download } from "lucide-react";

export default function PrivacyCenter() {
  const [memoryOn, setMemoryOn] = useState(true);
  const [done, setDone] = useState("");

  return (
    <div className="px-5 pt-6 pb-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#1c1c1e" }}>
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Privacycentrum</h1>
      </div>

      <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
        Bepaal zelf wat Nora onthoudt en wat van jou blijft.
      </p>

      {/* Memory toggle */}
      <div className="rounded-2xl px-4 py-4 flex items-center justify-between" style={{ background: "#1c1c1e" }}>
        <div>
          <p className="text-sm font-semibold text-white">Geheugen</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Nora onthoudt context over gesprekken heen</p>
        </div>
        <button
          onClick={() => setMemoryOn((v) => !v)}
          className="h-7 w-12 rounded-full transition-colors relative"
          style={{ background: memoryOn ? "#c25a32" : "#3a3a3c" }}
        >
          <span
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all"
            style={{ left: memoryOn ? "calc(100% - 26px)" : "2px" }}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => setDone("export")}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm text-white text-left transition-all"
          style={{ background: "#1c1c1e" }}
        >
          <Download className="h-5 w-5 text-[#c25a32]" />
          <span>{done === "export" ? "✓ Export aangemaakt" : "Alle data exporteren"}</span>
        </button>
        <button
          onClick={() => setDone("history")}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm text-white text-left transition-all"
          style={{ background: "#1c1c1e" }}
        >
          <Trash2 className="h-5 w-5" style={{ color: "rgba(255,255,255,0.50)" }} />
          <span>{done === "history" ? "✓ Geschiedenis gewist" : "Gespreksgeschiedenis wissen"}</span>
        </button>
      </div>

      {/* Delete account */}
      <div className="rounded-2xl px-4 py-4" style={{ background: "#1c1c1e", border: "1px solid rgba(255,59,48,0.20)" }}>
        <p className="text-sm font-semibold text-white mb-1">Account verwijderen</p>
        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>Verwijder je account en hele privé geschiedenis definitief. Dit kan niet ongedaan worden.</p>
        <button
          className="rounded-xl px-4 py-2 text-sm font-medium"
          style={{ background: "rgba(255,59,48,0.12)", color: "#ff3b30" }}
        >
          Account verwijderen
        </button>
      </div>
    </div>
  );
}