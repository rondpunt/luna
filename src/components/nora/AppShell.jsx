import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookOpen, TrendingUp, User } from "lucide-react";
import CrisisButton from "@/components/luna/CrisisButton";
import { motion } from "framer-motion";

const NAV = [
  { to: "/",          label: "Home",      icon: Home },
  { to: "/chat",      label: "Chat",      icon: MessageCircle },
  { to: "/diary",     label: "Dagboek",   icon: BookOpen },
  { to: "/voortgang", label: "Voortgang", icon: TrendingUp },
  { to: "/profiel",   label: "Profiel",   icon: User },
];

const NO_CRISIS = ["/landing", "/onboarding"];

export default function AppShell() {
  const { pathname } = useLocation();
  const isChat = pathname === "/chat";
  const showCrisis = !NO_CRISIS.some((p) => pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-dvh relative" style={{ background: "var(--bg)" }}>
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

      {showCrisis && !isChat && <CrisisButton />}

      <main
        className="flex-1 mx-auto w-full max-w-[480px]"
        style={{
          overflowY: isChat ? "hidden" : "auto",
          paddingBottom: isChat ? 0 : "120px",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <Outlet />
      </main>

      {/* Floating glass nav — 5 icons, geen labels */}
      {!isChat && (
        <nav
          aria-label="Hoofdnavigatie"
          className="fixed z-50 left-1/2 -translate-x-1/2"
          style={{
            bottom: 20,
            width: 320,
            height: 64,
            borderRadius: 32,
            background: "rgba(20,20,30,0.55)",
            backdropFilter: "blur(24px) saturate(140%)",
            WebkitBackdropFilter: "blur(24px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 6px",
          }}
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
                aria-label={label}
                style={{
                  width: 56, height: 56,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{
                    width: active ? 44 : "auto",
                    height: active ? 44 : "auto",
                    borderRadius: "50%",
                    background: active ? "rgba(232,131,74,0.10)" : "transparent",
                    border: active ? "1px solid rgba(232,131,74,0.28)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    padding: active ? 0 : 8,
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
                </motion.div>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
