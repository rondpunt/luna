import { Outlet, Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, MessageCircle, Zap, User } from "lucide-react";
import CrisisButton from "@/components/luna/CrisisButton";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/home",    label: "Home",    icon: HomeIcon },
  { to: "/chat",    label: "Chat",    icon: MessageCircle },
  { to: "/reflex",  label: "Reflex",  icon: Zap },
  { to: "/profiel", label: "Profiel", icon: User },
];

const NO_CRISIS = ["/landing", "/onboarding"];
const FULLSCREEN = ["/chat"];

export default function AppShell() {
  const { pathname } = useLocation();
  const isFullscreen = FULLSCREEN.includes(pathname);
  const showCrisis = !NO_CRISIS.some((p) => pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-dvh relative" style={{ background: "var(--bg)" }}>
      {/* Atelier ambient background — aubergine bloom + champagne whisper */}
      <div className="fixed inset-0 -z-10" style={{ background: "#0E0B14" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 90% 50% at 50% -5%, rgba(61,42,77,0.55), transparent 60%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 50% at 85% 35%, rgba(212,175,137,0.05), transparent 70%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 15% 95%, rgba(61,42,77,0.18), transparent 70%)",
        }} />
        {/* Film grain */}
        <div className="absolute inset-0" style={{
          opacity: 0.025,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }} />
      </div>

      {showCrisis && !isFullscreen && <CrisisButton />}

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

      {/* Bottom nav — refined pill */}
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
              width: 296,
              height: 64,
              borderRadius: 32,
              background: "rgba(20, 14, 28, 0.85)",
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: "1px solid rgba(242, 237, 228, 0.08)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,137,0.04) inset",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 6px",
            }}
          >
            {NAV.map(({ to, label, icon: NavIcon }) => {
              const active =
                pathname === to ||
                (to !== "/home" && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  style={{
                    width: 56, height: 56,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", flexShrink: 0, position: "relative",
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.84 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    style={{
                      width: active ? 44 : 38,
                      height: active ? 44 : 38,
                      borderRadius: "50%",
                      background: active ? "rgba(212,175,137,0.13)" : "transparent",
                      border: active ? "1px solid rgba(212,175,137,0.28)" : "1px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <NavIcon
                      size={20}
                      strokeWidth={active ? 2.1 : 1.5}
                      style={{
                        color: active ? "#D4AF89" : "rgba(242,237,228,0.32)",
                        transition: "color 0.22s ease",
                        filter: active ? "drop-shadow(0 0 8px rgba(212,175,137,0.5))" : "none",
                      }}
                    />
                  </motion.div>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute", bottom: 7,
                        width: 4, height: 4, borderRadius: "50%",
                        background: "#D4AF89",
                        boxShadow: "0 0 8px rgba(212,175,137,0.9)",
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