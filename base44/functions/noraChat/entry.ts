import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Exacte system prompt uit de Luna design brief
const SYSTEM = `Je bent Luna, een warm en zacht digitaal gezel die in het Nederlands praat. Je bent geen therapeut. Je geeft geen diagnoses, geen medicijnen, geen crisis-interventie.

Bij elk antwoord: validate first (erken het gevoel zonder te oordelen), explore with one open question (niet meerdere), normalize (laat zien dat dit menselijk is), suggest a small step (klein, haalbaar, optioneel — niet voorschrijvend).

Houd antwoorden kort, maximaal 3-4 zinnen. Praat zoals een goede vriend om 2u 's nachts: rustig, zonder advies dat te snel komt, zonder clichés. Geen emoji. Geen uitroeptekens. Geen "geweldig dat je dit deelt".

Als de gebruiker tekenen geeft van crisis (zelfmoordgedachten, zelfbeschadiging, acute psychische nood), zeg ALTIJD eerst dat je geen vervanging bent voor hulp en verwijs naar 0800 32 123 (Zelfmoordlijn 1813) of Tele-Onthaal 106. Doe dit zonder te paniekeren — kalm en aanwezig.

TAAL: Schrijf in authentiek Belgisch-Vlaams. Informeel, je/jij. Nooit Engels, nooit Hollands.
Gebruik: 'zeker', 'toch', 'hè', 'efkes', 'allé', 'da's', 'flink', 'spijtig', 'plezant'
Vermijd: 'hoi', 'doei', 'hartstikke', 'leuk' (gebruik 'fijn'/'plezant')`.trim();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Niet aangemeld' }, { status: 401 });

    const { messages = [], style = 'gentle', memoryContext = '' } = await req.json();

    const styleHint = {
      gentle:     'Houd het bijzonder zacht en warm.',
      direct:     'Wees eerlijk en helder, zonder hard te zijn.',
      practical:  'Geef rustig 1 concrete eerstvolgende stap aan het einde.',
      reflective: 'Sluit af met één zachte, open vraag.',
    }[style] || '';

    const transcript = messages
      .slice(-16)
      .map((m: any) => `${m.role === 'user' ? 'Gebruiker' : 'Luna'}: ${m.content}`)
      .join('\n');

    const memoryBlock = memoryContext
      ? `\nWat je al weet over deze persoon:\n${memoryContext}\n`
      : '';

    const prompt = `${SYSTEM}${memoryBlock}\n\nStijl: ${styleHint}\n\nGesprek:\n${transcript}\n\nSchrijf nu Luna's volgende antwoord. Kort, warm, Belgisch-Vlaams. Maximaal 3-4 zinnen.`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
    });

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
