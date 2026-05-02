import SectionCard from "@/components/nora/SectionCard";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">Admin dashboard</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Product health without exposing private conversations.</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {[
          ["Users", "12,480"],
          ["Active users", "4,210"],
          ["Subscriptions", "1,182"],
          ["Check-in rate", "68%"],
          ["Retention", "41% D30"],
          ["Feature usage", "Chat 92%"],
          ["Journal usage", "54%"],
          ["Voice usage", "31%"],
        ].map(([label, value]) => (
          <SectionCard key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </SectionCard>
        ))}
      </div>
      <SectionCard className="mt-4">
        <p className="text-lg font-medium text-foreground">Revenue overview placeholder</p>
        <p className="mt-3 text-sm text-muted-foreground">Prepared for Stripe-connected analytics later.</p>
      </SectionCard>
    </div>
  );
}