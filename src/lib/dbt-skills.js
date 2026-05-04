// DBT Skills library — Linehan's 4 modules
// Content in Belgian Dutch

export const SKILL_MODULES = [
  {
    key: "mindfulness",
    title: "Mindfulness",
    subtitle: "Observeren zonder oordeel",
    description: "De basis van alle DBT-skills. Leer waarnemen wat er is, zonder er meteen op te reageren.",
    skills: [
      {
        key: "observe",
        title: "Observeren",
        short: "Waarnemen wat er is",
        steps: [
          { instruction: "Stop wat je doet. Sluit je ogen of richt je blik op één punt.", why: "Je geeft je brein een pauze van het reageren." },
          { instruction: "Merk op wat je voelt in je lichaam. Geen oordeel — alleen waarnemen.", why: "Gevoelens zijn fysiek. Ze zitten in je keel, borst, maag." },
          { instruction: "Observeer je gedachten als wolken die voorbij drijven. Jij bent de lucht, niet de wolken.", why: "Dit creëert afstand tussen jou en je reacties." },
          { instruction: "Doe dit 2 minuten. Elke keer dat je wegdrijft, kom je rustig terug.", why: "Mindfulness is een spier. Je traint hem door terug te keren, niet door niet weg te drijven." },
        ],
        duration: 120,
        timer: true,
      },
      {
        key: "describe",
        title: "Beschrijven",
        short: "Woorden geven aan wat er is",
        steps: [
          { instruction: "Kies één gevoel dat nu sterk aanwezig is.", why: "Meerdere tegelijk verwerken is te veel." },
          { instruction: "Schrijf of zeg: 'Ik merk dat ik [gevoel] voel in mijn [lichaamsdeel].'", why: "Taal activeert de prefrontale cortex — dat is letterlijk je rationele brein." },
          { instruction: "Voeg geen oordeel toe. Niet 'ik voel me slecht' maar 'ik voel spanning in mijn borst'.", why: "Feiten kalmeren. Oordelen escaleren." },
        ],
        duration: 180,
        timer: false,
      },
    ],
  },
  {
    key: "distress",
    title: "Nood-tolerantie",
    subtitle: "TIP · STOP · ACCEPTS · IMPROVE",
    description: "Voor momenten waarop de pijn ondraaglijk is. Niet oplossen — overleven.",
    skills: [
      {
        key: "tip",
        title: "TIP",
        short: "Lichaam resetten in crisis",
        steps: [
          {
            key: "temperature",
            title: "Koud water",
            duration: 30,
            instruction: "Houd je gezicht 30 seconden in koud water (zo koud als je kunt). Of een ijspack op je voorhoofd en wangen.",
            why: "Dit triggert de duikreflex. Je hartslag daalt binnen seconden. Het is fysiologisch — het gaat sneller dan welk gedachte ook.",
            timer: true,
          },
          {
            key: "exercise",
            title: "Intensieve beweging",
            duration: 60,
            instruction: "60 seconden zo hard als je kunt: jumping jacks, sprintspringen, push-ups. Tot je hijgt.",
            why: "Verbrandt het cortisol en adrenaline dat door je lichaam vliegt. Werkt binnen 1 minuut.",
            timer: true,
          },
          {
            key: "breathing",
            title: "Paced breathing",
            duration: 120,
            instruction: "Adem in 4 tellen in, adem 6 tellen uit. Twee minuten lang. De uitademing altijd langer dan de inademing.",
            why: "Activeert je parasympatisch zenuwstelsel — de 'rust' knop van je lichaam. Fysiologisch bewezen.",
            timer: true,
            visualizer: "breath",
          },
          {
            key: "pmr",
            title: "Spier-ontspanning",
            duration: 180,
            instruction: "Span elke spiergroep 5 seconden aan, laat dan los. Begin bij je voeten, eindig bij je gezicht.",
            why: "Je kunt niet tegelijk gespannen en ontspannen zijn. Dit doorbreekt de fysieke vechtmodus.",
            timer: true,
          },
        ],
      },
      {
        key: "stop",
        title: "STOP",
        short: "Impulsiviteit stoppen",
        steps: [
          { title: "Stop", instruction: "Stop letterlijk. Beweeg niet. Doe niets.", why: "Impulsief handelen begint met een beweging. Stilstaan doorbreekt die cyclus." },
          { title: "Take a step back", instruction: "Stap fysiek of mentaal een stap terug. Adem één keer diep uit.", why: "Afstand creeërt ruimte om te kiezen." },
          { title: "Observe", instruction: "Wat voel ik? Wat denk ik? Wat is de situatie feitelijk?", why: "Feiten en interpretaties zijn niet hetzelfde. Dit onderscheid is kritisch." },
          { title: "Proceed mindfully", instruction: "Wat is het meest effectieve wat ik nu kan doen? Handel dan.", why: "Effectief handelen, niet perfect handelen." },
        ],
        duration: null,
        timer: false,
      },
    ],
  },
  {
    key: "emotion",
    title: "Emotie-regulatie",
    subtitle: "PLEASE · Tegenovergestelde actie",
    description: "Emoties veranderen, niet wegstoppen. Langetermijn strategieën.",
    skills: [
      {
        key: "please",
        title: "PLEASE",
        short: "Biologische basis op orde",
        steps: [
          { title: "PhysicaL illness", instruction: "Behandel lichamelijke klachten. Slaap je genoeg? Heb je pijn ergens?", why: "Lichamelijke pijn maakt emotionele pijn 3× intenser." },
          { title: "Eating", instruction: "Eet vandaag iets substantieels. Geen extreme diëten.", why: "Bloedsuiker heeft direct invloed op emotionele stabiliteit." },
          { title: "Avoid substances", instruction: "Vermijd alcohol en drugs — ook als zelfmedicatie.", why: "Kortetermijn verlichting, langetermijn destabilisatie." },
          { title: "Sleep", instruction: "Zorg voor 7-9 uur slaap. Slechte slaap = verminderde emotieregulatiecapaciteit.", why: "Slaaptekort schakelt je prefrontale cortex deels uit." },
          { title: "Exercise", instruction: "Beweeg vandaag. 20 minuten wandelen telt.", why: "Beweging is de enige bewezen interventie die zowel angs als depressie vermindert." },
        ],
        duration: null,
        timer: false,
      },
    ],
  },
  {
    key: "interpersonal",
    title: "Interpersoonlijk",
    subtitle: "DEAR MAN · GIVE · FAST",
    description: "Effectief communiceren zonder jezelf of de relatie te beschadigen.",
    skills: [
      {
        key: "dearman",
        title: "DEAR MAN",
        short: "Iets vragen of weigeren",
        steps: [
          { title: "Describe", instruction: "Beschrijf de situatie feitelijk, zonder oordeel.", why: "Feiten kunnen niet ontkend worden. Oordelen wel." },
          { title: "Express", instruction: "Zeg wat je voelt of denkt over die situatie.", why: "Gevoelens zijn informatie, geen aanklacht." },
          { title: "Assert", instruction: "Vraag duidelijk wat je wil, of zeg nee.", why: "Indirect vragen werkt niet. Duidelijkheid respecteert beide mensen." },
          { title: "Reinforce", instruction: "Leg uit wat de positieve uitkomst is als de ander ja zegt.", why: "Mensen doen meer voor beloningen dan om straf te vermijden." },
          { title: "Mindful", instruction: "Blijf bij het onderwerp. Ga niet in op afleidingsmanoeuvres.", why: "Zijsporen verzwakken je positie." },
          { title: "Appear confident", instruction: "Spreek rustig, maak oogcontact, rechte houding.", why: "Non-verbale communicatie bepaalt 70% van de impact." },
          { title: "Negotiate", instruction: "Wees bereid tot compromis. Vraag naar alternatieven.", why: "Effectiviteit op lange termijn vereist flexibiliteit." },
        ],
        duration: null,
        timer: false,
      },
    ],
  },
];

export function getSkillByKey(key) {
  for (const mod of SKILL_MODULES) {
    for (const skill of mod.skills) {
      if (skill.key === key) return { skill, module: mod };
    }
  }
  return null;
}
