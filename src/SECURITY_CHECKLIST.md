# Nora — Security basis-checklist

Stand: opleveringsmoment. Dit is geen pentest, wel een controle van de fundamenten.

## 1. Authenticatie
- [x] Login wordt 100% afgehandeld door het Base44-platform; er is geen eigen login-pagina.
- [x] `App.jsx` toont alleen `/`, `/onboarding`, `/pricing` en de juridische pagina's wanneer `authError.type === "auth_required"`. Alle andere routes (chat, dagboek, inzichten, profiel, privacycentrum, admin) zitten ach­ter de `AuthProvider`.
- [x] Backend functie `noraChat` controleert `base44.auth.me()` en geeft 401 terug als er geen gebruiker is.
- [x] Backend functie `analyzeWellbeing` doet dezelfde 401-check.
- [ ] **Open punt**: `pages/AdminDashboard.jsx` is een UI-pagina zonder admin-rolcheck. Op dit moment is dat een dashboard met fake-cijfers (geen echte data), maar zodra het echte gegevens toont, moet er een `user.role === "admin"` check toegevoegd worden, idealiter in een ProtectedRoute-wrapper én in de bijbehorende backend functie.

## 2. Row-Level Security / data-eigendom
- [x] Alle entiteiten met persoonlijke data (`Conversation`, `Message`, `MoodCheckin`, `JournalEntry`, `Memory`, `UserPreferences`, `Subscription`, `Notification`, `SafetyEvent`) bevatten een `userId`-veld.
- [x] Frontend gebruikt enkel de standaard SDK-calls (`base44.entities.X.list/filter/create`) — Base44 dwingt automatisch af dat een gebruiker enkel zijn eigen records ziet, behalve voor admins.
- [x] `User`-entiteit heeft de ingebouwde Base44 RLS: alleen admins kunnen andere users listen/updaten/deleten.
- [x] Backend functies gebruiken `createClientFromRequest(req)` en doen alle integraties via `base44.asServiceRole.integrations.Core.InvokeLLM` — service role wordt **niet** gebruikt om entiteiten te lezen/schrijven, dus RLS blijft intact.
- [ ] **Open punt**: zodra je `Memory`/`MoodCheckin`/`JournalEntry` gaat schrijven vanuit backend, altijd `userId: user.id` zelf injecteren in plaats van uit de body te trusten.

## 3. Geen secrets in de frontend
- [x] Geen API-sleutels in code: alle LLM-calls gaan via backend functies (`noraChat`, `analyzeWellbeing`) die `Deno.env.get` of het Base44 platform gebruiken.
- [x] Geen `.env`-waarden in `index.html`, `App.jsx` of pagina's.
- [x] `OPENAI_API_KEY` etc. worden niet rechtstreeks aangesproken — `InvokeLLM` regelt dat platform-side.
- [x] `base44Client.js` is een geïnitialiseerde client die enkel het ingelogde-gebruikers-token gebruikt, geen secret.

## 4. HTTPS / externe links
- [x] Alle externe links in de UI gebruiken `https://`:
  - Onboarding & chat verwijzen naar `https://zelfmoord1813.be` (en het korte nummer 1813).
  - `tel:1813` en `tel:112` gebruiken het correcte tel-protocol.
  - Lettertype-import in `index.css` gebruikt `https://fonts.googleapis.com`.
- [x] Mailto-links (`mailto:hello@nora.app`) zijn veilig.
- [x] Geen `http://`-links of mixed content gevonden in de codebase.
- [ ] **Aanbeveling**: zet bij externe `<a>`-tags `target="_blank" rel="noopener noreferrer"` zodra je naar third-party gaat openen. Voor in-app `<Link>` van react-router-dom is dat niet nodig.

## 5. AI-veiligheid
- [x] System prompt (`functions/noraChat.js`) instrueert de AI altijd in Belgisch-Nederlands te antwoorden, ook als de gebruiker een andere taal probeert.
- [x] System prompt verbiedt diagnoses, medisch advies en doet doorverwijzing naar 1813/112 bij signalen van zelfverwonding/suïcidaliteit.
- [x] Geen disclaimers meer als "Ik begrijp dat je je..." formules.
- [x] Maximaal 2-3 alinea's, hoogstens één vraag per antwoord.

## 6. Algemeen
- [x] Geen `dangerouslySetInnerHTML` in de codebase.
- [x] Geen `eval`/`new Function` in app-code.
- [x] Foutafhandeling in `noraChat` lekt geen stack-traces, geeft enkel `error.message`.
- [ ] **Open punt**: voeg op termijn rate-limiting toe aan `noraChat` (bv. via een Notification/SafetyEvent-counter) om misbruik tegen te gaan.

## Samenvatting
De fundering is veilig: auth en RLS staan correct, geen secrets in frontend, alle externe links zijn HTTPS, AI heeft een veilige system prompt. De drie open punten hierboven zijn aandachtspunten voor de volgende iteratie, niet blokkers voor oplevering.