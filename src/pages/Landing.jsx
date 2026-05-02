import { Link } from "react-router-dom";
import NoraLogo from "@/components/nora/NoraLogo";
import { t } from "@/lib/i18n";

export default function Landing() {
  return (
    <div className="min-h-screen px-5 py-8">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col">
        <div className="flex items-center justify-center gap-2 pt-6">
          <NoraLogo className="h-8 w-8" />
          <span className="text-base font-semibold text-[#1a3326]">Nora</span>
        </div>

        <div className="mt-16 flex-1 text-center">
          <h1 className="text-3xl font-semibold leading-tight text-[#1a3326]">{t.tagline}</h1>
          <p className="mt-4 text-sm leading-6 text-[#5b7a66]">{t.subTagline}</p>
        </div>

        <div className="space-y-3 pb-6">
          <Link
            to="/onboarding"
            className="block w-full rounded-full py-3.5 text-center text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #5cb47a 0%, #3f8a55 100%)",
              boxShadow: "0 6px 20px rgba(63,138,85,0.30)",
            }}
          >
            {t.cta.startFree}
          </Link>
          <Link
            to="/pricing"
            className="block w-full rounded-full bg-white py-3.5 text-center text-sm font-medium text-[#1a3326]"
            style={{ border: "1px solid rgba(63,138,85,0.20)" }}
          >
            {t.cta.seePlans}
          </Link>
          <p className="px-4 pt-2 text-center text-xs leading-5 text-muted-foreground">
            Nora is geen noodhulp en geen medische zorg. Bij direct gevaar bel 112 of de Zelfmoordlijn 1813.
          </p>
        </div>
      </div>
    </div>
  );
}