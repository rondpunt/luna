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
    <div className="flex flex-col min-h-dvh" style={{ background: "#000" }}>
      {/* iOS-style large title topbar */}
      <header
        className="sticky top-0 z-40 px-4 pt-2 pb-0"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(84,84,88,0.65)",
        }}
      >
        <div className="flex items-center justify-center py-3">
          <span
            className="text-[17px] font-semibold"
            style={{ color: "#FFFFFF", letterSpacing: "-0.2px" }}
          >
            Nora
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg overflow-y-auto" style={{ paddingBottom: "84px" }}>
        <Outlet />
      </main>

      {/* iOS tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50"
        style={{
          background: "rgba(28,28,30,0.94)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderTop: "0.5px solid rgba(84,84,88,0.65)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex justify-around px-1 pt-2 pb-1.5 max-w-lg mx-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-[3px] py-1 px-2 min-w-[56px]"
              >
                <Icon
                  className="h-[25px] w-[25px] transition-all"
                  style={{ color: active ? "#C25A32" : "rgba(235,235,245,0.55)" }}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span
                  className="text-[10px] font-medium tracking-tight"
                  style={{ color: active ? "#C25A32" : "rgba(235,235,245,0.55)" }}
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