import { defineCollection, z } from "astro:content";

const tickets = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    price: z.coerce.number(),
    theater: z.string(),
    rating: z.string(),
    international: z.boolean().optional(),
  }),
});

export const collections = {
  tickets,
};
