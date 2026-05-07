import { ArrowLeft, MessageCircle } from "lucide-react";

export default function BodyDoubleFocus({ onBack }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-6" style={{ background: "#11131A" }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(158, 196, 177, 0.18), transparent 34%), radial-gradient(circle at 15% 80%, rgba(242, 237, 227, 0.08), transparent 30%), linear-gradient(180deg, #171922 0%, #0F1118 100%)",
        }}
      />
      <div className="absolute inset-x-8 top-32 h-48 rounded-full blur-3xl" style={{ background: "rgba(158,196,177,0.10)" }} />

      <div className="relative z-10 flex items-center justify-between pt-safe">
        <button
          onClick={onBack}
          className="press flex h-11 items-center gap-2 rounded-full border px-4 text-sm"
          style={{ borderColor: "rgba(242,237,227,0.12)", background: "rgba(242,237,227,0.05)", color: "#F2EDE3" }}
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Terug
        </button>
        <button
          onClick={onBack}
          aria-label="Terug naar chat"
          className="press flex h-11 w-11 items-center justify-center rounded-full border"
          style={{ borderColor: "rgba(242,237,227,0.12)", background: "rgba(242,237,227,0.05)", color: "#F2EDE3" }}
        >
          <MessageCircle size={17} strokeWidth={1.8} />
        </button>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-10 flex h-44 w-44 items-center justify-center">
          <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(158,196,177,0.22)" }} />
          <div className="absolute inset-6 rounded-full border" style={{ borderColor: "rgba(242,237,227,0.14)" }} />
          <div className="h-20 w-20 rounded-full" style={{ background: "linear-gradient(145deg, #DDE8DF, #9EC4B1)", boxShadow: "0 24px 70px rgba(158,196,177,0.24)" }} />
        </div>

        <p className="eyebrow-muted mb-4">BODY DOUBLE</p>
        <h1 className="font-display max-w-[340px] text-[38px] leading-[0.95] tracking-[-0.03em]" style={{ color: "#F2EDE3" }}>
          Rustige aanwezigheid terwijl jij begint.
        </h1>
        <p className="mt-5 max-w-[330px] text-[15px] leading-6" style={{ color: "#A8A097" }}>
          Het doel is niet praten of analyseren. Luna blijft op de achtergrond aanwezig, zodat jij één kleine stap kunt zetten zonder dat de chat ruimte inneemt.
        </p>
      </main>

      <div className="relative z-10 pb-safe">
        <button onClick={onBack} className="btn btn-ghost press" style={{ fontSize: 15 }}>
          Terug naar gewone chat
        </button>
      </div>
    </div>
  );
}