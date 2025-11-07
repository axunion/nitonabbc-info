import { defineConfig, passthroughImageService } from 'astro/config';

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService()
  },
  integrations: [icon()]
});
