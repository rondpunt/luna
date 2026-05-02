import { Link } from "react-router-dom";
import { Gem } from "lucide-react";
import { t } from "@/lib/i18n";

export default function PaywallHook({ onSkip }) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "linear-gradient(135deg, #fbe4d6 0%, #f6d0bb 100%)",
        border: "1px solid rgba(194,90,50,0.25)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[18px] font-semibold leading-tight text-[#3d1f12]">
            {t.paywallHook.eyebrow}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#7a3a20]">
            {t.paywallHook.title}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#9c6a52]">
            {t.paywallHook.body}
          </p>
        </div>
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          <Gem className="h-9 w-9" style={{ color: "#c25a32" }} />
        </div>
      </div>

      <Link
        to="/pricing"
        className="mt-4 block w-full rounded-2xl py-3 text-center text-sm font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #ee9670 0%, #c25a32 100%)",
          boxShadow: "0 6px 20px rgba(194,90,50,0.30)",
        }}
      >
        {t.paywallHook.cta}
      </Link>
      {onSkip && (
        <button
          onClick={onSkip}
          className="mt-2 block w-full text-center text-xs font-medium text-[#9c6a52]"
        >
          {t.paywallHook.skip}
        </button>
      )}
    </div>
  );
}