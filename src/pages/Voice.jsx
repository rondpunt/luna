import { Link } from "react-router-dom";
import { MessageCircle, BookHeart } from "lucide-react";

export default function Voice() {
  return (
    <div className="px-5 pt-10 flex flex-col items-center text-center min-h-[70vh] justify-center space-y-6">
      <div
        className="rounded-3xl p-6 max-w-xs w-full"
        style={{ background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-4xl mb-4">🎙️</p>
        <p className="text-lg font-bold text-white mb-2">Stem niet beschikbaar</p>
        <p className="text-sm leading-5" style={{ color: "rgba(255,255,255,0.50)" }}>
          De stemmodus is tijdelijk niet actief. Gebruik chat of het dagboek om je gedachten te delen.
        </p>
      </div>

      <div className="space-y-2 w-full max-w-xs">
        <Link
          to="/chat"
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 text-sm font-semibold text-white"
          style={{ background: "#c25a32" }}
        >
          <MessageCircle className="h-4 w-4" />
          Start een gesprek
        </Link>
        <Link
          to="/journal"
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 text-sm font-medium"
          style={{ background: "#1c1c1e", color: "rgba(255,255,255,0.70)" }}
        >
          <BookHeart className="h-4 w-4" />
          Open dagboek
        </Link>
      </div>
    </div>
  );
}