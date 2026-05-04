import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, TrendingUp, User } from "lucide-react";
import CrisisButton from "@/components/luna/CrisisButton";

const NAV = [
  { to: "/",          label: "Home",      icon: Home },
  { to: "/chat",      label: "Chat",      icon: MessageCircle },
  { to: "/voortgang", label: "Voortgang", icon: TrendingUp },
  { to: "/profiel",   label: "Profiel",   icon: User },
];

const NO_CRISIS = ["/", "/onboarding", "/chat"];

export default function AppShell() {
  const { pathname } = useLocation();
  const isChat = pathname === "/chat";
  const showCrisis = !NO_CRISIS.includes(pathname);

  return (
    <div className="flex flex-col min-h-dvh relative" style={{ background: "var(--bg)" }}>

      {/* Ambient background layer */}
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.08), transparent 60%)",
            opacity: 0.6,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(232,131,74,0.04), transparent 70%)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Crisis button — top right, not on splash/onboarding/chat */}
      {showCrisis && <CrisisButton />}

      {/* Main content */}
      <main
        className="flex-1 mx-auto w-full max-w-[480px] overflow-y-auto"
        style={{
          paddingBottom: isChat ? 0 : "120px",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <Outlet />
      </main>

      {/* Floating glass bottom nav — not on chat */}
      {!isChat && (
        <nav
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between"
          style={{
            width: 280,
            height: 64,
            borderRadius: 32,
            background: "rgba(20,20,30,0.55)",
            backdropFilter: "blur(24px) saturate(140%)",
            WebkitBackdropFilter: "blur(24px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "0 8px",
          }}
        >
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className="press flex items-center justify-center"
                style={{ width: 56, height: 56 }}
              >
                <div
                  style={{
                    width: active ? 44 : "auto",
                    height: active ? 44 : "auto",
                    borderRadius: active ? "50%" : 0,
                    background: active ? "rgba(232,131,74,0.10)" : "transparent",
                    border: active ? "1px solid rgba(232,131,74,0.28)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2 : 1.5}
                    style={{
                      color: active ? "#E8834A" : "rgba(242,237,227,0.4)",
                      transition: "color 0.2s ease",
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
