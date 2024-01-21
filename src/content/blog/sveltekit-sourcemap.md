---
title: Sourcemaps in SvelteKit 
summary: How to enable CSS Sourcemap in SvelteKit
date: 2022-10-30
---

Because of the various iterations, SvelteKit has gone through, it was pretty difficult to find out how to enable SvelteKit sourcemaps for CSS.

These days, sourcemaps are enabled through Vite, but you're likely looking to enable sourcemaps during development, so `build.sourcemap` isn't going to do anything for you. 

What you need is [`config.css.devSourcemap`](https://vitejs.dev/config/shared-options.html#css-devsourcemap):

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
    server: {
        port: 3000,
    },
    plugins: [sveltekit()],
    css: {
        devSourcemap: true,
    }
};

export default config;
```