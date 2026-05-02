import { Link } from "react-router-dom";
import SectionCard from "@/components/nora/SectionCard";
import InsightChartCard from "@/components/nora/InsightChartCard";
import UrgentHelpBanner from "@/components/nora/UrgentHelpBanner";
import { t } from "@/lib/i18n";

const trend = [
  { day: "Ma", value: 4 },
  { day: "Di", value: 5 },
  { day: "Wo", value: 6 },
  { day: "Do", value: 5 },
  { day: "Vr", value: 7 },
  { day: "Za", value: 6 },
  { day: "Zo", value: 7 },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t.home.welcome}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{t.home.moodPrompt}</h1>
        </div>
        <UrgentHelpBanner />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard className="bg-[linear-gradient(135deg,rgba(110,126,247,0.14),rgba(117,213,184,0.16))]">
          <p className="text-sm text-muted-foreground">{t.subTagline}</p>
          <h2 className="mt-2 text-2xl font-semibold">{t.tagline}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {t.home.moods.map((mood) => (
              <button key={mood} className="rounded-full border border-border bg-background px-4 py-2 text-sm capitalize text-foreground">
                {mood}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-sm font-medium text-foreground">{t.home.todayPath}</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <Link to="/chat" className="block rounded-2xl bg-secondary p-4">{t.home.resumeChat}</Link>
            <Link to="/voice" className="block rounded-2xl bg-secondary p-4">{t.home.startVoice}</Link>
            <Link to="/journal" className="block rounded-2xl bg-secondary p-4">{t.home.journal5}</Link>
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <SectionCard>
          <p className="text-sm text-muted-foreground">{t.home.streak}</p>
          <p className="mt-2 text-3xl font-semibold">{t.home.streakDays(8)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t.home.streakNote}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm text-muted-foreground">{t.home.suggestedTool}</p>
          <p className="mt-2 text-lg font-medium">{t.home.breathingReset}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t.home.breathingNote}</p>
        </SectionCard>
        <SectionCard className="bg-primary/5">
          <p className="text-sm text-muted-foreground">{t.home.unlockPlus}</p>
          <p className="mt-2 text-lg font-medium">{t.home.unlockPlusNote}</p>
          <Link to="/pricing" className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {t.cta.seePlans}
          </Link>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InsightChartCard data={trend} title={t.home.weeklyTrend} subtitle={t.home.weeklyTrendNote} />
        <SectionCard>
          <p className="text-sm font-medium text-foreground">{t.home.privacyTitle}</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {t.home.privacyBullets.map((b) => <li key={b}>• {b}</li>)}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}