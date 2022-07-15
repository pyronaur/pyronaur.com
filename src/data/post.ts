// Which mode is the environment running in? https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const { MODE } = import.meta.env;
// import { rss } from '@astrojs/rss';

export type Post = {
	title: string,
	slug: string,
	preview: string,
	timestamp: number,
	draft: boolean,
	date: string,
	file: string,
}


export function single(post): Post {
	
	const file = post.file;
	const slug = file.split('/').reverse()[0].replace('.md', '');

	return {
		...post.frontmatter,
		Content: post.Content,
		file: post.file,
		slug: slug,
		draft: file.split('/').reverse()[1] === 'drafts',
		timestamp: (new Date(post.frontmatter.date)).valueOf()
	}
}

export function blog(posts): Post[] {
	return published(posts)
		.filter(post => !post.file.includes("/archive/"));
}

export function published(posts): Post[] {
	return posts
		.filter(post => post.frontmatter.title )
		.map(single)
		.filter(post => MODE === 'development' || !post.draft)
		.sort((a, b) => b.timestamp - a.timestamp)
}


export function getRSS(posts: Post[]) {
	return {
		title: 'Pyronaur.com RSS',
		description: 'Pyronaur.com RSS Feed',
		stylesheet: true,
		customData: `<language>en-us</language>`,
		items: posts.map((post: Post) => ({
			title: post.title,
			description: post.preview,
			link: post.slug,
			pubDate: post.date,
		})),
	}
}

