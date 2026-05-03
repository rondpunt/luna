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
    <div className="card px-4 py-4 flex items-center gap-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "rgba(194,90,50,0.15)" }}
      >
        <MessageCircle className="h-5 w-5" style={{ color: "#C25A32" }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Praat met Luna</p>
        <button
          onClick={() => go("/journal/new")}
          className="text-[13px] mt-0.5 btn-press"
          style={{ color: "var(--text-2)" }}
        >
          of schrijf van je af →
        </button>
      </div>
      <button
        onClick={() => go("/chat")}
        className="rounded-xl px-4 py-2.5 text-[14px] font-semibold text-white btn-press shrink-0"
        style={{ background: "#C25A32" }}
      >
        Beginnen
      </button>
    </div>
  );
}