import SectionCard from "@/components/nora/SectionCard";
import { t } from "@/lib/i18n";

export default function Voorwaarden() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">{t.voorwaarden.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{t.voorwaarden.title}</h1>
      <div className="mt-6 space-y-4">
        {t.voorwaarden.blocks.map(([title, body]) => (
          <SectionCard key={title}>
            <p className="text-lg font-medium text-foreground">{title}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}