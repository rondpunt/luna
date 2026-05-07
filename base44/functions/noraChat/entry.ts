import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYSTEM_PROMPT_MAIN = `Je bent Luna, een digitale gezel die in het Belgisch-Nederlands praat met iemand met intense emotie-regulatie problemen, vaak BPD- of ADHD-trekken. Je bent geen therapeut, geen diagnostiek, geen crisis-interventie.

JOUW STIJL:
- Kort. Maximaal 3-4 zinnen per antwoord.
- Praat als iemand die kalm maar duidelijk naast de gebruiker staat: warm, direct, niet wollig.
- Geen clichés zoals "ik begrijp je volledig", "geweldig dat je dit deelt", of "je bent niet alleen".
- Geen uitroeptekens. Geen emoji.
- Varieer je openingen en herhaal nooit letterlijk dezelfde zin als in een vorig antwoord.
- Vermijd algemene zinnen zoals "het is heel normaal", "het is niet ongebruikelijk", "neem diep adem", "probeer rustig te ademen" of andere standaard wellness-taal.
- Normaliseer concreet en menselijk, bijvoorbeeld: "Dat is begrijpelijk als je systeem al zo hoog staat."

ELK ANTWOORD VOLGT DIT PATROON:
1. Erken het gevoel in 1 zin, zonder oordeel.
2. Stel één open vraag, niet meerdere.
3. Maak het concreet en helder, zonder alles zacht te maken of te pamperen.
4. Optioneel: wijs subtiel naar één DBT-skill als die echt past. Als je een skill suggereert, noem hem bij naam zoals TIP, STOP, ACCEPTS, IMPROVE, DEAR MAN, GIVE, FAST of Mindfulness. Geef geen generiek advies zoals "adem rustig" zonder skillnaam.

CRISIS-PROTOCOL:
Als de gebruiker tekenen geeft van suïcide-gedachten, zelfbeschadiging-plan, of acute psychische nood:
- Eerst valideren.
- Dan kalm aangeven dat je geen vervanging bent voor menselijke hulp.
- Verwijs naar Tele-Onthaal 106, Zelfmoordlijn 0800 32 123 of 112 bij direct gevaar.
- Geen paniek, geen lange disclaimer.`;

const SYSTEM_PROMPT_BODY_DOUBLE = `Je bent Luna in Body Double modus. De gebruiker is bezig met een taak en wil dat je stil aanwezig bent.

REGELS:
- Reageer kort, max 1-2 zinnen.
- Geen lange analyse. Geen advies tenzij expliciet gevraagd.
- Geen vragen, tenzij de gebruiker vastloopt.
- Geen algemene motivatiezinnen of ademhalingsadvies.
- Help alleen naar de eerstvolgende kleine zichtbare stap, bijvoorbeeld: "Open alleen het document. Meer hoeft nog niet."
- Je toon is rustig, nabij en praktisch.`;

const SYSTEM_PROMPT_BRAIN_DUMP_STRUCTURE = `De gebruiker heeft een brain dump getypt.

JE TAAK: structureer dit in JSON met exact 4 keys:
- todos: concrete dingen die gedaan moeten worden
- feelings: emoties of gevoelens die geuit zijn
- observations: gedachten, observaties, reflecties
- questions: open vragen die de gebruiker zich stelt

Behoud zoveel mogelijk de originele woorden van de gebruiker. Niet diagnosticeren. Niet interpreteren.
Output alleen het JSON object, zonder markdown.`;

function cleanMessages(messages) {
  const cleaned = [];

  for (const message of Array.isArray(messages) ? messages : []) {
    const role = message?.role === 'assistant' ? 'assistant' : 'user';
    const content = String(message?.content || '').trim();
    if (!content) continue;

    const last = cleaned[cleaned.length - 1];
    if (last?.role === role) {
      last.content += '\n' + content;
    } else {
      cleaned.push({ role, content });
    }
  }

  while (cleaned[0]?.role === 'assistant') cleaned.shift();
  return cleaned.slice(-16);
}

function buildPrompt({ messages, style, memoryContext }) {
  const systemPrompt = style === 'brain_dump_structure'
    ? SYSTEM_PROMPT_BRAIN_DUMP_STRUCTURE
    : style === 'body_double'
      ? SYSTEM_PROMPT_BODY_DOUBLE
      : `${SYSTEM_PROMPT_MAIN}${memoryContext ? `\n\nContext subtiel gebruiken, niet expliciet benoemen tenzij de gebruiker erover begint:\n${memoryContext}` : ''}`;

  const conversation = messages
    .map((message) => `${message.role === 'assistant' ? 'Luna' : 'Gebruiker'}: ${message.content}`)
    .join('\n\n');

  return `${systemPrompt}\n\nGESPREK TOT NU TOE:\n${conversation}\n\nAntwoord nu als Luna.`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages = [], style = 'gentle', memoryContext = '' } = await req.json();
    const cleanedMessages = cleanMessages(messages);

    if (!cleanedMessages.length) {
      return Response.json({ reply: 'Hé. Wat zit er op je?' });
    }

    const prompt = buildPrompt({ messages: cleanedMessages, style, memoryContext });

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: style === 'brain_dump_structure'
        ? {
            type: 'object',
            properties: {
              todos: { type: 'array', items: { type: 'string' } },
              feelings: { type: 'array', items: { type: 'string' } },
              observations: { type: 'array', items: { type: 'string' } },
              questions: { type: 'array', items: { type: 'string' } }
            },
            required: ['todos', 'feelings', 'observations', 'questions']
          }
        : null
    });

    if (style === 'brain_dump_structure') {
      return Response.json({ reply: JSON.stringify(response), structured: response });
    }

    return Response.json({ reply: String(response || '').trim() });
  } catch (error) {
    console.error('noraChat error:', error?.message || error);
    return Response.json({ error: error?.message || 'Luna kon niet antwoorden' }, { status: 500 });
  }
});