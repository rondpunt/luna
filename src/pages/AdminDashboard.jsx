import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { MessageCircle, BookHeart, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, conversations: 0, journals: 0, checkins: 0 });

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role !== "admin") { navigate("/"); return; }
        const [convs, journals, checkins] = await Promise.all([
          base44.entities.Conversation.list("-created_date", 999),
          base44.entities.JournalEntry.list("-created_date", 999),
          base44.entities.CheckIn.list("-date", 999),
        ]);
        setStats((prev) => ({
          ...prev,
          conversations: convs.length,
          journals: journals.length,
          checkins: checkins.length,
        }));
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const CARDS = [
    { icon: MessageCircle, label: "Gesprekken", value: stats.conversations, color: "#c25a32" },
    { icon: BookHeart, label: "Dagboeknotities", value: stats.journals, color: "#ee9670" },
    { icon: BarChart3, label: "Check-ins", value: stats.checkins, color: "#a04028" },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#000" }}>
      <p className="text-white/50 text-sm">Laden…</p>
    </div>
  );

  return (
    <div className="min-h-screen px-5 py-10 space-y-6" style={{ background: "#000" }}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Admin</p>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CARDS.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: "#1c1c1e" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ background: `${color}25` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl px-4 py-4" style={{ background: "#1c1c1e" }}>
        <p className="text-sm font-semibold text-white mb-1">Over dit dashboard</p>
        <p className="text-sm leading-5" style={{ color: "rgba(255,255,255,0.50)" }}>
          Enkel zichtbaar voor admin-gebruikers. Data is anoniem geaggregeerd — geen persoonsgegevens worden hier weergegeven.
        </p>
      </div>
    </div>
  );
}