import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Download, Trash2, AlertTriangle, Sparkles, Brain, ScrollText } from "lucide-react";
import { usePremium } from "@/hooks/usePremium";
import { useMemoryList } from "@/hooks/useMemoryList";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useScrollLock } from "@/hooks/useScrollLock";
import { downloadMarkdownFile, diaryToMarkdown, conversationToMarkdown } from "@/utils/exportLunaData";
import { format, differenceInDays, parseISO } from "date-fns";
import CrisisSheet from "@/components/luna/CrisisSheet";
import { fetchUserPreferencesRow, USER_PREFERENCES_QUERY_KEY } from "@/hooks/useChatSettings";
import { parseOnboardingProfile } from "@/lib/lunaComfortPreferences";

const ONBOARDING_CONCERN_READ = {
  bpd: "Intense emoties (BPD-trekken)",
  adhd: "ADHD-trekken",
  both: "Meerdere thema's (legacy)",
  autism: "Autisme / structuur en prikkels",
  combination: "Meerdere dingen door elkaar",
  unsure: "Nog aan het verkennen",
  other: "Anders / eigen woorden",
};

const AI_STYLE_READ = {
  shorter: "Kortere antwoorden",
  structured: "Meer structuur in antwoorden",
  deeper: "Iets dieper uitgewerkt",
  practical: "Praktisch en concreet",
};

function rhythmSentence(checkIns, user) {
  if (!checkIns?.length) return "Je bent hier voor het eerst. Fijn dat je er bent.";
  const totalWeeks = user?.created_date
    ? Math.ceil(differenceInDays(new Date(), parseISO(user.created_date)) / 7)
    : null;
  const thisWeek = checkIns.filter((c) => differenceInDays(new Date(), parseISO(c.created_date)) < 7).length;
  if (thisWeek >= 5) return "Je maakt hier ruimte voor jezelf. Mooi.";
  if (thisWeek >= 2) return "Je hebt er deze week meerdere keren even bij stilgestaan.";
  if (totalWeeks && totalWeeks >= 4) return `Je bent hier nu meerdere weken. Mooi dat je dat doet.`;
  return "Goed dat je hier bent.";
}

export default function Profiel() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { isPlus } = usePremium();
  const { count: memoryCount } = useMemoryList();
  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkins-profiel"],
    queryFn: () => base44.entities.CheckIn.list("-created_date", 100),
  });
  const { data: userPrefs } = useQuery({
    queryKey: USER_PREFERENCES_QUERY_KEY,
    queryFn: fetchUserPreferencesRow,
    staleTime: 60_000,
  });
  const comfortProfile = useMemo(
    () =>
      parseOnboardingProfile(
        typeof userPrefs?.onboarding_profile === "string" ? userPrefs.onboarding_profile : null,
      ),
    [userPrefs?.onboarding_profile],
  );
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  useDocumentTitle("Profiel");
  const [crisisSheetOpen, setCrisisSheetOpen] = useState(false);
  useScrollLock(showDeleteConfirm || changelogOpen || crisisSheetOpen);

  const rawName = user?.full_name || "";
  const name = rawName.length > 1 ? rawName : (user?.email?.split("@")[0] || "Jij");
  const email = user?.email || "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    await base44.auth.logout();
  };

  const handleExport = async () => {
    if (!isPlus) return;
    try {
      const convs = await base44.entities.Conversation.list("-created_date", 15).catch(() => []);
      const lines = ["# Luna export — gesprekken", ""];
      for (const c of convs || []) {
        const msgs = await base44.entities.Message.filter({ conversation_id: c.id }).catch(() => []);
        const sorted = [...msgs].sort((a, b) => Date.parse(String(a.created_date)) - Date.parse(String(b.created_date)));
        lines.push(conversationToMarkdown(c.title || "Gesprek", sorted.map((m) => ({ role: m.role, content: m.content }))));
        lines.push("\n---\n\n");
      }
      downloadMarkdownFile(`luna-gesprekken-${format(new Date(), "yyyy-MM-dd")}.md`, lines.join("\n"));
    } catch { /* ignore */ }
  };

  const handleExportDiary = async () => {
    if (!isPlus) return;
    try {
      const entries = await base44.entities.DiaryEntry.list("-date", 30).catch(() => []);
      const md = ["# Luna export — dagboek", "", ...(entries || []).map((e) => diaryToMarkdown({
        date: e.date,
        notes: e.notes,
        emotions: { verdriet: e.sadness, schaamte: e.shame, angst: e.fear, boos: e.anger, vreugde: e.joy },
      }))].join("\n\n---\n\n");
      downloadMarkdownFile(`luna-dagboek-${format(new Date(), "yyyy-MM-dd")}.md`, md);
    } catch { /* ignore */ }
  };

  return (
    <div className="fade-in luna-page pb-10">
      <details
        id="luna-nood-profiel"
        className="surface"
        style={{ padding: "var(--space-2) 20px", marginBottom: "var(--space-3)", borderRadius: 16 }}
      >
        <summary
          style={{
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 500,
            color: "var(--text-muted)",
            listStyle: "none",
          }}
          className="[&::-webkit-details-marker]:hidden"
        >
          Ik voel me onveilig
        </summary>
        <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 12, lineHeight: 1.5 }}>
          Als je direct gevaar loopt of iemand anders in gevaar is, bel 112. Voor luisteren en verwijzing: onderaan vind je nummers.
        </p>
        <button
          type="button"
          className="btn btn-ghost-crisis press"
          style={{ marginTop: 14, fontSize: 14, width: "100%" }}
          onClick={() => setCrisisSheetOpen(true)}
        >
          Steunnummers openen
        </button>
      </details>

      {/* Profile header — eyebrow + titel, meer lucht */}
      <div style={{ marginBottom: "var(--space-4)" }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>
          Jouw profiel
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              flexShrink: 0,
              background: "#14141E",
              border: "1px solid rgba(232,131,74,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="font-display" style={{ fontSize: 20, color: "#E8834A" }}>
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <p
              className="font-display truncate"
              style={{ fontSize: 26, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              {name}
            </p>
            <p className="truncate" style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Abonnement */}
      <div className="surface" style={{ padding: 24, marginBottom: 24 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>ABONNEMENT</p>
        {isPlus ? (
          <>
            <p className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>
              Luna Plus
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>
              Onbeperkt chatten, langere context, export en geheugenbeheer.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-faint)" }}>Actieve herinneringen: {memoryCount}</p>
          </>
        ) : (
          <>
            <p className="font-display" style={{ fontSize: 32, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>
              Gratis
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
              {10} berichten per dag.
            </p>
            <Link to="/pricing">
              <button type="button" className="btn btn-primary press" style={{ fontSize: 15 }}>
                Upgrade naar Luna Plus
              </button>
            </Link>
            <p style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center", marginTop: 8 }}>
              €9,99/maand. Maandelijks opzegbaar.
            </p>
          </>
        )}
      </div>

      {/* Plus routes & changelog */}
      <div className="surface" style={{ padding: 0, marginBottom: 24, overflow: "hidden" }}>
        <Link to="/geheugen" style={{ textDecoration: "none" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500, color: "var(--text)" }}>
              <Brain size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} /> Geheugen
            </span>
            <ChevronRight size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
          </div>
        </Link>
        <Link to="/inzichten" style={{ textDecoration: "none" }}>
          <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500, color: "var(--text)" }}>
              <Sparkles size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} /> Inzichten
            </span>
            <ChevronRight size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setChangelogOpen(true)}
          className="btn-press w-full text-left"
          style={{ height: 56, display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500, color: "var(--text)" }}>
            <ScrollText size={18} style={{ color: "#E8834A" }} strokeWidth={1.5} /> Wat is nieuw
          </span>
          <ChevronRight size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
        </button>
      </div>

      {/* Onboarding-samenvatting (read-only) */}
      {userPrefs?.onboardingCompleted && (
        <div className="surface" style={{ padding: "20px 24px", marginBottom: 24 }}>
          <p className="eyebrow-muted" style={{ marginBottom: 12 }}>PERSONALISATIE</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 12 }}>
            Wat je bij de start koos — later kun je dit breder uitbreiden in de app.
          </p>
          <ul style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.65, margin: 0, paddingLeft: 18 }}>
            {userPrefs.concern && (
              <li>
                <span style={{ color: "var(--text-muted)" }}>Herkenning: </span>
                {ONBOARDING_CONCERN_READ[userPrefs.concern] || userPrefs.concern}
              </li>
            )}
            {userPrefs.aiResponseStyle && (
              <li>
                <span style={{ color: "var(--text-muted)" }}>Chatstijl: </span>
                {AI_STYLE_READ[userPrefs.aiResponseStyle] || userPrefs.aiResponseStyle}
              </li>
            )}
            <li>
              <span style={{ color: "var(--text-muted)" }}>Antwoordvorm: </span>
              {comfortProfile.replyShape === "structured" ? "met meer structuur" : "kort"}
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>Toon: </span>
              {comfortProfile.communicationDirectness === "direct" ? "directer" : "zachter"}
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>Minder ‘feest’-feedback: </span>
              {comfortProfile.fewerCelebrations ? "ja" : "nee"}
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>Extra sobere modus: </span>
              {comfortProfile.plainMode ? "ja" : "nee"}
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>Rustiger scherm: </span>
              {userPrefs.calmUi || comfortProfile.calmPalette ? "ja" : "nee"}
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>Minder animatie: </span>
              {userPrefs.reduceMotionUi || comfortProfile.reduceAnimations ? "ja" : "nee"}
            </li>
            {Array.isArray(userPrefs.goals) && userPrefs.goals.length > 0 && (
              <li>
                <span style={{ color: "var(--text-muted)" }}>Doelen: </span>
                {userPrefs.goals.slice(0, 6).join(" · ")}
                {userPrefs.goals.length > 6 ? "…" : ""}
              </li>
            )}
            {Array.isArray(userPrefs.primary_moods) && userPrefs.primary_moods.length > 0 && (
              <li>
                <span style={{ color: "var(--text-muted)" }}>Stemming bij start: </span>
                {userPrefs.primary_moods.slice(0, 5).join(", ")}
                {userPrefs.primary_moods.length > 5 ? "…" : ""}
              </li>
            )}
            {Array.isArray(userPrefs.preferred_moments) && userPrefs.preferred_moments.length > 0 && (
              <li>
                <span style={{ color: "var(--text-muted)" }}>Momenten: </span>
                {userPrefs.preferred_moments.join(", ")}
              </li>
            )}
            {userPrefs.notificationTime && userPrefs.notificationTime !== "none" && (
              <li>
                <span style={{ color: "var(--text-muted)" }}>Herinnering: </span>
                rond {userPrefs.notificationTime}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Jouw ritme */}
      <div className="surface" style={{ padding: "20px 24px", marginBottom: 24 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>JOUW RITME</p>
        <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>
          {rhythmSentence(checkIns, user)}
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
          Geen score. Geen druk. Gewoon: dat je er bent.
        </p>
      </div>

      {/* Privacy & data */}
      <div className="surface" style={{ padding: 24, marginBottom: 24 }}>
        <p className="eyebrow-muted" style={{ marginBottom: 12 }}>JE DATA & PRIVACY</p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
          Onder GDPR heb je altijd recht op inzage, export en verwijdering. Alles wat je hier zegt is end-to-end versleuteld. Niemand kan het lezen — wij ook niet. Geen tracking. Geen ads.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            className="btn btn-ghost press"
            style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8, opacity: isPlus ? 1 : 0.45 }}
            onClick={handleExport}
            disabled={!isPlus}
            title={!isPlus ? "Export is onderdeel van Luna Plus" : undefined}
          >
            <Download size={16} strokeWidth={1.5} />
            Export gesprekken (markdown)
          </button>
          <button
            type="button"
            className="btn btn-ghost press"
            style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8, opacity: isPlus ? 1 : 0.45 }}
            onClick={handleExportDiary}
            disabled={!isPlus}
            title={!isPlus ? "Export is onderdeel van Luna Plus" : undefined}
          >
            <Download size={16} strokeWidth={1.5} />
            Export dagboek (markdown)
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-ghost-crisis press"
            style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}
          >
            <Trash2 size={16} strokeWidth={1.5} />
            Wis dit account
          </button>
        </div>
      </div>

      {/* Legal */}
      <p className="eyebrow-muted" style={{ marginBottom: 8, paddingLeft: 4 }}>JURIDISCH</p>
      <div className="surface" style={{ padding: 0, marginBottom: 24, overflow: "hidden" }}>
        {[
          { label: "Privacybeleid", to: "/privacy" },
          { label: "Algemene voorwaarden", to: "/voorwaarden" },
          { label: "Contact", to: "/contact" },
        ].map((item, i, arr) => (
          <Link key={item.label} to={item.to} style={{ textDecoration: "none" }}>
            <div
              style={{
                height: 56, display: "flex", alignItems: "center",
                padding: "0 20px", justifyContent: "space-between",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{item.label}</span>
              <ChevronRight size={16} style={{ color: "var(--text-faint)" }} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="btn btn-ghost"
        style={{
          fontSize: 15, color: "var(--text-muted)",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#D14D4D"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
      >
        {loggingOut ? "Even geduld…" : "Uitloggen"}
      </button>

      {crisisSheetOpen && <CrisisSheet onClose={() => setCrisisSheetOpen(false)} />}

      {/* Delete confirm modal */}

      {changelogOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] cursor-default border-0 p-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            aria-label="Sluit changelog"
            onClick={() => setChangelogOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-[70] fade-up"
            style={{
              background: "#14141E",
              borderRadius: "28px 28px 0 0",
              padding: "28px 24px calc(36px + env(safe-area-inset-bottom, 0px))",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 20px" }} />
            <h3 className="font-display" style={{ fontSize: 22, color: "var(--text)", marginBottom: 12 }}>Changelog</h3>
            <ul style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65, paddingLeft: 18, margin: 0 }}>
              <li>Luna Plus: onbeperkt chatten, tokens, export markdown.</li>
              <li>Nieuwe routes: Inzichten, Geheugen.</li>
              <li>Onboarding uitgebreid met doelen, privacy, Plus-pitch.</li>
              <li>Sneltoetsen: Ctrl of ⌘ + /</li>
            </ul>
            <button type="button" className="btn btn-primary press w-full mt-6" style={{ fontSize: 14 }} onClick={() => setChangelogOpen(false)}>
              Sluiten
            </button>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-[70] fade-up"
            style={{
              background: "#14141E",
              borderRadius: "28px 28px 0 0",
              padding: "32px 24px calc(40px + env(safe-area-inset-bottom, 0px))",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 24px" }} />
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <AlertTriangle size={28} style={{ color: "#D14D4D", marginBottom: 12 }} strokeWidth={1.5} />
            </div>
            <h3
              className="font-display"
              style={{ fontSize: 24, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}
            >
              Account wissen?
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 8 }}>
              Dit verwijdert direct alles. Geen herstel mogelijk.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 24 }}>
              Al je gesprekken, dagboeknotities en check-ins worden permanent gewist.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost press" style={{ flex: 1, fontSize: 14 }}>
                Annuleren
              </button>
              <button
                className="btn press"
                style={{
                  flex: 1, fontSize: 14,
                  background: "var(--crisis-soft)",
                  border: "1px solid var(--crisis-border)",
                  color: "#D14D4D",
                  borderRadius: "var(--r-pill)",
                }}
              >
                Definitief wissen
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
