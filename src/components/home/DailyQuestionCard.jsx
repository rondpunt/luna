import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const QUESTIONS = [
  "Wat wil jij vandaag loslaten?",
  "Hoe voelt jouw lijf nu?",
  "Wat maakte gisteren de moeite waard?",
  "Waar ben jij het hardst voor jezelf vandaag?",
  "Wat heb je nodig dat je nog niet hebt gevraagd?",
  "Welk gevoel zit er net onder de oppervlakte?",
  "Wat zou je vandaag tegen je jongere zelf zeggen?",
  "Waar voel jij je het meest jezelf?",
  "Wat is er deze week zwaarder dan je toegeeft?",
  "Welke gedachte blijft maar terugkomen?",
  "Wat heb je vandaag al goed gedaan, hoe klein ook?",
  "Wat zou je willen vragen als niemand zou oordelen?",
  "Welke emotie probeer je weg te duwen?",
  "Wat geeft jou rust, ook al is het maar even?",
  "Wat houdt je 's nachts wakker?",
  "Welk patroon zie jij steeds terugkomen?",
  "Wat zou je doen als je niet bang was?",
  "Wie of wat heeft jou recent geraakt?",
  "Wat verdien jij vandaag wél te voelen?",
  "Welke grens heb je deze week niet bewaakt?",
  "Wat zou helpen om vandaag iets lichter te zijn?",
  "Welk woord beschrijft jouw week het beste?",
  "Waar ben je trots op, ook al zegt niemand het?",
  "Wat heb je nodig om je veilig te voelen?",
  "Welk verhaal vertel je jezelf dat misschien niet klopt?",
  "Wat zou je willen dat iemand jou vandaag vraagt?",
  "Waar voel jij je nu het meest verbonden?",
  "Wat is een klein moment van vandaag dat je wil vasthouden?",
  "Wat probeer je perfect te doen, terwijl het niet hoeft?",
  "Wat als je vandaag écht naar jezelf luistert?",
];

function questionOfTheDay() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = (new Date() - start) + ((start.getTimezoneOffset() - new Date().getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / 86400000);
  return QUESTIONS[dayOfYear % QUESTIONS.length];
}

export default function DailyQuestionCard() {
  const navigate = useNavigate();
  const tappedRef = useRef(false);
  const question = questionOfTheDay();

  const handleTap = () => {
    if (tappedRef.current) return;
    tappedRef.current = true;
    navigate(`/chat?prompt=${encodeURIComponent(question)}`);
    setTimeout(() => { tappedRef.current = false; }, 600);
  };

  return (
    <button
      onClick={handleTap}
      className="w-full flex items-center gap-3.5 px-4 py-4 btn-press text-left"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--line-subtle)",
        borderRadius: 18,
      }}
    >
      <div
        className="h-10 w-10 shrink-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 32%, #ee9670 0%, #c25a32 55%, #7a2d14 100%)",
          boxShadow: "0 0 14px 4px rgba(194,90,50,0.30)",
          animation: "orbBreath 3.8s ease-in-out infinite",
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase mb-1" style={{ color: "#C25A32", letterSpacing: "1px" }}>
          Luna vraagt
        </p>
        <p className="text-[14.5px] font-medium leading-[1.4]" style={{ color: "var(--text)", letterSpacing: "-0.1px" }}>
          {question}
        </p>
      </div>
      <span className="text-[18px] shrink-0" style={{ color: "var(--text-3)" }}>›</span>
    </button>
  );
}