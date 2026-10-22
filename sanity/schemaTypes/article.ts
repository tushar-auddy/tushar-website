import { defineField, defineType } from 'sanity';

export const article = defineType({
 name: 'article', title: 'Article', type: 'document',
 initialValue: () => ({ publishedAt: new Date().toISOString(), category: 'Personal notes' }),
 fields: [
  defineField({ name: 'title', title: 'Title', type: 'string', validation: rule => rule.required().max(180) }),
  defineField({ name: 'slug', title: 'Story link', type: 'slug', description: 'Click Generate after writing the title. Keep this unchanged after publishing so shared links keep working.', options: { source: 'title', maxLength: 96 }, validation: rule => rule.required() }),
  defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['Politics', 'Lifestyle', 'Entertainment', 'Personal notes'] }, validation: rule => rule.required() }),
  defineField({ name: 'excerpt', title: 'Short introduction', type: 'text', rows: 3, description: 'A sentence or two for the journal card.', validation: rule => rule.required().max(320) }),
  defineField({ name: 'cover', title: 'Cover image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Image description', type: 'string', description: 'Describe the image for readers using screen readers.' }] }),
  defineField({ name: 'body', title: 'Your story', type: 'array', of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading', value: 'h2' }, { title: 'Subheading', value: 'h3' }, { title: 'Quote', value: 'blockquote' }], marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }], annotations: [{ name: 'link', title: 'Link', type: 'object', fields: [{ name: 'href', title: 'URL', type: 'url', validation: rule => rule.uri({ scheme: ['https', 'http', 'mailto'] }) }] }] } }], validation: rule => rule.required().min(1) }),
  defineField({ name: 'publishedAt', title: 'Article date', type: 'datetime', validation: rule => rule.required() }),
  defineField({ name: 'seo', title: 'SEO & sharing', type: 'object', description: 'Optional. Leave these blank to use your article title, introduction, and cover image.', options: { collapsible: true, collapsed: false }, fields: [
   defineField({ name: 'title', title: 'Meta title', type: 'string', description: 'The page title for search results and browser tabs. Aim for 50–60 characters.', validation: rule => rule.max(60).warning('Try to keep your meta title within 60 characters.') }),
   defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 3, description: 'A clear summary for search results and link previews. Aim for 140–160 characters.', validation: rule => rule.max(160).warning('Try to keep your meta description within 160 characters.') }),
   defineField({ name: 'image', title: 'Social sharing image', type: 'image', description: 'Optional image for link previews. A wide image around 1200 × 630 pixels works well.', options: { hotspot: true } }),
  ] }),
 ],
 orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] }],
 preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
});
