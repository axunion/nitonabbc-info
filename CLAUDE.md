# CLAUDE.md

This file provides guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview

Astro-based static website providing event information, schedules, photo albums, and venue details. Hosted on Cloudflare Pages with automatic deployment on push to main.

## Commands

```bash
pnpm run dev          # Start dev server (localhost:4321)
pnpm run build        # Production build
pnpm run preview      # Preview the production build
pnpm run check        # Biome lint + astro check (type checking)
pnpm run fix          # Auto-fix with Biome
```

## Architecture

### Design Principles

- **Shared Layout + event-specific styles**: All pages use the common `Layout.astro`; event-specific color schemes are defined in `variables.css`
- **Fully isolated components**: All components are defined in each event's `_components/`. No shared component directory exists

### Global Resources

| Location | Purpose |
| -------- | ------- |
| `src/layouts/Layout.astro` | Common HTML structure (used by all pages) |
| `src/styles/palette.css` | Color token definitions |
| `src/styles/global.css` | Theme variables, reset styles, `.viewport` |
| `src/types/` | Shared type definitions (API types, etc.) |
| `src/scripts/` | Shared scripts (`uploadImages`, `fetchFileList`, `sanitizeFileName`) |

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

## Code Conventions

| Item | Language |
| ---- | -------- |
| Commit messages | English |
| Code comments | English (omit self-evident comments) |
| Console output | English |
| Chat / responses | Japanese |

### Styling

See `.claude/rules/css.md` for detailed CSS conventions. Key rules:

- Event-specific color schemes defined in `_styles/variables.css`
- Use scoped `<style>` blocks inside Astro components
- Always use palette tokens — never hardcoded hex, rgb, or hsl values
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

### Accessibility

See `.claude/rules/a11y.md` for detailed accessibility requirements. Key rules:

- All animations must include `prefers-reduced-motion` support
- CSS animations: disable inside `@media (prefers-reduced-motion: reduce)`
- JS animations: skip if `window.matchMedia("(prefers-reduced-motion: reduce)").matches`

### Icons

Uses `@iconify-json/mdi` via `astro-icon` (e.g., `mdi:menu`, `mdi:photo-camera`)

## Skills

| Skill | Usage |
| ----- | ----- |
| `/create-event` | Create a new event page interactively |
| `/event-review` | Pre-deploy review (a11y + CSS + build check) before merging to main |

## Implementation Patterns

### Shared Scripts and Event-Specific Config

Shared scripts (`src/scripts/`) do not depend on event-specific config. Values such as endpoint URLs are passed as arguments from the event's `_config/`.

### Shared Type Definitions

Types shared across multiple files are defined in `src/types/`.
