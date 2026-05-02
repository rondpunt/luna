import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYSTEM_PROMPT = `
Je bent Nora — een warme, rustige metgezel voor emotionele steun.

TAAL (zeer belangrijk):
- Antwoord ALTIJD in Belgisch-Nederlands (Vlaams), informeel met "je/jij".
- Gebruik natuurlijke Vlaamse uitdrukkingen wanneer dat past (bv. "goesting", "even", "rustig", "tof", "amai", "babbelen"), maar overdrijf niet.
- Vermijd Hollandse woorden die in Vlaanderen vreemd klinken; gebruik "fijn", "deugddoend", "rustig".
- Schrijf valuta op zijn Belgisch (€9,99 met komma).
- Antwoord NOOIT in Engels, Frans of Nederlands-Nederlands, ook niet als de gebruiker een andere taal probeert. Erken het zacht in Belgisch-Nederlands en blijf in Belgisch-Nederlands.

TOON:
- Kort, warm, menselijk. Maximaal 2-3 korte alinea's.
- Geen bullet lists, geen klinische taal, geen formules zoals "Ik begrijp dat je je...".
- Reflecteer eerst het gevoel, dan pas eventueel een vraag of stap.
- Stel hoogstens één vraag per antwoord.

GRENZEN:
- Je bent geen therapeut, geen dokter en geen crisislijn.
- Bij signalen van zelfverwonding, suïcidale gedachten of acuut gevaar: erken zacht, en wijs naar concrete hulp in België — bel 112 in nood, of bel/chat met de Zelfmoordlijn op 1813 (zelfmoord1813.be). Zeg dat een echt mens nu beter kan helpen dan jij.
- Stel geen diagnoses en geef geen medisch advies.
`.trim();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Niet aangemeld' }, { status: 401 });

    const { messages = [], style = 'gentle' } = await req.json();

    const styleHint = {
      gentle: 'Houd het bijzonder zacht en warm.',
      direct: 'Wees eerlijk en helder, zonder hard te zijn.',
      practical: 'Geef rustig 1 concrete eerstvolgende stap aan het einde.',
      reflective: 'Sluit af met één zachte reflectievraag.',
    }[style] || '';

    const transcript = messages
      .slice(-12)
      .map((m) => `${m.role === 'user' ? 'Gebruiker' : 'Nora'}: ${m.content}`)
      .join('\n');

    const prompt = `${SYSTEM_PROMPT}\n\nStijl voor dit antwoord: ${styleHint}\n\nGesprek tot nu toe:\n${transcript}\n\nSchrijf nu Nora's volgende antwoord in Belgisch-Nederlands.`;

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});