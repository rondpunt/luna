import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    q: "Vervangt Luna een psycholoog?",
    a: "Nee. Luna is een gezel die luistert. Geen therapeut, geen arts. Voor diagnose, medicatie of intensieve begeleiding: ga naar een psycholoog of huisarts. Luna is een aanvulling, geen vervanging.",
  },
  {
    q: "Wat gebeurt er met mijn gesprekken?",
    a: "Ze worden versleuteld bewaard op EU-servers. Alleen jij ziet ze terug. Je kunt ze op elk moment exporteren of wissen via Profiel. Wij gebruiken jouw gesprekken niet om AI-modellen te trainen.",
  },
  {
    q: "Kan ik op elk moment opzeggen?",
    a: "Ja. Eén tap in Profiel → Abonnement. Je houdt toegang tot het einde van de betaalde periode. Geen vervelende formulieren.",
  },
  {
    q: "Is mijn data veilig?",
    a: "Ja. EU-servers, encryptie in rust en in transit, GDPR-conform. Anoniem gebruik kan zonder e-mail.",
  },
  {
    q: "Wat als ik in nood ben?",
    a: "Luna is geen crisisdienst. Bij signalen van acute nood toont Luna in het gesprek een steunkaartje met Zelfmoordlijn 1813 (24/7, gratis) en 112. Bel die direct als je in gevaar bent.",
  },
  {
    q: "Hoe werkt de terugbetaling?",
    a: "Niet tevreden binnen 14 dagen? Mail hello@luna.app — we storten zonder vragen terug.",
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4">
        <Link to="/">
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-primary-luna)" }} />
        </Link>
        <span
          className="font-semibold"
          style={{ color: "var(--text-primary-luna)", letterSpacing: "-0.02em" }}
        >
          luna
        </span>
      </header>

      <main className="px-6 pb-12 max-w-lg mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ color: "var(--text-primary-luna)" }}
          >
            Kies hoe je met Luna verder gaat
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary-luna)" }}>
            Begin gratis. Upgrade als het past.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div
            className="flex rounded-xl p-1"
            style={{ background: "var(--bg-elev)" }}
          >
            <button
              onClick={() => setIsYearly(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: !isYearly ? "var(--luna-accent)" : "transparent",
                color: !isYearly ? "#fff" : "var(--text-muted-luna)",
              }}
            >
              Maandelijks
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isYearly ? "var(--luna-accent)" : "transparent",
                color: isYearly ? "#fff" : "var(--text-muted-luna)",
              }}
            >
              Jaarlijks – bespaar 34%
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-8">
          {/* Free */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--bg-elev)",
              border: "1px solid var(--luna-border)",
            }}
          >
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary-luna)" }}>
              Gratis
            </h3>
            <p className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary-luna)" }}>
              €0
            </p>
            <p className="text-xs mb-5" style={{ color: "var(--text-muted-luna)" }}>voor altijd</p>

            <div className="space-y-3">
              {["10 berichten per dag", "Dagelijkse check-in", "7 dagen voortgang", "Steun in crisis-momenten"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" style={{ color: "var(--luna-success)" }} />
                  <span className="text-sm" style={{ color: "var(--text-secondary-luna)" }}>{f}</span>
                </div>
              ))}
            </div>

            <Link
              to="/chat"
              className="block text-center w-full py-3 mt-6 rounded-xl font-medium text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--text-primary-luna)",
              }}
            >
              Begin gratis
            </Link>
          </div>

          {/* Pro */}
          <div
            className="rounded-2xl p-6 relative"
            style={{
              background: "var(--bg-elev)",
              border: "1px solid var(--luna-accent)",
            }}
          >
            <div
              className="absolute -top-3 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "var(--luna-accent)", color: "#fff" }}
            >
              <Star className="w-3 h-3" /> Aanbevolen
            </div>

            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary-luna)" }}>
              Personal Pro
            </h3>
            <p className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary-luna)" }}>
              {isYearly ? "€79/jaar" : "€9,99/maand"}
            </p>
            <p className="text-xs mb-5" style={{ color: "var(--text-muted-luna)" }}>
              14 dagen terugbetaling
            </p>

            <div className="space-y-3">
              {[
                "Onbeperkt berichten",
                "Volledige geschiedenis",
                "Topic-vault: vind oude gesprekken",
                "Volledige voortgang & trends",
                "Prioriteit op nieuwe functies",
                "Steun in crisis-momenten",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" style={{ color: "var(--luna-success)" }} />
                  <span className="text-sm" style={{ color: "var(--text-secondary-luna)" }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              className="w-full py-3 mt-6 rounded-xl font-medium text-sm text-white transition-all active:scale-[0.97]"
              style={{
                background: "var(--luna-accent)",
                boxShadow: "0 4px 24px rgba(123,92,255,0.4)",
              }}
            >
              Upgrade naar Pro
            </button>
          </div>
        </div>

        {/* Trust strip */}
        <p
          className="text-xs text-center mb-10"
          style={{ color: "var(--text-muted-luna)", letterSpacing: "0.03em" }}
        >
          🇪🇺 EU-servers · 🔒 Versleuteld · 🇧🇪 Belgisch · Anoniem mogelijk
        </p>

        {/* FAQ */}
        <div className="mb-10">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary-luna)" }}
          >
            Veelgestelde vragen
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border-0 overflow-hidden"
                style={{ background: "var(--bg-elev)" }}
              >
                <AccordionTrigger
                  className="px-4 py-3 text-sm font-medium hover:no-underline"
                  style={{ color: "var(--text-primary-luna)" }}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary-luna)" }}>
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pb-6">
          <Link
            to="/chat"
            className="text-sm"
            style={{ color: "var(--luna-accent)" }}
          >
            Niet zeker? Probeer Luna eerst gratis.
          </Link>
          <p className="text-xs" style={{ color: "var(--text-muted-luna)" }}>
            Vragen?{" "}
            <a href="mailto:hello@luna.app" style={{ color: "var(--luna-accent)" }}>
              hello@luna.app
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}