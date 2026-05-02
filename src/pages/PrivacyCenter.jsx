import SectionCard from "@/components/nora/SectionCard";

export default function PrivacyCenter() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">Privacy Center</p>
        <h1 className="text-4xl font-semibold tracking-tight">Control what Nora remembers and what stays with you.</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SectionCard>
          <p className="text-lg font-medium text-foreground">What is stored</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>• Chats and journal entries in your private account</li>
            <li>• Optional memories you explicitly keep</li>
            <li>• Check-ins and insights used to personalize support</li>
          </ul>
        </SectionCard>
        <SectionCard>
          <p className="text-lg font-medium text-foreground">Memory controls</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl bg-secondary px-4 py-4">Delete individual memories</div>
            <div className="rounded-2xl bg-secondary px-4 py-4">Turn memory off</div>
            <div className="rounded-2xl bg-secondary px-4 py-4">Delete conversation history</div>
          </div>
        </SectionCard>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SectionCard>
          <p className="text-lg font-medium text-foreground">Export your data</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Export all chats and journal entries as downloadable files.</p>
          <button className="mt-4 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">Export all data</button>
        </SectionCard>
        <SectionCard>
          <p className="text-lg font-medium text-foreground">Delete account</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Permanently remove your account and private history.</p>
          <button className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">Delete account</button>
        </SectionCard>
      </div>
    </div>
  );
}