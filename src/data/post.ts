import { type MarkdownInstance } from "astro";

// Which mode is the environment running in? https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const { MODE } = import.meta.env;

export type PostMarkdownInstance = MarkdownInstance<{
	title: string;
	date: string;
	preview: string;
}>;

export interface Post {
	title: string,
	slug: string,
	preview: string,
	timestamp: number,
	draft: boolean,
	date: string,
	file: string;
	Content: PostMarkdownInstance["Content"];
}

export function post(post: PostMarkdownInstance): Post {

	const file = post.file;
	const filename = file.split('/').pop();
	const slug = filename.replace(/\.mdx?/, '')
	const contentPath = file.split("content/")[1];
	const draft = contentPath.split('/')[0] !== 'public';

	return {
		...post.frontmatter,
		Content: post.Content,
		file: post.file,
		slug: slug,
		draft,
		timestamp: (new Date(post.frontmatter.date)).valueOf()
	}
}

export function posts(paths: PostMarkdownInstance[]): Post[] {
	return paths
		.filter(post => post.frontmatter.title)
		.map(post)
}

export function blog(paths: PostMarkdownInstance[]): Post[] {
	return published(paths)
		.filter(post => !post.file.includes("/archive/"));
}

export function published(paths: PostMarkdownInstance[]): Post[] {
	return posts(paths)
		.filter(post => MODE === 'development' || !post.draft)
		.sort((a, b) => b.timestamp - a.timestamp)
}