import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Orb } from "@/components/luna/Orb";

export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => base44.auth.redirectToLogin(window.location.origin + "/home");

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ background: "#0B0B14" }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 -z-10" style={{ background: "#0B0B14" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,131,74,0.08), transparent 60%)",
            opacity: 0.6,
          }}
        />
      </div>

      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Spacer top */}
        <div style={{ flex: "0 0 20vh" }} />

        {/* Orb */}
        <div className="fade-in" style={{ animationDelay: "0s" }}>
          <Orb size="xl" />
        </div>

        {/* H1 */}
        <h1
          className="font-display fade-up text-center"
          style={{
            fontSize: 48,
            color: "#F2EDE3",
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            marginTop: 64,
            animationDelay: "0.2s",
          }}
        >
          Hallo, ik ben Luna.
        </h1>

        {/* Subtitle */}
        <p
          className="fade-up text-center"
          style={{
            fontSize: 16,
            color: "#8A8278",
            marginTop: 16,
            lineHeight: 1.55,
            maxWidth: 280,
            animationDelay: "0.4s",
          }}
        >
          Een rustige plek om te voelen, te denken, te zijn.
        </p>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 40 }} />

        {/* CTA */}
        <div
          className="w-full fade-up"
          style={{ maxWidth: 280, animationDelay: "0.7s" }}
        >
          <button
            onClick={() => navigate("/onboarding")}
            className="btn btn-primary press"
            style={{ fontSize: 16, fontWeight: 500 }}
          >
            Begin
          </button>

          <button
            onClick={handleLogin}
            className="btn btn-ghost press"
            style={{ fontSize: 15, marginTop: 12, gap: 10 }}
          >
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#F2EDE3", color: "#11131A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>G</span>
            Verder met Google of e-mail
          </button>

          <div style={{ marginTop: 18, textAlign: "center" }}>
            <button
              onClick={() => navigate("/pricing")}
              style={{
                fontSize: 14,
                color: "#8A8278",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
            >
              Bekijk Luna Plus
            </button>
          </div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}