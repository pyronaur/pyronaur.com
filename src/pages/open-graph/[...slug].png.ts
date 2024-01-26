import generateOgImage from "../../utils/open-graph";
import { type APIRoute } from "astro";

import { getCollection } from 'astro:content';
export async function getStaticPaths() {
	const posts = await getCollection("published");
	return posts.map((post) => {
		const slug = post.slug.split('/').pop();
		return {
			params: {
				slug
			},
			props: {
				...post.data,
				slug
			},
		};
	});
}

export const GET: APIRoute = async ({ props }) => {
	const response = await generateOgImage(props);
	return new Response(response, {
		status: 200,
		headers: {
			"Content-Type": "image/png",
		},
	});
};