import SectionCard from "./SectionCard";

const tiers = [
  {
    name: "Free",
    price: "$0",
    note: "For getting started gently",
    features: ["Limited daily chats", "Basic journaling", "Daily check-ins", "Basic insights"],
  },
  {
    name: "Plus",
    price: "$12/mo",
    note: "For everyday support and memory",
    featured: true,
    features: ["Unlimited chat", "Memory", "Voice mode", "Full journal tools", "Weekly insights"],
  },
  {
    name: "Pro",
    price: "$24/mo",
    note: "For deeper reflection over time",
    features: ["Advanced insights", "Long-term memory", "Custom routines", "Priority features", "Coach integrations placeholder"],
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
            {tier.name === "Free" ? "Start free" : `Choose ${tier.name}`}
          </button>
        </SectionCard>
      ))}
    </div>
  );
}