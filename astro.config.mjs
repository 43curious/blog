// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://castro.eus',
	prefetch: true,
	experimental: { clientPrerender: true },
	// Let the small static pages paint without a separate stylesheet request.
	build: { inlineStylesheets: 'always' },
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: 'github-light',
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
