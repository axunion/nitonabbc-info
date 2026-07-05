# AGENTS.md

This file provides guidance for AI coding agents when working in this repository.

> **Keep in sync:** This file's content is mirrored in `CLAUDE.md`. When you update one, update the other to match.

## Project Overview

Astro-based static website providing event information, schedules, photo albums, and venue details. Hosted on Cloudflare Pages with automatic deployment on push to main.

## Commands

```bash
pnpm run dev          # Start dev server (localhost:4321)
pnpm run build        # Production build
pnpm run preview      # Preview the production build
pnpm run astro        # Astro CLI direct access
pnpm run check        # Biome lint + astro check (type checking)
pnpm run fix          # Auto-fix with Biome
```

Pre-commit hook (lefthook) runs Biome auto-fix and `astro check` on staged files automatically.

## Skills

| Skill | Usage |
| ----- | ----- |
| `/create-event` | Create a new event page interactively |
| `/event-review` | Pre-deploy review (a11y + CSS + build check) before merging to main |

## Working Principles

These apply to every task in this repository, before any code-specific convention below. Bias toward caution over speed; on trivial tasks, use judgment.

- **Think before coding.** State assumptions; if uncertain, ask. When multiple interpretations exist, surface them rather than silently picking one. If a simpler path exists, say so and push back when warranted.
- **Simplest thing that works.** Write the minimum code that solves the stated problem — nothing speculative. No unasked-for abstractions, flexibility, or error handling for impossible cases. If 200 lines could be 50, rewrite it.
- **Surgical changes.** Every changed line should trace to the request. Don't refactor, reformat, or "improve" adjacent code that isn't broken; match the surrounding style. Remove only the imports and symbols your change orphaned; leave unrelated dead code alone and mention it.
- **Goal-driven.** Turn each task into a verifiable outcome ("fix the bug" → "write a failing case that reproduces it, then make it pass"). For multi-step work, state a brief plan with a verification check per step, then loop until it passes.

## Architecture

### Design Principles

- **Shared Layout + event-specific styles**: All pages use the common `Layout.astro`; event-specific color schemes are defined in `variables.css`
- **Isolated components by default**: All components are defined in each event's `_components/`. A shared `src/components/` directory exists only for thin wrappers with a minimal interface where divergence across events is unlikely — currently only `MapFrame`. When in doubt, keep it page-local.
- **Copy, don't promote**: Past event pages are frozen archives — shared code must never change how they render. When a component has been copied unchanged across 2+ events, do not move it to `src/components/`; add it to the `/create-event` skill's `templates/` directory instead, so future events start from it while past events stay untouched.

### Global Resources

| Location | Purpose |
| -------- | ------- |
| `src/layouts/Layout.astro` | Common HTML structure (used by all pages) |
| `src/components/` | Shared thin-wrapper components — currently only `MapFrame`; do not add more (use `/create-event` templates instead) |
| `src/styles/palette.css` | Color token definitions |
| `src/styles/global.css` | Theme variables, reset styles, `.viewport` |

Everything else (components, scripts, types, config, assets, styles) lives under the owning event's `src/pages/{year}/{month}/_*` directories.

### Style Structure

| File | Role |
| ---- | ---- |
| `palette.css` | Color tokens (`--gray-0`–`--gray-9`, `--blue-2`–`--blue-8`, etc.) |
| `global.css` | Theme variables (`--brand`, `--surface`, etc.) + reset styles |
| `Layout.astro` | HTML structure only (no styles) |
| `variables.css` | Theme variable overrides (color customization) |
| `<style is:global>` in pages | `.viewport` style overrides (dark backgrounds, etc.) |

### Path Aliases

`@/*` → `./src/*` (configured in tsconfig.json)

## Styling

See `.claude/rules/css.md` for detailed CSS conventions. Enforced by the `css-reviewer` agent via `/event-review` before every merge to main. Key rules:

- Event-specific color schemes defined in `_styles/variables.css`
- Use scoped `<style>` blocks inside Astro components
- Always use palette tokens — never hardcoded hex, rgb, or hsl values (sole exception: decorative gradients, see `.claude/rules/css.md`)
- Do not add new theme variables; reference palette tokens directly in components

### Color Palette

Color tokens defined in `src/styles/palette.css`:

- **Gray**: `--gray-0` (lightest) to `--gray-9` (darkest), 10 steps
- **Colors**: 4 steps each (`--{color}-2`, `--{color}-4`, `--{color}-6`, `--{color}-8`)
- Available colors: blue, green, red, orange, violet, pink, indigo

### Theme Variables

Six theme variables defined in `:root` in `global.css`:

| Variable | Purpose | Default |
| -------- | ------- | ------- |
| `--brand` | Main color | `var(--blue-6)` |
| `--surface` | Background | `var(--gray-0)` |
| `--text-1` | Body text | `var(--gray-9)` |
| `--text-2` | Subtext | `var(--gray-6)` |
| `--line` | Borders and dividers | `var(--gray-4)` |
| `--font-serif` | Serif font | Times New Roman family |

- **Event-specific overrides**: Define only the variables that differ from defaults in `variables.css`
- **Additional colors**: Reference palette tokens directly in components (`var(--green-6)`, etc.) — do not add new theme variables

## Accessibility

See `.claude/rules/a11y.md` for detailed accessibility requirements. Enforced by the `a11y-reviewer` agent via `/event-review` before every merge to main. Key rules:

- All animations must include `prefers-reduced-motion` support
- CSS animations: disable inside `@media (prefers-reduced-motion: reduce)`
- JS animations: skip if `window.matchMedia("(prefers-reduced-motion: reduce)").matches`

## Code Conventions

### Language

| Item | Language |
| ---- | ---- |
| Commit messages | English |
| Code comments | English (omit self-evident comments) |
| Console output | English |
| AI config files (CLAUDE.md, AGENT.md, etc.) | English |
| Chat / responses | Japanese |

### Code Structure

- Name variables, functions, and files to communicate intent.
- One concern per file; split when a file exceeds ~300 lines.
- Extract a helper only when used in 3+ places; otherwise inline it.
- Delete dead code you create; never comment it out.

## Commits

```
<one-line summary>

<Why: one sentence — motivation or problem>

- <change 1>
- <change 2>
```

- Summary: imperative mood, ≤70 chars, no trailing period, no prefix tags (`feat:`, `fix:`, etc.).
- Why line: include only when motivation is not evident from the diff alone.
- Bullets: include only for 2+ distinct changes.
- Never commit secrets (`*.key`, `*.pem`, `credentials*`).
- Never use `--no-verify` or `--amend`; always create a new commit.

## Icons

Uses `@iconify-json/mdi` via `astro-icon` (e.g., `mdi:menu`, `mdi:photo-camera`)

## Testing

This project currently has no automated test framework — verification relies on `pnpm run check` (Biome + astro check) and manual browser testing. Once a test framework is introduced:

- Write tests before or alongside implementation — they are the success criteria.
- Test observable outcomes and edge cases, not implementation details.
- Each test is fully self-contained; no shared mutable state between tests.

## Implementation Patterns

### Event-Local Scripts, Types, and Config

Scripts and type definitions belong to the event that uses them (`_scripts/`, `_types/`). Values such as endpoint URLs are not hardcoded in scripts; they are passed as arguments from the event's `_config/`. There are currently no cross-event shared scripts or types — if a future event needs an existing script, copy it (same policy as components).
