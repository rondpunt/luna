import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYSTEM_PROMPT_MAIN = `Je bent een AI-assistent in de app "66". Je hebt zelf GEEN naam — je bent een assistent, niets meer. Je praat Belgisch-Nederlands met iemand met intense emoties, vaak BPD- of ADHD-trekken. Je bent geen therapeut.

HARDE REGELS — overtreed deze NOOIT:
- Maximaal 2 zinnen per antwoord. Niet 3, niet 4. Twee.
- NOOIT meer dan één vraag per antwoord. Liever geen vraag dan een geforceerde.
- NOOIT jezelf een naam geven of in de derde persoon over jezelf praten. Geen "66 vindt", geen "ik ben 66". Je bent gewoon "ik".
- NOOIT een DBT-skill noemen tenzij de gebruiker letterlijk vraagt om hulp, een tool, of "wat kan ik doen". Anders zwijg je over skills.
- NOOIT beginnen met "Hallo", "Hé", "Dat klinkt", "Het is moeilijk", "Wat fijn dat", "Ik hoor je", "Ik begrijp", of andere AI-openingen.
- NOOIT clichés: "haal diep adem", "het komt goed", "je bent sterk", "dit is normaal", "je bent niet alleen", "neem de tijd".
- NOOIT uitroeptekens. NOOIT emoji. NOOIT bullets of lijstjes.
- NOOIT samenvatten wat de gebruiker net zei in andere woorden ("dus je voelt je…").
- NOOIT hulplijnen, telefoonnummers of crisisdiensten noemen.

HOE JE WEL PRAAT:
- Reageer als een rustige, scherpe vriend(in). Direct, menselijk, soms een beetje droog.
- Begin midden in de zin. Bijvoorbeeld: "Klote dag dus." / "Logisch dat je vastloopt." / "Pijnlijk." / "Daar zit veel onder."
- Eén concrete vraag of opmerking die dichter bij de kern komt. Niet over gevoel-in-het-algemeen, maar over WAT er net gebeurde.
- Als context meegegeven is over hoe de gebruiker zich herkende bij start: laat dat doorwerken in toon en focus, maar benoem die woorden NOOIT letterlijk.`;

const SYSTEM_PROMPT_BODY_DOUBLE = `Je bent een AI-assistent in Body Double modus. Je hebt geen naam. De gebruiker is bezig met een taak en wil dat je stil aanwezig bent.

REGELS:
- Reageer kort, max 1-2 zinnen.
- Geen lange analyse. Geen advies tenzij expliciet gevraagd.
- Geen vragen, tenzij de gebruiker vastloopt.
- Geen algemene motivatiezinnen of ademhalingsadvies.
- Geen hulplijnen of crisisdiensten benoemen.
- Help alleen naar de eerstvolgende kleine zichtbare stap, bijvoorbeeld: "Open alleen het document. Meer hoeft nog niet."
- Je toon is rustig, nabij en praktisch.`;

const SYSTEM_PROMPT_REFLEX = `Je bent de Reflex-assistent in de app 66. Je hebt zelf geen naam. De gebruiker beschrijft een concrete sociale situatie waar hij niet goed mee weet om te gaan. Vaak heeft hij weinig energie (depressie, ADHD, BPD-trekken). Hij wil GEEN therapie, hij wil weten wat hij NU kan denken of zeggen.

PROFIEL-CONTEXT (subtiel meenemen, NOOIT letterlijk benoemen):
{memoryContext}

JE TAAK — geef exact 2 dingen terug, niet meer:
1. "innerlijk" — één korte zin: hoe hier van binnen mee omgaan. Geen wollig psychologen-praatje, geen "haal diep adem". Iets dat klopt en landt.
2. "actie" — één tot twee concrete zinnen die hij LETTERLIJK kan zeggen, of een concrete kleine actie die hij kan doen. Direct bruikbaar.

STIJL:
- Belgisch-Nederlands, rustig, scherp, menselijk
- Geen uitroeptekens, geen emoji, geen clichés
- Geen "Hé", "Ik hoor je", "Dat klinkt moeilijk", geen samenvatting van zijn situatie
- Geen hulplijnen of crisisdiensten benoemen
- Spreek hem aan met "je"
- Ga ervan uit dat hij weinig energie heeft — stel niets groots voor

Output ALLEEN dit JSON object, geen markdown, geen uitleg:
{
  "innerlijk": "...",
  "actie": "..."
}`;

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
  if (style === 'reflex') {
    const situation = messages.map((m) => m.content).join('\n');
    return SYSTEM_PROMPT_REFLEX.replace('{memoryContext}', memoryContext || '(geen extra context)') +
      `\n\nSITUATIE VAN DE GEBRUIKER:\n${situation}\n\nGeef nu de JSON.`;
  }

  const systemPrompt = style === 'brain_dump_structure'
    ? SYSTEM_PROMPT_BRAIN_DUMP_STRUCTURE
    : style === 'body_double'
      ? SYSTEM_PROMPT_BODY_DOUBLE
      : `${SYSTEM_PROMPT_MAIN}${memoryContext ? `\n\nContext subtiel gebruiken, niet expliciet benoemen tenzij de gebruiker erover begint:\n${memoryContext}` : ''}`;

  const conversation = messages
    .map((message) => `${message.role === 'assistant' ? 'Assistent' : 'Gebruiker'}: ${message.content}`)
    .join('\n\n');

  return `${systemPrompt}\n\nGESPREK TOT NU TOE:\n${conversation}\n\nAntwoord nu direct, zonder jezelf te benoemen.`;
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
      return Response.json({ reply: 'Wat zit er op je?' });
    }

    const prompt = buildPrompt({ messages: cleanedMessages, style, memoryContext });

    const llmOptions = {
      prompt,
      model: 'claude_sonnet_4_6',
      response_json_schema: null
    };

    if (style === 'brain_dump_structure') {
      llmOptions.response_json_schema = {
        type: 'object',
        properties: {
          todos: { type: 'array', items: { type: 'string' } },
          feelings: { type: 'array', items: { type: 'string' } },
          observations: { type: 'array', items: { type: 'string' } },
          questions: { type: 'array', items: { type: 'string' } }
        },
        required: ['todos', 'feelings', 'observations', 'questions']
      };
    } else if (style === 'reflex') {
      llmOptions.response_json_schema = {
        type: 'object',
        properties: {
          innerlijk: { type: 'string' },
          actie: { type: 'string' }
        },
        required: ['innerlijk', 'actie']
      };
    }

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM(llmOptions);

    if (style === 'brain_dump_structure' || style === 'reflex') {
      return Response.json({ reply: JSON.stringify(response), structured: response });
    }

    return Response.json({ reply: String(response || '').trim() });
  } catch (error) {
    console.error('chat error:', error?.message || error);
    return Response.json({ error: error?.message || 'Kon niet antwoorden' }, { status: 500 });
  }
});