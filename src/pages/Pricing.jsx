import PricingCards from "@/components/nora/PricingCards";
import SectionCard from "@/components/nora/SectionCard";

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">Pricing</p>
        <h1 className="text-4xl font-semibold tracking-tight">Premium support, with a clear free path.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Stripe-ready pricing architecture with Free, Plus, and Pro plans, designed for a clean paywall and future subscription management.</p>
      </div>
      <div className="mt-6">
        <PricingCards />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionCard>
          <p className="text-lg font-medium text-foreground">Why people upgrade</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Unlimited emotional support chat</li>
            <li>• Voice mode and guided sessions</li>
            <li>• Memory and better personalization</li>
            <li>• Deeper weekly and monthly insights</li>
          </ul>
        </SectionCard>
        <SectionCard>
          <p className="text-lg font-medium text-foreground">Important note</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Nora is not emergency support, not medical care, and not a replacement for professional help.</p>
        </SectionCard>
      </div>
    </div>
  );
}