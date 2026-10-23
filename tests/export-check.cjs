const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../out');
const base='/tushar-website';
const htmlFiles=[];
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())walk(file);else if(file.endsWith('.html'))htmlFiles.push(file);}}
walk(root);
let links=0;
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8');
 for(const tag of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/g)){
  const match=/\b(?:href|src)="([^"]+)"/.exec(tag[0]);if(!match)continue;
  const url=match[1].replace(/&amp;/g,'&');
  if(!url.startsWith('/')||url.startsWith('//'))continue;
  assert.ok(url===base||url.startsWith(base+'/'),`Missing GitHub Pages prefix: ${url}`);
  const relative=decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]);
  let target=path.join(root,relative);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),`Broken exported link in ${path.relative(root,file)}: ${url}`);links++;
 }
}
const articles=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../lib/published-articles.json'),'utf8'));
for(const article of articles){
 const html=fs.readFileSync(path.join(root,'journal',article.slug,'index.html'),'utf8');
 assert.ok(html.includes('article-structured-data'));
 assert.ok(html.includes('rel="canonical"'));
 assert.ok(html.includes('property="og:image"'));
 assert.ok(!html.includes('An illustrative starter article'));
 assert.ok(fs.existsSync(path.join(root,article.image)));
}
for(const asset of ['images/tushar-runner.png','images/bamboo.png','images/samosa-body.png','images/samosa-wing-left.png','images/samosa-wing-right.png','sounds/jump.wav','sounds/game-over.wav'])assert.ok(fs.existsSync(path.join(root,asset)),`Missing game asset: ${asset}`);
assert.equal(fs.readFileSync(path.join(root,'google0e582a6135194502.html'),'utf8').trim(),'google-site-verification: google0e582a6135194502.html');
assert.ok(fs.existsSync(path.join(root,'404.html')));
console.log(`Export checks passed: ${htmlFiles.length} pages, ${links} local links/assets, article metadata, game assets, and Google verification.`);
