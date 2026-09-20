import fs from 'node:fs';
import path from 'node:path';
const out = path.resolve('seo-deliverables');
fs.mkdirSync(out, { recursive: true });
const catalog = JSON.parse(fs.readFileSync('src/data/catalogFallback.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('src/data/Blog.json', 'utf8'));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const decode = s => s.replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g,' ');
const clean = s => decode(s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim());
const attr = (s,n) => decode(s.match(new RegExp('(?:^|\\s)'+n+'=["\x27]([^"\x27]*)["\x27]','i'))?.[1] || '');
async function inspect(url) {
 const hops=[]; let current=url;
 try {
  for(let i=0;i<5;i++) {
   const start=Date.now(); const r=await fetch(current,{redirect:'manual',signal:AbortSignal.timeout(18000)});
   const h={url:current,status:r.status,location:r.headers.get('location'),headerMs:Date.now()-start}; hops.push(h);
   if(r.status>=300&&r.status<400&&h.location){current=new URL(h.location,current).href; await r.body?.cancel();continue;}
   const html=await r.text(); const tags=[...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(m=>m[0]);
   const ld=[...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>{try{return JSON.parse(m[1])}catch{return 'INVALID_JSON'}});
   const body=clean(html.replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<style\b[\s\S]*?<\/style>/gi,''));
   const links=[...new Set([...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map(m=>decode(m[1])))];
   const images=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>({src:attr(m[0],'src'),alt:attr(m[0],'alt'),loading:attr(m[0],'loading'),width:attr(m[0],'width'),height:attr(m[0],'height'),sizes:attr(m[0],'sizes')}));
   return {url,checkedAt:new Date().toISOString(),hops,status:r.status,finalUrl:current,bytes:Buffer.byteLength(html),title:clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||''),description:attr(tags.find(t=>attr(t,'name')==='description')||'','content'),canonical:attr(tags.find(t=>attr(t,'rel')==='canonical')||'','href'),robots:attr(tags.find(t=>attr(t,'name')==='robots')||'','content'),xRobots:r.headers.get('x-robots-tag'),headings:[...html.matchAll(/<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>({tag:m[1],text:clean(m[2])})),ld,links,images,body};
  }
  return {url,hops,error:'redirect limit'};
 } catch(e){return {url,hops,error:String(e)}}
}
const base='https://mixenza.com';
const routes=['/','/robots.txt','/sitemap.xml','/shop','/shop/','/shop?category=Kitchenware','/shop/general','/shop/shop','/shop/kitchenware','/shop/health-beauty','/blog','/pages/about','/pages/faqs','/pages/contact','/pages/customer-feedbacks','/homepages/fashion11','/shop/breadcrumb1','/blog/default','/product/out-of-stock','/checkout','/seo-audit-nonexistent-20260921','/product/seo-audit-nonexistent-20260921',...catalog.slice(0,9).map(p=>'/product/'+p.slug),'/product/default?id='+catalog[0]._id,...[...new Set(posts.map(p=>p.slug))].map(s=>'/blog/'+s)];
const competitors=['https://wehome.pk/collections/kitchen-tools-gadgets','https://traderz.pk/product-category/kitchen-dining-gadgets/','https://galaxiee.com/collections/massage-gun','https://www.markaz.app/shop/product/Kitchenware','https://www.mztrends.com/','https://propakistani.pk/','https://www.techjuice.pk/','https://www.phoneworld.com.pk/'];
const report = fs.readFileSync('SEO_AUDIT_MIXENZA_PAKISTAN.md','utf8');
const priorityPaths = [...report.matchAll(/\| `([^`]+)` \|/g)].map(m=>m[1]).filter(p=>p.startsWith('/product/')&&!p.includes('*')&&!p.includes('...')&&!p.includes('{'));
const categoryPaths=[...new Set(catalog.map(p=>'/shop/'+slug(p.category?.name||'General')))];
const urls=[...new Set(['http://mixenza.com/','https://www.mixenza.com/',...routes.map(p=>base+p),...priorityPaths.map(p=>base+p),...categoryPaths.map(p=>base+p),...competitors,
 'https://orderly.com.pk/products/rechargeable-hand-fan',
 'https://spectorgadgets.com/product/portable-hand-fan-pakistan/',
 'https://dtech.com.pk/',
 'https://www.action.pk/products/automatic-water-dispenser-pump-usb-rechargeable-hygienic-design',
 'https://galaxiee.com/blogs/news/best-massage-gun-price-in-pakistan-2026',
 'https://www.daraz.pk/tag/massage-guns/'
])];
const rows=[]; let index=0;
await Promise.all(Array.from({length:5},async()=>{while(index<urls.length){const u=urls[index++];const row=await inspect(u);rows.push(row);console.log(row.status||'ERROR',u,row.error||'');}}));
fs.writeFileSync(path.join(out,'live-evidence.json'),JSON.stringify({generatedAt:new Date().toISOString(),method:'HTTP GET and server HTML; five concurrent requests; no browser field metrics',rows},null,2));
fs.writeFileSync(path.join(out,'catalog-inventory.json'),JSON.stringify({source:'bundled fallback snapshot, not verified live stock',count:catalog.length,categories:[...new Set(catalog.map(p=>p.category?.name||'General'))].map(n=>({name:n,path:'/shop/'+slug(n),count:catalog.filter(p=>(p.category?.name||'General')===n).length})),products:catalog.map(p=>({id:p._id,url:'/product/'+p.slug,name:p.title,category:p.category?.name,price:p.discountPrice||p.price,stock:p.stock,description:p.description,images:p.images})),posts},null,2));
console.log('Saved evidence for',rows.length,'URLs');
