import { useEffect } from "react";
import { X, Search, Pin, Archive, FolderInput, Hash, Rows3, CalendarRange } from "lucide-react";
import { useChatSettings } from "@/hooks/useChatSettings";

const OPTIONS = [
  { key: "showSearch",    icon: Search,        label: "Zoekbalk",                sub: "Doorzoek je gesprekken" },
  { key: "showPin",       icon: Pin,           label: "Vastpinnen",              sub: "Belangrijke gesprekken bovenaan" },
  { key: "showArchive",   icon: Archive,       label: "Archiveren",              sub: "Gesprekken wegbergen zonder verwijderen" },
  { key: "showQuickMove", icon: FolderInput,   label: "Snelle map-knop",         sub: "Verplaatsknop bij elk gesprek" },
  { key: "showCounts",    icon: Hash,          label: "Aantal gesprekken tonen", sub: "Per map een teller" },
  { key: "showDateGroups",icon: CalendarRange, label: "Groeperen op datum",      sub: "Vandaag · Gisteren · Deze week" },
  { key: "compactList",   icon: Rows3,         label: "Compacte lijst",          sub: "Meer gesprekken zichtbaar" },
];

export default function ChatSettingsSheet({ onClose }) {
  const { settings, setSetting } = useChatSettings();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
          maxHeight: "85vh",
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full" style={{ background: "var(--text-4)" }} />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <p className="text-[16px] font-bold" style={{ color: "var(--text)" }}>Chat-overzicht</p>
          <button onClick={onClose} className="btn-press">
            <X className="h-5 w-5" style={{ color: "var(--text-3)" }} />
          </button>
        </div>

        <p className="text-[13px] px-5 pb-3" style={{ color: "var(--text-3)" }}>
          Zet enkel aan wat je echt gebruikt. Default = clean.
        </p>

        <div className="overflow-y-auto px-3" style={{ maxHeight: "60vh" }}>
          {OPTIONS.map(({ key, icon: Icon, label, sub }) => (
            <button
              key={key}
              onClick={() => setSetting(key, !settings[key])}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl btn-press hover:bg-white/5"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: settings[key] ? "rgba(194,90,50,0.18)" : "rgba(255,255,255,0.05)" }}
              >
                <Icon className="h-4 w-4" style={{ color: settings[key] ? "#C25A32" : "var(--text-3)" }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14.5px] font-medium" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>{sub}</p>
              </div>
              <div
                className="h-6 w-10 rounded-full p-0.5 transition-colors shrink-0"
                style={{ background: settings[key] ? "#C25A32" : "rgba(255,255,255,0.10)" }}
              >
                <div
                  className="h-5 w-5 rounded-full bg-white transition-transform"
                  style={{ transform: settings[key] ? "translateX(16px)" : "translateX(0)" }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}