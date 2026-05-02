---
name: build-check
description: Run pnpm build to validate TypeScript types and Astro build. Use this before committing, before pushing to main, or whenever TypeScript errors are suspected after editing .astro or .ts files.
disable-model-invocation: true
---

Run the following command and report the result:

```bash
pnpm run build
```

If it fails, show the error output and suggest fixes.
If it succeeds, confirm the build passed and is ready to push.
