import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { messages = [], checkIns = [] } = await req.json();

    // Build conversation text for analysis
    const convoText = messages
      .filter(m => m.role === 'user')
      .slice(-40)
      .map(m => m.content)
      .join('\n');

    const checkInText = checkIns
      .slice(0, 30)
      .map(c => `${c.date}: ${c.score}/10`)
      .join(', ');

    const prompt = `
Je bent een empathische welzijnsanalist. Analyseer de volgende gespreksberichten en stemmingsscores van een gebruiker.
Schrijf je analyse ALTIJD in informeel Belgisch-Nederlands, warm en persoonlijk — alsof je een goede vriend bent die eerlijk maar zacht praat.
GEEN therapeutentaal, GEEN klinische termen, GEEN lijsten of opsommingen.
Schrijf in doorlopende, menselijke zinnen. Maximaal 4 paragrafen.

Stemmingsscores van de afgelopen weken: ${checkInText || 'Geen data beschikbaar'}

Berichten van de gebruiker (alleen inhoud):
${convoText || 'Geen gesprekken beschikbaar'}

Genereer een JSON object met EXACT deze velden:
- "summary": een warme samenvatting van hoe het de afgelopen periode ging (2-3 zinnen)
- "pattern": een observatie over een terugkerend patroon of trigger die je ziet (1-2 zinnen, of null als er te weinig data is)
- "strength": iets positiefs dat je opmerkt over hoe deze persoon omgaat met moeilijke momenten (1-2 zinnen)
- "invitation": een zachte uitnodiging of reflectievraag die uitnodigt tot meer zelfbewustzijn (1 zin, als een vriendelijke vraag)
- "mood_trend": één woord dat de algemene tendens beschrijft: "stijgend", "dalend", "stabiel", of "wisselend"

Antwoord ALLEEN met het JSON object, niets anders.
`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          pattern: { type: ["string", "null"] },
          strength: { type: "string" },
          invitation: { type: "string" },
          mood_trend: { type: "string", enum: ["stijgend", "dalend", "stabiel", "wisselend"] }
        },
        required: ["summary", "pattern", "strength", "invitation", "mood_trend"]
      }
    });

    return Response.json({ analysis: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});