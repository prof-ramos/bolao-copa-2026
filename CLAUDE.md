# CLAUDE.md — Bolão Brasil Copa 2026

Reference guide for AI assistants working on this codebase.

## Project Overview

A zero-dependency, single-page web application for predicting Brazil's FIFA World Cup 2026 group-stage match scores (Group C). Deployed as a static site via GitHub Pages at `prof-ramos.github.io/bolao-copa-2026`.

**Key constraints:**
- No build step, no bundler, no server
- Vanilla HTML/CSS/JavaScript (ES modules)
- All state lives in the browser (`localStorage`, URL params)
- CDN-only external dependencies (`html2canvas`, `lz-string`, Google Fonts)

---

## Repository Structure

```
bolao-copa-2026/
├── index.html              # Entry point (dev / local use)
├── css/                    # Modular CSS (mirrored in docs/css/)
│   ├── variables.css       # CSS custom properties (--color-*, etc.)
│   ├── base.css            # Reset, typography, layout foundations
│   ├── components.css      # Match cards, inputs, buttons, toast
│   ├── themes.css          # Dark / light theme overrides
│   ├── responsive.css      # Mobile-first media queries
│   └── print.css           # A4 print layout
├── js/                     # ES module source (mirrored in docs/js/)
│   ├── app.js              # BolaoApp — main controller, entry point
│   ├── render.js           # MatchRenderer — dynamic HTML generation
│   ├── storage.js          # StorageManager — localStorage abstraction
│   ├── share.js            # ShareManager — URL encoding / Web Share API
│   ├── theme.js            # ThemeManager — dark/light toggle
│   ├── print.js            # PrintManager — window.print() wrapper
│   ├── image.js            # ImageExporter — html2canvas wrapper
│   └── data/
│       ├── matches.js      # MATCHES array (Group C fixture data)
│       ├── countries.js    # COUNTRIES map (code → name, flag emoji)
│       └── scoring.js      # SCORING rules + calculatePoints/getOutcome
├── tests/                  # Vitest unit tests (root, mirrors docs/tests/)
│   ├── scoring.test.js
│   ├── storage.test.js
│   ├── share.test.js
│   ├── theme.test.js
│   ├── matches.test.js
│   └── countries.test.js
├── docs/                   # GitHub Pages deploy root (mirrors root)
│   ├── index.html          # Production HTML (kept in sync with root)
│   ├── css/                # Mirrors css/
│   ├── js/                 # Mirrors js/
│   └── tests/              # Mirrors tests/
├── vitest.config.js        # Vitest config — jsdom env, tests/**/*.test.js
├── package.json            # devDeps: vitest, jsdom
├── ARQUITETURA.md          # Architecture analysis
├── ANALISE-FRONTEND.md     # Frontend/UX audit
└── README.md
```

**Important:** `docs/` is a verbatim mirror of the root `css/`, `js/`, and `index.html`. When editing JS or CSS files, **always update both locations** (root and `docs/`).

---

## Development Workflow

### Prerequisites

```bash
npm install   # installs vitest + jsdom (dev only)
```

No build required. Open `index.html` directly in a browser or use any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

### Running Tests

```bash
npm test          # vitest run (single pass)
npx vitest        # watch mode
```

Tests use `jsdom` environment. All test files live in `tests/` and follow the pattern `<module>.test.js`.

### Deployment

GitHub Pages serves the `docs/` directory from `main` branch. To deploy:
1. Edit files under root `css/` and `js/`
2. Mirror changes to `docs/css/` and `docs/js/`
3. If `index.html` changes, update `docs/index.html` too
4. Push to `main`

---

## Architecture

### Module Responsibilities

| Module | Class / Export | Responsibility |
|--------|---------------|----------------|
| `app.js` | `BolaoApp` | Init, event wiring, global exposure |
| `render.js` | `MatchRenderer` | Builds match card HTML from data |
| `storage.js` | `StorageManager` | JSON persistence via localStorage |
| `share.js` | `ShareManager` | Encode/decode predictions to URL params |
| `theme.js` | `ThemeManager` | Detect/apply/toggle dark/light theme |
| `data/matches.js` | `MATCHES` (default) | Fixture array for Group C |
| `data/countries.js` | `COUNTRIES` | Map: 3-letter code → `{ name, flag }` |
| `data/scoring.js` | `SCORING`, `calculatePoints`, `getOutcome` | Scoring logic |

### Singleton Pattern

Each manager module exports both a **class** and a **singleton instance**:

```js
export class StorageManager { ... }
export const storage = new StorageManager();  // singleton
export default StorageManager;
```

`BolaoApp` uses the singletons. Tests instantiate classes directly.

### Data Flow

1. On `DOMContentLoaded`, `BolaoApp.init()` runs
2. `MatchRenderer.renderMatches()` builds DOM from `MATCHES` + `COUNTRIES` data
3. `loadData()` checks URL `?data=` param first, then `localStorage`
4. Score inputs trigger a debounced (800ms) `saveData()` to `localStorage`
5. Share: predictions encoded via LZString → URL query param `?data=`
6. Export: `html2canvas` captures the DOM and triggers a PNG download

### State Shape (localStorage key: `bolao_copa_2026_v3`)

```json
{
  "participantName": "string",
  "scores": {
    "g1": { "home": "2", "away": "0" },
    "g2": { "home": "1", "away": "1" },
    "g3": { "home": "3", "away": "0" }
  },
  "timestamp": "ISO 8601 string",
  "version": 1
}
```

Match IDs `g1`–`g3` correspond to Group C rounds 1–3. Only IDs starting with `"g"` are persisted.

### HTML Conventions

- Score inputs: `<input data-game="g1" data-team="home|away">`
- Theme toggle: `<button data-theme-toggle>`
- Matches container: `<div id="matches-container">` (filled dynamically by `MatchRenderer`)
- Theme applied via `data-theme="dark|light"` on `<html>`
- Global window functions exposed for inline `onclick` handlers: `clearAll()`, `exportAsImage()`, `shareBolao()`, `printBolao()`

---

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| CSS classes | kebab-case | `.match-card`, `.score-input`, `.btn-row` |
| CSS variables | `--color-*` prefix | `--color-bg`, `--color-primary` |
| HTML IDs | kebab-case | `g1-home`, `participantName` |
| HTML `data-*` | kebab-case | `data-game`, `data-team`, `data-theme-toggle` |
| JS functions | camelCase | `collectData()`, `saveData()`, `loadData()` |
| JS constants | UPPER_SNAKE_CASE | `STORAGE_KEY`, `MATCHES`, `SCORING` |
| JS classes | PascalCase | `BolaoApp`, `StorageManager` |
| Team codes | 3-letter uppercase | `BRA`, `MAR`, `HAI`, `SCO` |

---

## CSS Architecture

CSS is organized into six files loaded in order:

1. `variables.css` — all `--color-*` and `--*` custom properties
2. `base.css` — reset, body, typography
3. `components.css` — UI components
4. `themes.css` — dark/light overrides on `[data-theme]`
5. `responsive.css` — mobile-first breakpoints
6. `print.css` — `@media print` styles

**Do not** add new custom properties outside `variables.css`.

---

## Testing Conventions

- Framework: **Vitest** with jsdom environment
- Import style: named imports from the class file, not the singleton
- Test files mirror module names: `storage.js` → `storage.test.js`
- Use `describe` blocks per function/class, `it` for each case
- No mocking of external CDN libs (LZString, html2canvas); test only pure logic

Example pattern:
```js
import { calculatePoints } from '../js/data/scoring.js';

describe('calculatePoints', () => {
  it('returns 3 for exact score', () => {
    expect(calculatePoints({ home: 2, away: 1 }, { home: 2, away: 1 })).toBe(3);
  });
});
```

---

## Key Constraints for AI Assistants

1. **No build tooling.** Do not introduce Webpack, Vite, Rollup, TypeScript compilation, or any transpilation step.
2. **Mirror docs/.** Any change to `js/`, `css/`, or `index.html` must be reflected in the corresponding `docs/` path.
3. **ES modules only.** All JS files use `import`/`export`. The `package.json` sets `"type": "module"`.
4. **No new runtime dependencies.** External libs (html2canvas, lz-string) are loaded from CDN inside `index.html`. Do not add `npm` runtime dependencies.
5. **Storage key versioning.** If the localStorage schema changes, increment `SCHEMA_VERSION` in `storage.js` and add a migration in `StorageManager.migrate()`.
6. **Team codes.** Always use the 3-letter codes defined in `js/data/countries.js`. Add new teams there before referencing them in matches.
7. **Match IDs.** Group-stage match IDs follow the pattern `gN` (e.g., `g1`, `g2`). App logic filters on the `"g"` prefix — maintain this convention.
8. **Singletons vs classes.** Use the exported singleton (`storage`, `themeManager`, etc.) in application code. Use the class directly in tests.

---

## Scoring Rules

| Outcome | Points |
|---------|--------|
| Exact score match | 3 pts |
| Correct result (W/D/L) | 1 pt |
| Wrong result | 0 pts |

Maximum per match: 3 pts. Maximum total (3 matches): 9 pts.

Implemented in `js/data/scoring.js` — `calculatePoints(prediction, result)`.
