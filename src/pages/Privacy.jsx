import { t } from "@/lib/i18n";

export default function Privacy() {
  return (
    <div className="px-5 pt-6">
      <p className="text-sm text-muted-foreground">{t.privacy.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold text-[#1a3326]">{t.privacy.title}</h1>
      <div className="mt-6 space-y-5">
        {t.privacy.blocks.map(([title, body]) => (
          <div key={title} className="border-t border-[rgba(63,138,85,0.10)] pt-4">
            <p className="text-sm font-semibold text-[#1a3326]">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}