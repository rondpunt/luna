import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import GlassCard from "../components/luna/GlassCard";
import LunaMoon from "../components/luna/LunaMoon";

const faqItems = [
  { q: "Vervangt Luna een psycholoog?", a: "Nee. Luna is een gezel die luistert. Geen therapeut, geen arts. Voor diagnose, medicatie of intensieve begeleiding: ga naar een psycholoog of huisarts." },
  { q: "Wat gebeurt er met mijn gesprekken?", a: "Ze worden versleuteld bewaard op EU-servers. Alleen jij ziet ze terug. Je kunt ze op elk moment wissen via Profiel." },
  { q: "Kan ik op elk moment opzeggen?", a: "Ja. Eén tap in Profiel → Abonnement. Je houdt toegang tot het einde van de betaalde periode." },
  { q: "Is mijn data veilig?", a: "Ja. EU-servers, encryptie in rust en in transit, GDPR-conform." },
  { q: "Wat als ik in nood ben?", a: "Luna is geen crisisdienst. Bij acute nood: bel Zelfmoordlijn 0800 32 123 (24/7, gratis) of 112." },
  { q: "Hoe werkt de terugbetaling?", a: "Niet tevreden binnen 14 dagen? Mail hello@luna.app — we storten zonder vragen terug." },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

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
          className="text-base"
          style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}
        >
          luna
        </span>
      </header>

      <main className="px-5 pb-16 max-w-md mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <LunaMoon size={56} state="idle" float className="mx-auto mb-5" />
          <h1
            className="text-[26px] mb-2"
            style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.92)" }}
          >
            Eerlijke prijzen.
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "'DM Sans', sans-serif" }}>
            Stop wanneer je wil.
          </p>
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
            ✓ 7 dagen gratis · Geen creditcard · Opzeggen wanneer je wil
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <GlassCard className="flex p-1 gap-1">
            <button
              onClick={() => setIsYearly(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: !isYearly ? "#6366f1" : "transparent",
                color: !isYearly ? "#fff" : "rgba(255,255,255,0.40)",
                boxShadow: !isYearly ? "0 0 10px rgba(99,102,241,0.3)" : "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Maandelijks
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isYearly ? "#6366f1" : "transparent",
                color: isYearly ? "#fff" : "rgba(255,255,255,0.40)",
                boxShadow: isYearly ? "0 0 10px rgba(99,102,241,0.3)" : "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Jaarlijks – 34% korting
            </button>
          </GlassCard>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-8">
          {/* Free */}
          <GlassCard className="p-5">
            <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'DM Sans', sans-serif" }}>
              Gratis
            </p>
            <p className="text-[32px] leading-none mb-1" style={{ fontFamily: "'Lora', Georgia, serif", color: "rgba(255,255,255,0.92)" }}>
              €0
            </p>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>voor altijd</p>
            <div className="space-y-2.5 mb-5">
              {["10 chats per dag", "Dagelijkse check-in", "Voortgang 7 dagen", "Crisis-ondersteuning"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#4ade80" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                </div>
              ))}
            </div>
            <Link
              to="/chat"
              className="block text-center w-full py-3 rounded-full text-sm font-medium transition-all active:scale-[0.97]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.70)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Begin gratis
            </Link>
          </GlassCard>

          {/* Pro */}
          <GlassCard
            className="p-5 relative"
            style={{ border: "1px solid rgba(129,140,248,0.35)" }}
          >
            <div
              className="absolute -top-3 right-4 px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: "#6366f1", color: "#fff", boxShadow: "0 0 12px rgba(99,102,241,0.4)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Meest populair
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'DM Sans', sans-serif" }}>
              Personal Pro
            </p>
            <p className="text-[32px] leading-none mb-1" style={{ fontFamily: "'Lora', Georgia, serif", color: "rgba(255,255,255,0.92)" }}>
              {isYearly ? "€79/jaar" : "€9,99/maand"}
            </p>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
              14 dagen terugbetaling
            </p>
            <div className="space-y-2.5 mb-5">
              {[
                "Onbeperkte chats",
                "Volledige gesprekshistoriek",
                "Voortgang onbeperkt",
                "Vault-onderwerpen",
                "Prioriteit nieuwe functies",
                "Crisis-ondersteuning",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#4ade80" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all active:scale-[0.97]"
              style={{
                background: "#6366f1",
                boxShadow: "0 0 20px rgba(99,102,241,0.35)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Upgrade naar Pro
            </button>
          </GlassCard>
        </div>

        {/* Trust */}
        <p
          className="text-xs text-center mb-10"
          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}
        >
          🇪🇺 EU-servers · 🔒 Versleuteld · 🇧🇪 Belgisch
        </p>

        {/* FAQ */}
        <h2
          className="text-lg mb-4"
          style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", color: "rgba(255,255,255,0.88)" }}
        >
          Veelgestelde vragen
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border-0 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <AccordionTrigger
                className="px-4 py-3 text-sm hover:no-underline"
                style={{ color: "rgba(255,255,255,0.88)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)", fontFamily: "'DM Sans', sans-serif" }}>
                  {item.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-xs text-center mt-8" style={{ color: "rgba(255,255,255,0.20)", fontFamily: "'DM Sans', sans-serif" }}>
          Vragen?{" "}
          <a href="mailto:hello@luna.app" style={{ color: "rgba(129,140,248,0.70)" }}>
            hello@luna.app
          </a>
        </p>
      </main>
    </div>
  );
}