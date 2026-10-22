import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { article } from './schemaTypes/article';

export default defineConfig({
 name: 'tushar-journal', title: 'Tushar Auddy · Writing room',
 projectId: '9wlmf5r4', dataset: 'production',
 plugins: [structureTool({ structure: S => S.list().title('Writing room').items([S.documentTypeListItem('article').title('Articles & drafts')]) })],
 schema: { types: [article] },
});
