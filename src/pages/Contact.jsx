import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import GlassCard from "../components/luna/GlassCard";

export default function Contact() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at 80% -10%, rgba(180,120,20,0.12), transparent 50%), radial-gradient(ellipse at 50% -5%, rgba(79,70,229,0.10), transparent 45%), #080d1e",
      }}
    >
      <header className="flex items-center gap-3 px-5 py-4">
        <Link to="/profiel">
          <ArrowLeft className="w-5 h-5" style={{ color: "rgba(255,255,255,0.55)" }} />
        </Link>
        <span
          className="font-semibold text-sm"
          style={{ color: "rgba(255,255,255,0.88)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Contact
        </span>
      </header>

      <main className="px-5 pb-12 max-w-lg mx-auto">
        <GlassCard className="p-5 mt-2">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5" style={{ color: "#818cf8" }} />
            <h2
              className="text-lg"
              style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}
            >
              Neem contact op
            </h2>
          </div>
          <p
            className="text-sm mb-5"
            style={{ color: "rgba(255,255,255,0.50)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Vragen, feedback of iets anders? Stuur ons een mail.
          </p>
          <a
            href="mailto:hello@luna.app"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm text-white transition-all active:scale-[0.97]"
            style={{
              background: "#6366f1",
              boxShadow: "0 0 16px rgba(99,102,241,0.35)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Mail className="w-4 h-4" />
            hello@luna.app
          </a>
        </GlassCard>
      </main>
    </div>
  );
}