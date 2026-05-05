import { useNavigate } from "react-router-dom";
import { Orb } from "@/components/luna/Orb";
import { useAuth } from "@/lib/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { navigateToLogin } = useAuth();

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

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => navigateToLogin()}
              className="text-[14px] text-[#8A8278] bg-transparent border-none cursor-pointer underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-md"
              style={{ outlineColor: "rgba(232,131,74,0.45)" }}
            >
              Ik heb al een account
            </button>
          </div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
