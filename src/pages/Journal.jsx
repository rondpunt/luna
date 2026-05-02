import { t } from "@/lib/i18n";

export default function Journal() {
  return (
    <div className="px-5 pt-6">
      <p className="text-sm text-muted-foreground">{t.journal.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold text-[#1a3326]">{t.journal.title}</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {t.journal.templates.slice(0, 4).map((template) => (
          <button
            key={template}
            className="rounded-full bg-white px-4 py-2 text-sm text-[#1a3326]"
            style={{ border: "1px solid rgba(63,138,85,0.18)" }}
          >
            {template}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <input
          placeholder={t.journal.titlePlaceholder}
          className="w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none"
          style={{ border: "1px solid rgba(63,138,85,0.18)" }}
        />
        <textarea
          placeholder={t.journal.bodyPlaceholder}
          rows={10}
          className="w-full rounded-2xl bg-white px-4 py-4 text-sm leading-6 outline-none"
          style={{ border: "1px solid rgba(63,138,85,0.18)" }}
        />
      </div>

      <button
        className="mt-6 w-full rounded-full py-3.5 text-sm font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #5cb47a 0%, #3f8a55 100%)",
          boxShadow: "0 6px 20px rgba(63,138,85,0.25)",
        }}
      >
        {t.journal.save}
      </button>
    </div>
  );
}