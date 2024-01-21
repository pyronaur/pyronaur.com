import { z, defineCollection } from 'astro:content';
const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		categories: z.array(z.string()),
		summary: z.string().optional(),
		date: z.coerce.date(),
	}),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { blog };