# The Hanging Bouquet

Seed and plug arrangements for hanging baskets — pick a mood, pick a planting date, and get a curated flower basket with a personalized grow schedule.

## What it does

1. **Landing page** — choose a mood (Pollinator, Romantic, Wild, Apothecary, Moody, Joyful) and a planting date.
2. **Basket builder** — browse curated baskets that match your mood and season, swap individual flowers for same-role alternatives (thriller / filler / spiller), and accept one.
3. **Grow schedule** — get sow dates, bloom windows, and care notes calculated from your planting date and grow zone.
4. **Congratulations / export** — download a PDF summary of your finished basket and schedule.

Also included:
- **Flower library** — browse all 31 flowers available for Zone 9–10, with sun, watering, and indoor-start notes.
- **Color system viewer** — inspect the design token / primitive color system driving each mood's theme.

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Radix UI](https://www.radix-ui.com/) primitives (dialog, popover, select, toggle group)
- [jsPDF](https://github.com/parallax/jsPDF) for basket/schedule export
- [Playwright](https://playwright.dev/) for end-to-end tests
- Design tokens (`src/tokens/`) driving mood-based theming via `data-theme`

## Design tokens: Figma → code

**The problem this solves:**

- **Design and code drift independently.** Colors, spacing, and type values get hand-copied from Figma into CSS once, and nobody keeps the two in sync after that — a value changed in Figma doesn't show up in the running app until someone remembers to go find and retype it in code, and vice versa.
- **Round-trips between design and code are slow.** Updating a color meant grepping for every hardcoded hex across the codebase, updating each one by hand, and hoping nothing was missed. That doesn't scale past a handful of files, and it discourages making design changes at all.
- **A design system applied unevenly to headless components.** [Radix UI](https://www.radix-ui.com/)'s primitives (`Popover`, `ToggleGroup`, `Dialog`, `Select`, `Separator`) ship zero visual styling — only behavior and accessibility state (`data-state`, ARIA roles, focus management). Without one shared source of truth for styling, it's easy for some components to get skinned with real tokens and others to get one-off hardcoded values, so parts of the app quietly fall out of sync with the design system even though everything is nominally "on Radix."

**The approach — a generated token pipeline:**

1. **Figma is the source of truth.** `src/tokens/primatives.json`, `semantic.json`, and `number.json` are Figma Variables exports (one file per variable collection): raw primitives (`color/maroon`, `spacing/24`, …), semantic tokens that alias primitives by role (`surface/base_moody` → `color/maroon`), and numeric scales (spacing, radius, font-size, font-weight).
2. **A build script generates CSS from those exports.** `scripts/build-tokens.mjs` reads the three JSON files and writes `src/tokens/tokens.generated.css` — real CSS custom properties, including every mood's `--surface-base` / `--interactive-primary` pair, resolved through Figma's own alias chain so the values can never disagree with the JSON.
3. **This runs automatically.** `predev` and `prebuild` run `npm run tokens:build` before `npm run dev` / `npm run build`, so the generated CSS is always current. Run it manually any time with `npm run tokens:build`.
4. **A thin hand-authored layer sits on top.** `tokens.css` imports the generated file and adds only what has no Figma equivalent — a true `#fff` swatch, a computed `color-mix()`, box-shadow values, and one convenience alias. Everything else lives in the generated file and should never be hand-edited; edit the JSON instead.
5. **Theming is one DOM attribute.** The active mood is applied as `data-theme="<mood>"` on `<html>`; every component reads `var(--surface-base)`, `var(--interactive-primary)`, etc. instead of hardcoding a mood's colors, so switching moods repaints the whole app instantly with no per-component logic.

**Headless components stay on the same system.** Radix primitives are skinned purely through these same CSS variables — e.g. `.home-mood-tab[data-state="on"] { background: var(--interactive-primary); }` — so a Radix-based component and a hand-rolled one look and re-theme identically. Whether a given piece of UI has been migrated onto a Radix primitive yet (see `blog/` for the running log) never causes an inconsistent look, because both draw from the same token layer rather than their own copy of the design.

**To change a value:** edit it in Figma, re-export the variable collection to update the JSON files (or hand-edit them directly during development), then run `npm run tokens:build` — or just start the dev server / build, which does it for you. Every theme, every component, and the `/colors` reference page (`src/components/ColorSystem.jsx`, which reads the live resolved CSS custom properties rather than storing its own copy) pick up the change with no further code edits.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Regenerate design tokens, then start the Vite dev server |
| `npm run build` | Regenerate design tokens, then build for production |
| `npm run tokens:build` | Regenerate `src/tokens/tokens.generated.css` from the Figma JSON exports |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Playwright end-to-end tests |
| `npm run test:ui` | Run Playwright tests in UI mode |

## Project structure

```
scripts/
  build-tokens.mjs    Generates tokens.generated.css from the Figma JSON exports
src/
  components/       Landing, home, library, color system, and step components
  components/steps/ Builder wizard steps (mood, sow date, basket, schedule, congrats)
  data/             Flower, mood, and curated basket data
  hooks/            Shared React hooks
  tokens/
    primatives.json, semantic.json, number.json   Figma Variables exports (source of truth)
    tokens.generated.css                          Generated CSS — do not hand-edit
    tokens.css                                     Imports the generated file + a small hand-authored layer
  utils/            Schedule calculation, basket generation, PDF export
public/
  flowers/, baskets/  Flower and basket imagery
  flower-library.md   Reference doc listing every flower and its metadata
  basket-images.md    Reference doc listing every curated basket and its contents
tests/              Playwright end-to-end specs
blog/               Write-ups on building this project
```

## Deployment

Pushing to the default branch deploys via GitHub Pages (see `.github/workflows/deploy.yml`). The Vite `base` is set to `/The-Hanging-Bouquet-/` for that deployment target.

## Grow zone

The app is currently scoped to **Zone 9–10**; flowers and baskets outside that zone's suitability are excluded from the library and builder.
