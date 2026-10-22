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

- Open `/studio/` to compose, preview, save drafts, and publish **on the current device**. These posts use localStorage; they are not shared with other visitors and are not a secure admin CMS. Browser storage can be cleared, so download JSON backups regularly. Backups can be restored using Import backup.
- Export a story as Markdown for safekeeping or use in another CMS.
- To publish site-wide, add the article to `lib/articles.ts` and rebuild/redeploy. The static article pages, journal, category counts, and sitemap update automatically. Set `sample: true` only for illustrative starter stories. For a real published story omit `sample` and set `status: 'published'`.
- The six initial articles are clearly marked illustrative samples and do not represent Tushar's previously published work. Replace them with his own articles and photographs before public launch.
- Existing content does not use a database. A future CMS integration should replace the article data source and add authenticated authoring.

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
npm run build
```
