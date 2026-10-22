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

The existing `/studio/` route is a legacy browser-only scratchpad. It does not publish online.
