import SectionCard from "@/components/nora/SectionCard";

const templates = ["Free write", "Gratitude", "Anxiety dump", "Relationship reflection", "Sleep reflection", "Wins today"];

export default function Journal() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">Journal</p>
        <h1 className="text-3xl font-semibold tracking-tight">A private place to write without performing.</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard>
          <p className="text-sm font-medium text-foreground">Today’s entry</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {templates.map((template) => (
              <button key={template} className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">{template}</button>
            ))}
          </div>
          <input placeholder="Entry title" className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" />
          <textarea placeholder="Write what’s true right now..." rows={10} className="mt-4 w-full rounded-[28px] border border-border bg-background px-4 py-4 text-sm outline-none" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input placeholder="Mood before" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" />
            <input placeholder="Mood after" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Save entry</button>
            <button className="rounded-2xl border border-border bg-background px-5 py-3 text-sm">Turn into chat</button>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-sm font-medium text-foreground">Reflection tools</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl bg-secondary p-4">AI reflection summary</div>
            <div className="rounded-2xl bg-secondary p-4">Most common theme this week</div>
            <div className="rounded-2xl bg-secondary p-4">Private and exportable anytime</div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}