import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";

/**
 * Eén duidelijke hoofdactie boven de vouw.
 * Zelfde card-pattern als Journal "Nieuwe notitie".
 * 1 primary button + 1 secundaire tekstactie.
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
        <MessageCircle className="h-[22px] w-[22px]" style={{ color: "#C25A32" }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[16px] font-semibold leading-tight"
          style={{ color: "var(--text)", letterSpacing: "-0.2px" }}
        >
          Praat met Luna
        </p>
        <button
          onClick={() => go("/journal/new")}
          className="text-[13px] mt-1 btn-press"
          style={{ color: "var(--text-2)" }}
        >
          of schrijf van je af →
        </button>
      </div>
      <button
        onClick={() => go("/chat")}
        className="rounded-xl px-4 h-10 text-[14px] font-semibold text-white btn-press shrink-0"
        style={{ background: "#C25A32" }}
      >
        Beginnen
      </button>
    </div>
  );
}