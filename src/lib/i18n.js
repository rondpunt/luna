// Centrale Belgisch-Nederlandse taalbestanden
// Toon: warm, kort, "ge/je" mix vermijden — we kiezen 'je/jij' (informeel BE-NL).
// Spelling: typisch Vlaams ("goesting", "babbel", "even", "rustig", "tof").

export const t = {
  appName: "Luna",
  tagline: "Een rustige plek om je gehoord te voelen.",
  subTagline: "Privé emotionele steun, wanneer je het nodig hebt.",

  nav: {
    home: "Start",
    chat: "Babbel",
    voice: "Stem",
    journal: "Dagboek",
    insights: "Inzichten",
    profile: "Profiel",
  },

  cta: {
    startFree: "Gratis beginnen",
    seePlans: "Bekijk abonnementen",
    next: "Volgende",
    back: "Terug",
    save: "Bewaren",
    cancel: "Annuleren",
    finish: "Afronden",
    close: "Sluiten",
    unlock: "Nu ontgrendelen",
    later: "Later",
    send: "Versturen",
    continue: "Verdergaan",
  },

  home: {
    welcome: "Fijn dat je er bent",
    moodPrompt: "Hoe voel je je nu?",
    moods: ["zwaar", "rusteloos", "vlak", "hoopvol", "in m'n hoofd"],
    todayPath: "Vandaag, rustig aan",
    resumeChat: "Verder doen met laatste babbel",
    startVoice: "Een stemsessie starten",
    journal5: "5 minuten in je dagboek schrijven",
    streak: "Reeks",
    streakDays: (n) => `${n} dagen`,
    streakNote: "Regelmaat helpt Luna om te zien wat je rust geeft.",
    suggestedTool: "Voorgestelde oefening",
    breathingReset: "3-minuten ademreset",
    breathingNote: "Helpt bij racende gedachten en overweldiging.",
    unlockPlus: "Ontgrendel Luna Plus",
    unlockPlusNote: "Stem, geheugen en diepere weekinzichten.",
    privacyTitle: "Privacy eerst",
    privacyBullets: [
      "Je babbels en dagboek blijven privé op je account.",
      "Geheugen kun je altijd uitzetten.",
      "Exporteer of verwijder je data via het Privacycentrum.",
    ],
    weeklyTrend: "Stemming deze week",
    weeklyTrendNote: "Een zachte blik op hoe je week aanvoelt.",
  },

  chat: {
    header: "Babbel",
    title: "Privé emotionele steun, altijd binnen handbereik.",
    placeholder: "Vertel Luna wat er door je hoofd gaat…",
    tonightTitle: "Babbel van vanavond",
    tonightNote: "Empathische steun in korte, rustige antwoorden.",
    sidebarTitle: "Gesprekken",
    searchPlaceholder: "Zoek een gesprek",
    starterPrompts: [
      "Ik voel me overweldigd en weet niet goed waarom",
      "Help me even ordenen wat ik voel",
      "Kun je m'n gedachten helpen vertragen?",
      "Ik heb een praktische volgende stap nodig",
    ],
    tools: [
      "Bewaar in geheugen",
      "Maak een copingplan",
      "Vat samen wat ik voel",
      "Herformuleer deze gedachte",
      "Wat is m'n volgende stap?",
    ],
    styles: ["Korter", "Dieper", "Praktisch"],
    welcomeMsg: "Hé, ik ben hier. Wat voelt nu het zwaarst voor jou?",
    fallbackMsg: "Er zit duidelijk veel op je. Wil je eerst het gevoel uitpluizen of liever kijken naar een volgende stap?",
    urgent: "Hulp nodig?",
  },

  pricing: {
    eyebrow: "Abonnementen",
    title: "Premium steun, met een duidelijk gratis pad.",
    intro: "Kies wat bij je past. Je kunt op elk moment opzeggen.",
    tiers: [
      {
        key: "free",
        name: "Gratis",
        price: "€0",
        per: "",
        note: "Om rustig te starten",
        features: ["Beperkte babbels per dag", "Basis dagboek", "Dagelijkse check-in", "Eenvoudige inzichten"],
      },
      {
        key: "plus",
        name: "Plus",
        price: "€9,99",
        per: "/maand",
        note: "Voor dagelijkse steun met geheugen",
        featured: true,
        features: ["Onbeperkt babbelen", "Geheugen", "Stemmodus", "Volledig dagboek", "Wekelijkse inzichten"],
      },
      {
        key: "pro",
        name: "Pro",
        price: "€19,99",
        per: "/maand",
        note: "Voor diepere reflectie op lange termijn",
        features: ["Diepe inzichten", "Lange-termijn geheugen", "Vaste routines", "Voorrang op nieuwe functies"],
      },
    ],
    chooseFree: "Gratis starten",
    choose: (n) => `Kies ${n}`,
    importantTitle: "Belangrijk om te weten",
    importantBody: "Luna is geen noodhulp, geen medische zorg en geen vervanging voor een professionele hulpverlener.",
  },

  paywallHook: {
    eyebrow: "Ontgrendel onbeperkte toegang",
    title: "Voor ononderbroken ondersteuning, 24/7",
    body: "Onbeperkt babbelen, stemmodus en geheugen — voor wanneer je het écht nodig hebt.",
    cta: "Nu ontgrendelen",
    skip: "Misschien later",
  },

  onboarding: {
    steps: [
      {
        eyebrow: "Welkom",
        title: "Hoi, ik ben Luna.",
        body: "Een rustige, privé plek om te babbelen wanneer het zwaar is. Geen oordeel, geen haast.",
      },
      {
        eyebrow: "Hoe heet je?",
        title: "Hoe mag ik je noemen?",
        body: "Je voornaam of een bijnaam — je hoeft niets te delen wat je niet wil.",
      },
      {
        eyebrow: "Wat brengt je hier?",
        title: "Waar wil je rond werken?",
        body: "Kies wat resoneert. Je kunt dit later altijd aanpassen.",
      },
      {
        eyebrow: "Hoe wil je dat ik klink?",
        title: "Welke toon past bij jou?",
        body: "Ik pas mijn antwoorden hierop aan.",
      },
      {
        eyebrow: "Privacy",
        title: "Jouw verhaal blijft van jou.",
        body: "Berichten staan privé op je account. Je kunt geheugen uitzetten of alles wissen via het Privacycentrum.",
      },
    ],
    goals: ["Stress", "Angst", "Slaap", "Relaties", "Focus", "Eenzaamheid", "Zelfbeeld", "Burn-out", "Verlies", "Iets anders"],
    tones: [
      { key: "gentle", label: "Zacht", desc: "Warm en geduldig" },
      { key: "direct", label: "Direct", desc: "Eerlijk en helder" },
      { key: "practical", label: "Praktisch", desc: "Concrete stappen" },
      { key: "reflective", label: "Reflectief", desc: "Vragen die laten denken" },
    ],
    namePlaceholder: "Bv. Niels",
    consent: "Ik ga akkoord met het privacybeleid en de veiligheidsnotitie.",
    safety: "Bij directe nood of zelfmoordgedachten: bel 112 of de Zelfmoordlijn 1813.",
    finish: "Luna openen",
  },

  profile: {
    eyebrow: "Profiel",
    title: "Voorkeuren, privacy en abonnement.",
    settings: [
      { label: "Toon", value: "Reflectief" },
      { label: "Geheugen", value: "Aan" },
      { label: "Meldingen", value: "Dagelijks om 20:00" },
      { label: "Stem", value: "Zachte stem · Nederlands (BE)" },
      { label: "Thema", value: "Automatisch" },
    ],
    plan: "Huidig abonnement",
    free: "Gratis",
    upgrade: "Beheer abonnement",
    privacyCenter: "Privacycentrum",
    memoryControls: "Geheugeninstellingen",
    exportData: "Data exporteren",
    deleteAccount: "Account verwijderen",
  },

  privacy: {
    eyebrow: "Privacybeleid",
    title: "Heldere taal over wat Luna bewaart en waarom.",
    blocks: [
      ["Wat bewaren we?", "Babbels, dagboeknotities, check-ins, voorkeuren en optionele herinneringen die je expliciet bewaart."],
      ["Waarom?", "Om de app te laten werken, je steun persoonlijker te maken en continuïteit te bieden over de tijd heen."],
      ["Jouw controle", "Je kunt data exporteren, geheugen uitzetten, herinneringen wissen en je account verwijderen."],
      ["Geen noodhulp", "Luna is geen noodhulp, geen medische zorg en geen vervanger voor een professional."],
    ],
  },

  voorwaarden: {
    eyebrow: "Voorwaarden",
    title: "Wat Luna wel en niet is.",
    blocks: [
      ["Geen therapeut", "Luna is een AI-gezel voor emotionele steun, geen therapeut, dokter of crisislijn."],
      ["Geen diagnose", "Luna stelt geen diagnoses en biedt geen medische behandeling."],
      ["Veiligheid eerst", "Bij direct gevaar contacteer je lokale noodhulp of een vertrouwenspersoon."],
      ["Voor volwassenen", "Ontworpen als algemene emotionele steun voor volwassenen."],
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Vragen, feedback of een idee?",
    body: "Mail het Luna-team via hallo@luna-app.be — we lezen alles.",
    button: "Stuur een mail",
  },

  privacyCenter: {
    eyebrow: "Privacycentrum",
    title: "Bepaal zelf wat Luna onthoudt en wat van jou blijft.",
    storedTitle: "Wat wordt bewaard",
    storedItems: [
      "Babbels en dagboeknotities op je privé account",
      "Optionele herinneringen die je bewust bewaart",
      "Check-ins en inzichten om je steun persoonlijker te maken",
    ],
    memoryTitle: "Geheugeninstellingen",
    memoryItems: ["Individuele herinneringen wissen", "Geheugen volledig uitzetten", "Gespreksgeschiedenis verwijderen"],
    exportTitle: "Exporteer je data",
    exportBody: "Download al je babbels en dagboeknotities als bestand.",
    exportCta: "Alles exporteren",
    deleteTitle: "Account verwijderen",
    deleteBody: "Verwijder je account en je hele privé geschiedenis definitief.",
    deleteCta: "Verwijder account",
  },

  voice: {
    eyebrow: "Stem",
    title: "Praat dingen uit in een rustige privé ruimte.",
    body: "Spraak-naar-tekst en tekst-naar-spraak in je browser, klaar om uit te groeien tot live stem.",
    start: "Beginnen met luisteren",
    mute: "Dempen",
    transcript: "Live transcript",
    pause: "Pauzeren",
    stopSave: "Stoppen & bewaren",
  },

  journal: {
    eyebrow: "Dagboek",
    title: "Een privé plek om te schrijven zonder te moeten presteren.",
    today: "Notitie van vandaag",
    titlePlaceholder: "Titel van je notitie",
    bodyPlaceholder: "Schrijf wat nu écht waar voelt…",
    moodBefore: "Stemming voor",
    moodAfter: "Stemming na",
    save: "Notitie bewaren",
    toChat: "Hier verder over babbelen",
    reflection: "Reflectie-tools",
    reflectionItems: ["AI-samenvatting van je notitie", "Meest voorkomend thema deze week", "Privé en altijd te exporteren"],
    templates: ["Vrij schrijven", "Dankbaarheid", "Angst loslaten", "Relatiereflectie", "Slaapreflectie", "Wins van vandaag"],
  },

  insights: {
    eyebrow: "Inzichten",
    title: "Patronen, geen prestaties.",
    weekly: "Weeksamenvatting",
    weeklyBody: "Je voelt je grondiger op dagen dat je vroeg incheckt en kort iets opschrijft, in plaats van alles in je hoofd te houden.",
    cards: [
      ["Veelvoorkomende thema's", "Werkdruk, slaapfrictie, twijfels in relaties"],
      ["Triggers", "Onbeantwoorde berichten, laat opblijven, conflict vermijden"],
      ["Wat helpt jou", "Ademreset, herformuleren, korte stemsessies"],
    ],
  },

  errors: {
    needLogin: "Je moet aangemeld zijn om dit te gebruiken.",
    generic: "Er liep iets mis. Probeer het zo nog eens.",
  },
};

// Korte helper als we ooit meertalig willen werken
export function tr(path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), t);
}