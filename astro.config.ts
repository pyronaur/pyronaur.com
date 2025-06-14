import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import icon from "astro-icon";
import preact from "@astrojs/preact";
import { vitePreprocess } from '@astrojs/svelte';

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {
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
  integrations: [mdx(), sitemap(), svelte({
    preprocess: vitePreprocess()
  }), icon(), preact()],
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  adapter: vercel()
});