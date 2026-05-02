import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, TrendingUp, User } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/voortgang", icon: TrendingUp, label: "Voortgang" },
  { path: "/profiel", icon: User, label: "Profiel" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(5,8,20,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Crisis strip */}
      <div className="flex justify-center pt-2 pb-1">
        <a
          href="tel:080032123"
          className="px-3 py-0.5 rounded-full text-[10px] tracking-wide"
          style={{
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.18)",
            color: "rgba(248,113,113,0.80)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          0800 32 123 · 106
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-around max-w-md mx-auto px-4 pt-1 pb-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive =
            location.pathname === path ||
            (path === "/home" && location.pathname === "/");
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <Icon
                className="w-[22px] h-[22px] transition-all"
                style={{
                  color: isActive ? "#818cf8" : "rgba(255,255,255,0.35)",
                  filter: isActive ? "drop-shadow(0 0 6px rgba(129,140,248,0.5))" : "none",
                }}
              />
              <span
                className="text-[10px] font-medium"
                style={{
                  color: isActive ? "#818cf8" : "rgba(255,255,255,0.35)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </span>
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ background: "#818cf8" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}