import { useState, useEffect } from "react";
import LunaMoon from "./LunaMoon";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [dismissCount, setDismissCount] = useState(() => {
    return parseInt(localStorage.getItem("luna_install_dismiss") || "0");
  });

  useEffect(() => {
    if (dismissCount >= 2) return;
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissCount]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    const newCount = dismissCount + 1;
    setDismissCount(newCount);
    localStorage.setItem("luna_install_dismiss", String(newCount));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-[72px] left-3 right-3 z-50 rounded-2xl p-4 flex items-center gap-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <LunaMoon size={32} state="idle" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.92)", fontFamily: "'DM Sans', sans-serif" }}>
          LUNA op je beginscherm
        </p>
        <p className="text-[11px] leading-tight mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
          Altijd bij de hand, geen browser, geen afleiding.
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-lg text-xs"
          style={{
            color: "rgba(255,255,255,0.40)",
            background: "transparent",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Nu niet
        </button>
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: "#6366f1",
            color: "#fff",
            boxShadow: "0 0 12px rgba(99,102,241,0.4)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Installeer
        </button>
      </div>
    </div>
  );
}