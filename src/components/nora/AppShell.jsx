import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookHeart, BarChart3, User } from "lucide-react";

const NAV = [
  { to: "/",        label: "Start",    icon: Home },
  { to: "/chat",    label: "Chat",     icon: MessageCircle },
  { to: "/journal", label: "Dagboek",  icon: BookHeart },
  { to: "/insights",label: "Inzichten",icon: BarChart3 },
  { to: "/profile", label: "Profiel",  icon: User },
];

export default function AppShell() {
  const { pathname } = useLocation();
  const isChat = pathname === "/chat";

  if (isChat) return <Outlet />;

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "var(--bg)" }}>

      {/* Top bar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-center"
        style={{
          background: "rgba(10,10,11,0.90)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          height: "calc(52px + env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="flex items-center gap-2">
          {/* Orb */}
          <div
            className="h-6 w-6 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
              boxShadow: "0 0 12px 3px rgba(194,90,50,0.30)",
            }}
          />
          <span className="text-[17px] font-semibold tracking-tight" style={{ color: "var(--text)", letterSpacing: "-0.3px" }}>
            Luna
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg overflow-y-auto" style={{ paddingBottom: "80px" }}>
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50"
        style={{
          background: "rgba(10,10,11,0.94)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
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
                className="flex flex-col items-center gap-[3px] py-1 px-3 min-w-[52px] rounded-xl transition-all active:opacity-60"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
                  style={{ background: active ? "rgba(194,90,50,0.18)" : "transparent" }}
                >
                  <Icon
                    className="h-[20px] w-[20px] transition-all"
                    style={{ color: active ? "#C25A32" : "rgba(240,240,242,0.38)" }}
                    strokeWidth={active ? 2.2 : 1.7}
                  />
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: active ? "#C25A32" : "rgba(240,240,242,0.35)" }}
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