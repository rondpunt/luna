import { Link } from "react-router-dom";
import { ChevronLeft, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen px-4 py-6 space-y-6" style={{ background: "#000", paddingTop: "env(safe-area-inset-top, 44px)" }}>
      <div className="flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-1" style={{ color: "#FF6B3D" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[17px] font-medium">Profiel</span>
        </Link>
      </div>

      <h1 className="text-[34px] font-bold text-white">Contact</h1>

      <div className="rounded-2xl p-6" style={{ background: "#1C1C1E" }}>
        <div
          className="flex h-16 w-16 items-center justify-center rounded-[18px] mb-5"
          style={{ background: "rgba(255,107,61,0.20)" }}
        >
          <Mail className="h-8 w-8" style={{ color: "#FF6B3D" }} strokeWidth={1.8} />
        </div>
        <p className="text-[20px] font-semibold text-white mb-2">Vragen of feedback?</p>
        <p className="text-[17px] leading-[1.5] mb-6" style={{ color: "rgba(235,235,245,0.55)" }}>
          Mail het Nora-team via <span className="text-white font-medium">hello@nora.app</span> — we lezen alles en antwoorden binnen 48u.
        </p>
        <a
          href="mailto:hello@nora.app"
          className="block w-full rounded-[14px] py-4 text-center text-[17px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #FF8C60, #FF6B3D)" }}
        >
          Stuur een mail
        </a>
      </div>
    </div>
  );
}