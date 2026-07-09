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
- Vary the visual design per event — the `templates/` components below are functional starting points, not a fixed look to replicate
- Base on a formal, simple design and customize freely
- Use theme variables (`--brand`, `--surface`, etc.) and palette tokens (`--blue-6`, etc.)
- **Design mobile-first**: build the phone-width layout first, then layer on wider-viewport adjustments with `min-width` media queries. Most visitors open these pages from a link shared on a phone, so the small-viewport layout is the primary experience, not an afterthought.

## Component Templates

Reference implementations in `.claude/skills/create-event/templates/`:

| Template | Purpose |
|----------|---------|
| `ButtonLink.astro` | CTA button link (uses `--brand`, `--surface`) |
| `TimeTable.astro` | Schedule table |
| `Bracket.astro` | Decorative bracket text (uses `currentColor`) |
| `QAList.astro` | Q&A definition list |

These exist to keep structural and accessibility details consistent (markup shape, tap target sizing, `rel="noopener"`, wiring to theme tokens instead of hardcoded colors) — not to make every event look the same. Treat the markup and token usage as the reusable part; treat the visual treatment (spacing, decoration, borders like Bracket's corner style, font choices like TimeTable's monospace column) as free to reshape per event.

Usage:
- Copy template content into the event's `_components/` directory
- Keep the underlying structure and theme-token usage; restyle the visual details so this event doesn't just look like the last one that used the template
- Components not in templates (Header, Footer, headings, etc.) are created from scratch
- When a component has been copied unchanged across 2+ events, add it here as a new template (do not promote it to `src/components/` — past events are frozen archives)

## Referencing Past Events

It's natural to look at a similar past event's page to see what a section typically covers or what order information appears in — that's useful structural context, and the Event Format sections below exist for exactly this purpose. But a past page is a frozen archive of *that* event: its wording and layout CSS express a one-off design decision, not a reusable pattern.

- **OK to reference**: which sections exist, what order they appear in, roughly what information each one holds
- **Not OK to reuse as-is**: sentence-level copy (headlines, body text) and layout CSS (spacing, grid structure, decorative treatments) — write new copy and styles for the new event even when the section list looks the same
- If a past page's overall feel matches what the user wants, treat it as a mood reference and reimplement it in your own words and CSS — do not copy-paste text or `<style>` blocks from it
- This is the same reasoning as "Copy, don't promote" in CLAUDE.md, applied to content instead of components: shared wording or styles create coupling between events that should stay independent

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

## Colors

Palette tokens and the six theme variables are documented in CLAUDE.md and `.claude/rules/css.md` (sources: `src/styles/palette.css`, `global.css`). For additional colors, reference palette tokens directly in components (`var(--pink-6)`, etc.) — do not add new theme variables.

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

**When direction is still unclear**: If the user asks for something like "make it feel special" or "give it a different vibe" without saying what that means, don't guess by defaulting to a past event's color or layout — ask a follow-up question via AskUserQuestion (e.g., offer a couple of concrete color/mood directions to choose from) before generating files.

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

- Follow `.claude/rules/css.md` and `.claude/rules/a11y.md` (palette tokens only in `variables.css`, `prefers-reduced-motion` on all animations)
- Duplicated component *code* across events is fine and intentional — it's the copy-don't-promote tradeoff that keeps each event independent. It's the visual *outcome* that should still diverge; see "Component Templates" and "Referencing Past Events" above
