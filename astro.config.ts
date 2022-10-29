import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import serviceWorker from "astrojs-service-worker";

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: ['remark-gfm'],
		rehypePlugins: ['rehype-slug', ['rehype-autolink-headings', {
			behavior: 'wrap'
		}]],
		// Pick a syntax highlighter. Can be 'prism' (default), 'shiki' or false to disable any highlighting.
		syntaxHighlight: 'shiki',
		// If you are using shiki, here you can define a global theme and
		// add custom languages.
		shikiConfig: {
			theme: 'nord',
			langs: [],
			wrap: false
		}
	},
	site: "https://pyronaur.com",
	integrations: [mdx(), sitemap(), svelte(), serviceWorker()],
	output: 'static',
});