import { defineField, defineType } from 'sanity';

export const article = defineType({
 name: 'article', title: 'Article', type: 'document',
 groups: [{ name: 'article', title: 'Article', default: true }, { name: 'faq', title: 'FAQ' }, { name: 'keywords', title: 'Keywords' }, { name: 'schema', title: 'Schema' }, { name: 'seo', title: 'SEO & sharing' }],
 initialValue: () => ({ publishedAt: new Date().toISOString(), category: 'Personal notes' }),
 fields: [
  defineField({ name: 'faq', title: 'Frequently asked questions', group: 'faq', type: 'array', description: 'Optional questions and answers shown below this article. Add only questions that help the reader.', of: [{ type: 'object', name: 'faqItem', fields: [
   { name: 'question', title: 'Question', type: 'string', validation: rule => rule.required() },
   { name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: rule => rule.required() },
  ], preview: { select: { title: 'question', subtitle: 'answer' } } }] }),
  defineField({ name: 'keywords', title: 'Keywords & topics', group: 'keywords', type: 'object', fields: [
   { name: 'focus', title: 'Focus keyword', type: 'string', description: 'Your main topic or search phrase. This is a writing aid, not a ranking score.' },
   { name: 'related', title: 'Related keywords / topics', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, validation: rule => rule.unique(), description: 'Used for article topics and automatic related-article matching.' },
  ] }),
  defineField({ name: 'schema', title: 'Structured data', group: 'schema', type: 'object', fields: [
   { name: 'type', title: 'Article schema type', type: 'string', initialValue: 'BlogPosting', options: { list: [{ title: 'Blog post', value: 'BlogPosting' }, { title: 'News article', value: 'NewsArticle' }, { title: 'Article', value: 'Article' }] }, description: 'Defaults to Blog post. Author, headline, dates and image are filled from the article.' },
   { name: 'includeFaq', title: 'Include FAQ structured data', type: 'boolean', initialValue: false, description: 'Uses the visible questions from your FAQ tab. Search features are not guaranteed.' },
   { name: 'customJson', title: 'Additional schema (advanced)', type: 'text', rows: 8, description: 'Optional JSON-LD object or array. Enter JSON only, without <script> tags. It must describe content actually present on this page.', validation: rule => rule.custom(value => { if (!value) return true; try { const parsed = JSON.parse(value); const items = Array.isArray(parsed) ? parsed : [parsed]; return items.length > 0 && items.every(item => item && typeof item === 'object' && !Array.isArray(item) && (item['@type'] || item['@graph'])) ? true : 'Enter a JSON-LD object with @type or @graph.'; } catch { return 'Enter valid JSON, without script tags.'; } }) },
  ] }),
  defineField({ name: 'title', group: 'article', title: 'Title', type: 'string', validation: rule => rule.required().max(180) }),
  defineField({ name: 'slug', group: 'article', title: 'Story link', type: 'slug', description: 'Click Generate after writing the title. Keep this unchanged after publishing so shared links keep working.', options: { source: 'title', maxLength: 96 }, validation: rule => rule.required() }),
  defineField({ name: 'category', group: 'article', title: 'Category', type: 'string', options: { list: ['Technology', 'Design', 'Politics', 'Lifestyle', 'Entertainment', 'Personal notes'] }, validation: rule => rule.required() }),
  defineField({ name: 'excerpt', group: 'article', title: 'Short introduction', type: 'text', rows: 3, description: 'A sentence or two for the journal card.', validation: rule => rule.required().max(320) }),
  defineField({ name: 'cover', group: 'article', title: 'Cover image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Image description', type: 'string', description: 'Describe the image for readers using screen readers.' }] }),
  defineField({ name: 'body', group: 'article', title: 'Your story', type: 'array', of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading', value: 'h2' }, { title: 'Subheading', value: 'h3' }, { title: 'Quote', value: 'blockquote' }], marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }], annotations: [{ name: 'link', title: 'Link', type: 'object', fields: [{ name: 'href', title: 'URL', type: 'url', validation: rule => rule.uri({ scheme: ['https', 'http', 'mailto'] }) }] }] } }], validation: rule => rule.required().min(1) }),
  defineField({ name: 'publishedAt', group: 'article', title: 'Article date', type: 'datetime', validation: rule => rule.required() }),
  defineField({ name: 'seo', group: 'seo', title: 'SEO & sharing', type: 'object', description: 'Optional. Leave these blank to use your article title, introduction, and cover image.', options: { collapsible: true, collapsed: false }, fields: [
   defineField({ name: 'title', title: 'Meta title', type: 'string', description: 'The page title for search results and browser tabs. Aim for 50–60 characters.', validation: rule => rule.max(60).warning('Try to keep your meta title within 60 characters.') }),
   defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 3, description: 'A clear summary for search results and link previews. Aim for 140–160 characters.', validation: rule => rule.max(160).warning('Try to keep your meta description within 160 characters.') }),
   defineField({ name: 'image', title: 'Social sharing image', type: 'image', description: 'Optional image for link previews. A wide image around 1200 × 630 pixels works well.', options: { hotspot: true } }),
   defineField({ name: 'socialTitle', title: 'Social sharing title', type: 'string', description: 'Optional. Defaults to the meta title.' }),
   defineField({ name: 'socialDescription', title: 'Social sharing description', type: 'text', rows: 3, description: 'Optional. Defaults to the meta description.' }),
   defineField({ name: 'canonicalUrl', title: 'Canonical URL (advanced)', type: 'url', description: 'Leave blank for this article’s own URL. Set the original URL when republishing an article.', validation: rule => rule.uri({ scheme: ['https', 'http'] }) }),
   defineField({ name: 'noIndex', title: 'Hide this article from search engines', type: 'boolean', initialValue: false, description: 'The article stays publicly accessible. This requests noindex; it is not privacy protection.' }),
  ] }),
 ],
 orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] }],
 preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
});



