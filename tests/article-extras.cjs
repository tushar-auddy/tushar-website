const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
function load(file) {
 const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
 const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } });
 const module = { exports: {} };
 new Function('require', 'module', 'exports', outputText)(require, module, module.exports);
 return module.exports;
}
const { articleHeadings, relatedArticles } = load('lib/article-extras.ts');
const { articleSchema } = load('lib/article-schema.ts');
const { PortableBody } = load('components/portable-body.tsx');
const article = { slug: 'current', title: 'Current story', excerpt: 'Summary', category: 'Politics', date: '2026-10-22', image: '', body: '', readTime: '1 min read', keywords: { focus: 'elections', related: ['India'] } };
const blocks = ['a','b'].map((key,i) => ({ _key: key, _type: 'block', style: i ? 'h3' : 'h2', children: [{ _key: key, text: 'Same heading' }] }));
const headings = articleHeadings({ ...article, portableBody: blocks });
assert.deepEqual(headings.map(h => h.id), ['section-a', 'section-b']);
const html = renderToStaticMarkup(React.createElement(PortableBody, { blocks }));
headings.forEach(h => assert.ok(html.includes(`id="${h.id}"`)));
const nested = renderToStaticMarkup(React.createElement(PortableBody, { blocks: [
 { _key:'one', _type:'block', listItem:'bullet', level:1, children:[{_key:'a',text:'Parent'}] },
 { _key:'two', _type:'block', listItem:'number', level:2, children:[{_key:'b',text:'Child'}] },
 { _key:'three', _type:'block', listItem:'bullet', level:1, children:[{_key:'c',text:'Sibling'}] },
] }));
assert.ok(nested.includes('<li>Parent<ol><li>Child</li></ol></li><li>Sibling</li>'));
assert.equal(articleHeadings({ ...article, body: 'Paragraph\n\n## Heading' })[0].id, 'section-1');
const other = { ...article, slug: 'other', keywords: {} };
const match = { ...article, slug: 'match', category: 'Lifestyle' };
assert.deepEqual(relatedArticles(article, [article, other, match, match]).map(a => a.slug), ['match', 'other']);
const faqArticle = { ...article, schema: { type: 'NewsArticle', includeFaq: true, customJson: '{invalid' }, faq: [{ _key: 'q', question: 'Why?', answer: 'Because.' }] };
const schema = articleSchema(faqArticle, 'https://example.com/story', 'https://example.com/cover.jpg');
assert.equal(schema[0]['@type'], 'NewsArticle');
assert.equal(schema[0].author.name, 'Tushar Auddy');
assert.equal(schema[1].mainEntity[0].acceptedAnswer.text, 'Because.');
assert.equal(articleSchema({ ...faqArticle, faq: [] }, 'https://example.com', '').length, 1);
assert.equal(articleSchema({ ...article, schema: { customJson: '{"@type":"Thing","name":"Extra"}' } }, 'https://example.com', '').length, 2);
console.log('Article extras: heading anchors, related matching, FAQ schema and custom JSON checks passed.');

