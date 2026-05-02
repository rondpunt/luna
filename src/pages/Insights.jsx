import SectionCard from "@/components/nora/SectionCard";
import InsightChartCard from "@/components/nora/InsightChartCard";
import { t } from "@/lib/i18n";

const trend = [
  { day: "W1", value: 4 },
  { day: "W2", value: 6 },
  { day: "W3", value: 5 },
  { day: "W4", value: 7 },
];

export default function Insights() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">{t.insights.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t.insights.title}</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InsightChartCard data={trend} />
        <SectionCard className="bg-primary/5">
          <p className="text-sm font-medium text-foreground">{t.insights.weekly}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.insights.weeklyBody}</p>
        </SectionCard>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {t.insights.cards.map(([title, body]) => (
          <SectionCard key={title}>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}