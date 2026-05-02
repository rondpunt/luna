import { Link } from "react-router-dom";
import { MessageCircle, BookHeart } from "lucide-react";

export default function Voice() {
  return (
    <div className="px-4 pt-14 pb-8 flex flex-col items-center text-center min-h-[80vh] justify-center space-y-6 max-w-lg mx-auto">
      <div className="rounded-[28px] p-8" style={{ background: "#1C1C1E" }}>
        <p className="text-5xl mb-5">🎙️</p>
        <p className="text-[22px] font-bold text-white mb-2">Stem tijdelijk niet beschikbaar</p>
        <p className="text-[17px] leading-[1.5]" style={{ color: "rgba(235,235,245,0.55)" }}>
          De stemmodus is nog niet actief. Gebruik chat of het dagboek om je gedachten te delen.
        </p>
      </div>

      <div className="space-y-3 w-full max-w-sm">
        <Link
          to="/chat"
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-[17px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #FF8C60, #FF6B3D)" }}
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2} />
          Start een gesprek
        </Link>
        <Link
          to="/journal"
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-[17px] font-medium"
          style={{ background: "#1C1C1E", color: "rgba(235,235,245,0.75)" }}
        >
          <BookHeart className="h-5 w-5" strokeWidth={2} />
          Open dagboek
        </Link>
      </div>
    </div>
  );
}