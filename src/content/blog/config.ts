import { z, defineCollection } from 'astro:content';
const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		date: z.coerce.date(),
	}),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { blog };