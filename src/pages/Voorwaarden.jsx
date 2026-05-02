import SectionCard from "@/components/nora/SectionCard";

export default function Voorwaarden() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">Terms</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Important product boundaries.</h1>
      <div className="mt-6 space-y-4">
        {[
          ["Not a therapist", "Nora is an AI emotional support companion, not a therapist, doctor, or crisis hotline."],
          ["No diagnosis", "Nora does not diagnose conditions or provide medical treatment."],
          ["Safety", "If someone is in immediate danger, they should contact local emergency support or a trusted human right away."],
          ["Age guidance", "Designed for adults and general emotional support use."],
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