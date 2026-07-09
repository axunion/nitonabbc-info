---
paths:
  - "**/*.css"
  - "**/*.astro"
---

# CSS Conventions

## Color Values

- **Always** use palette tokens — never hardcoded hex, rgb, or hsl values
  - Correct: `color: var(--blue-6);`
  - Wrong: `color: #1971c2;`
- Available palette tokens: `--gray-0` to `--gray-9`, and `--{color}-2/4/6/8` for blue, green, red, orange, violet, pink, indigo
- **Sole exception — decorative gradients**: the palette has no alpha or intermediate hues, so multi-stop decorative gradients may need values it cannot express. Prefer deriving from tokens with `color-mix()` (e.g. `color-mix(in srgb, var(--green-8) 50%, transparent)`). If a literal value is unavoidable, add a comment on the line above explaining why. This exception never applies to text, backgrounds, or borders

## Theme Variables

Six theme variables are defined in `global.css`. Override them in `_styles/variables.css` only:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--brand` | `var(--blue-6)` | Main color |
| `--surface` | `var(--gray-0)` | Background |
| `--text-1` | `var(--gray-9)` | Body text |
| `--text-2` | `var(--gray-6)` | Subtext |
| `--line` | `var(--gray-4)` | Borders and dividers |
| `--font-serif` | Times New Roman | Serif font |

- **Do not add new theme variables** — use palette tokens directly in components instead
- `variables.css` must only contain overrides that differ from the defaults above

## Scoping

- Use scoped `<style>` blocks inside Astro components
- Only use `<style is:global>` for intentional global overrides (e.g., `.viewport` background on a specific page)
- Never use `!important`

## Animations

Every CSS animation must have a `prefers-reduced-motion` counterpart — see "Reduced Motion" in `.claude/rules/a11y.md` for the required pattern.
