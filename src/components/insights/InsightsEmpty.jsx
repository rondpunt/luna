import { useNavigate } from "react-router-dom";

/**
 * Empty insights — sub-aanwezig, één heldere actie.
 */
export default function InsightsEmpty() {
  const navigate = useNavigate();
  return (
    <div className="card flex flex-col items-center text-center px-5 py-7 gap-4">
      <p className="text-[14.5px] font-semibold leading-tight" style={{ color: "var(--text)" }}>
        Nog niets om te tonen
      </p>
      <p className="text-[13px] -mt-2 leading-[1.55] max-w-xs" style={{ color: "var(--text-2)" }}>
        Hier verschijnt straks hoe het met je gaat en welke thema's terugkomen.
      </p>
      <button
        onClick={() => navigate("/diary")}
        className="btn btn-primary"
      >
        Schrijf een notitie
      </button>
    </div>
  );
}