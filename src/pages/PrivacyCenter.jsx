import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Download, Trash2 } from "lucide-react";

export default function PrivacyCenter() {
  const [memoryOn, setMemoryOn] = useState(true);
  const [done, setDone] = useState("");

  return (
    <div className="min-h-dvh px-4 pt-0 pb-10" style={{ background: "#000" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 py-3 mb-6"
        style={{
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(84,84,88,0.65)",
        }}
      >
        <Link to="/profile" className="flex items-center gap-1 text-[17px] font-medium" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          Profiel
        </Link>
        <span className="flex-1 text-center text-[17px] font-semibold" style={{ color: "#fff" }}>Privacycentrum</span>
        <div className="w-16" />
      </div>

      <div className="space-y-6">
        {/* Memory toggle */}
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wider mb-1.5 px-1" style={{ color: "rgba(235,235,245,0.55)" }}>
            INSTELLINGEN
          </p>
          <div className="ios-list">
            <div className="ios-list-row justify-between">
              <div>
                <p className="text-[15px]" style={{ color: "#fff" }}>Geheugen</p>
                <p className="text-[13px]" style={{ color: "rgba(235,235,245,0.45)" }}>
                  Nora onthoudt context over gesprekken
                </p>
              </div>
              <button
                onClick={() => setMemoryOn((v) => !v)}
                className="relative h-[31px] w-[51px] rounded-full transition-colors shrink-0"
                style={{ background: memoryOn ? "#C25A32" : "#3A3A3C" }}
              >
                <span
                  className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-all"
                  style={{ left: memoryOn ? "22px" : "2px" }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data actions */}
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wider mb-1.5 px-1" style={{ color: "rgba(235,235,245,0.55)" }}>
            DATA
          </p>
          <div className="ios-list">
            <button
              onClick={() => setDone("export")}
              className="ios-list-row w-full gap-3"
            >
              <Download className="h-5 w-5" style={{ color: "#C25A32" }} />
              <span className="text-[15px]" style={{ color: "#fff" }}>
                {done === "export" ? "✓ Export aangemaakt" : "Alle data exporteren"}
              </span>
            </button>
            <button
              onClick={() => setDone("history")}
              className="ios-list-row w-full gap-3"
            >
              <Trash2 className="h-5 w-5" style={{ color: "rgba(235,235,245,0.55)" }} />
              <span className="text-[15px]" style={{ color: "#fff" }}>
                {done === "history" ? "✓ Geschiedenis gewist" : "Gespreksgeschiedenis wissen"}
              </span>
            </button>
          </div>
        </div>

        {/* Delete account */}
        <div>
          <p className="text-[13px] font-medium uppercase tracking-wider mb-1.5 px-1" style={{ color: "rgba(235,235,245,0.55)" }}>
            ACCOUNT
          </p>
          <div className="ios-list">
            <div className="ios-list-row flex-col items-start gap-2 py-4">
              <p className="text-[15px] font-semibold" style={{ color: "#FF453A" }}>Account verwijderen</p>
              <p className="text-[13px] leading-5" style={{ color: "rgba(235,235,245,0.45)" }}>
                Verwijdert je account en alle data definitief. Kan niet ongedaan worden.
              </p>
              <button
                className="mt-1 rounded-xl px-4 py-2 text-[14px] font-medium"
                style={{ background: "rgba(255,69,58,0.15)", color: "#FF453A" }}
              >
                Verwijder account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}