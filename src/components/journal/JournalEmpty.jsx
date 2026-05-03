import { useNavigate } from "react-router-dom";

/**
 * Mobiele empty state — geen illustratie, geen marketingcopy.
 * Eén korte regel + 1 primary action.
 */
export default function JournalEmpty() {
  const navigate = useNavigate();
  return (
    <div className="card flex flex-col items-center text-center px-5 py-8 gap-4">
      <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
        Nog geen notities.
      </p>
      <button
        onClick={() => navigate("/journal/new")}
        className="rounded-xl px-5 py-3 text-[14px] font-semibold text-white btn-press"
        style={{ background: "#C25A32" }}
      >
        Eerste notitie schrijven
      </button>
    </div>
  );
}