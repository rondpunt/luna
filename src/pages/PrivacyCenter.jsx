import SectionCard from "@/components/nora/SectionCard";
import { t } from "@/lib/i18n";

export default function PrivacyCenter() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">{t.privacyCenter.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{t.privacyCenter.title}</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionCard>
          <p className="text-lg font-medium text-foreground">{t.privacyCenter.storedTitle}</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {t.privacyCenter.storedItems.map((s) => <li key={s}>• {s}</li>)}
          </ul>
        </SectionCard>
        <SectionCard>
          <p className="text-lg font-medium text-foreground">{t.privacyCenter.memoryTitle}</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            {t.privacyCenter.memoryItems.map((s) => (
              <div key={s} className="rounded-2xl bg-secondary px-4 py-4">{s}</div>
            ))}
          </div>
        </SectionCard>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SectionCard>
          <p className="text-lg font-medium text-foreground">{t.privacyCenter.exportTitle}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.privacyCenter.exportBody}</p>
          <button className="mt-4 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">{t.privacyCenter.exportCta}</button>
        </SectionCard>
        <SectionCard>
          <p className="text-lg font-medium text-foreground">{t.privacyCenter.deleteTitle}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.privacyCenter.deleteBody}</p>
          <button className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">{t.privacyCenter.deleteCta}</button>
        </SectionCard>
      </div>
    </div>
  );
}