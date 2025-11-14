import { defineCollection, z } from "astro:content";

const tickets = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    price: z.coerce.number(),
    theaters: z.string(),
    ratings: z.string(),
  }),
});

export const collections = {
  tickets,
};
