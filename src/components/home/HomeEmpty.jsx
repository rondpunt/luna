/**
 * Empty state op Home — verschijnt naast PrimaryActionCard
 * als er nog geen activiteit is. Sub-aanwezig, niet luid.
 */
export default function HomeEmpty() {
  return (
    <div className="card px-5 py-6">
      <p className="text-[14.5px] font-semibold leading-tight" style={{ color: "var(--text)" }}>
        Nog geen activiteit
      </p>
      <p className="text-[13px] mt-1.5 leading-[1.55]" style={{ color: "var(--text-2)" }}>
        Hier verschijnen straks je gesprekken en notities. Begin gewoon — er is geen druk.
      </p>
    </div>
  );
}