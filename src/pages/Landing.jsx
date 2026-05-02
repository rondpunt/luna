import { Link } from "react-router-dom";
import NoraLogo from "@/components/nora/NoraLogo";
import SectionCard from "@/components/nora/SectionCard";
import UrgentHelpBanner from "@/components/nora/UrgentHelpBanner";
import { t } from "@/lib/i18n";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NoraLogo />
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">{t.appName}</p>
              <p className="text-sm text-muted-foreground">{t.subTagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UrgentHelpBanner />
            <Link to="/pricing" className="rounded-full border border-border px-4 py-2 text-sm">{t.pricing.eyebrow}</Link>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm text-primary">{t.subTagline}</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight">{t.tagline}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Babbel, stem, dagboek, check-ins, geheugen en persoonlijke inzichten — gemaakt om je gehoord, rustiger en meer in controle te laten voelen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/onboarding" className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">{t.cta.startFree}</Link>
              <Link to="/pricing" className="rounded-2xl border border-border px-5 py-3 text-sm font-medium">{t.cta.seePlans}</Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Nora is therapie-geïnspireerde steun, geen medische zorg, diagnose of noodhulp.</p>
          </div>

          <SectionCard className="bg-[linear-gradient(180deg,rgba(110,126,247,0.12),rgba(117,213,184,0.08))]">
            <div className="space-y-4">
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Babbelen voor directe steun</div>
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Stemmodus die rustig en privé aanvoelt</div>
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Geheugen dat enkel onthoudt wat jij wil</div>
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Dagelijkse check-ins, dagboek en stemmingstrends</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}