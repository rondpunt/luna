import { useNavigate } from "react-router-dom";

/**
 * Rustige first-use empty state.
 * Geen illustraties, geen marketing, 1 actie.
 */
export default function HomeEmpty() {
  const navigate = useNavigate();
  return (
    <div className="card px-5 py-7 text-center space-y-3">
      <p className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
        Nog geen activiteit
      </p>
      <p className="text-[13px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
        Hier verschijnen straks je gesprekken en notities, plus wat vandaag relevant is.
      </p>
      <button
        onClick={() => navigate("/chat")}
        className="rounded-xl px-4 py-2.5 text-[14px] font-semibold text-white btn-press"
        style={{ background: "#C25A32" }}
      >
        Praat met Luna
      </button>
    </div>
  );
}