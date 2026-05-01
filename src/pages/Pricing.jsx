import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [yearly, setYearly] = useState(true);

  return (
    <div className="min-h-screen py-8 px-6" style={{ backgroundColor: "var(--luna-bg-base)" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link to="/" className="block mb-8">
          <span
            className="text-xl font-semibold"
            style={{ color: "var(--luna-text-primary)", letterSpacing: "-0.02em" }}
          >
            luna
          </span>
        </Link>

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: "var(--luna-text-primary)" }}>
            Kies hoe je met Luna verder gaat
          </h1>
          <p className="text-base" style={{ color: "var(--luna-text-secondary)" }}>
            Begin gratis. Upgrade als het past.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setYearly(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: !yearly ? "var(--luna-accent)" : "var(--luna-bg-elev)",
              color: !yearly ? "white" : "var(--luna-text-muted)",
            }}
          >
            Maandelijks
          </button>
          <button
            onClick={() => setYearly(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: yearly ? "var(--luna-accent)" : "var(--luna-bg-elev)",
              color: yearly ? "white" : "var(--luna-text-muted)",
            }}
          >
            Jaarlijks – bespaar 34%
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {/* Free */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--luna-bg-elev)", border: "1px solid var(--luna-border)" }}
          >
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--luna-text-primary)" }}>
              Gratis
            </h3>
            <p className="text-3xl font-bold mb-1" style={{ color: "var(--luna-text-primary)" }}>€0</p>
            <p className="text-xs mb-6" style={{ color: "var(--luna-text-muted)" }}>voor altijd</p>
            <div className="space-y-3 mb-6">
              <Feature text="10 berichten per dag" />
              <Feature text="Dagelijkse check-in" />
              <Feature text="7 dagen voortgang" />
              <Feature text="Steun in crisis-momenten" />
            </div>
            <Link
              to="/chat"
              className="block text-center w-full py-3 rounded-xl font-medium transition-all"
              style={{
                color: "var(--luna-text-primary)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Begin gratis
            </Link>
          </div>

          {/* Pro */}
          <div
            className="rounded-2xl p-6 relative"
            style={{ backgroundColor: "var(--luna-bg-elev)", border: "2px solid var(--luna-accent)" }}
          >
            <div
              className="absolute -top-3 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: "var(--luna-accent)", color: "white" }}
            >
              <Star className="w-3 h-3" /> Aanbevolen
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--luna-text-primary)" }}>
              Personal Pro
            </h3>
            <p className="text-3xl font-bold mb-1" style={{ color: "var(--luna-text-primary)" }}>
              {yearly ? "€79/jaar" : "€9,99/maand"}
            </p>
            <p className="text-xs mb-6" style={{ color: "var(--luna-text-muted)" }}>14 dagen terugbetaling</p>
            <div className="space-y-3 mb-6">
              <Feature text="Onbeperkt berichten" />
              <Feature text="Volledige geschiedenis" />
              <Feature text="Topic-vault: vind oude gesprekken" />
              <Feature text="Volledige voortgang & trends" />
              <Feature text="Prioriteit op nieuwe functies" />
              <Feature text="Steun in crisis-momenten" />
            </div>
            <button
              className="w-full py-3 rounded-xl font-medium text-white transition-all active:scale-[0.97]"
              style={{
                backgroundColor: "var(--luna-accent)",
                boxShadow: "0 4px 24px rgba(159,134,255,0.45)",
              }}
            >
              Upgrade naar Pro
            </button>
          </div>
        </div>

        {/* Trust strip */}
        <p className="text-center text-xs mb-10" style={{ color: "var(--luna-text-muted)" }}>
          🇪🇺 EU-servers · 🔒 Versleuteld · 🇧🇪 Belgisch · Anoniem mogelijk
        </p>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--luna-text-primary)" }}>
            Veelgestelde vragen
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl px-4"
                style={{ backgroundColor: "var(--luna-bg-elev)", border: "1px solid var(--luna-border)" }}
              >
                <AccordionTrigger
                  className="text-sm text-left"
                  style={{ color: "var(--luna-text-primary)" }}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--luna-text-secondary)" }}
                >
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3 pb-8">
          <Link
            to="/chat"
            className="text-sm underline"
            style={{ color: "var(--luna-accent)" }}
          >
            Niet zeker? Probeer Luna eerst gratis.
          </Link>
          <p className="text-xs" style={{ color: "var(--luna-text-muted)" }}>
            Vragen? hello@luna.app
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--luna-success)" }} />
      <span className="text-sm" style={{ color: "var(--luna-text-secondary)" }}>{text}</span>
    </div>
  );
}