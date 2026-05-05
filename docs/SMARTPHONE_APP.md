# Luna als smartphone-first webapp (PWA / mobiele browser)

**Doel / goal:** Luna ontwerpen en bouwen alsof de primaire client een **telefoon** is (Safari/Chrome, eventueel later **Capacitor**-wrap). Desktop is secundair.

---

## 1. Viewport, safe area, notch & home-indicator

### NL

- Gebruik een correcte viewport-meta: `width=device-width`, `initial-scale=1` (geen `user-scalable=no` tenzij juridisch/UX noodzakelijk — schaalt toegankelijkheid omlaag).
- **Safe area:** respecteer `env(safe-area-inset-top|right|bottom|left)` voor inhoud die tegen randen, notch of Dynamic Island zit (navigatie, fixed footers, full-screen panels).
- **Patroon:** op shell-niveau (bv. `AppShell`) `padding` of `margin` combineren met `max()` zodat oudere browsers niet breken, bv. `padding-bottom: max(1rem, env(safe-area-inset-bottom))`.
- **100vh-probleem iOS:** gebruik **`100dvh`** (en fallback `100vh` waar nodig) voor full-viewport layouts; `100svh`/`100lvh` zijn nuttig voor sticky UI (toolbar in/uit).
- **Statusbalk / thema:** `theme-color` (HTML meta) en PWA-manifest moeten aansluiten op de **echte** achtergrondkleur van de shell (geen harde clash met `black-translucent` op iOS).

### EN (short)

Treat notches and home indicators as first-class layout constraints. Prefer dynamic viewport units over classic `100vh` on iOS.

---

## 2. Touch: minimum 44×44 px, geen hover-only kritieke acties

### NL

- **Minimum interactiegebied ~44×44 CSS px** (Apple HIG / WCAG-richting). Kleinere iconen mogen visueel kleiner zijn mits **hit area** (`min-h`, `min-w`, `padding`, pseudo-element) groot genoeg is.
- **Geen kritieke flows** (opslaan, betalen, verwijderen, primaire navigatie) alleen via `:hover` of tooltips die op touch niet bestaan.
- **Focus states** moeten zichtbaar zijn voor toetsenbord/switch control — niet alleen “hover styling”.
- **Spacing tussen tappable elementen** om fout-taps te voorkomen (zeker in lijsten en bottom bars).

### EN (short)

If it matters on mobile, it must work without hover. Hit targets before pixel-perfect icon size.

---

## 3. `touch-action`, scroll chaining, overscroll

### NL

- **`touch-action`:** gebruik gericht (`pan-y`, `manipulation`) op horizontale carrousels of kaarten om **onbedoelde browser-zoom** of horizontaal scrollen te beperken; vermijd globaal `touch-action: none` op `body`.
- **Scroll chaining:** nested scrollers (chat + outer page) — test waar de scroll “blijft hangen”; overweeg één primaire scroll-as of `overscroll-behavior: contain` op inner panels om **pull-to-refresh / rubber-band** van de browser te isoleren.
- **Overscroll / bounce:** kan fixed headers/footers visueel laten “verspringen”; test op iOS en Android Chrome.
- **Pull-to-refresh:** kan conflicteren met verticale gestures in content; document gedrag per route.

### EN (short)

Prefer local `touch-action` and `overscroll-behavior` fixes over global gesture blocking.

---

## 4. Toetsenbord, focus en `visualViewport`

### NL

- Bij **focus op inputs** (chat composer, formulieren): zorg dat het veld **in beeld** blijft — `scrollIntoView` met `block: 'nearest'` / `'center'` waar nodig, en test met **iOS Safari** (adresbalk hoogte verandert).
- **`window.visualViewport`:** hoogte en `offsetTop` veranderen als het virtuele toetsenbord opent; fixed bottom UI kan “half” onder het toetsenbord zitten — overweeg listeners om padding/bottom offset aan te passen (throttle/debounce).
- Voorkom dat **fixed bottom bars** het invoerveld bedekken; reserveer ruimte of verplaats composer.

### EN (short)

Keyboard open ≠ resize like desktop. Test composer + bottom nav together.

---

## 5. PWA: manifest, icons, display-modi

### NL

- **`manifest.json` (of equivalent via Vite plugin):**
  - `name` / `short_name`
  - `start_url` (consistent met router basename)
  - `display`: `standalone` (app-achtig) vs `browser` — kies bewust; `standalone` verbergt browser-chrome maar verandert ook verwachtingen rond **terug-navigatie**.
  - `theme_color` + `background_color` (splash / task switcher)
  - `icons`: minstens **192** en **512** maskable + regular varianten waar nodig
- **Service worker:** alleen toevoegen met duidelijke cache-strategie; auth/token flows mogen niet “stale” serveren zonder versiebeheer.
- **iOS “Add to Home Screen”:** `apple-mobile-web-app-capable`, status bar style, en **touch icons** (`link rel="apple-touch-icon"`).

### EN (short)

PWA metadata must match real shell colors and icon set; test install + cold start.

---

## 6. Auth: Base44-token in WebView / in-app browser

### NL (projectspecifiek)

- Luna leest o.a. `access_token` uit de URL en bewaart die via `app-params` / `localStorage` (zie `src/lib/app-params.js`). Dat is **gevoelig** in embedded browsers:
  - **Referrers / logs / screenshots** kunnen de URL vastleggen — token in querystring is **kortlevend** en moet zo snel mogelijk uit de balk (`removeFromUrl`).
  - **WebViews** (Instagram, LinkedIn, mail clients): cookies/storage kunnen **strikter** zijn; test login callback end-to-end.
  - **Third-party cookie / ITP:** vertrouw niet op impliciete cross-site gedrag; houd auth in dezelfde site/origin waar mogelijk.
  - **Capacitor later:** `localhost` vs productie-API, deep links voor OAuth callback, en secure storage overwegen i.p.v. alleen webstorage.

### EN (short)

Treat tokens as secrets-in-transit: strip from URL, test in real in-app browsers, plan native storage for a future wrap.

---

## 7. Performance (mobiel)

### NL

- **Bundle:** houd initiële JS klein — `React.lazy` + `Suspense` voor zware routes (nu zijn veel pagina’s statisch geïmporteerd in `App.jsx`; dat is een duidelijke split-kandidaat).
- **Afbeeldingen:** `width`/`height` of aspect-ratio om layout shift te beperken; moderne formaten waar build dat toelaat; lazy loading onder de fold.
- **Netwerk:** TanStack Query defaults tunen voor mobiele latency; voorkom request-storms bij focus/resize.
- **Animaties:** respecteer `prefers-reduced-motion` voor grote bewegingen.

### EN (short)

Measure on throttled 4G + mid-tier phone; lazy routes and stable image metrics first.

---

## 8. Definition of Done (releasechecklist)

Gebruik deze lijst vóór een release die mobiel raakt.

- [ ] **Viewport / safe area:** geen inhoud onder notch/home indicator; fixed UI heeft correcte bottom/top inset.
- [ ] **Geen layout-break** op `100dvh` / keyboard open (chat + forms).
- [ ] **Tap targets:** primaire acties ≥ ~44×44 px; voldoende tussenruimte.
- [ ] **Geen hover-only** kritieke acties; focus states OK.
- [ ] **Scroll/touch:** geen onbedoelde zoom; nested scroll werkt; geen “stuck” scroll in chat.
- [ ] **PWA metadata:** manifest + icons + `theme-color` kloppen visueel op iOS en Android.
- [ ] **Auth:** token-flow getest in normale browser én minstens één **in-app browser** / WebView-scenario waar relevant.
- [ ] **Performance:** Lighthouse/mobile of vergelijkbare meting: geen excessieve JS op first route; LCP/CLS in acceptabele bandbreedte.
- [ ] **Toegankelijkheid:** contrast, font-schaal, reduced-motion sanity check.

---

## 9. Multi-agent handoff — backlog met “geen bestands-overlap”

Werk **strikt in zones** om merge-conflicten te beperken. Volgorde is suggestie; pas aan op sprint-prioriteit.

| Volgorde | Agent / thema | Zone (enkel hier wijzigen) | Opmerking |
|---------:|----------------|----------------------------|-----------|
| 1 | **Specs / richtlijnen** | `docs/**` | Alleen documentatie en specificaties — geen productiecode. |
| 2 | **Hooks** | `src/hooks/**` | Gedeelde logica (viewport, keyboard, safe-area helpers, media queries). Geen page-layouts hier. |
| 3 | **Onboarding** | `src/pages/Onboarding.jsx` + `src/components/**` **alleen** als naam/component duidelijk `onboarding`-prefix heeft (bv. map `src/components/onboarding/` aanmaken i.p.v. bestaande shell splitsen) | Vermijd gelijktijdig bewerken van `AppShell` met premium-agent — coördineer of sequentieer. |
| 4 | **Premium / product** | `src/pages/Chat.jsx`, `src/pages/Profiel.jsx`, `src/pages/Voortgang.jsx`, **entities / API-laag:** `src/api/**` en Base44-gerelateerde aanroepen die **uitsluitend** door deze pagina’s worden gebruikt (geen nieuwe hooks in `src/hooks` zonder hooks-agent) | Chat/Profiel/Voortgang zijn de primaire premium UI-oppervlakken. |
| 5 | **Shell / navigatie** | `src/components/shell/AppShell.jsx` + gerelateerde shell-componenten | Alleen wanneer geen andere agent actief in onboarding/premium dezelfde files wijzigt. |

**Overlap vermijden — harde regels**

- `/docs` = **specs only** (geen runtime-wijzigingen in `src/`).
- `/src/hooks` = **hooks agent** (herbruikbare hooks; geen complete page UI).
- **Premium agent** = `Chat`, `Profiel`, `Voortgang`, plus **`src/api/`** (Base44 client / entity-gerichte calls) — geen brede refactors buiten die scope.
- Wijzig je **één gedeelde file** (bv. `App.jsx`, `AppShell.jsx`)? Leg kort vast in PR-beschrijving en ping co-agent om conflicten te voorkomen.

---

## 10. Optionele toekomst: Capacitor-wrap

### NL

- Houd **routing en auth** “web normaal” (één origin); native shell voegt alleen **StatusBar**, **SplashScreen**, **Deep Links**, en secure storage toe.
- Test **safe areas** opnieuw — native overlays kunnen afwijken van Safari.
- iOS/Android **permissies** (microfoon, notificaties) niet aannemen in web-only code paths.

---

*Laatste tip:* test maandelijks op **één oudere iPhone** en **één mid-range Android**; dat vangt 80% van de smartphone-only bugs.

---

## Ontwikkelprincipe

- **Minimaal nieuwe code:** breid bestaande patronen uit; geen parallelle frameworks of “eigen varianten” naast de huidige stack.
- **Zoek eerst:** gebruik grep / projectzoeken vóór je nieuwe bestanden aanmaakt — vaak bestaat er al een component, pagina of hook die je kunt aanpassen.
- **Hooks:** nieuwe gedeelde hooks in `src/hooks/**` alleen wanneer **minstens twee** call sites dezelfde logica dupliceren; anders logica colocaten.
- **Stack hergebruiken:** shadcn onder `src/components/ui`, design tokens uit `index.css`, en de bestaande Base44-clientlaag **ongewijzigd** houden tenzij een gerichte wijziging strikt nodig is.
