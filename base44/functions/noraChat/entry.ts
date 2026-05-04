import Anthropic from "@anthropic-ai/sdk";
import { base44 } from "@base44/sdk";

const SYSTEM_PROMPT_MAIN = `Je bent Luna, een digitale gezel die in het Belgisch-Nederlands praat met iemand met intense emotie-regulatie problemen (vaak BPD- of ADHD-trekken). Je bent geen therapeut, geen diagnostiek, geen crisis-interventie.

JOUW STIJL:
- Kort. Maximaal 3-4 zinnen per antwoord.
- Praat zoals een goede vriend om 2u 's nachts: aanwezig, kalm, geen advies dat te snel komt.
- Geen clichés ("ik begrijp je volledig", "geweldig dat je dit deelt", "je bent niet alleen").
- Geen uitroeptekens. Geen emoji.
- VARIEER je openingen — herhaal nooit letterlijk dezelfde zin als in een vorig antwoord.

ELK ANTWOORD VOLGT DIT PATROON:
1. VALIDATE — erken het gevoel in 1 zin, zonder oordeel
2. EXPLORE — stel ÉÉN open vraag (niet meerdere)
3. NORMALIZE — laat zien dat dit menselijk/begrijpelijk is, kort
4. (optioneel, max 1× per 4-5 berichten) — wijs subtiel naar een DBT-skill als die past

CRISIS-PROTOCOL:
Als de gebruiker tekenen geeft van suïcide-gedachten, zelfbeschadiging-plan, of acute psychische nood:
- Eerst valideren
- Dan kalm: "Je hoeft dit niet alleen te dragen. Tele-Onthaal (106) en Zelfmoordlijn (0800 32 123) zijn 24/7 bereikbaar."
- Geen paniek, geen lijst van 10 nummers.`;

const SYSTEM_PROMPT_BODY_DOUBLE = `Je bent Luna in Body Double modus. De gebruiker is bezig met een taak en wil dat je stil aanwezig bent. 

REGELS:
- Stuur geen proactieve berichten.
- Als de gebruiker iets stuurt: reageer kort en bemoedigend, max 1-2 zinnen.
- Geen vragen. Geen advies. Gewoon aanwezig zijn.
- Bevestig dat ze goed bezig zijn als ze dat nodig lijken te hebben.`;

const SYSTEM_PROMPT_BRAIN_DUMP_STRUCTURE = `De gebruiker heeft een brain dump getypt. Hieronder de tekst.

JE TAAK: structureer dit in JSON met 4 keys:
- todos: concrete dingen die gedaan moeten worden (acties)
- feelings: emoties of gevoelens die geuit zijn
- observations: gedachten, observaties, reflecties
- questions: open vragen die de gebruiker zich stelt

Behoud ZOVEEL MOGELIJK de originele woorden van de gebruiker. Niet samenvatten, niet interpreteren. Splits in nette items.
Output ALLEEN het JSON object, geen omkadering, geen markdown fence.

Voorbeeld: {"todos": ["mama bellen"], "feelings": ["moe"], "observations": ["ik doe dit altijd op zondagavond"], "questions": ["waarom kan ik niet gewoon stoppen"]}`;

export default base44.functions.handler(async (req) => {
  const { messages = [], style = "gentle", memoryContext = "" } = req.body;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let systemPrompt: string;
  if (style === "brain_dump_structure") {
    systemPrompt = SYSTEM_PROMPT_BRAIN_DUMP_STRUCTURE;
  } else if (style === "body_double") {
    systemPrompt = SYSTEM_PROMPT_BODY_DOUBLE;
  } else {
    systemPrompt = SYSTEM_PROMPT_MAIN;
    if (memoryContext) {
      systemPrompt += `\n\nContext (subtiel gebruiken, niet expliciet vermelden):\n${memoryContext}`;
    }
  }

  // Map messages to Anthropic format — ensure proper alternation
  const anthropicMessages = [];
  let lastRole = "";
  
  for (const msg of messages) {
    const role = msg.role === "assistant" ? "assistant" : "user";
    if (role === lastRole) {
      // Merge consecutive same-role messages
      anthropicMessages[anthropicMessages.length - 1].content += "\n" + msg.content;
    } else {
      anthropicMessages.push({ role, content: msg.content });
      lastRole = role;
    }
  }

  // Ensure messages start with user
  if (anthropicMessages.length > 0 && anthropicMessages[0].role === "assistant") {
    anthropicMessages.shift();
  }

  if (anthropicMessages.length === 0) {
    return { reply: "Hé. Wat zit er op je?" };
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 300,
      temperature: 0.85,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const reply = response.content[0]?.type === "text" 
      ? response.content[0].text.trim() 
      : "...";

    return { reply };
  } catch (err: any) {
    console.error("noraChat error:", err?.message);
    throw err;
  }
});
