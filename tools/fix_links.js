// window.__A={E,S,R,ed}; relie les images sans lien connues vers la page de leur gamme (dry=true : liste seulement)
window.__fixLinks=async(dry)=>{const A=window.__A;const tk=document.querySelector('meta[name="builder-csrf-token"]').content;const sl=ms=>new Promise(r=>setTimeout(r,ms));
const api=async p=>{await sl(250);return JSON.parse((await (await fetch('/builder/api/getPageData?entityId='+A.E+'&subEntityId='+A.S,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded','anti-csrftoken-a2z':tk},body:`pageId=${p}&storeId=${A.R}&edition=${A.ed}`})).json()).pageData)};
const MAP={e2bb7491:/^BIZZIKINS$/i,'259a58da':/^BLOPENS$/i,'8d95a5c5':/^COLLECTION\s+SEQUINS$/i};
const root=await api(A.R);const nav=root.store.widgets.navigation.content.nav;const find=re=>Object.keys(nav).filter(k=>re.test(nav[k].title.trim())).sort((a,b)=>nav[a].level-nav[b].level)[0];const out=[];let CTA=null;JSON.stringify(root.page).replace(/"callToAction":"([^"]+)"/,(m,v)=>{CTA=v});
for(const id of Object.keys(nav)){const p=id==A.R?root:await api(id);let ch=0;
 p.page.forEach((s,i)=>(s.tiles||[]).forEach((x,j)=>{const c=x.content;if(x.type!='image'||c.pageId||(c.ASINList||[]).length||(c.tileLayers||[]).some(l=>(l.content||{}).pageId))return;
  const k=(c.imageKey||'').split('/').pop().slice(0,8);const re=MAP[k];if(!re)return;const tgt=find(re);
  if(!tgt){out.push(nav[id].title+' '+i+'.'+j+' '+k+' : page cible absente');return}if(tgt==id)return;
  c.pageId=tgt;if(!c.callToAction&&CTA)c.callToAction=CTA;ch++;out.push(nav[id].title+' '+i+'.'+j+' '+k+' -> '+nav[tgt].title)}));
 if(ch&&!dry){await sl(300);const r=await fetch('/builder/api/savePageData?entityId='+A.E+'&subEntityId='+A.S,{method:'POST',headers:{'content-type':'application/json','anti-csrftoken-a2z':tk},body:JSON.stringify({pageId:id,pageData:p,entityId:A.E,deleted:false,storeId:A.R,parentPageId:nav[id].parent||'',edition:A.ed})});out.push('save '+nav[id].title+' '+r.status)}}
return out};
