import { Link } from "react-router-dom";
import { ChevronLeft, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="px-5 pt-6 pb-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#1c1c1e" }}>
          <ChevronLeft className="h-5 w-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Contact</h1>
      </div>

      <div className="rounded-2xl p-6 text-center space-y-4" style={{ background: "#1c1c1e" }}>
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl" style={{ background: "rgba(194,90,50,0.20)" }}>
          <Mail className="h-7 w-7 text-[#c25a32]" />
        </div>
        <p className="text-base font-semibold text-white">Vragen of feedback?</p>
        <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
          Mail het Nora-team via <strong className="text-white">hello@nora.app</strong> — we lezen alles en antwoorden binnen 48u.
        </p>
        <a
          href="mailto:hello@nora.app"
          className="inline-block rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all"
          style={{ background: "#c25a32" }}
        >
          Stuur een mail
        </a>
      </div>
    </div>
  );
}