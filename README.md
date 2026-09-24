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

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Playwright end-to-end tests |
| `npm run test:ui` | Run Playwright tests in UI mode |

## Project structure

```
src/
  components/       Landing, home, library, color system, and step components
  components/steps/ Builder wizard steps (mood, sow date, basket, schedule, congrats)
  data/             Flower, mood, and curated basket data
  hooks/            Shared React hooks
  tokens/           Design tokens (primitives, semantic, numeric) as JSON + CSS
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
