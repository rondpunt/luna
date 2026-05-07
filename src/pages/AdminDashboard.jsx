import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookHeart, MessageCircle, Shield, Users } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminUserList from "@/components/admin/AdminUserList";
import AdminUserDetail from "@/components/admin/AdminUserDetail";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [search, setSearch] = useState("");

  const loadOverview = async () => {
    const response = await base44.functions.invoke("adminOverview", {});
    setOverview(response.data);
    if (!selectedUserId && response.data.users?.[0]?.id) setSelectedUserId(response.data.users[0].id);
  };

  const loadUserDetail = async (userId) => {
    if (!userId) return;
    setDetailLoading(true);
    const response = await base44.functions.invoke("adminUserProfile", { userId });
    setSelectedDetail(response.data);
    setDetailLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role !== "admin") { navigate("/"); return; }
        await loadOverview();
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (selectedUserId) loadUserDetail(selectedUserId);
  }, [selectedUserId]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return overview?.users || [];
    return (overview?.users || []).filter((user) =>
      `${user.full_name || ""} ${user.email || ""} ${(user.selectedTags || []).join(" ")}`.toLowerCase().includes(term)
    );
  }, [overview?.users, search]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="text-sm text-white/50">Admin laden…</p>
    </div>
  );

  const totals = overview?.totals || {};
  const cards = [
    { icon: Users, label: "Users", value: totals.users || 0, detail: "Alle geregistreerde accounts" },
    { icon: MessageCircle, label: "Chatberichten", value: totals.messages || 0, detail: "User + Luna berichten" },
    { icon: BarChart3, label: "Check-ins", value: totals.checkins || 0, detail: "Dagelijkse scores" },
    { icon: BookHeart, label: "Dagboek", value: totals.diaryEntries || 0, detail: "Diary entries" },
  ];

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-orange-200/60">
              <Shield className="h-4 w-4" /> Admin only
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Luna admin panel</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Beveiligd overzicht van users, statistieken, onboardingwoorden, volledige chatlogs en AI-profielen.
            </p>
          </div>
          <button onClick={loadOverview} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65 hover:bg-white/[0.06]">
            Refresh data
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => <AdminStatCard key={card.label} {...card} />)}
        </div>

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <div className="space-y-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek user, mail of woord…"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-300/40"
            />
            <AdminUserList users={filteredUsers} selectedId={selectedUserId} onSelect={setSelectedUserId} />
          </div>
          <AdminUserDetail detail={selectedDetail} loading={detailLoading} onAnalyze={() => loadUserDetail(selectedUserId)} />
        </div>
      </div>
    </div>
  );
}