import { Link } from "react-router-dom";
import NoraLogo from "@/components/nora/NoraLogo";
import SectionCard from "@/components/nora/SectionCard";
import UrgentHelpBanner from "@/components/nora/UrgentHelpBanner";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NoraLogo />
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Nora</p>
              <p className="text-sm text-muted-foreground">Private emotional support</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UrgentHelpBanner />
            <Link to="/pricing" className="rounded-full border border-border px-4 py-2 text-sm">Pricing</Link>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm text-primary">Private. Calm. Always available.</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight">A premium emotional support companion for the moments that feel like too much.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Chat, voice, journaling, check-ins, memory, and personalized insights — designed to help users feel heard, calmer, and more in control.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/onboarding" className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Start free</Link>
              <Link to="/how-it-works" className="rounded-2xl border border-border px-5 py-3 text-sm font-medium">See how it works</Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Nora is therapy-inspired support, not medical care, diagnosis, or emergency help.</p>
          </div>

          <SectionCard className="bg-[linear-gradient(180deg,rgba(110,126,247,0.12),rgba(117,213,184,0.08))]">
            <div className="space-y-4">
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Text chat for instant support</div>
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Voice mode that feels calm and private</div>
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Memory of what matters, only if you want it</div>
              <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">Daily check-ins, journaling, and emotional trends</div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            ["Built for trust", "Clear privacy language, visible safety, and control over memory and exports."],
            ["Designed for mobile", "Sticky composer, one-handed flows, soft motion, and clean focus."],
            ["Structured for premium", "Free, Plus, and Pro tiers with clean upgrade paths and paywall-ready UX."],
          ].map(([title, body]) => (
            <SectionCard key={title}>
              <p className="text-lg font-medium text-foreground">{title}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}