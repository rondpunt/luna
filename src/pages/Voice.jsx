import { Mic } from "lucide-react";
import { t } from "@/lib/i18n";

export default function Voice() {
  return (
    <div className="px-5 pt-6">
      <p className="text-sm text-muted-foreground">{t.voice.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-semibold text-[#3d1f12]">{t.voice.title}</h1>

      <div className="mt-12 flex flex-col items-center text-center">
        <button
          className="flex h-32 w-32 items-center justify-center rounded-full text-white"
          style={{
            background: "linear-gradient(135deg, #ee9670 0%, #c25a32 100%)",
            boxShadow: "0 12px 40px rgba(194,90,50,0.35)",
          }}
        >
          <Mic className="h-12 w-12" />
        </button>
        <p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">{t.voice.body}</p>

        <div className="mt-8 flex gap-3">
          <button
            className="rounded-full bg-white px-5 py-2.5 text-sm"
            style={{ border: "1px solid rgba(194,90,50,0.20)" }}
          >
            {t.voice.pause}
          </button>
          <button
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: "#c25a32" }}
          >
            {t.voice.stopSave}
          </button>
        </div>
      </div>
    </div>
  );
}