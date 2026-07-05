---
name: create-event
description: Create a new event page. Use when asked to "add an event", "create a new page", "create an event for YYYY/MM", "イベントページを作って", or "新しいイベントを追加". Interactively sets color theme and basic information.
---

# Event Page Creation

Interactively create a new event page.

## Directory Structure

`_assets/` is always created. Others are created only when needed.

```
src/pages/{year}/{month}/
├── _assets/           # Images (hero.webp, etc.), PDFs
├── _components/       # All components (no sharing — all event-specific)
├── _config/           # Config files (when needed)
├── _layouts/          # Event Layout wrapper (multi-page events only)
├── _scripts/          # Event-specific scripts (when needed)
├── _styles/
│   └── variables.css  # Theme variable overrides (only when customizing theme)
├── _types/            # Event-specific type definitions (when needed)
└── *.astro            # Page files
```

## Component Guidelines

- **All components are event-specific**, with one exception: `MapFrame` (Google Maps embed) is imported from the shared `@/components/MapFrame.astro`. Never add new components to `src/components/`.
- Extract repeated elements (headings, cards, etc.) into `_components/`
- Vary styles slightly per event — avoid fixed templates
- Base on a formal, simple design and customize freely
- Use theme variables (`--brand`, `--surface`, etc.) and palette tokens (`--blue-6`, etc.)

## Component Templates

Reference implementations in `.claude/skills/create-event/templates/`:

| Template | Purpose |
|----------|---------|
| `ButtonLink.astro` | CTA button link (uses `--brand`, `--surface`) |
| `TimeTable.astro` | Schedule table |
| `Bracket.astro` | Decorative bracket text (uses `currentColor`) |
| `QAList.astro` | Q&A definition list |

Usage:
- Copy template content into the event's `_components/` directory
- Use as-is or customize to match the event's design
- Components not in templates (Header, Footer, headings, etc.) are created from scratch
- When a component has been copied unchanged across 2+ events, add it here as a new template (do not promote it to `src/components/` — past events are frozen archives)

## Multi-Page Events

A single-page event imports `variables.css` directly in `index.astro`. When an event has multiple pages, create a thin wrapper in `_layouts/Layout.astro` instead, so each page has one import and the theme cannot be forgotten:

```astro
---
import Layout from "@/layouts/Layout.astro";
import "../_styles/variables.css";

type Props = { title: string; favicon?: string };
---

<Layout {...Astro.props}><slot /></Layout>
```

Pages then use `import Layout from "./_layouts/Layout.astro";` (adjust relative depth for subdirectories) and never import `variables.css` themselves.

## Color Palette

Use color tokens defined in `src/styles/palette.css`:

- **Gray**: `--gray-0` (lightest) to `--gray-9` (darkest), 10 steps
- **Color scales**: `--{color}-2` (light), `--{color}-4`, `--{color}-6`, `--{color}-8` (dark)
- Available colors: blue, green, red, orange, violet, pink, indigo

## Theme Variables

Defaults defined in `global.css`:

```css
:root {
  --brand: var(--blue-6);     /* main color */
  --surface: var(--gray-0);   /* background */
  --text-1: var(--gray-9);    /* body text */
  --text-2: var(--gray-6);    /* subtext */
  --line: var(--gray-4);      /* borders and dividers */
  --font-serif: ...;          /* serif font */
}
```

For additional colors, reference palette tokens directly in components (`var(--pink-6)`, etc.). Do not add new theme variables.

## Event Format

| Format | Description |
|--------|-------------|
| Overnight | 2-day timetable, speaker intro, social event, partial attendance, packing list |
| Day-only | Date/time, speaker, venue, registration link only — no timetable needed |

## Color Theme

| Theme | Approach |
|-------|----------|
| Light (default) | No `variables.css` needed |
| Dark | Dark background, light text. Override `--surface`/`--text-1`/`--text-2` in `variables.css`. Add `color-scheme: dark` to `:root` to also darken scrollbars and form elements |
| Custom | Ask about main color and background additionally |

## Steps

### Step 1: Gather Basic Information

Use AskUserQuestion to ask (use Japanese labels for all options):

1. **Format** (header: "形式")
   - 宿泊あり（お泊まり会） — 2 days, with timetable
   - 宿泊なし（日帰り） — date/speaker/venue/registration only

2. **Color theme** (header: "配色")
   - ライト（デフォルト）
   - ダーク
   - カスタム

3. **Content** (header: "内容")
   - サンプルで作成 — generate with placeholder data
   - 直接入力 — user provides details as text

### Step 2: Gather Additional Information (if needed)

**Custom theme**: Ask about main color (blue/green/orange/purple) and background (light/dark)

**Direct input**: Ask the user to provide as text:
- Year/month, event name, date/time, venue, speaker name (optional), registration link (optional)

**Sample**: Ask for year/month only

### Step 3: Generate Files

**Branch suggestion**: Before generating files, suggest working on a new branch. This project auto-deploys on push to main — a separate branch prevents publishing an unfinished page and allows review before merging. Example: `git checkout -b event/{year}-{month}`

Generate files in this order:

1. **`_assets/` directory**: Place a `.gitkeep` file (empty directories are not tracked by git)
2. **`_components/`**: Copy from `templates/` and customize as needed; create other components from scratch
3. **`_styles/variables.css`**: Only when changing the theme
4. **`index.astro`**: Main page that imports and uses the components

**Overnight format sections**:
- Hero section (theme verse)
- Overview (date/time, venue, speaker, fee)
- Speaker introduction
- Program (2-day timetable)
- Social/recreation info
- Registration (form link, deadline)
- Other (partial attendance, packing list, access, contact)

**Day-only format sections**:
- Hero section
- Overview (date/time, venue, speaker)
- Registration (form link)
- Access and contact

### Step 4: Report Completion

1. List of created files
2. How to verify: `pnpm run dev` → `http://localhost:4321/{year}/{month}/`
3. Next steps (add hero image to `_assets/`, edit content, etc.)

## Notes

- Chat with the user in Japanese
- Extract repeated elements into `_components/`
- Always create the `_assets/` directory (as the target location for the hero image)
- All components go in the event-specific `_components/` — never add to `src/components/` (see Component Guidelines for the sole `MapFrame` exception)
- In `variables.css`, use only palette tokens (e.g., `--brand: var(--green-6);`) — no hex values
- Add `prefers-reduced-motion` support to all animations (`@media (prefers-reduced-motion: reduce)`)
- Components may look identical across events — this is intentional. Copying keeps each event independent and free to diverge; shared components create coupling that constrains future customization
