# Tushar Auddy — Portfolio & Journal

A responsive Next.js App Router website with TypeScript, an editorial visual style, category filters, search, full article pages, and a browser-based writing room.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build` generates the static site in `out/`. Deploy `out/` to any static host, or remove `output: 'export'` from `next.config.ts` for a standard Next.js deployment and use `npm run start` after building.

## Write and publish

### GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys every push to `main`. In the GitHub repository, choose **Settings → Pages → Source → GitHub Actions** once to enable deployment. The website URL is `https://tushar-auddy.github.io/tushar-website/`.

The workflow supplies `NEXT_PUBLIC_BASE_PATH=/tushar-website` and `NEXT_PUBLIC_SITE_URL=https://tushar-auddy.github.io/tushar-website`. Local development continues to use `/`. Images, fonts, navigation, and metadata support both deployment paths. If the repository or domain changes, update these workflow values.

### Authoring

- Open the website’s **Writing room** at `/admin/`, then **Open the editor** to sign in to Sanity. Drafts stay private until you publish them.
- The four author-supplied articles are stored in Sanity and have static snapshots in `lib/published-articles.json`. Those snapshots provide full HTML article pages and offline fallbacks. The reader refreshes published content when opened.
- Related articles and contents lists are automatic. FAQ, keywords, schema, and SEO/sharing fields are editable in the CMS.
- The original `/studio/` route remains a browser-only scratchpad with JSON backup and Markdown export. Its device publications are not shared with other visitors.
- New CMS posts appear through `/read/?story=...` without a deployment. Static snapshots and metadata need a rebuild to reflect later CMS changes in the initial HTML; JavaScript-free social crawlers cannot read browser-applied metadata.

## Customise

- Biography and homepage: `app/page.tsx`
- Colours, typography and responsive layouts: `app/globals.css`
- Navigation, social and contact links: `components/chrome.tsx`
- Metadata: `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Article content: `lib/articles.ts`

Photography is downloaded from Unsplash and stored locally under `public/images/`. Font families: self-hosted Outfit for the main typography, with DM Serif Display and Caveat reserved for the quotation and handwritten accents, with system fallbacks. Contact links open email or Tushar's supplied LinkedIn profile. No subscriber forms or analytics collect visitor data.

## Checks

```sh
npm run typecheck
node tests/site-audit.cjs
node tests/article-extras.cjs
npm run build
node tests/export-check.cjs
```
