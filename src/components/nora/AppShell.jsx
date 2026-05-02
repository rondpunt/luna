import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, Mic, BookHeart, BarChart3, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/voice", label: "Voice", icon: Mic },
  { to: "/journal", label: "Journal", icon: BookHeart },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <aside className="hidden md:flex md:w-72 md:flex-col md:justify-between md:border-r md:border-border/60 md:bg-card/70 md:backdrop-blur-xl">
        <div className="p-6">
          <div className="mb-8 rounded-3xl border border-border/60 bg-background/70 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Nora</p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">A private place to feel heard.</h1>
          </div>
          <nav className="space-y-2">
            {items.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 to-accent/10 p-5">
            <p className="text-sm font-medium text-foreground">Need urgent help?</p>
            <p className="mt-2 text-sm text-muted-foreground">If you're in immediate danger or thinking about harming yourself, contact local emergency support right away.</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-6 px-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] pt-2">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className="flex flex-col items-center gap-1 rounded-2xl py-2">
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[11px] ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}