import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ConsoleOnboarding from "@/pages/ConsoleOnboarding";
import { base44 } from "@/api/base44Client";

export default function OnboardingGate() {
  const [state, setState] = useState("loading");

  useEffect(() => {
    const check = async () => {
      try {
        const user = await base44.auth.me();
        const rows = user ? await base44.entities.UserSelectedTags.filter({ userId: user.id }, "-created_date", 1) : [];
        const enoughTags = rows?.[0]?.tags?.length >= 2;
        setState(enoughTags ? "home" : "onboarding");
      } catch {
        setState("onboarding");
      }
    };
    check();
  }, []);

  if (state === "loading") return <div className="min-h-dvh" style={{ background: "#FFFBF7" }} />;
  if (state === "onboarding") return <ConsoleOnboarding />;
  return <Navigate to="/home" replace />;
}