import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookOpen, TrendingUp, User } from "lucide-react";
import { motion } from "framer-motion";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import LunaGlobalChrome from "@/components/shell/LunaGlobalChrome";

const NAV = [
  { to: "/",          label: "Home",      icon: Home },
  { to: "/chat",      label: "Chat",      icon: MessageCircle },
  { to: "/diary",     label: "Dagboek",   icon: BookOpen },
  { to: "/voortgang", label: "Voortgang", icon: TrendingUp },
  { to: "/profiel",   label: "Profiel",   icon: User },
];

export default function AppShell() {
  const { pathname } = useLocation();
  const isChat = pathname === "/chat";
  const online = useOnlineStatus();

  return (
    <div className="flex flex-col min-h-dvh relative" style={{ background: "var(--bg)" }}>
      <LunaGlobalChrome />
      {/* Ambient background */}
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

      {!online && !isChat && (
        <div
          className="sticky top-0 z-[45] w-full text-center py-1.5 px-3"
          style={{
            background: "rgba(142, 142, 147, 0.18)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 12,
            color: "rgba(242,237,227,0.65)",
          }}
          role="status"
          aria-live="polite"
        >
          Geen netwerk — check je verbinding
        </div>
      )}

      <main
        className="flex-1 mx-auto w-full max-w-[480px]"
        style={{
          overflowY: isChat ? "hidden" : "auto",
          paddingBottom: isChat ? 0 : "calc(108px + var(--safe-bottom))",
          paddingTop: "var(--safe-top)",
        }}
      >
        <Outlet />
      </main>

      {/* Bottom bar — icon + compact label, softer active, less chrome */}
      {!isChat && (
        <nav
          aria-label="Hoofdnavigatie"
          className="glass-nav fixed z-50 left-1/2 -translate-x-1/2 flex items-stretch justify-between gap-0.5 px-2 py-2 w-[min(100vw-24px,400px)] max-w-[400px] rounded-[22px]"
          style={{ bottom: "calc(16px + var(--safe-bottom))" }}
        >
          {NAV.map(({ to, label, icon: Icon }) => {
            const active =
              pathname === to ||
              (to === "/" && pathname === "/home") ||
              (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 min-w-0 flex-col items-center justify-center gap-0.5 no-underline rounded-[14px] py-1"
                style={{
                  background: active ? "rgba(232,131,74,0.08)" : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  className="flex flex-col items-center justify-center gap-0.5"
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2 : 1.5}
                    aria-hidden
                    style={{
                      color: active ? "#E8834A" : "rgba(242,237,227,0.38)",
                      transition: "color 0.2s ease",
                    }}
                  />
                  <span
                    className="max-w-full truncate px-0.5 text-center leading-none"
                    style={{
                      fontSize: 10,
                      fontWeight: active ? 600 : 500,
                      letterSpacing: "0.02em",
                      color: active ? "rgba(242,237,227,0.82)" : "rgba(242,237,227,0.38)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
