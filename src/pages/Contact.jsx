import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <header className="flex items-center gap-3 px-6 py-4">
        <Link to="/profiel">
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-primary-luna)" }} />
        </Link>
        <span className="font-semibold" style={{ color: "var(--text-primary-luna)" }}>
          Contact
        </span>
      </header>

      <main className="px-6 pb-12 max-w-lg mx-auto">
        <div className="rounded-2xl p-6 mt-4" style={{ background: "var(--bg-elev)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5" style={{ color: "var(--luna-accent)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary-luna)" }}>
              Neem contact op
            </h2>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary-luna)" }}>
            Vragen, feedback of iets anders? Stuur ons een mailtje.
          </p>
          <a
            href="mailto:hello@luna.app"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.97]"
            style={{
              background: "var(--luna-accent)",
              color: "#fff",
            }}
          >
            <Mail className="w-4 h-4" />
            hello@luna.app
          </a>
        </div>
      </main>
    </div>
  );
}