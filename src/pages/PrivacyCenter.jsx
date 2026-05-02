import { t } from "@/lib/i18n";

export default function PrivacyCenter() {
  return (
    <div className="px-5 pt-6">
      <p className="text-sm text-muted-foreground">{t.privacyCenter.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold text-[#3d1f12]">{t.privacyCenter.title}</h1>

      <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-[#9c6a52]">
        {t.privacyCenter.memoryTitle}
      </p>
      <div
        className="mt-3 overflow-hidden rounded-2xl bg-white"
        style={{ border: "1px solid rgba(194,90,50,0.12)" }}
      >
        {t.privacyCenter.memoryItems.map((item, i) => (
          <button
            key={item}
            className={`flex w-full items-center px-4 py-3.5 text-left text-sm text-[#3d1f12] ${i > 0 ? "border-t border-[rgba(194,90,50,0.08)]" : ""}`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        className="mt-6 w-full rounded-full bg-white py-3 text-sm font-medium text-[#3d1f12]"
        style={{ border: "1px solid rgba(194,90,50,0.20)" }}
      >
        {t.privacyCenter.exportCta}
      </button>
      <button className="mt-3 w-full rounded-full bg-[rgba(218,77,77,0.08)] py-3 text-sm font-medium text-[#a23a3a]">
        {t.privacyCenter.deleteCta}
      </button>
    </div>
  );
}