import SectionCard from "@/components/nora/SectionCard";

export default function Onboarding() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Onboarding</p>
        <h1 className="text-4xl font-semibold tracking-tight">Set up Nora around how you want support to feel.</h1>
      </div>
      <SectionCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" placeholder="First name or nickname" />
          <select className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"><option>Preferred language</option><option>English</option><option>Nederlands</option><option>Français</option></select>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Main goals</p>
            <div className="flex flex-wrap gap-2">{['Stress','Anxiety','Sleep','Relationships','Focus','Loneliness','Self-esteem','Burnout','Grief','Other'].map((goal) => <button key={goal} className="rounded-full border border-border px-4 py-2 text-sm">{goal}</button>)}</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <select className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"><option>Communication style</option><option>Gentle</option><option>Direct</option><option>Practical</option><option>Reflective</option></select>
            <input className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none" placeholder="Daily check-in time" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-2xl border border-border bg-secondary px-4 py-4 text-sm"><input type="checkbox" className="mr-2" defaultChecked /> Enable memory</label>
            <label className="rounded-2xl border border-border bg-secondary px-4 py-4 text-sm"><input type="checkbox" className="mr-2" defaultChecked /> Enable voice mode</label>
          </div>
          <label className="block rounded-2xl border border-border bg-secondary px-4 py-4 text-sm"><input type="checkbox" className="mr-2" /> I agree to the privacy policy and safety notice.</label>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">If someone mentions self-harm or immediate danger here, Nora should route them to crisis support and real-world human help.</div>
          <button className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Complete onboarding</button>
        </div>
      </SectionCard>
    </div>
  );
}