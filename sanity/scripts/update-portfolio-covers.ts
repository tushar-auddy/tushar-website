import fs from 'node:fs';
import path from 'node:path';
import { getCliClient } from 'sanity/cli';

async function run() {
 const client = getCliClient({ apiVersion: '2026-10-01' });
 const articles = JSON.parse(fs.readFileSync('../lib/published-articles.json','utf8'));
 const ids = articles.map((article: {slug: string}) => `portfolio-${article.slug}`);
 const before = await client.fetch('*[_id in $ids || _id in $drafts]{_id,body,title,cover}', { ids, drafts: ids.map((id: string) => `drafts.${id}`) });
 if (ids.some((id: string) => !before.some((doc: {_id: string}) => doc._id === id))) throw new Error('A portfolio article is missing; no covers were changed.');
 let transaction = client.transaction();
 for (const article of articles) {
  const file = path.resolve('../public', article.image.replace(/^\//,''));
  const image = await client.assets.upload('image',fs.createReadStream(file),{filename:path.basename(file)});
  const cover = { _type: 'image', asset: {_type: 'reference',_ref:image._id}, alt:article.imageAlt };
  const id = `portfolio-${article.slug}`;
  transaction = transaction.patch(id,patch=>patch.set({cover}));
  if (before.some((doc: {_id: string}) => doc._id === `drafts.${id}`)) transaction = transaction.patch(`drafts.${id}`,patch=>patch.set({cover}));
 }
 await transaction.commit();
 const after = await client.fetch('*[_id in $ids || _id in $drafts]{_id,body,title,cover}',{ids,drafts:ids.map((id: string)=>`drafts.${id}`)});
 for (const original of before) {
  const updated = after.find((doc: {_id: string})=>doc._id===original._id);
  if (!updated || JSON.stringify(original.body)!==JSON.stringify(updated.body) || original.title!==updated.title) throw new Error('Article text changed unexpectedly.');
 }
 console.log('Updated all four cover images. Article titles and body text are unchanged.');
}
run().catch(error=>{console.error(error.message);process.exitCode=1;});
