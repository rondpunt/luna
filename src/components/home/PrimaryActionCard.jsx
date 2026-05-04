import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Primaire dagelijkse actie — premium hero-card.
 * Eén dominante CTA + één rustige tekstlink.
 */
export default function PrimaryActionCard() {
  const navigate = useNavigate();
  const tappedRef = useRef(false);

  const go = (to) => {
    if (tappedRef.current) return;
    tappedRef.current = true;
    navigate(to);
    setTimeout(() => { tappedRef.current = false; }, 600);
  };

  return (
    <div className="card-hero px-5 py-6">
      {/* Orb mark */}
      <div
        className="h-10 w-10 rounded-full mb-4"
        style={{
          background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
          boxShadow: "0 0 14px 3px rgba(194,90,50,0.20)",
        }}
      />

      <p
        className="text-[20px] font-bold leading-[1.2]"
        style={{ color: "var(--text)", letterSpacing: "-0.3px" }}
      >
        Wat speelt er nu?
      </p>
      <p className="text-[13.5px] mt-1.5 leading-[1.5]" style={{ color: "var(--text-2)" }}>
        Vertel het Luna in je eigen woorden. Geen oordeel, geen haast.
      </p>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={() => go("/chat")}
          className="btn btn-primary flex-1"
        >
          Praat met Luna
          <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2.4} />
        </button>
        <button
          onClick={() => go("/journal/new")}
          className="btn btn-secondary"
        >
          Schrijven
        </button>
      </div>
    </div>
  );
}