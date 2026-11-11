# Blog maintenance

## Run it

```sh
npm install       # first time only
npm run dev       # local site: http://localhost:4321
npm run build     # production check
npm run preview   # preview dist/
```

## Add an article

Articles live in `src/content/blog/`:

- `.md`: regular Markdown
- `.mdx`: Markdown plus Astro components

Use this frontmatter:

```yaml
---
title: 'Título'
description: 'Resumen corto'
pubDate: 'Jul 10 2026'
articleType: 'guides' # or 'interests'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
```

The schema is in `src/content.config.ts`. New article categories must be added there and to the tabs in `src/pages/index.astro`.

## Use a chart in MDX

```mdx
import Chart from '../../components/Chart.astro';

<Chart
  mode="line"
  title="Rendimiento"
  xLabel="Versión"
  yLabel="AVG FPS"
  showTooltip
  series={[{
    label: 'GPU A',
    color: '#4137ff',
    values: [
      { x: 1, y: 120 },
      { x: 2, y: 145 },
    ],
  }]}
/>
```

Available modes: `line`, `curve`, `scatter`, `bar`, and `tower`.

- `line`: use numeric `{ x, y }` values.
- `curve`: use `fn: (x) => number` and `xDomain={[min, max]}`.
- `scatter`: points only; add `label` to each point for tooltip details.
- `bar`/`tower`: use string `x` values as category labels.

Useful options: `color`, `xDomain`, `yDomain`, `showGrid`, `showPoints`, `showTooltip`, and `animateOnScroll`. Charts animate on scroll by default; use `animateOnScroll={false}` to disable it.

For a two-state line chart, assign each series `state: 0` or `state: 1` and add:

```mdx
toggle={{ labels: ['Estado A', 'Estado B'] }}
```

## Before publishing

```sh
npm run build
```

If the build passes, commit the source files—not `dist/` or `.astro/`.
