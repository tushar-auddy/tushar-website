import fs from 'node:fs';
import path from 'node:path';
import { getCliClient } from 'sanity/cli';

async function run() {
 const client = getCliClient({ apiVersion: '2026-10-01' });
 const docs = JSON.parse(fs.readFileSync(path.resolve('.env.import-articles.json'), 'utf8'));
 if (docs.length !== 4 || docs.some((doc: {_id: string}) => !doc._id.startsWith('portfolio-'))) throw new Error('Expected four verified portfolio imports.');
 const existing = await client.fetch('*[_id in $ids]{_id}', { ids: docs.map((doc: {_id: string}) => doc._id) });
 if (existing.length) throw new Error('Import IDs already exist. Stop to avoid overwriting edits.');
 let transaction = client.transaction();
 for (const original of docs) {
  const { coverPath, coverAlt, ...doc } = original;
  const asset = await client.assets.upload('image', fs.createReadStream(path.resolve('../public', coverPath.replace(/^\//,''))), { filename: path.basename(coverPath) });
  doc.cover = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: coverAlt };
  transaction = transaction.create(doc);
 }
 await transaction.commit();
 console.log('Published four author-supplied articles with cover illustrations.');
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
