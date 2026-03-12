import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const tickets = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tickets" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    price: z.coerce.number(),
    theater: z.string(),
    rating: z.string(),
    international: z.boolean().optional(),
    rerelease: z.boolean().optional(),
  }),
});

export const collections = {
  tickets,
};
