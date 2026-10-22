# Tushar Auddy writing room

This editor stores articles and drafts in Sanity. The public website remains on GitHub Pages and reads published articles without a write token.

## Local editor

Run `npm ci` then `npm run dev` in this folder. Open http://localhost:3333 and sign in with the account that owns project `9wlmf5r4`.

## Finish online activation

1. The owner claims the provisioned project using their private claim link. Never commit that link or `.env*` files.
2. Sign in to the CLI with `npx sanity login` using the same account.
3. Add `https://tushar-auddy.github.io` as a CORS origin for public content reads. Add the hosted Studio origin with credentials enabled for authenticated editing.
4. Run `npm run deploy` to host this Studio. If the configured Studio hostname is unavailable, choose another.
5. Set `studioUrl` in `../lib/content-project.ts` to the resulting HTTPS editor URL, then deploy the frontend.
6. After account authentication works, revoke the provisional project token in Sanity management and remove its ignored local environment file.

## Writing

Open the website’s **Writing room**, then **Open the editor**. Create an Article, enter its title, generate its story link, choose a category, add an introduction and write the story. A cover image is optional. Click **Publish** when ready. Draft changes stay private until published. The article date is a displayed date, not a publication scheduler.

Published articles appear when readers open or refresh the journal. Their share links use `/read/?story=your-story-link`, which works with static GitHub Pages hosting. New articles do not receive server-rendered social metadata until static generation is extended.

Each article includes **SEO & sharing** fields for an optional meta title, meta description, and sharing image. Blank fields fall back to the article title, introduction, and cover. The reader applies these after loading the online article. Crawlers that do not execute JavaScript may still see the generic page metadata; reliable crawler previews require server rendering or rebuilding static article pages after publishing.

The editor has separate **Article**, **FAQ**, **Keywords**, **Schema**, and **SEO & sharing** tabs. Add optional FAQ questions and answers manually. The focus keyword is an editorial aid; related keywords become topic chips and help rank related articles. The Schema tab selects BlogPosting, NewsArticle, or Article, optionally includes visible FAQs, and accepts validated additional JSON-LD without script tags. Author and article details populate the standard schema automatically.

The reader builds a table of contents from Heading/Subheading blocks, with links to each heading. Related articles are selected automatically from published posts by shared category and keywords, then date; the current article and duplicates are excluded. An online article with no other published posts has no related-articles section. SEO supports separate social text, a canonical URL override, and a noindex request. These browser-applied settings retain the static-hosting crawler limitations described above.

Run `node tests/article-extras.cjs` from the repository root to check heading anchors, related matching and schema generation without creating public content.

The existing `/studio/` route is a legacy browser-only scratchpad. It does not publish online.
