const STATE_RULES = [
  {
    match: ["leeg", "verdoofd", "vlak", "afwezig", "numb"],
    needs: ["zachte activering", "weinig woorden", "geen druk"],
    tone: ["traag", "grondend", "concreet"],
    skills: ["Mindfulness", "IMPROVE"],
    avoid: ["te veel vragen", "peptalk"],
    riskSensitivity: "let op terugtrekking en zelfverwaarlozing"
  },
  {
    match: ["onrust", "opgejaagd", "paniek", "stress", "overweldigd", "chaos"],
    needs: ["ontprikkeling", "één stap tegelijk", "veiligheid in het moment"],
    tone: ["kort", "ankerend", "niet analyserend"],
    skills: ["TIP", "STOP", "Mindfulness"],
    avoid: ["lange uitleg", "meerdere opties tegelijk"],
    riskSensitivity: "let op escalatie, impulsiviteit en acute nood"
  },
  {
    match: ["boos", "woede", "irritatie", "explosief", "uitvallen"],
    needs: ["remming voor actie", "validatie zonder gelijk geven", "pauze vóór reactie"],
    tone: ["stevig zacht", "niet moraliserend"],
    skills: ["STOP", "TIP", "GIVE"],
    avoid: ["schuldtaal", "discussie winnen"],
    riskSensitivity: "let op conflict, zelfbeschadiging of impulsieve actie"
  },
  {
    match: ["eenzaam", "verlaten", "afgewezen", "relatie", "hechting"],
    needs: ["nabijheid", "niet wegduwen", "relatiepijn serieus nemen"],
    tone: ["warm", "menselijk", "niet klinisch"],
    skills: ["GIVE", "DEAR MAN", "FAST"],
    avoid: ["bagatelliseren", "zeggen dat ze gewoon moeten loslaten"],
    riskSensitivity: "let op verlatingspaniek en wanhoop"
  },
  {
    match: ["uitstel", "focus", "adhd", "vergeten", "vast", "taak"],
    needs: ["microstap", "body-double stijl", "extern starten"],
    tone: ["praktisch", "direct", "vriendelijk"],
    skills: ["STOP", "ACCEPTS"],
    avoid: ["motivatiepreek", "waarom-vragen"],
    riskSensitivity: "let op schaamtespiraal en overbelasting"
  }
];

const unique = (items) => [...new Set(items.filter(Boolean))];

export function buildLunaUserState(tags = []) {
  const normalizedTags = tags.map((tag) => String(tag || "").toLowerCase());
  const matchedRules = STATE_RULES.filter((rule) =>
    rule.match.some((word) => normalizedTags.some((tag) => tag.includes(word)))
  );

  if (!matchedRules.length) {
    return {
      selectedTags: tags,
      needs: ["eerst luisteren", "voorzichtig aftasten"],
      tone: ["rustig", "kort", "niet diagnosticerend"],
      skills: ["Mindfulness", "STOP"],
      avoid: ["labels plakken", "diagnoses suggereren"],
      riskSensitivity: "normaal, maar blijf alert bij crisiswoorden"
    };
  }

  return {
    selectedTags: tags,
    needs: unique(matchedRules.flatMap((rule) => rule.needs)),
    tone: unique(matchedRules.flatMap((rule) => rule.tone)),
    skills: unique(matchedRules.flatMap((rule) => rule.skills)),
    avoid: unique(matchedRules.flatMap((rule) => rule.avoid)),
    riskSensitivity: unique(matchedRules.map((rule) => rule.riskSensitivity)).join("; ")
  };
}

export function formatLunaUserState(state) {
  return [
    `Gekozen woorden: ${state.selectedTags.join(", ")}.`,
    `Vertaal dit naar chatgedrag, niet naar diagnose.`,
    `Behoeftes: ${state.needs.join(", ")}.`,
    `Toon: ${state.tone.join(", ")}.`,
    `Vermijd: ${state.avoid.join(", ")}.`,
    `Passende skills: ${state.skills.join(", ")}.`,
    `Risico-alertheid: ${state.riskSensitivity}.`
  ].join("\n");
}