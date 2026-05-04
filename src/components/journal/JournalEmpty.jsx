import { useNavigate } from "react-router-dom";

/**
 * Mobiele empty state — sub-aanwezig, één rustige actie.
 */
export default function JournalEmpty() {
  const navigate = useNavigate();
  return (
    <div className="card flex flex-col items-center text-center px-5 py-7 gap-4">
      <p className="text-[14.5px] font-semibold leading-tight" style={{ color: "var(--text)" }}>
        Nog geen notities
      </p>
      <p className="text-[13px] -mt-2 leading-[1.55]" style={{ color: "var(--text-2)" }}>
        Schrijf wat speelt. Niemand leest mee.
      </p>
      <button
        onClick={() => navigate("/journal/new")}
        className="btn btn-primary"
      >
        Eerste notitie schrijven
      </button>
    </div>
  );
}