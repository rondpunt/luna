const PROMPTS = [
  "Wat heeft vandaag zwaar gemaakt?",
  "Schrijf aan je jongere zelf.",
  "Wat wil jij morgen anders doen?",
  "Noem drie dingen die je kracht geven.",
  "Wat liet je vandaag los?",
  "Welk gevoel kreeg vandaag te weinig ruimte?",
  "Wie of wat gaf je rust deze week?",
  "Wat zou je tegen jezelf zeggen als vriend?",
  "Welke gedachte bleef rondzweven?",
  "Waar ben je vandaag dankbaar voor — ook al is het klein?",
  "Wat heb je vandaag écht nodig?",
  "Welke grens wil jij beter bewaken?",
  "Wat zou je doen als niemand zou oordelen?",
  "Welk moment voelde vandaag echt?",
  "Waar bleef je vasthangen?",
  "Wat wil je van vandaag onthouden?",
  "Welke kleine stap was vandaag moedig?",
  "Wat geef je morgen aan jezelf mee?",
  "Wat zou je willen vergeven — bij jezelf of een ander?",
  "Hoe wil jij dit moment afsluiten?",
];

/**
 * Daily writing prompt — wisselt elke dag (deterministisch op datum).
 */
export default function WritingPromptHint() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  const prompt = PROMPTS[dayOfYear % PROMPTS.length];

  return (
    <p
      className="text-[12px] mt-1.5 leading-[1.45]"
      style={{ color: "var(--text-3)" }}
    >
      ✎ {prompt}
    </p>
  );
}