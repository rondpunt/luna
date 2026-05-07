import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", backgroundColor: "#FFFFFF" },
  header: { marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#E5E5E5" },
  h1: { fontSize: 20, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  h2: { fontSize: 13, marginTop: 20, marginBottom: 8, fontFamily: "Helvetica-Bold", color: "#333" },
  body: { lineHeight: 1.6, marginBottom: 5, color: "#333" },
  meta: { color: "#888", fontSize: 9, marginBottom: 3 },
  accent: { color: "#C06030", fontFamily: "Helvetica-Bold" },
  disclaimer: { marginTop: 32, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#E5E5E5", fontSize: 8, color: "#999", lineHeight: 1.5 },
  bullet: { marginLeft: 12, marginBottom: 4, lineHeight: 1.5, color: "#444" },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  statBox: { flex: 1, padding: 10, backgroundColor: "#F8F8F8", borderRadius: 6 },
  statValue: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#333", marginBottom: 2 },
  statLabel: { fontSize: 8, color: "#888" },
});

export function TherapistReportDoc({ profile, period, data = {}, narrative = {} }) {
  const emotionAvg = data.emotionAvg || {};
  const emotionDelta = data.emotionDelta || {};
  const urges = data.urges || {};
  const skills = data.skills || [];

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.h1}>LUNA — Therapeut-export</Text>
          <Text style={styles.meta}>Gebruiker: {profile.display_name || "Anoniem"}</Text>
          <Text style={styles.meta}>Periode: {period.start} tot {period.end}</Text>
          <Text style={styles.meta}>Gegenereerd: {new Date().toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}</Text>
        </View>

        {/* Samenvatting */}
        <View>
          <Text style={styles.h2}>Samenvatting</Text>
          <Text style={styles.body}>{narrative.summary || "Geen samenvatting beschikbaar."}</Text>
        </View>

        {/* Emotie-trends */}
        {Object.keys(emotionAvg).length > 0 && (
          <View>
            <Text style={styles.h2}>Emotie-trends (gemiddeld 0–5)</Text>
            {Object.entries(emotionAvg).map(([emo, val]) => (
              <Text key={emo} style={styles.bullet}>
                · {emo}: {typeof val === "number" ? val.toFixed(1) : val}
                {emotionDelta[emo] !== undefined ? (emotionDelta[emo] > 0 ? " ↑" : " ↓") : ""}
              </Text>
            ))}
          </View>
        )}

        {/* Urges & gedrag */}
        {Object.keys(urges).length > 0 && (
          <View>
            <Text style={styles.h2}>Urges & gedrag</Text>
            {urges.self_harm && (
              <Text style={styles.bullet}>· Zelfbeschadiging: {urges.self_harm.count || 0}× gevoel · {urges.self_harm.acted || 0}× gehandeld</Text>
            )}
            {urges.substance && (
              <Text style={styles.bullet}>· Middelen: {urges.substance.count || 0}× gevoel · {urges.substance.acted || 0}× gehandeld</Text>
            )}
            {urges.lash_out && (
              <Text style={styles.bullet}>· Uitvallen: {urges.lash_out.count || 0}× gevoel · {urges.lash_out.acted || 0}× gehandeld</Text>
            )}
          </View>
        )}

        {/* Skill-gebruik */}
        {skills.length > 0 && (
          <View>
            <Text style={styles.h2}>Skill-gebruik</Text>
            {skills.map((s, i) => (
              <Text key={i} style={styles.bullet}>
                · {s.label || s.key}: {s.count || 0}×
                {s.avgEffective ? ` (gem. effectief: ${s.avgEffective}/5)` : ""}
              </Text>
            ))}
          </View>
        )}

        {/* Patronen */}
        {narrative.patterns?.length > 0 && (
          <View>
            <Text style={styles.h2}>Patronen (AI-observaties)</Text>
            {narrative.patterns.map((p, i) => (
              <Text key={i} style={styles.bullet}>· {p}</Text>
            ))}
          </View>
        )}

        {/* Aandachtspunten */}
        {narrative.flags?.length > 0 && (
          <View>
            <Text style={styles.h2}>Aandachtspunten</Text>
            {narrative.flags.map((f, i) => (
              <Text key={i} style={styles.bullet}>· {f}</Text>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Dit rapport is AI-gegenereerd op basis van zelfrapportage door de gebruiker via de LUNA app.
          Het is niet bedoeld als diagnose, klinische conclusie of behandeladvies.
          Het dient uitsluitend als gespreksmateriaal voor de therapeut-patiënt relatie.
          LUNA is geen erkend medisch hulpmiddel.
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadTherapistReport(profile, period, data, narrative) {
  const blob = await pdf(
    <TherapistReportDoc profile={profile} period={period} data={data} narrative={narrative} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `LUNA_export_${period.start}_${period.end}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
