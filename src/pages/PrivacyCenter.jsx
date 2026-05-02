import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Download, Trash2 } from "lucide-react";

export default function PrivacyCenter() {
  const [memoryOn, setMemoryOn] = useState(true);
  const [done, setDone] = useState("");

  return (
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "#000", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-1" style={{ color: "#FF6B3D" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[17px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[34px] font-bold text-white">Privacycentrum</h1>
      <p className="text-[17px] leading-[1.5]" style={{ color: "rgba(235,235,245,0.55)" }}>
        Bepaal zelf wat Nora onthoudt.
      </p>

      {/* Memory toggle — iOS Settings style */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(235,235,245,0.40)" }}>INSTELLINGEN</p>
        <div className="overflow-hidden rounded-2xl" style={{ background: "#1C1C1E" }}>
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="flex-1">
              <p className="text-[17px] text-white">Geheugen</p>
              <p className="text-[13px] mt-0.5" style={{ color: "rgba(235,235,245,0.50)" }}>Nora onthoudt context over gesprekken</p>
            </div>
            <button
              onClick={() => setMemoryOn((v) => !v)}
              className="ios-toggle"
              style={{ background: memoryOn ? "#FF6B3D" : "#3A3A3C" }}
            >
              <div
                className="ios-toggle-knob"
                style={{ transform: memoryOn ? "translateX(20px)" : "translateX(0px)" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(235,235,245,0.40)" }}>DATA</p>
        <div className="overflow-hidden rounded-2xl" style={{ background: "#1C1C1E" }}>
          <button
            onClick={() => setDone("export")}
            className="flex w-full items-center gap-4 px-4 py-4 active:opacity-60 transition-opacity"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "rgba(10,132,255,0.20)" }}>
              <Download className="h-[18px] w-[18px]" style={{ color: "#0A84FF" }} strokeWidth={2} />
            </div>
            <span className="text-[17px] text-white">{done === "export" ? "✓ Export aangemaakt" : "Alle data exporteren"}</span>
          </button>
          <button
            onClick={() => setDone("history")}
            className="flex w-full items-center gap-4 px-4 py-4 active:opacity-60 transition-opacity"
            style={{ borderTop: "0.5px solid rgba(84,84,88,0.45)" }}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "rgba(120,120,128,0.20)" }}>
              <Trash2 className="h-[18px] w-[18px]" style={{ color: "rgba(235,235,245,0.55)" }} strokeWidth={2} />
            </div>
            <span className="text-[17px] text-white">{done === "history" ? "✓ Geschiedenis gewist" : "Gespreksgeschiedenis wissen"}</span>
          </button>
        </div>
      </div>

      {/* Delete account */}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: "rgba(235,235,245,0.40)" }}>GEVAARZONE</p>
        <div className="overflow-hidden rounded-2xl" style={{ background: "#1C1C1E" }}>
          <div className="px-4 py-4">
            <p className="text-[17px] font-semibold text-white mb-1">Account verwijderen</p>
            <p className="text-[13px] mb-3" style={{ color: "rgba(235,235,245,0.50)" }}>
              Verwijder je account en hele privé geschiedenis definitief. Dit kan niet ongedaan worden.
            </p>
            <button
              className="rounded-[10px] px-4 py-2 text-[15px] font-medium"
              style={{ background: "rgba(255,69,58,0.15)", color: "#FF453A" }}
            >
              Account verwijderen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}