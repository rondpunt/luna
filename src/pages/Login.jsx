import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Orb } from "@/components/luna/Orb";

/**
 * Triggers Base44 hosted login redirect. Kept as a route so /login deep links work.
 */
export default function Login() {
  const { navigateToLogin } = useAuth();

  useEffect(() => {
    navigateToLogin();
  }, [navigateToLogin]);

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 fade-in"
      style={{ background: "var(--bg)" }}
    >
      <Orb size="md" />
      <p className="mt-8 text-center text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Je wordt doorgestuurd naar inloggen…
      </p>
    </div>
  );
}
