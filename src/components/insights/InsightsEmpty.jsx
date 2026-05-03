import { useNavigate } from "react-router-dom";

/**
 * Rustige empty-state voor wanneer er nog geen data is om iets zinnigs te zeggen.
 * Eén actie, geen marketingcopy, geen illustraties.
 */
export default function InsightsEmpty() {
  const navigate = useNavigate();
  return (
    <div className="card px-5 py-7 text-center space-y-3">
      <p className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
        Nog niets om te tonen
      </p>
      <p className="text-[13px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
        Hier verschijnt straks hoe het recent gaat, welke thema's terugkomen en kleine veranderingen die Luna opmerkt.
      </p>
      <button
        onClick={() => navigate("/journal/new")}
        className="rounded-xl px-4 py-2.5 text-[14px] font-semibold text-white btn-press"
        style={{ background: "#C25A32" }}
      >
        Schrijf een notitie
      </button>
    </div>
  );
}