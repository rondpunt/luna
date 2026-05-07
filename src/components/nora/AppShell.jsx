import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookOpen, TrendingUp, User } from "lucide-react";
import CrisisButton from "@/components/luna/CrisisButton";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/home",      label: "Home",      icon: Home },
  { to: "/chat",      label: "Chat",      icon: MessageCircle },
  { to: "/diary",     label: "Dagboek",   icon: BookOpen },
  { to: "/voortgang", label: "Voortgang", icon: TrendingUp },
  { to: "/profiel",   label: "Profiel",   icon: User },
];

const NO_CRISIS = ["/landing", "/onboarding"];
const FULLSCREEN = ["/chat"];

export default function AppShell() {
  const { pathname } = useLocation();
  const isFullscreen = FULLSCREEN.includes(pathname);
  const showCrisis = !NO_CRISIS.some((p) => pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-dvh relative" style={{ background: "var(--bg)" }}>
      {/* Ambient background — richer layering */}
      <div className="fixed inset-0 -z-10" style={{ background: "#080810" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 100% 60% at 50% -10%, rgba(232,131,74,0.07), transparent 65%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(164,107,168,0.03), transparent 70%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 20% 100%, rgba(107,143,212,0.025), transparent 70%)",
        }} />
      </div>

      {showCrisis && !isFullscreen && <CrisisButton />}

      <main
        className="flex-1 mx-auto w-full max-w-[480px]"
        style={{
          overflowY: isFullscreen ? "hidden" : "auto",
          paddingBottom: isFullscreen ? 0 : "100px",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <Outlet />
      </main>

      {/* Bottom nav — pill style, refined */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            aria-label="Hoofdnavigatie"
            className="fixed z-50 left-1/2 -translate-x-1/2"
            style={{
              bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
              width: 310,
              height: 62,
              borderRadius: 31,
              background: "rgba(10,10,18,0.82)",
              backdropFilter: "blur(36px) saturate(180%)",
              WebkitBackdropFilter: "blur(36px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 4px",
            }}
          >
            {NAV.map(({ to, label, icon: Icon }) => {
              const active =
                pathname === to ||
                (to !== "/home" && to !== "/" && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  style={{
                    width: 54, height: 54,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", flexShrink: 0, position: "relative",
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.82 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    style={{
                      width: active ? 42 : 36,
                      height: active ? 42 : 36,
                      borderRadius: "50%",
                      background: active ? "rgba(232,131,74,0.12)" : "transparent",
                      border: active ? "1px solid rgba(232,131,74,0.24)" : "1px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.2 : 1.5}
                      style={{
                        color: active ? "#E8834A" : "rgba(240,235,225,0.32)",
                        transition: "color 0.2s ease",
                        filter: active ? "drop-shadow(0 0 6px rgba(232,131,74,0.5))" : "none",
                      }}
                    />
                  </motion.div>
                  {active && (
                    <motion.div
                      layoutId="nav-dot"
                      style={{
                        position: "absolute", bottom: 6,
                        width: 4, height: 4, borderRadius: "50%",
                        background: "#E8834A",
                        boxShadow: "0 0 6px rgba(232,131,74,0.8)",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}