import fs from 'node:fs';
import path from 'node:path';
const results=[];
const walk=dir=>{
 if(!fs.existsSync(dir))return;
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory()){if(!['node_modules','.next','.git','images'].includes(e.name))walk(p);continue;}
  if(!/\.(ts|tsx|js|jsx|json|md)$/i.test(p)||/package-lock|catalogFallback\.json/i.test(p))continue;
  let content='';
  try{content=fs.readFileSync(p,'utf8')}catch{continue}
  for(const [i,line] of content.split(/\r?\n/).entries())
    if(/\b(meem|memon|pickora)(?:[.\s_-]|$)/i.test(line))
      results.push({file:p.replaceAll(path.sep,'/'),line:i+1,text:line.trim().slice(0,250)});
 }
};
walk('src'); walk('app');
console.log('BRAND_AUDIT_JSON',JSON.stringify({total:results.length,lines:results}));
