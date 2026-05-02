import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, BookOpen, User } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/bibliotheek", icon: BookOpen, label: "Bibliotheek" },
  { path: "/profiel", icon: User, label: "Profiel" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(245,248,255,0.97)",
        borderTop: "1px solid rgba(180,190,220,0.30)",
        backdropFilter: "blur(20px)",
        paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-4 pt-2 pb-1">
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
                  color: isActive ? "#1e7a8c" : "#9aa5be",
                }}
              />
              <span
                className="text-[10px] font-medium"
                style={{
                  color: isActive ? "#1e7a8c" : "#9aa5be",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full" style={{ background: "#1e7a8c" }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}