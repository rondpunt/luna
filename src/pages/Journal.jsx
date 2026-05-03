import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Pencil } from "lucide-react";
import JournalRow from "@/components/journal/JournalRow";
import JournalEmpty from "@/components/journal/JournalEmpty";

/**
 * Journal lijst-screen.
 * - AppShell levert topbar + bottom-nav (hergebruikt).
 * - Eigen pagina-titel "Dagboek" volgt patroon van Home/Profile.
 * - Primaire actiekaart = RN-Paper Card-pattern: titel, sub, één primary button.
 * - Recente notities = bestaand list-group/list-row (max 5).
 */
export default function Journal() {
  const navigate = useNavigate();
  const tappedRef = useRef(false);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 50),
  });

  const myEntries = entries.filter((e) => e.userId === user?.id).slice(0, 5);

  const openWriter = () => {
    if (tappedRef.current) return;
    tappedRef.current = true;
    navigate("/journal/new");
    setTimeout(() => { tappedRef.current = false; }, 600);
  };

  return (
    <div className="px-4 pt-6 pb-6 space-y-6">

      {/* Page title — zelfde patroon als Home/Profile */}
      <div className="px-1 pt-1">
        <h1 className="text-[26px] font-bold leading-[1.15]" style={{ color: "var(--text)", letterSpacing: "-0.4px" }}>
          Dagboek
        </h1>
      </div>

      {/* Primary action card */}
      <div
        className="px-5 py-5 flex items-center gap-4"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          borderRadius: 20,
          boxShadow: "0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(194,90,50,0.14)" }}
        >
          <Pencil className="h-[22px] w-[22px]" style={{ color: "#C25A32" }} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold leading-tight" style={{ color: "var(--text)", letterSpacing: "-0.2px" }}>Nieuwe notitie</p>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-2)" }}>Even iets neerschrijven</p>
        </div>
        <button
          onClick={openWriter}
          className="rounded-xl px-4 h-10 text-[14px] font-semibold text-white btn-press shrink-0"
          style={{ background: "#C25A32" }}
        >
          Schrijven
        </button>
      </div>

      {/* Recente notities */}
      <section>
        <h2 className="text-[15px] font-semibold mb-3 px-1" style={{ color: "var(--text)" }}>
          Recente notities
        </h2>

        {isLoading ? (
          <div className="list-group">
            {[1, 2, 3].map((i) => (
              <div key={i} className="list-row gap-0">
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-3 w-1/2 rounded shimmer" />
                  <div className="h-2.5 w-1/3 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : myEntries.length === 0 ? (
          <JournalEmpty />
        ) : (
          <div className="list-group">
            {myEntries.map((entry) => (
              <JournalRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}