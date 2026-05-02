import { Link } from "react-router-dom";
import { ChevronRight, User, Mail, CreditCard, MessageSquare, RefreshCcw, Lock, FileText, HelpCircle } from "lucide-react";
import { Gem } from "lucide-react";
import { t } from "@/lib/i18n";

const accountItems = [
  { icon: User, label: "Bijnaam", value: "n" },
  { icon: Mail, label: "Email", value: "privé@email.be" },
  { icon: CreditCard, label: "Huidig abonnement", value: t.profile.free },
  { icon: MessageSquare, label: "Probleem melden" },
  { icon: RefreshCcw, label: "Aankopen herstellen" },
];

const aboutItems = [
  { icon: Lock, label: "Privacybeleid", to: "/privacy" },
  { icon: FileText, label: "Servicevoorwaarden", to: "/voorwaarden" },
  { icon: HelpCircle, label: "Feedback verzenden", to: "/contact" },
];

export default function Profile() {
  return (
    <div className="px-5 pt-6">
      {/* Paywall hook bovenaan, identiek aan screenshot */}
      <div
        className="rounded-3xl p-5"
        style={{
          background: "linear-gradient(135deg, #e9f5ec 0%, #d6ecdb 100%)",
          border: "1px solid rgba(63,138,85,0.20)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-base font-semibold leading-tight text-[#1a3326]">
              Ontgrendel onbeperkte toegang
            </p>
            <p className="mt-1 text-sm text-[#365a44]">
              Voor ononderbroken ondersteuning 24/7
            </p>
            <Link
              to="/pricing"
              className="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #5cb47a 0%, #3f8a55 100%)" }}
            >
              Nu ontgrendelen
            </Link>
          </div>
          <Gem className="h-14 w-14 text-[#3f8a55]" />
        </div>
      </div>

      {/* Account */}
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-[#5b7a66]">ACCOUNT</p>
      <div
        className="mt-3 overflow-hidden rounded-2xl bg-white"
        style={{ border: "1px solid rgba(63,138,85,0.12)" }}
      >
        {accountItems.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-[rgba(63,138,85,0.08)]" : ""}`}
          >
            <Icon className="h-5 w-5 text-[#1a3326]" />
            <span className="flex-1 text-sm text-[#1a3326]">{label}</span>
            {value && <span className="text-sm text-[#5b7a66]">{value}</span>}
            <ChevronRight className="h-4 w-4 text-[#a8baac]" />
          </div>
        ))}
      </div>

      {/* Over */}
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-[#5b7a66]">OVER</p>
      <div
        className="mt-3 overflow-hidden rounded-2xl bg-white"
        style={{ border: "1px solid rgba(63,138,85,0.12)" }}
      >
        {aboutItems.map(({ icon: Icon, label, to }, i) => (
          <Link
            key={label}
            to={to}
            className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-[rgba(63,138,85,0.08)]" : ""}`}
          >
            <Icon className="h-5 w-5 text-[#1a3326]" />
            <span className="flex-1 text-sm text-[#1a3326]">{label}</span>
            <ChevronRight className="h-4 w-4 text-[#a8baac]" />
          </Link>
        ))}
      </div>

      <p className="mt-6 px-2 text-center text-xs text-muted-foreground">Versie 1.0.0</p>
    </div>
  );
}