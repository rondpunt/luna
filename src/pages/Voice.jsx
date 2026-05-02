import SectionCard from "@/components/nora/SectionCard";

export default function Voice() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">Voice</p>
        <h1 className="text-3xl font-semibold tracking-tight">Talk things through in a calm private space.</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard className="flex min-h-[420px] flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(117,213,184,0.16),transparent_55%),linear-gradient(180deg,rgba(110,126,247,0.08),transparent)] text-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary text-4xl text-primary-foreground shadow-[0_20px_60px_rgba(110,126,247,0.35)]">●</div>
          <h2 className="mt-6 text-2xl font-semibold">Voice mode</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Browser-based speech-to-text and text-to-speech architecture, ready to evolve into live voice later.</p>
          <div className="mt-6 flex gap-3">
            <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Start listening</button>
            <button className="rounded-2xl border border-border bg-background px-5 py-3 text-sm text-foreground">Mute</button>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-sm font-medium text-foreground">Live transcript</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <div className="rounded-2xl bg-secondary p-4">You: I’ve been carrying a lot all week and I can’t switch off.</div>
            <div className="rounded-2xl bg-primary/10 p-4 text-foreground">Nora: Your body sounds like it never got the memo that the day ended. Want to settle the pressure first or name what’s driving it?</div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">Pause</button>
            <button className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">Stop & save</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}