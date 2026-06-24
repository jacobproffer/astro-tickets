// @ts-check
import { defineConfig, svgoOptimizer } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import llms from "astro-llms-md";

// https://astro.build/config
export default defineConfig({
  site: "https://tickets.proffer.dev/",
  trailingSlash: "always",

  integrations: [sitemap(), llms({
    siteUrl: "https://tickets.proffer.dev/",
    name: "Deadman's Brew",
    description: "The ongoing movie ticket collection of Jacob Proffer.",
    generateIndividualMd: true,
    generateLlmsTxt: true,
    generateLlmsFullTxt: true,
    titleSelector: "h1",
    contentSelector: "main",
    exclude: ["404", "404.html", "_astro"],
    verbose: false,
  })],

  // Security and performance optimizations
  security: {
    checkOrigin: true,
  },

  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Improve build performance
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('astro')) return 'vendor';
          },
        },
      },
    },
  },

  experimental: {
    svgOptimizer: svgoOptimizer()
  }
});