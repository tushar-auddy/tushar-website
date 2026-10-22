import type { OnlineArticle } from '@/lib/content';
import { articleHeadings } from '@/lib/article-extras';

export function ArticleContents({ article }: { article: OnlineArticle }) {
 const headings = articleHeadings(article);
 if (!headings.length) return null;
 return <nav className="article-contents reading-body" aria-label="Table of contents"><div className="article-extra-panel"><span className="eyebrow">IN THIS ARTICLE</span><ol>{headings.map(h => <li key={h.id} className={h.level === 3 ? 'subheading' : ''}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol></div></nav>;
}
export function ArticleFaq({ article }: { article: OnlineArticle }) {
 const faq = article.faq?.filter(item => item.question?.trim() && item.answer?.trim());
 return <>{Boolean(faq?.length) && <section className="article-faq reading-body" aria-labelledby="article-faq-title"><div className="eyebrow">A FEW MORE ANSWERS</div><h2 id="article-faq-title">Frequently asked questions</h2>{faq?.map(item => <details key={item._key}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>}{Boolean(article.keywords?.related?.length) && <div className="article-topics reading-body" aria-label="Article topics">{article.keywords?.related?.map(topic => <span key={topic}>{topic}</span>)}</div>}</>;
}
