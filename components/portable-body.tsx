import { Fragment, type ReactNode } from 'react';
import type { TextBlock } from '@/lib/content';

export function PortableBody({ blocks }: { blocks: TextBlock[] }) {
 const rendered: ReactNode[] = [];
 const inline = (block: TextBlock) => (block.children || []).map(child => {
  let text: ReactNode = child.text;
  for (const mark of child.marks || []) {
   if (mark === 'strong') text = <strong>{text}</strong>;
   else if (mark === 'em') text = <em>{text}</em>;
   else {
    const link = block.markDefs?.find(def => def._key === mark && def._type === 'link');
    if (link?.href && /^(https?:\/\/|mailto:)/i.test(link.href)) text = <a href={link.href} rel="noopener noreferrer">{text}</a>;
   }
  }
  return <Fragment key={child._key}>{text}</Fragment>;
 });
 for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];
  if (block._type !== 'block') continue;
  if (block.listItem) {
   const type = block.listItem; const items: ReactNode[] = [];
   do { const item = blocks[i]; items.push(<li key={item._key}>{inline(item)}</li>); i++; } while (i < blocks.length && blocks[i].listItem === type);
   i--;
   rendered.push(type === 'number' ? <ol key={block._key}>{items}</ol> : <ul key={block._key}>{items}</ul>);
  } else {
   const content = inline(block);
   rendered.push(block.style === 'h2' ? <h2 key={block._key}>{content}</h2> : block.style === 'h3' ? <h3 key={block._key}>{content}</h3> : block.style === 'blockquote' ? <blockquote key={block._key}>{content}</blockquote> : <p key={block._key}>{content}</p>);
  }
 }
 return <div className="reading-body">{rendered}</div>;
}
