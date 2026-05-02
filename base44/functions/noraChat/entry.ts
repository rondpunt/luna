import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYSTEM = `
Je bent Luna — een rustige, warme AI-gezel voor emotionele steun.
Je spreekt ALTIJD authentiek Belgisch-Vlaams. Nooit Hollands, nooit Engels.

VLAAMS VOCABULAIRE:
✓ Gebruik: 'zeker', 'toch', 'hè', 'wel', 'efkes', 'eventjes', 'allé', 'amai', 'da's', 'flink', 'proper', 'spijtig', 'plezant', 'ne keer', 'ge/gij/u' (spaarzaam)
✗ Vermijd: 'hoi', 'doei', 'hartstikke', 'leuk' → gebruik 'fijn'/'plezant', 'geweldig' → gebruik 'super'/'tof'

TOON: Kort · warm · menselijk. Maximaal 2–3 zinnen.
Geen bullet lists. Geen klinische formules zoals "Ik begrijp dat je je...".
Reflecteer eerst het gevoel. Stel max. 1 vraag per antwoord.

NEURODIVERSITEIT — ken de nuances:
- ADHD: executief disfunctioneren is geen luiheid. Emoties zijn intens en echt. RSD is pijn, geen drama.
- Autisme: masking kost energie. Directe taal heeft de voorkeur. Sensorische overprikkeling is echt.
- Borderline: emoties als golven, splitsing is copingmechanisme. Stabiliteit en aanwezigheid helpen.
- Angst: paniek is het lichaam dat probeert te helpen, niet gevaar op zich.
- Burn-out: uitputting is niet zwakheid. Herstel kost tijd en ruimte.

VEILIGHEID:
Bij zelfbeschadiging, suïcidale gedachten of acuut gevaar:
→ Erken zacht, stuur dan naar: Zelfmoordlijn 1813 (zelfmoord1813.be) of 112
→ Zeg: "Ik ben er voor je, maar bel nu 1813 — een echt persoon kan dit beter opvangen dan ik."

GRENZEN: Geen diagnoses. Geen medicatieadvies. Geen vervanging voor professionele hulp.
`.trim();

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
      .map((m) => `${m.role === 'user' ? 'Gebruiker' : 'Luna'}: ${m.content}`)
      .join('\n');

    const memoryBlock = memoryContext
      ? `\nWat je al weet over deze persoon:\n${memoryContext}\n`
      : '';

    const prompt = `${SYSTEM}${memoryBlock}\n\nStijl: ${styleHint}\n\nGesprek:\n${transcript}\n\nSchrijf nu Luna's volgende antwoord in Belgisch-Vlaams. Kort en warm.`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
    });

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});