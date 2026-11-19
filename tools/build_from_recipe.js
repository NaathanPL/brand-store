// window.__B = {E,S,R,ed, pairs:{dePrefix:'existingTitle'}, T:{deText:'newText'}, ageFmt:'Da $1 anni', header:{...}, backupKey}
// builds all pages from ES/de_recipe.json + FR json; dry=true returns summary only
window.__build = async (dry) => {
  const B = window.__B; const base='https://raw.githubusercontent.com/NaathanPL/brand-store/2fd7156/';
  const [rec,fr,hs]=await Promise.all(['ES/de_recipe.json','DE/pages_fr_fa26.json','DE/homepage_sections.json'].map(f=>fetch(base+f).then(r=>r.json())));
  const tk=document.querySelector('meta[name="builder-csrf-token"]').content;
  const api=async p=>JSON.parse((await (await fetch('/builder/api/getPageData?entityId='+B.E+'&subEntityId='+B.S,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded','anti-csrftoken-a2z':tk},body:`pageId=${p}&storeId=${B.R}&edition=${B.ed}`})).json()).pageData);
  const save=async(id,pd,del=false)=>(await fetch('/builder/api/savePageData?entityId='+B.E+'&subEntityId='+B.S,{method:'POST',headers:{'content-type':'application/json','anti-csrftoken-a2z':tk},body:JSON.stringify({pageId:id,pageData:pd,entityId:B.E,deleted:del,storeId:B.R,parentPageId:'',edition:B.ed})})).status;
  const rootOld=await api(B.R); const oldNav=rootOld.store.widgets.navigation.content.nav;
  const byTitle=t=>Object.keys(oldNav).find(k=>oldNav[k].title.trim()==t);
  const idx={};const add=s=>{const id=s.widgetId||s.id||(s.tiles&&s.tiles[0]&&s.tiles[0].id);if(id)idx[id]=s};Object.values(fr).forEach(v=>v.page.forEach(add));hs.forEach(add);
  const M={'9E466E98-1E9B-4B4D-9A1F-C1894C8ED9E7':B.R}; const miss=[];
  for(const d of Object.keys(rec.__nav)){if(M[d])continue;const t=B.pairs[d.slice(0,8)];const ex=t&&byTitle(t);if(t&&!ex)miss.push(t);M[d]=ex||crypto.randomUUID().toUpperCase()}
  const known=new Set(Object.values(M));
  const tr=v=>B.T[v]!==undefined?B.T[v]:v.replace(/^Ab (\d+) Jahren$/,B.ageFmt);
  const set=(o,path,v)=>{let x=o;for(let i=0;i<path.length-1;i++)x=x[path[i]];const k=path[path.length-1];if(v==='__DEL__')delete x[k];else x[k]=v};
  const nav={};for(const [d,n] of Object.entries(rec.__nav))nav[M[d]]={parent:n.parent?M[n.parent]:null,level:n.level,children:n.children.map(c=>M[c]),pageId:M[d],title:d.startsWith('9E466E98')?rootOld.title:tr(n.title)};
  const out={};const unk=new Set();
  for(const [d,r] of Object.entries(rec)){if(d=='__nav')continue;
    let page=r.secs.map(s=>{if(s.full)return JSON.parse(JSON.stringify(s.full));const c=JSON.parse(JSON.stringify(idx[s.ref]));s.d.forEach(([p,v])=>set(c,p,v));return c});
    let s=JSON.stringify(page);for(const [a,b] of Object.entries(M))s=s.split(a).join(b);
    page=JSON.parse(s,(k,v)=>{if(typeof v=='string'){if(/(text|title|header|label|callToAction|prefix)$/i.test(k))return tr(v);if(k=='pageId'&&!known.has(v))unk.add(v)}return v});
    const isRoot=d.startsWith('9E466E98');const title=isRoot?rootOld.title:tr(r.title);
    const store={settings:Object.assign({},rootOld.store.settings,{pageDescription:isRoot?rootOld.store.settings.pageDescription:title.charAt(0)+title.slice(1).toLowerCase()}),widgets:{navigation:Object.assign({},rootOld.store.widgets.navigation,{content:Object.assign({},rootOld.store.widgets.navigation.content,{nav})}),header:B.header}};
    out[M[d]]=isRoot?Object.assign({},rootOld,{page,store,template:r.template}):{template:r.template,id:M[d],store,page,title};
  }
  const del=Object.keys(oldNav).filter(k=>!out[k]);
  if(dry) return {miss,unk:[...unk],titles:Object.values(nav).map(n=>n.level+' '+n.title),del:del.map(k=>oldNav[k].title)};
  const res=[];for(const [id,o] of Object.entries(out)){if(id==B.R)continue;res.push(o.title+' '+await save(id,o))}
  res.push('ROOT '+await save(B.R,out[B.R]));
  for(const k of del){const p=await api(k);res.push('DEL '+oldNav[k].title+' '+await save(k,p,true))}
  return res.filter(x=>!/ 200$/.test(x)).concat([res.length+' ops']);
};
