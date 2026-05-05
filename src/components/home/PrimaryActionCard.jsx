import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { ArrowRight, PenLine } from "lucide-react";

/**
 * Primaire dagelijkse actie — premium hero-card.
 * Subtielere orb, meer white space, duidelijkere hiërarchie.
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
    <div className="card-hero px-5 py-5 overflow-hidden">
      {/* Subtiele top-accent lijn */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(194,90,50,0.6) 40%, rgba(194,90,50,0.3) 70%, transparent)",
        }}
      />

      {/* Content */}
      <div className="flex items-start gap-4">
        {/* Orb — kleiner, rechts uitgelijnd */}
        <div
          className="orb-breathe shrink-0 mt-0.5"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
            boxShadow: "0 0 14px 4px rgba(194,90,50,0.14)",
          }}
        />
        <div className="flex-1 min-w-0">
          <p
            className="text-[18px] font-bold leading-[1.25]"
            style={{ color: "var(--text)", letterSpacing: "-0.3px" }}
          >
            Wat speelt er nu?
          </p>
          <p className="text-[13px] mt-1 leading-[1.5]" style={{ color: "var(--text-2)" }}>
            Geen oordeel, geen haast.
          </p>
        </div>
      </div>

      {/* Acties */}
      <div className="flex items-center gap-2.5 mt-4">
        <button
          onClick={() => go("/chat")}
          className="btn btn-primary flex-1 text-[14px]"
        >
          Praat met Luna
          <ArrowRight className="h-[14px] w-[14px]" strokeWidth={2.4} />
        </button>
        <button
          onClick={() => go("/diary")}
          className="btn btn-secondary h-[44px] px-4"
          title="Schrijven"
        >
          <PenLine className="h-[16px] w-[16px]" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
