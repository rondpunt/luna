import { Link } from "react-router-dom";
import { Gem } from "lucide-react";
import { t } from "@/lib/i18n";

// Paywall hook in Noah-stijl: lichte groene kaart, diamant-icoon, primaire CTA.
export default function PaywallHook({ onSkip }) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "linear-gradient(135deg, #e9f5ec 0%, #d6ecdb 100%)",
        border: "1px solid rgba(105,168,118,0.25)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[18px] font-semibold leading-tight text-[#1a3326]">
            {t.paywallHook.eyebrow}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#365a44]">
            {t.paywallHook.title}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#5b7a66]">
            {t.paywallHook.body}
          </p>
        </div>
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          <Gem className="h-9 w-9" style={{ color: "#3f8a55" }} />
        </div>
      </div>

      <Link
        to="/pricing"
        className="mt-4 block w-full rounded-2xl py-3 text-center text-sm font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #5cb47a 0%, #3f8a55 100%)",
          boxShadow: "0 6px 20px rgba(63,138,85,0.30)",
        }}
      >
        {t.paywallHook.cta}
      </Link>
      {onSkip && (
        <button
          onClick={onSkip}
          className="mt-2 block w-full text-center text-xs font-medium text-[#5b7a66]"
        >
          {t.paywallHook.skip}
        </button>
      )}
    </div>
  );
}