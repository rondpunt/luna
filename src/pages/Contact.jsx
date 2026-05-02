import { Link } from "react-router-dom";
import { ChevronLeft, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-dvh px-4 pt-0 pb-10" style={{ background: "#000" }}>
      <div
        className="sticky top-0 z-10 flex items-center gap-3 py-3 mb-6"
        style={{
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(84,84,88,0.65)",
        }}
      >
        <Link to="/profile" className="flex items-center gap-1 text-[17px] font-medium" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.5} />
          Profiel
        </Link>
        <span className="flex-1 text-center text-[17px] font-semibold" style={{ color: "#fff" }}>Contact</span>
        <div className="w-16" />
      </div>

      <div
        className="rounded-2xl p-6 text-center space-y-4"
        style={{ background: "#1C1C1E" }}
      >
        <div
          className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl"
          style={{ background: "rgba(194,90,50,0.22)" }}
        >
          <Mail className="h-7 w-7" style={{ color: "#C25A32" }} />
        </div>
        <p className="text-[20px] font-semibold" style={{ color: "#fff" }}>Vragen of feedback?</p>
        <p className="text-[15px] leading-6" style={{ color: "rgba(235,235,245,0.55)" }}>
          Mail via <strong style={{ color: "#fff" }}>hello@nora.app</strong> — we lezen alles en antwoorden binnen 48u.
        </p>
        <a
          href="mailto:hello@nora.app"
          className="inline-block rounded-2xl px-6 py-3 text-[15px] font-semibold text-white"
          style={{ background: "#C25A32" }}
        >
          Stuur een mail
        </a>
      </div>
    </div>
  );
}