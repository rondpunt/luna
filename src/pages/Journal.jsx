import SectionCard from "@/components/nora/SectionCard";
import { t } from "@/lib/i18n";

export default function Journal() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">{t.journal.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t.journal.title}</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard>
          <p className="text-sm font-medium text-foreground">{t.journal.today}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {t.journal.templates.map((template) => (
              <button key={template} className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">{template}</button>
            ))}
          </div>
          <input placeholder={t.journal.titlePlaceholder} className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" />
          <textarea placeholder={t.journal.bodyPlaceholder} rows={10} className="mt-4 w-full rounded-[28px] border border-border bg-background px-4 py-4 text-sm outline-none" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input placeholder={t.journal.moodBefore} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" />
            <input placeholder={t.journal.moodAfter} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">{t.journal.save}</button>
            <button className="rounded-2xl border border-border bg-background px-5 py-3 text-sm">{t.journal.toChat}</button>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-sm font-medium text-foreground">{t.journal.reflection}</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            {t.journal.reflectionItems.map((item) => (
              <div key={item} className="rounded-2xl bg-secondary p-4">{item}</div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}