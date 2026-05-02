import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, Mic, BookHeart, BarChart3, User } from "lucide-react";
import { t } from "@/lib/i18n";
import NoraLogo from "@/components/nora/NoraLogo";

const items = [
  { to: "/", label: t.nav.home, icon: Home },
  { to: "/chat", label: t.nav.chat, icon: MessageCircle },
  { to: "/voice", label: t.nav.voice, icon: Mic },
  { to: "/journal", label: t.nav.journal, icon: BookHeart },
  { to: "/insights", label: t.nav.insights, icon: BarChart3 },
  { to: "/profile", label: t.nav.profile, icon: User },
];

export default function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-[rgba(63,138,85,0.10)] bg-[rgba(244,249,245,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <NoraLogo className="h-7 w-7" />
            <span className="text-base font-semibold text-[#1a3326]">Nora</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl pb-28">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[rgba(63,138,85,0.12)] bg-white/90 backdrop-blur-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto grid max-w-md grid-cols-6 px-2 pt-2">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-0.5 py-2"
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: active ? "#3f8a55" : "#8aa294" }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: active ? "#3f8a55" : "#8aa294" }}
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