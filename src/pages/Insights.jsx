import SectionCard from "@/components/nora/SectionCard";
import InsightChartCard from "@/components/nora/InsightChartCard";

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
        <p className="text-sm text-muted-foreground">Insights</p>
        <h1 className="text-3xl font-semibold tracking-tight">Patterns, not pressure.</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InsightChartCard data={trend} />
        <SectionCard className="bg-primary/5">
          <p className="text-sm font-medium text-foreground">Weekly summary</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">You seem more grounded on days when you check in early and write a few lines instead of keeping everything in your head.</p>
        </SectionCard>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {[
          ["Common themes", "Work pressure, sleep friction, relationship uncertainty"],
          ["Triggers", "Unread messages, late-night overthinking, conflict avoidance"],
          ["Helpful tools", "Breathing reset, reframing, short voice sessions"],
        ].map(([title, body]) => (
          <SectionCard key={title}>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}