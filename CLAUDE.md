# CLAUDE.md

## Project Overview

Astro-based static website providing event information, schedules, photo albums, and venue details. Hosted on Cloudflare Pages with automatic deployment on push to main.

## Skills

| Skill | Usage |
| ----- | ----- |
| `/create-event` | Create a new event page interactively |
| `/event-review` | Pre-deploy review (a11y + CSS + build check) before merging to main |

## Approach

These apply to every task in this repository, before any code-specific convention below. Bias toward caution over speed; on trivial tasks, use judgment.

- **Change scope.** Change only what was requested. Don't "improve" adjacent code, comments, or formatting; match the existing style. Delete code your own change makes unused, never leave it commented out. Point out pre-existing dead code only; don't delete, split, or refactor it unless asked.
- **Implementation size.** Don't add unrequested features, abstractions, or configurability. Extract a helper only when it's used in 3+ places; otherwise inline it. Don't write error handling for cases that can't happen.
- **Uncertainty.** When more than one interpretation is possible, present the options instead of silently picking one.

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

## Styling

See `.claude/rules/css.md` for CSS conventions — palette tokens (`src/styles/palette.css`), the six theme variables and their defaults (`global.css`), `variables.css` overrides, scoping, and the decorative-gradient exception. Enforced by the `css-reviewer` agent via `/event-review` before every merge to main.

## Accessibility

See `.claude/rules/a11y.md` for accessibility requirements — reduced motion, alt text, heading hierarchy, keyboard access, and color contrast. Enforced by the `a11y-reviewer` agent via `/event-review` before every merge to main.

## Code Conventions

### Language

Default to Japanese for everything interactive — chat replies, plan-mode proposals, clarifying questions, and any other back-and-forth during the session.

Switch to English for durable artifacts: things other people or tools will read after the session ends — commit messages, code comments (omit self-evident ones), console/log/error output, AI-readable instruction files (CLAUDE.md and the like), and reader-facing docs (README and the like). Scratch notes and other throwaway dev artifacts stay in Japanese.

### Code Structure

- Name variables, functions, and files to communicate intent.
- One concern per file; split when a file exceeds ~300 lines.

## Commits

```
<summary: imperative mood, ≤70 chars, no trailing period, no prefix tags (`feat:`, `fix:`, etc.)>

<motivation: one sentence, only when not evident from the diff>

- <change bullets: only for 2+ distinct changes>
```

- Never commit secrets (`*.key`, `*.pem`, `credentials*`).
- Never use `--no-verify`. Use `--amend` only when explicitly asked; default to a new commit.

## Testing

This project currently has no automated test framework — verification relies on `pnpm run check` (Biome + astro check) and manual browser testing. Once a test framework is introduced:

- Write tests before or alongside implementation — they are your success criteria.
- Test observable outcomes and edge cases, not implementation details.
- Each test is fully self-contained; no shared mutable state between tests.

## Implementation Patterns

### Event-Local Scripts, Types, and Config

Scripts and type definitions belong to the event that uses them (`_scripts/`, `_types/`). Values such as endpoint URLs are not hardcoded in scripts; they are passed as arguments from the event's `_config/`. There are currently no cross-event shared scripts or types — if a future event needs an existing script, copy it (same policy as components).
