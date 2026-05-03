import SectionCard from "./SectionCard";

const tiers = [
  {
    name: "Gratis",
    price: "€0",
    note: "Om rustig te beginnen",
    features: ["Beperkte dagelijkse chats", "Basis dagboek", "Dagelijkse check-ins", "Basis inzichten"],
  },
  {
    name: "Plus",
    price: "€9,99/mnd",
    note: "Voor dagelijkse steun en geheugen",
    featured: true,
    features: ["Onbeperkt chatten", "Geheugen", "Stemmodus", "Volledig dagboek", "Wekelijkse inzichten"],
  },
  {
    name: "Pro",
    price: "€19,99/mnd",
    note: "Voor diepgaande reflectie over tijd",
    features: ["Geavanceerde inzichten", "Langetermijngeheugen", "Eigen routines", "Prioriteitsfeatures", "Gespreksmappen"],
  },
];

export default function PricingCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {tiers.map((tier) => (
        <SectionCard key={tier.name} className={tier.featured ? "border-primary/40 bg-primary/5" : ""}>
          <p className="text-lg font-semibold text-foreground">{tier.name}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{tier.price}</p>
          <p className="mt-2 text-sm text-muted-foreground">{tier.note}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {tier.features.map((feature) => <li key={feature}>• {feature}</li>)}
          </ul>
          <button className="mt-5 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
            {tier.name === "Gratis" ? "Gratis starten" : `Kies ${tier.name}`}
          </button>
        </SectionCard>
      ))}
    </div>
  );
}