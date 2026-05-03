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
          background: "rgba(10,10,11,0.88)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid var(--line-subtle)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          height: "calc(52px + env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="flex items-center gap-2">
          {/* Orb */}
          <div
            className="h-[22px] w-[22px] rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
              boxShadow: "0 0 10px 2px rgba(194,90,50,0.24)",
            }}
          />
          <span
            className="text-[16px] font-semibold"
            style={{ color: "var(--text)", letterSpacing: "-0.2px" }}
          >
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
          background: "rgba(10,10,11,0.92)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderTop: "1px solid var(--line-subtle)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex justify-around px-2 pt-1.5 pb-1.5 max-w-lg mx-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px] transition-all active:opacity-60"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                  style={{ background: active ? "rgba(194,90,50,0.14)" : "transparent" }}
                >
                  <Icon
                    className="h-[19px] w-[19px] transition-all"
                    style={{ color: active ? "#C25A32" : "rgba(240,240,242,0.42)" }}
                    strokeWidth={active ? 2.1 : 1.6}
                  />
                </div>
                <span
                  className="text-[10.5px] font-medium leading-none"
                  style={{ color: active ? "#C25A32" : "rgba(240,240,242,0.42)" }}
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