import SectionCard from "@/components/nora/SectionCard";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">Privacy policy</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Clear language about what Nora stores and why.</h1>
      <div className="mt-6 space-y-4">
        {[
          ["What we store", "Chats, journal entries, check-ins, preferences, and optional memories connected to your account."],
          ["Why we store it", "To make the product work, personalize support, and give you continuity over time."],
          ["Your controls", "You can export data, turn memory off, delete memories, and delete your account."],
          ["Emergency limit", "Nora is not emergency support or medical care."],
        ].map(([title, body]) => (
          <SectionCard key={title}>
            <p className="text-lg font-medium text-foreground">{title}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}