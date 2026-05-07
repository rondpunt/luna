import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookHeart, MessageCircle, Shield, Users, Search } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminUserList from "@/components/admin/AdminUserList";
import AdminUserDetail from "@/components/admin/AdminUserDetail";
import { motion } from "framer-motion";

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
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
      <p style={{ fontSize: 14, color: "var(--text-faint)" }}>Admin laden…</p>
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
    <div className="min-h-screen px-6 py-10" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl space-y-8">
        
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 999, background: "rgba(232,131,74,0.1)", border: "1px solid rgba(232,131,74,0.2)", width: "fit-content" }}>
            <Shield size={14} style={{ color: "#E8834A" }} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#E8834A", letterSpacing: "0.1em" }}>ADMIN ONLY</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="font-display" style={{ fontSize: 42, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1 }}>Luna Backoffice.</h1>
              <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 8, maxWidth: 500, lineHeight: 1.5 }}>
                Beveiligd overzicht van users, statistieken, volledige chatlogs en AI-profielen.
              </p>
            </div>
            <button onClick={loadOverview} className="btn btn-ghost press" style={{ width: "auto", height: 40, fontSize: 13 }}>
              Refresh data
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(232,131,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <card.icon size={18} style={{ color: "#E8834A" }} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>{card.label}</span>
              </div>
              <p className="font-display" style={{ fontSize: 48, color: "var(--text)", lineHeight: 1 }}>{card.value}</p>
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 8 }}>{card.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek user, mail..."
                style={{ width: "100%", height: 48, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, paddingLeft: 44, fontSize: 14, color: "var(--text)", outline: "none" }}
              />
            </div>
            <AdminUserList users={filteredUsers} selectedId={selectedUserId} onSelect={setSelectedUserId} />
          </div>
          <AdminUserDetail detail={selectedDetail} loading={detailLoading} onAnalyze={() => loadUserDetail(selectedUserId)} />
        </div>
      </div>
    </div>
  );
}