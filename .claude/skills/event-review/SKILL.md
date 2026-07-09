---
name: event-review
description: Run a comprehensive pre-deploy review before merging an event branch to main. Invokes a11y-reviewer and css-reviewer agents, then runs a build check. Use before pushing to main, which auto-deploys to Cloudflare Pages. Invoke whenever the user asks to "review this branch", "check before merging", "is this ready to deploy", or wants to confirm changes are clean before pushing.
---

# Pre-deploy Event Review

Run a complete review pipeline before pushing to main (which auto-deploys to Cloudflare Pages).

## Steps

1. **Identify changed files** — run `git diff --name-only main` to find modified/added `.astro` and `.css` files in the current branch
2. **Accessibility review** — invoke the `a11y-reviewer` agent on the changed Astro files
3. **CSS convention review** — invoke the `css-reviewer` agent on the changed CSS and Astro files
4. **Check** — run `pnpm run check` (Biome lint + `astro check` type checking)
5. **Build check** — run `pnpm run build` to catch build failures (the build alone does not type-check)

## Report Format

Summarize results in three sections:

- **A11y**: pass / issues found (with file:line references)
- **CSS**: pass / violations found (with file:line references)
- **Check & Build**: pass / errors (with full error output)

If all pass: confirm the branch is ready to merge to main.
If any fail: list all issues grouped by category and suggest fixes before merging.
