import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookHeart, BarChart3, User } from "lucide-react";

const NAV = [
  { to: "/",         label: "Start",     icon: Home },
  { to: "/chat",     label: "Chat",      icon: MessageCircle },
  { to: "/journal",  label: "Dagboek",   icon: BookHeart },
  { to: "/insights", label: "Inzichten", icon: BarChart3 },
  { to: "/profile",  label: "Profiel",   icon: User },
];

export default function AppShell() {
  const { pathname } = useLocation();
  const isChat = pathname === "/chat";

  if (isChat) return <Outlet />;

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "var(--bg)" }}>

      {/* Top bar — premium, hairline border */}
      <header
        className="sticky top-0 z-40 flex items-center justify-center"
        style={{
          background: "rgba(10,10,11,0.85)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderBottom: "1px solid var(--line-subtle)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          height: "calc(52px + env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-[22px] w-[22px] rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
              boxShadow: "0 0 8px 1.5px rgba(194,90,50,0.22)",
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

      <main className="flex-1 mx-auto w-full max-w-lg overflow-y-auto" style={{ paddingBottom: "84px" }}>
        <Outlet />
      </main>

      {/* Bottom nav — premium with active indicator bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50"
        style={{
          background: "rgba(10,10,11,0.90)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderTop: "1px solid var(--line-subtle)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex justify-around px-2 pt-1 pb-1.5 max-w-lg mx-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="relative flex flex-col items-center gap-[3px] py-1 px-3 min-w-[56px] btn-press"
                aria-current={active ? "page" : undefined}
              >
                {/* Active indicator bar */}
                <span
                  className="absolute top-0 h-[2px] rounded-full transition-all"
                  style={{
                    width: active ? 18 : 0,
                    background: "#C25A32",
                    opacity: active ? 1 : 0,
                  }}
                />
                <Icon
                  className="h-[20px] w-[20px] transition-colors"
                  style={{ color: active ? "#C25A32" : "rgba(240,240,242,0.42)" }}
                  strokeWidth={active ? 2.1 : 1.7}
                />
                <span
                  className="text-[10.5px] font-medium leading-none transition-colors"
                  style={{ color: active ? "#C25A32" : "rgba(240,240,242,0.46)" }}
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