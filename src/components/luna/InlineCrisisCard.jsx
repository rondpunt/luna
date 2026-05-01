import React, { useState } from "react";
import { Phone, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InlineCrisisCard({ onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className="mx-4 my-3 rounded-xl p-4 space-y-3"
      style={{
        background: "var(--bg-elev)",
        borderLeft: "3px solid var(--luna-warn)",
      }}
    >
      <div className="flex items-center justify-between">
        <h4
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary-luna)" }}
        >
          Steun, nu
        </h4>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full transition-colors hover:bg-secondary"
        >
          <X className="w-3.5 h-3.5" style={{ color: "var(--text-muted-luna)" }} />
        </button>
      </div>

      <p className="text-sm" style={{ color: "var(--text-secondary-luna)" }}>
        Het klinkt alsof je het heel zwaar hebt. Je hoeft hier niet alleen door.
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" style={{ color: "var(--luna-warn)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-primary-luna)" }}>
            Zelfmoordlijn 1813
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted-luna)" }}>
            Gratis, anoniem, 24/7
          </span>
        </div>
        <div className="flex gap-2 ml-6">
          <a href="tel:1813">
            <Button size="sm" variant="outline" className="text-xs border-border">Bel</Button>
          </a>
          <a href="https://www.zelfmoord1813.be" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="text-xs border-border">
              <ExternalLink className="w-3 h-3 mr-1" />Chat
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-between ml-6 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "var(--text-primary-luna)" }}>Acuut gevaar — 112</span>
          </div>
          <a href="tel:112">
            <Button size="sm" variant="outline" className="text-xs border-border">Bel</Button>
          </a>
        </div>

        <p className="text-xs ml-6" style={{ color: "var(--text-muted-luna)" }}>
          Onder 18? Awel, 102
        </p>
      </div>
    </div>
  );
}