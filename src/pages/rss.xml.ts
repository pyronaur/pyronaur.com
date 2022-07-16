import { blog, Post } from '../data/post';
import rss from '@astrojs/rss';

const imports = import.meta.glob('../content/**/*.md', { eager: true })
const posts = await Promise.all(Object.values(imports).map(f => f()))

export const get = () => rss({
	title: 'Pyronaur.com RSS',
	description: 'Pyronaur.com RSS Feed',
	stylesheet: true,
	site: import.meta.env.SITE,
	items: blog(posts).map((post: Post) => ({
		title: post.title,
		description: post.preview,
		link: post.slug,
		pubDate: post.date,
	})),
	customData: `<language>en-us</language>`
});




