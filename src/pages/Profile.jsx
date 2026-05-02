import { Link } from "react-router-dom";
import { ChevronRight, User, Mail, CreditCard, MessageSquare, RefreshCcw, Lock, FileText, HelpCircle, Gem } from "lucide-react";
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
      <div
        className="rounded-3xl p-5"
        style={{
          background: "linear-gradient(135deg, #fbe4d6 0%, #f6d0bb 100%)",
          border: "1px solid rgba(194,90,50,0.20)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-base font-semibold leading-tight text-[#3d1f12]">
              Ontgrendel onbeperkte toegang
            </p>
            <p className="mt-1 text-sm text-[#7a3a20]">
              Voor ononderbroken ondersteuning 24/7
            </p>
            <Link
              to="/pricing"
              className="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #ee9670 0%, #c25a32 100%)" }}
            >
              Nu ontgrendelen
            </Link>
          </div>
          <Gem className="h-14 w-14 text-[#c25a32]" />
        </div>
      </div>

      <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-[#9c6a52]">ACCOUNT</p>
      <div
        className="mt-3 overflow-hidden rounded-2xl bg-white"
        style={{ border: "1px solid rgba(194,90,50,0.12)" }}
      >
        {accountItems.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-[rgba(194,90,50,0.08)]" : ""}`}
          >
            <Icon className="h-5 w-5 text-[#3d1f12]" />
            <span className="flex-1 text-sm text-[#3d1f12]">{label}</span>
            {value && <span className="text-sm text-[#9c6a52]">{value}</span>}
            <ChevronRight className="h-4 w-4 text-[#cbb0a0]" />
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-[#9c6a52]">OVER</p>
      <div
        className="mt-3 overflow-hidden rounded-2xl bg-white"
        style={{ border: "1px solid rgba(194,90,50,0.12)" }}
      >
        {aboutItems.map(({ icon: Icon, label, to }, i) => (
          <Link
            key={label}
            to={to}
            className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-[rgba(194,90,50,0.08)]" : ""}`}
          >
            <Icon className="h-5 w-5 text-[#3d1f12]" />
            <span className="flex-1 text-sm text-[#3d1f12]">{label}</span>
            <ChevronRight className="h-4 w-4 text-[#cbb0a0]" />
          </Link>
        ))}
      </div>

      <p className="mt-6 px-2 text-center text-xs text-muted-foreground">Versie 1.0.0</p>
    </div>
  );
}