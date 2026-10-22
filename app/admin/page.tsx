import Link from 'next/link';
import { ArrowUpRight, Feather, Image, FileCheck, LockKeyhole } from 'lucide-react';
import { contentProject } from '@/lib/content-project';
import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = { title: 'Writing room', robots: { index: false, follow: false } };
export default function AdminPage() {
 return <main id="main" className="admin-page"><div className="container"><div className="admin-heading"><span className="eyebrow">YOUR WRITING ROOM</span><span className="admin-private"><LockKeyhole size={14}/> Private editor</span></div><div className="admin-intro"><div className="admin-mark"><Feather size={30}/></div><h1>A new story<br/>starts here<span>.</span></h1><p>Write at your own pace. Save a draft, add the finishing touches, and publish when you’re ready.</p>{contentProject.studioUrl ? <a className="primary-button" href={contentProject.studioUrl}>Open the editor <ArrowUpRight size={18}/></a> : <div className="admin-pending" role="status">Your online editor is being connected. Owner sign-in is the final setup step.</div>}<small>Sign in with the account that owns your journal.</small></div><div className="admin-steps"><div><Feather size={23}/><span>01 / WRITE</span><h2>Make it yours.</h2><p>Add a title and write your article. Use headings, bold text, lists, and links.</p></div><div><Image size={23}/><span>02 / FINISH</span><h2>A few final details.</h2><p>Choose a category, upload a cover, and add a short introduction. Drafts save as you work.</p></div><div><FileCheck size={23}/><span>03 / PUBLISH</span><h2>Out into the world.</h2><p>Press Publish to make your story available in the journal. Return anytime to edit or unpublish it.</p></div></div><div className="admin-foot"><p>Your drafts stay private. Only published stories appear on the website.</p><Link className="text-link" href="/journal/">View the journal <ArrowUpRight size={16}/></Link></div></div></main>;
}
