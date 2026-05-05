import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Phone, ExternalLink } from "lucide-react";

export default function CrisisHelpSheet({ trigger }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-t"
        style={{
          background: "var(--bg-elev-2)",
          borderColor: "var(--luna-border)",
        }}
      >
        <SheetHeader>
          <SheetTitle
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary-luna)" }}
          >
            Steun, nu
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Main crisis lines */}
          <div className="space-y-3">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary-luna)" }}
            >
              Praat met iemand
            </p>

            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                background: "var(--bg-elev)",
                borderLeft: "3px solid var(--luna-warn)",
              }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: "var(--luna-warn)" }} />
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-primary-luna)" }}
                  >
                    Zelfmoordlijn 1813
                  </span>
                </div>
                <p
                  className="text-xs mt-1 ml-6"
                  style={{ color: "var(--text-muted-luna)" }}
                >
                  Gratis, anoniem, 24/7
                </p>
              </div>
              <div className="flex gap-2 ml-6">
                <a href="tel:1813">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-border"
                  >
                    Bel 1813
                  </Button>
                </a>
                <a
                  href="https://www.zelfmoord1813.be"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-border"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open chat
                  </Button>
                </a>
              </div>
            </div>

            <div
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: "var(--bg-elev)" }}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: "var(--luna-warn)" }} />
                <span style={{ color: "var(--text-primary-luna)" }}>
                  Acuut gevaar — 112
                </span>
              </div>
              <a href="tel:112">
                <Button size="sm" variant="outline" className="text-xs border-border">
                  Bel 112
                </Button>
              </a>
            </div>

            <div
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: "var(--bg-elev)" }}
            >
              <div>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary-luna)" }}
                >
                  Onder 18? — Awel
                </span>
              </div>
              <a href="tel:102">
                <Button size="sm" variant="outline" className="text-xs border-border">
                  Bel 102
                </Button>
              </a>
            </div>
          </div>

          {/* What Luna can't do */}
          <div className="pt-2 border-t" style={{ borderColor: "var(--luna-border)" }}>
            <a
              href="/voorwaarden"
              className="text-xs flex items-center gap-1 transition-colors"
              style={{ color: "var(--text-muted-luna)" }}
            >
              <ExternalLink className="w-3 h-3" />
              Wat Luna niet kan
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}