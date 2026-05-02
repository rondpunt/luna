import { Link } from "react-router-dom";
import { ChevronLeft, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-1 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[30px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.5px" }}>Contact</h1>

      <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-[18px] mb-5"
          style={{ background: "rgba(194,90,50,0.15)" }}
        >
          <Mail className="h-7 w-7" style={{ color: "#C25A32" }} strokeWidth={1.7} />
        </div>
        <p className="text-[19px] font-bold mb-2" style={{ color: "var(--text)" }}>Vragen of feedback?</p>
        <p className="text-[16px] leading-[1.6] mb-6" style={{ color: "var(--text-2)" }}>
          Stuur een mail naar <span className="font-semibold" style={{ color: "var(--text)" }}>hello@luna.app</span> — we lezen alles en antwoorden binnen 48u.
        </p>
        <a
          href="mailto:hello@luna.app"
          className="block w-full rounded-2xl py-4 text-center text-[16px] font-semibold text-white btn-press accent-gradient"
        >
          Stuur een mail
        </a>
      </div>
    </div>
  );
}