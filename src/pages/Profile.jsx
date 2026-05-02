import { Link } from "react-router-dom";
import SectionCard from "@/components/nora/SectionCard";

const settings = [
  ["Communication style", "Reflective"],
  ["Memory", "On"],
  ["Notifications", "Daily at 8:00 PM"],
  ["Voice settings", "Soft voice · English"],
  ["Theme", "Auto"],
];

export default function Profile() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">Profile</p>
        <h1 className="text-3xl font-semibold tracking-tight">Your preferences, privacy, and subscription.</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">N</div>
            <div>
              <p className="text-lg font-medium text-foreground">Nora user</p>
              <p className="text-sm text-muted-foreground">private@email.com</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {settings.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-4 text-sm">
                <span className="text-foreground">{label}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard className="bg-primary/5">
            <p className="text-sm font-medium text-foreground">Current plan</p>
            <p className="mt-2 text-2xl font-semibold">Free</p>
            <p className="mt-2 text-sm text-muted-foreground">Upgrade for voice, memory, and deeper insights.</p>
            <Link to="/pricing" className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Manage subscription</Link>
          </SectionCard>
          <SectionCard>
            <p className="text-sm font-medium text-foreground">Privacy Center</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <Link to="/privacy-center" className="block rounded-2xl bg-secondary px-4 py-4">Memory controls</Link>
              <div className="rounded-2xl bg-secondary px-4 py-4">Export data</div>
              <div className="rounded-2xl bg-secondary px-4 py-4">Delete account</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}