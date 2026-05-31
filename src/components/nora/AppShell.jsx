import { Outlet, Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, MessageCircle, Wind, Sparkles, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveTimeTracker } from "@/hooks/useActiveTimeTracker";

const NAV = [
  { to: "/home",       label: "Home",        icon: HomeIcon,      color: "#F0925E" },
  { to: "/chat",       label: "Chat",        icon: MessageCircle, color: "#6A9AD9" },
  { to: "/brain-dump", label: "Brain Dump",  icon: Wind,          color: "#7BC096" },
  { to: "/skills",     label: "Skills",      icon: Sparkles,      color: "#F0C674" },
  { to: "/profiel",    label: "Instellingen", icon: Settings,     color: "#9B7FC4" },
];

const FULLSCREEN = ["/chat", "/brain-dump"];

export default function AppShell() {
  const { pathname } = useLocation();
  const isFullscreen = FULLSCREEN.includes(pathname);
  useActiveTimeTracker();

  return (
    <div className="flex flex-col min-h-dvh relative" style={{ background: "var(--bg)" }}>
      {/* Junie ambient — soft warm rainbow */}
      <div className="fixed inset-0 -z-10" style={{ background: "#FFFBF7" }}>
        <div className="junie-blob" style={{ top: -120, right: -80, width: 320, height: 320, background: "#F0925E" }} />
        <div className="junie-blob" style={{ top: 120, left: -100, width: 280, height: 280, background: "#6A9AD9", opacity: 0.35 }} />
        <div className="junie-blob" style={{ bottom: 60, right: -60, width: 260, height: 260, background: "#7BC096", opacity: 0.3 }} />
        <div className="junie-blob" style={{ bottom: -100, left: "30%", width: 280, height: 280, background: "#EC6F6F", opacity: 0.28 }} />
      </div>

      <main
        className="flex-1 mx-auto w-full max-w-[480px]"
        style={{
          overflowY: isFullscreen ? "hidden" : "auto",
          paddingBottom: isFullscreen ? 0 : "104px",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <Outlet />
      </main>

      {/* Bottom nav — light pill */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            aria-label="Hoofdnavigatie"
            className="fixed z-50 left-1/2 -translate-x-1/2"
            style={{
              bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
              width: 340,
              height: 64,
              borderRadius: 32,
              background: "rgba(255, 251, 247, 0.92)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(240, 230, 216, 0.7)",
              boxShadow: "0 12px 40px rgba(45, 42, 58, 0.10), 0 2px 6px rgba(45, 42, 58, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 6px",
            }}
          >
            {NAV.map(({ to, label, icon: NavIcon, color }) => {
              const active =
                pathname === to ||
                (to !== "/home" && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  style={{
                    flex: 1, height: 56,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", position: "relative",
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.84 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    style={{
                      width: active ? 44 : 38,
                      height: active ? 44 : 38,
                      borderRadius: "50%",
                      background: active ? `${color}1F` : "transparent",
                      border: active ? `1.5px solid ${color}55` : "1px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <NavIcon
                      size={20}
                      strokeWidth={active ? 2.4 : 1.8}
                      style={{
                        color: active ? color : "#8A8499",
                        transition: "color 0.22s ease",
                      }}
                    />
                  </motion.div>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute", bottom: 7,
                        width: 4, height: 4, borderRadius: "50%",
                        background: color,
                        boxShadow: `0 0 6px ${color}AA`,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
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