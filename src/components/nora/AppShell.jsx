import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookHeart, BarChart3, User } from "lucide-react";

const NAV = [
  { to: "/", label: "Start", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/journal", label: "Dagboek", icon: BookHeart },
  { to: "/insights", label: "Inzichten", icon: BarChart3 },
  { to: "/profile", label: "Profiel", icon: User },
];

export default function AppShell() {
  const { pathname } = useLocation();
  const isChat = pathname === "/chat";

  if (isChat) return <Outlet />;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#000" }}>
      {/* Topbar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-center px-5 py-4"
        style={{
          background: "rgba(0,0,0,0.80)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-base font-semibold text-white tracking-tight">Nora</span>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg pb-32 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom tab bar — iOS style */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50"
        style={{
          background: "rgba(28,28,30,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex justify-around px-2 pt-2 pb-2 max-w-lg mx-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-0.5 py-1 px-3"
              >
                <Icon
                  className="h-[22px] w-[22px]"
                  style={{ color: active ? "#c25a32" : "rgba(255,255,255,0.40)" }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: active ? "#c25a32" : "rgba(255,255,255,0.40)" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}