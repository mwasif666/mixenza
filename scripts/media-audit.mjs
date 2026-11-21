// One-off public media health audit for Mixenza product galleries.
// Does not alter products, media, prices or stock.
import fs from 'node:fs';

const API='https://backend.mixenza.com/api/products';
const pageSize=100;
const timeoutMs=9000;
const origin='https://mixenza.com';
const products=[];
for (let page=1;page<=20;page++) {
  const resp=await fetch(API+'?page='+page+'&limit='+pageSize+'&sort=newest&compact=true',{signal:AbortSignal.timeout(25000)});
  if(!resp.ok)throw Error('Catalog request page '+page+' returned '+resp.status);
  const obj=await resp.json();
  if(!obj.success||!Array.isArray(obj.data))throw Error('Invalid catalog page '+page);
  products.push(...obj.data);
  if(page>=obj.pages)break;
}
console.log('Products in catalog:',products.length);
if(products.length<500)throw Error('Aborting incomplete catalog audit');
const originOf=u=>u.startsWith('/')?origin+u:u;
const group=p=>p.sku?.startsWith('MEMON2-')?'Memon Traders':p.sku?.startsWith('MEEM-')?'Meem Traders':p.sku?.startsWith('DARAZ-')?'Pickora':'Original catalog';
async function test(url) {
  if(!url)return {ok:false,status:0,type:'missing',message:'No image URL'};
  const full=originOf(url);
  try{
    let response=await fetch(full,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(timeoutMs),headers:{'User-Agent':'Mixenza-MediaAudit/1.0'}});
    if(response.status===405||response.status===501){
      response=await fetch(full,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(timeoutMs),headers:{Range:'bytes=0-63','User-Agent':'Mixenza-MediaAudit/1.0'}});
      await response.body?.cancel().catch(()=>{});
    }
    const type=(response.headers.get('content-type')||'').split(';')[0];
    return {ok:response.ok&&/^image\//.test(type),status:response.status,type,length:response.headers.get('content-length')||'',message:''};
  }catch(e){return{ok:false,status:0,type:'network',message:String(e?.message||e).slice(0,90)}}
}
const results=new Array(products.length);let next=0;
await Promise.all(Array.from({length:12},async()=>{
  while(next<products.length){
    const i=next++;const p=products[i],urls=(p.images||[]).map(img=>typeof img==='string'?img:(img?.url||img?.src||'')).filter(Boolean);
    const attempts=[];
    const galleryCheck = group(p) === 'Memon Traders' ||
        group(p) === 'Meem Traders' ||
        (p.sku?.startsWith('TOS-') && urls[0]?.startsWith('https://cdn.shopify.com/'));
    for(const url of (galleryCheck ? urls : urls.slice(0,5))){
      const testResult=await test(url);attempts.push({url,...testResult});
      // Check all restored thumbnails, not just the cover.
      if(testResult.ok && !galleryCheck)break;
    }
    results[i]={sku:p.sku,title:p.title,group:group(p),galleryCount:urls.length,
      validFirst:attempts[0]?.ok||false,anyValid:attempts.some(x=>x.ok),attempts};
    if(i%70===0)console.log('Checked',i+1,'/',products.length);
  }
}));
const byGroup={};
for(const row of results){
 const x=byGroup[row.group]||{count:0,validCover:0,hasWorkingAlternative:0,allFailed:0};
 x.count++;if(row.validFirst)x.validCover++;else if(row.anyValid)x.hasWorkingAlternative++;else x.allFailed++;
 byGroup[row.group]=x;
}
console.log('AUDIT_SUMMARY_JSON',JSON.stringify({products:results.length,byGroup,totalBrokenCover:results.filter(x=>!x.validFirst).length,allFailed:results.filter(x=>!x.anyValid).length,
memonGalleryChecked:results.filter(x=>x.group==='Memon Traders').reduce((sum,r)=>sum+r.attempts.length,0),
memonBrokenGalleryImages:results.filter(x=>x.group==='Memon Traders').reduce((sum,r)=>sum+r.attempts.filter(a=>!a.ok).length,0),
galleryFilesTested:results.reduce((sum,r)=>sum+r.attempts.length,0),
galleryBrokenFiles:results.reduce((sum,r)=>sum+r.attempts.filter(a=>!a.ok).length,0)}));
for(const row of results.filter(x=>x.attempts.some(a=>!a.ok))) {
  console.log('BAD_GALLERY',JSON.stringify({sku:row.sku,failed:row.attempts.filter(a=>!a.ok).map(a=>({url:a.url,status:a.status,type:a.type}))}));
}
const failures=results.filter(x=>!x.validFirst);
for(const row of failures.slice(0,120)){
 console.log('BAD_IMAGE',JSON.stringify({sku:row.sku,group:row.group,checks:row.attempts.map(a=>({status:a.status,type:a.type,url:a.url,message:a.message}))}));
}
fs.writeFileSync('mixenza-media-audit.json',JSON.stringify({generatedAt:new Date().toISOString(),summary:byGroup,results},null,2));
console.log('Report saved to mixenza-media-audit.json');
