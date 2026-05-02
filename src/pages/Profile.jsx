import { Link } from "react-router-dom";
import SectionCard from "@/components/nora/SectionCard";
import { t } from "@/lib/i18n";

export default function Profile() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">{t.profile.eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t.profile.title}</h1>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <SectionCard>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">N</div>
            <div>
              <p className="text-lg font-medium text-foreground">Nora-gebruiker</p>
              <p className="text-sm text-muted-foreground">privé@email.be</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {t.profile.settings.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-4 text-sm">
                <span className="text-foreground">{label}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard className="bg-primary/5">
            <p className="text-sm font-medium text-foreground">{t.profile.plan}</p>
            <p className="mt-2 text-2xl font-semibold">{t.profile.free}</p>
            <Link to="/pricing" className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              {t.profile.upgrade}
            </Link>
          </SectionCard>
          <SectionCard>
            <p className="text-sm font-medium text-foreground">{t.profile.privacyCenter}</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <Link to="/privacy-center" className="block rounded-2xl bg-secondary px-4 py-4">{t.profile.memoryControls}</Link>
              <Link to="/privacy-center" className="block rounded-2xl bg-secondary px-4 py-4">{t.profile.exportData}</Link>
              <Link to="/privacy-center" className="block rounded-2xl bg-secondary px-4 py-4">{t.profile.deleteAccount}</Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}