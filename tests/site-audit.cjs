const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function loader() {
 const cache = new Map();
 function load(filename) {
  const file = path.resolve(__dirname, '..', filename);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const compiled = ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const relative = name => {
   if (!name.startsWith('.')) return require(name);
   const target = path.resolve(path.dirname(file), name);
   return target.endsWith('.json') ? JSON.parse(fs.readFileSync(target,'utf8')) : load(path.relative(path.resolve(__dirname,'..'), target + '.ts'));
  };
  new Function('require','module','exports',compiled)(relative,module,module.exports);
  return module.exports;
 }
 return load;
}
const original = { fetch: global.fetch, localStorage: global.localStorage, setTimeout: global.setTimeout, clearTimeout: global.clearTimeout };
async function run() {
 let load = loader(); const core = load('lib/articles.ts');
 assert.equal(core.formatDate('not a date'),'Date unavailable');
 assert.equal(core.formatDate(''),'Date unavailable');
 assert.ok(!core.formatDate('2026-10-22T10:00:00Z').includes('Invalid'));
 assert.equal(core.formatDate('2026-10-22T23:30:00Z'),'23 Oct 2026','Use the same author timezone on server and client');
 global.localStorage = { getItem: () => JSON.stringify([{ slug:'draft',title:'Draft',body:'Words',category:'Technology' },{slug:'invalid',title:'Bad',body:null}]) };
 const draft = core.getLocalArticles();
 assert.equal(draft.length,1);assert.equal(draft[0].date,'');assert.equal(draft[0].status,'draft');
 assert.equal(draft[0].category,'Personal notes','Preserve drafts from retired categories');
 const article = core.articles[0];
 const doc = {title:article.title,slug:article.slug,category:'Personal notes',publishedAt:'2026-10-22T10:00:00Z',body:article.portableBody,image:'https://example.com/cms.jpg',seo:{image:'https://example.com/social.jpg'}};
 let requests=0;let finish;
 global.fetch = () => {requests++;return new Promise(resolve=>{finish=()=>resolve({ok:true,json:async()=>({result:[doc]})});});};
 const api = load('lib/content.ts');
 const controller=new AbortController();
 const cancelled=api.fetchPublishedArticles(controller.signal).catch(error=>error);
 const survivor=api.fetchPublishedArticles();
 controller.abort();finish();
 assert.equal((await cancelled).name,'AbortError');
 const items=await survivor;
 assert.equal(requests,1,'Concurrent article requests should share one fetch');
 assert.equal(items[0].image,article.image,'Keep the chosen local cover');
 assert.equal(items[0].seo.image,'https://example.com/social.jpg','Keep manually selected sharing images');
 await api.fetchPublishedArticles();assert.equal(requests,1,'Reuse a short-lived content cache');
 load=loader();let attempts=0;
 global.fetch=async()=>{attempts++;if(attempts===1)throw Error('offline');return {ok:true,json:async()=>({result:[]})};};
 const retryApi=load('lib/content.ts');
 await assert.rejects(retryApi.fetchPublishedArticles(),/offline/);
 assert.deepEqual(await retryApi.fetchPublishedArticles(),[]);
 assert.equal(attempts,2,'A failed request must be retryable');
 load=loader();
 global.setTimeout=callback=>{queueMicrotask(callback);return 1;};global.clearTimeout=()=>{};
 global.fetch=(_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError'))));
 await assert.rejects(load('lib/content.ts').fetchPublishedArticles(),/took too long/);
 console.log('Site audit checks passed: stored drafts, dates, shared requests, cancellation, retries, timeouts, and sharing images.');
}
run().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>Object.assign(global,original));
