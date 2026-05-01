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
      className="fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        backgroundColor: "var(--luna-bg-elev)",
        borderColor: "var(--luna-border)",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-4 pt-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 py-1 px-3 transition-all"
            >
              <Icon
                className="w-5 h-5 transition-all"
                style={{
                  color: isActive ? "var(--luna-accent)" : "var(--luna-text-muted)",
                  filter: isActive ? "drop-shadow(0 0 6px rgba(159,134,255,0.6))" : "none",
                }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "var(--luna-accent)" : "var(--luna-text-muted)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}