import SectionCard from "@/components/nora/SectionCard";
import { t } from "@/lib/i18n";

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">{t.contact.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{t.contact.title}</h1>
      <SectionCard className="mt-6">
        <p className="text-sm leading-6 text-muted-foreground">{t.contact.body}</p>
        <a href="mailto:hello@nora.app" className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
          {t.contact.button}
        </a>
      </SectionCard>
    </div>
  );
}