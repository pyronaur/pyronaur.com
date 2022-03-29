// Which mode is the environment running in? https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const { MODE } = import.meta.env;

export type Post = {
	title: string,
	slug: string,
	preview: string,
	timestamp: number,
	draft: boolean,
	date: string,
	file: URL,
}


export function single(post): Post {
	const slug = post.file.pathname.split('/').reverse()[0].replace('.md', '');
	return {
		...post,
		slug: slug,
		draft: post.file.pathname.split('/').reverse()[1] === 'drafts',
		timestamp: (new Date(post.date)).valueOf()
	}
}

export function blog(posts): Post[] {
	return published(posts)
		.filter(post => !post.file.pathname.includes("/archive/"));
}

export function published(posts): Post[] {
	return posts
		.filter(post => post.title )
		.map(post => single(post))
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

