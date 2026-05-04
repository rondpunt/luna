import { Phone } from "lucide-react";

const LINES = [
  { number: "0800 32 123", name: "Zelfmoordlijn 1813", meta: "Gratis · 24/7", tel: "tel:080032123" },
  { number: "106",         name: "Tele-Onthaal",       meta: "Gratis · anoniem", tel: "tel:106" },
];

export default function CrisisSheet({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] fade-up"
        style={{
          background: "#14141E",
          borderRadius: "28px 28px 0 0",
          padding: "24px 24px 40px",
          maxWidth: 480,
          margin: "0 auto",
          paddingBottom: "calc(40px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-6">
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        <h2
          className="font-display mb-2"
          style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.02em" }}
        >
          Even ademhalen.
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 24 }}>
          Je staat er niet alleen voor. Bel iemand die nu kan luisteren.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {LINES.map((l) => (
            <a
              key={l.number}
              href={l.tel}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 20px",
                background: "var(--crisis-soft)",
                border: "1px solid var(--crisis-border)",
                borderRadius: 20,
                textDecoration: "none",
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  className="font-display"
                  style={{ fontSize: 24, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}
                >
                  {l.number}
                </p>
                <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                  {l.name}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: 4 }}>· {l.meta}</span>
                </p>
              </div>
              <Phone size={22} style={{ color: "#D14D4D", flexShrink: 0 }} />
            </a>
          ))}
        </div>

        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
          Of ga naar de spoeddienst van het dichtstbijzijnde ziekenhuis. Bel 112 als er onmiddellijk gevaar is.
        </p>

        <button
          onClick={onClose}
          className="btn btn-ghost"
          style={{ fontSize: 15 }}
        >
          Sluiten
        </button>
      </div>
    </>
  );
}
