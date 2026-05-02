import { Link } from "react-router-dom";
import SectionCard from "@/components/nora/SectionCard";
import InsightChartCard from "@/components/nora/InsightChartCard";
import UrgentHelpBanner from "@/components/nora/UrgentHelpBanner";

const trend = [
  { day: "Mon", value: 4 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 6 },
  { day: "Thu", value: 5 },
  { day: "Fri", value: 7 },
  { day: "Sat", value: 6 },
  { day: "Sun", value: 7 },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-semibold tracking-tight">How are you feeling right now?</h1>
        </div>
        <UrgentHelpBanner />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard className="bg-[linear-gradient(135deg,rgba(110,126,247,0.14),rgba(117,213,184,0.16))]">
          <p className="text-sm text-muted-foreground">Private support</p>
          <h2 className="mt-2 text-2xl font-semibold">A calm space for chat, voice, check-ins, and reflection.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Nora helps you slow down, understand what’s underneath the surface, and find one steady next step.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {['heavy', 'restless', 'flat', 'hopeful', 'overthinking'].map((mood) => (
              <button key={mood} className="rounded-full border border-border bg-background px-4 py-2 text-sm capitalize text-foreground">{mood}</button>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-sm font-medium text-foreground">Today’s gentle path</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl bg-secondary p-4">Resume last conversation</div>
            <div className="rounded-2xl bg-secondary p-4">Start a voice session</div>
            <div className="rounded-2xl bg-secondary p-4">Journal for 5 minutes</div>
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <SectionCard>
          <p className="text-sm text-muted-foreground">Streak</p>
          <p className="mt-2 text-3xl font-semibold">8 days</p>
          <p className="mt-2 text-sm text-muted-foreground">Consistency helps Nora notice what steadies you.</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm text-muted-foreground">Suggested coping tool</p>
          <p className="mt-2 text-lg font-medium">3-minute grounding reset</p>
          <p className="mt-2 text-sm text-muted-foreground">Good for racing thoughts and emotional overwhelm.</p>
        </SectionCard>
        <SectionCard className="bg-primary/5">
          <p className="text-sm text-muted-foreground">Unlock Plus</p>
          <p className="mt-2 text-lg font-medium">Voice mode, memory, and deeper weekly insights.</p>
          <Link to="/pricing" className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">See plans</Link>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <InsightChartCard data={trend} />
        <SectionCard>
          <p className="text-sm font-medium text-foreground">Privacy first</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>• Your chats and journal stay private to your account.</li>
            <li>• Memory can be switched off anytime.</li>
            <li>• Export or delete your data from Privacy Center.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}