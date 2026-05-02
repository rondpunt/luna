import { t } from "@/lib/i18n";

export default function Contact() {
  return (
    <div className="px-5 pt-6">
      <p className="text-sm text-muted-foreground">{t.contact.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold text-[#3d1f12]">{t.contact.title}</h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{t.contact.body}</p>
      <a
        href="mailto:hello@nora.app"
        className="mt-6 inline-block rounded-full px-5 py-3 text-sm font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #ee9670 0%, #c25a32 100%)",
          boxShadow: "0 6px 20px rgba(194,90,50,0.30)",
        }}
      >
        {t.contact.button}
      </a>
    </div>
  );
}