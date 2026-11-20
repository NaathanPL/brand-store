// window.__A={E,S,R,ed} ; read-only audit
window.__audit=async()=>{const A=window.__A;const tk=document.querySelector('meta[name="builder-csrf-token"]').content;const sl=ms=>new Promise(r=>setTimeout(r,ms));
const raw=async p=>{await sl(250);const r=await fetch('/builder/api/getPageData?entityId='+A.E+'&subEntityId='+A.S,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded','anti-csrftoken-a2z':tk},body:`pageId=${p}&storeId=${A.R}&edition=${A.ed}`});return r.status==200?JSON.parse((await r.json()).pageData):r.status};
const root=await raw(A.R);const nav=root.store.widgets.navigation.content.nav;const out=[];
for(const id of Object.keys(nav)){const p=id==A.R?root:await raw(id);const t=nav[id].title;if(typeof p=='number'){out.push(t+': page introuvable '+p);continue}
 p.page.forEach((s,i)=>{if(s.sectionType=='ProductGrid'&&s.content.productType!='dynamic'&&(s.content.ASINList||[]).length<4)out.push(t+': grille '+(s.content.ASINList||[]).length+' produits');
  (s.tiles||[]).forEach((x,j)=>{const c=x.content;const L=[c.pageId,...(c.tileLayers||[]).map(l=>(l.content||{}).pageId)].filter(Boolean);
   L.forEach(l=>{if(!nav[l])out.push(t+': rangée '+i+' vignette '+j+' lien cassé')});
   if(x.type=='image'&&!L.length&&!(c.ASINList||[]).length&&!c.url)out.push(t+': rangée '+i+' vignette '+j+' image sans lien '+(c.imageKey||'').split('/').pop().slice(0,8))})})}
return out};
