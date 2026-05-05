import { defineConfig, passthroughImageService } from 'astro/config';

import icon from "astro-icon";

/** @returns {import('astro').AstroIntegration} */
function devPagesIndex() {
  return {
    name: "dev-pages-index",
    hooks: {
      "astro:config:setup": ({ command, injectRoute }) => {
        if (command !== "dev") return;
        injectRoute({
          pattern: "/",
          entrypoint: new URL("./src/dev/index.astro", import.meta.url),
        });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService()
  },
  integrations: [icon(), devPagesIndex()]
});
