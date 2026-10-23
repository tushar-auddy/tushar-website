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
 const listLevel = (block: TextBlock) => Math.max(1, Math.floor(block.level || 1));
 const list = (start: number): { node: ReactNode; next: number } => {
  const first = blocks[start]; const level = listLevel(first); const items: ReactNode[] = []; let index = start;
  while (index < blocks.length && blocks[index].listItem === first.listItem && listLevel(blocks[index]) === level) {
   const item = blocks[index++]; const children: ReactNode[] = [];
   while (index < blocks.length && blocks[index].listItem && listLevel(blocks[index]) > level) {
    const nested = list(index); children.push(nested.node); index = nested.next;
   }
   items.push(<li key={item._key}>{inline(item)}{children}</li>);
  }
  return { node: first.listItem === 'number' ? <ol key={first._key}>{items}</ol> : <ul key={first._key}>{items}</ul>, next: index };
 };
 for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];
  if (block._type !== 'block') continue;
  if (block.listItem) {
   const group = list(i); rendered.push(group.node); i = group.next - 1;
  } else {
   const content = inline(block);
   rendered.push(block.style === 'h2' ? <h2 id={`section-${block._key}`} key={block._key}>{content}</h2> : block.style === 'h3' ? <h3 id={`section-${block._key}`} key={block._key}>{content}</h3> : block.style === 'blockquote' ? <blockquote key={block._key}>{content}</blockquote> : <p key={block._key}>{content}</p>);
  }
 }
 return <div className="reading-body">{rendered}</div>;
}
