# Jon Castro

Personal website with notes, resources, and projects about audiovisual work, design, and web tools. The site is written in Spanish and built with Astro, TypeScript, Tailwind CSS, and Markdown/MDX.

## Development

Requires Node.js 22.12.0 or newer.

```sh
npm ci
npm run dev
```

The development server runs at `http://localhost:4321`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the production site in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | Show Astro CLI commands |

## Project structure

```text
public/               Static files and favicons
src/assets/           Images processed by Astro
src/components/       Shared UI, article lists, resource library, and charts
src/content/blog/     Markdown and MDX articles
src/layouts/          Page and article layouts
src/pages/            Homepage, resources, projects, articles, and RSS feed
src/styles/           Global styles and theme colors
src/consts.ts         Site title and description
src/content.config.ts Article frontmatter schema
astro.config.mjs      Astro integrations and site URL
```

See [MAINTAINING.md](MAINTAINING.md) for adding articles, using charts in MDX, and checking the site before publishing.

## Publishing

Set `site` in `astro.config.mjs` to the production URL before deploying; it currently uses `https://example.com`. This URL is used for canonical links, the sitemap, and RSS links.

Run `npm run build` and deploy `dist/` to a static host. Generated output (`dist/`, `.astro/`) and dependencies (`node_modules/`) are ignored by Git.

## Credit

Originally based on the Astro blog starter and [Bear Blog](https://github.com/HermanMartinus/bearblog/).
