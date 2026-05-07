import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert, Lock, Sparkles, FileText, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SelfTestCard from "@/components/selftests/SelfTestCard";

const TESTS = [
  { name: "PHQ-9", area: "Depressieve klachten", description: "Veelgebruikte screening voor depressieve symptomen in de voorbije twee weken.", url: "https://www.phqscreeners.com/select-screener" },
  { name: "GAD-7", area: "Angst", description: "Korte screening voor gegeneraliseerde angstklachten.", url: "https://www.phqscreeners.com/select-screener" },
  { name: "DASS-21", area: "Depressie, angst en stress", description: "Meet drie stressgerelateerde domeinen tegelijk, handig als klachten door elkaar lopen.", url: "https://maic.qld.gov.au/wp-content/uploads/2016/07/DASS-21.pdf" },
  { name: "K10", area: "Psychische spanning", description: "Algemene maat voor psychische belasting en distress.", url: "https://www.worksafe.qld.gov.au/__data/assets/pdf_file/0010/22240/kessler-psychological-distress-scale-k101.pdf" },
  { name: "ASRS v1.1", area: "ADHD bij volwassenen", description: "WHO-screening voor volwassen ADHD-symptomen.", url: "https://www.hcp.med.harvard.edu/ncs/ftpdir/adhd/6Q_ASRS_English.pdf" },
  { name: "PCL-5", area: "PTSS", description: "Screening voor posttraumatische stressklachten volgens DSM-5-symptomen.", url: "https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp" },
  { name: "MDQ", area: "Bipolaire kenmerken", description: "Screening voor hypomanie/manie-achtige patronen. Geen diagnose op zichzelf.", url: "https://ibpf.org/wp-content/uploads/2016/11/MDQ.pdf" },
  { name: "AQ-10", area: "Autisme-screening", description: "Korte volwassenen-screening voor autistische trekken.", url: "https://docs.autismresearchcentre.com/tests/AQ10.pdf" },
  { name: "RAADS-R", area: "Autistische trekken", description: "Uitgebreidere zelfrapportage rond autisme bij volwassenen.", url: "https://embrace-autism.com/raads-r/" },
  { name: "OCI-R", area: "Dwangklachten", description: "Screening voor obsessief-compulsieve klachten en rituelen.", url: "https://www.div12.org/wp-content/uploads/2015/07/OCI-R.pdf" },
  { name: "SCOFF", area: "Eetstoornis-signalen", description: "Zeer korte screening voor mogelijke eetstoornisproblemen.", url: "https://www.mdcalc.com/calc/1725/scoff-questionnaire-eating-disorders" },
  { name: "AUDIT", area: "Alcoholgebruik", description: "WHO-vragenlijst om risicovol alcoholgebruik in kaart te brengen.", url: "https://auditscreen.org/" },
  { name: "AUDIT-C", area: "Alcoholgebruik kort", description: "Korte versie van AUDIT voor eerste inschatting van alcoholrisico.", url: "https://www.hepatitisc.uw.edu/page/clinical-calculators/audit-c" },
  { name: "DUDIT", area: "Druggebruik", description: "Screening voor risicovol of problematisch druggebruik.", url: "https://www.emcdda.europa.eu/drugs-library/drug-use-disorders-identification-test-dudit_en" },
  { name: "BSL-23", area: "Borderline-kenmerken", description: "Zelfrapportage rond borderline-gerelateerde klachten en emotionele instabiliteit.", url: "https://www.borderline-personality-disorder.org/wp-content/uploads/2011/08/BSL-23-English.pdf" },
  { name: "DES-II", area: "Dissociatie", description: "Screening voor dissociatieve ervaringen zoals vervreemding of tijd kwijt zijn.", url: "http://traumadissociation.com/des" },
  { name: "ISI", area: "Slapeloosheid", description: "Insomnia Severity Index voor ernst van slaapproblemen.", url: "https://www.ons.org/sites/default/files/InsomniaSeverityIndex_ISI.pdf" },
  { name: "PSS", area: "Ervaren stress", description: "Perceived Stress Scale voor hoe belastend het leven recent aanvoelt.", url: "https://www.das.nh.gov/wellness/docs/percieved%20stress%20scale.pdf" },
  { name: "SPIN", area: "Sociale angst", description: "Screening voor sociale angst en vermijding.", url: "https://psychology-tools.com/test/spin" },
  { name: "EPDS", area: "Zwangerschap/postpartum", description: "Screening voor depressieve klachten tijdens zwangerschap of na bevalling.", url: "https://www.sadag.org/images/brochures/edinburghscale.pdf" }
];

export default function SelfTests() {
  const navigate = useNavigate();

  const handleLogin = () => base44.auth.redirectToLogin(window.location.href);

  return (
    <div className="fade-in px-6" style={{ paddingTop: "calc(32px + env(safe-area-inset-top, 0px))", paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 20, display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span style={{ fontSize: 14 }}>Terug</span>
      </button>

      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>ZELFTESTEN</p>
        <h1 className="font-display" style={{ fontSize: 36, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Screenings, geen diagnoses.
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6 }}>
          Deze links helpen patronen herkennen. Bespreek opvallende scores altijd met een arts, psycholoog of therapeut.
        </p>
      </div>

      <div className="surface" style={{ padding: 18, marginBottom: 18, borderColor: "rgba(232,131,74,0.22)", background: "rgba(232,131,74,0.05)" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <ShieldAlert size={18} style={{ color: "#E8834A", flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Bij acute nood of gevaar: bel 112. Bij zelfmoordgedachten in België: Zelfmoordlijn 1813 of Tele-Onthaal 106.
          </p>
        </div>
      </div>

      <div style={{ padding: 22, marginBottom: 18, borderRadius: 24, background: "linear-gradient(145deg, rgba(232,131,74,0.12), rgba(242,237,227,0.04))", border: "1px solid rgba(232,131,74,0.28)", boxShadow: "0 24px 70px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(232,131,74,0.12)", border: "1px solid rgba(232,131,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={16} style={{ color: "#E8834A" }} strokeWidth={1.8} />
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 2 }}>LUNA PLUS</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Premium zelftesten</p>
          </div>
        </div>
        <h2 className="font-display" style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 10 }}>
          Meer dan alleen een link.
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 18 }}>
          Met Plus krijg je scores opgeslagen in Luna, zachte AI-duiding, trends doorheen de tijd en een export voor je therapeut.
        </p>
        <div style={{ display: "grid", gap: 9, marginBottom: 18 }}>
          {[
            { icon: Sparkles, text: "AI-uitleg zonder diagnose-taal" },
            { icon: TrendingUp, text: "Verloop en patronen per test" },
            { icon: FileText, text: "PDF-bundel voor therapie" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text)", fontSize: 13 }}>
              <item.icon size={15} style={{ color: "#E8834A", flexShrink: 0 }} strokeWidth={1.8} />
              {item.text}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <button onClick={() => navigate("/pricing")} className="btn btn-primary press" style={{ fontSize: 15 }}>Bekijk Premium</button>
          <button onClick={handleLogin} className="btn btn-ghost press" style={{ fontSize: 15, gap: 10 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#F2EDE3", color: "#11131A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>G</span>
            Verder met Google of e-mail
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TESTS.map((test) => <SelfTestCard key={test.name} test={test} />)}
      </div>
    </div>
  );
}