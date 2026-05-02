import SectionCard from "@/components/nora/SectionCard";
import { t } from "@/lib/i18n";

export default function Voice() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">{t.voice.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t.voice.title}</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard className="flex min-h-[420px] flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(117,213,184,0.16),transparent_55%),linear-gradient(180deg,rgba(110,126,247,0.08),transparent)] text-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary text-4xl text-primary-foreground shadow-[0_20px_60px_rgba(110,126,247,0.35)]">●</div>
          <h2 className="mt-6 text-2xl font-semibold">{t.voice.eyebrow}</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{t.voice.body}</p>
          <div className="mt-6 flex gap-3">
            <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">{t.voice.start}</button>
            <button className="rounded-2xl border border-border bg-background px-5 py-3 text-sm text-foreground">{t.voice.mute}</button>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-sm font-medium text-foreground">{t.voice.transcript}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">{t.voice.pause}</button>
            <button className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">{t.voice.stopSave}</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}