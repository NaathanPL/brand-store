// window.__CFG = {E,S,R,ed,terr:[...], map:{pageTitle:'CATKEY'}}; returns log
window.__fill = async (dry) => {
  const C = window.__CFG;
  const tk = document.querySelector('meta[name="builder-csrf-token"]').content;
  const api = async p => JSON.parse((await (await fetch('/builder/api/getPageData?entityId='+C.E+'&subEntityId='+C.S,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded','anti-csrftoken-a2z':tk},body:`pageId=${p}&storeId=${C.R}&edition=${C.ed}`})).json()).pageData);
  const cat = await (await fetch('https://raw.githubusercontent.com/NaathanPL/brand-store/380fbd4/cata_actif.json')).json();
  const dead = new Set(cat.filter(o=>/Définitivement|Annulé/.test(o.st)).map(o=>o.a));
  const act = cat.filter(o=>!dead.has(o.a) && C.terr.includes(o.t));
  const N = o=>o.n.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const has=(o,...k)=>k.some(x=>N(o).includes(x));
  const fam=o=>has(o,'BLOPENS')?'BLO':has(o,'MINI DELICES')?'MINI':has(o,'COLLECTION SEQUINS')?'SEQ':has(o,'PIXELO')?'PIX':has(o,'MAGIC LIGN')?'ML':has(o,'CUTIE STIX')?'CS':has(o,'SHINY POP')?'SP':has(o,'SKY DANCERS')?'SKY':has(o,'BEBE CABRIOLES')?'BEBE':has(o,'BIZZIKINS')?'BIZ':has(o,'YUMEMI')?'YUM':(has(o,'MAKE IT REAL','BRACELETS COLOR')||/make it real/i.test(o.b))?'MIR':has(o,'STAR ACADEMY')?'STAR':has(o,'COFFRET BIJOUX')?'COF':has(o,'METIER A TISSER')?'TIS':has(o,'DECOMAGIC')?'DECO':has(o,'LASER X')?'LASER':has(o,'FINGERLINGS')?'FING':has(o,'TITOUNIS')?'TIT':has(o,'WEDNESDAY','DC -','MCFARLANE')?'KID':has(o,'STITCH - STICKERS','STICKER STITCH')?'STICK':'JEU';
  const ageOf=o=>o.age?(/mois/i.test(o.age[1])?0:o.age[0]):null;
  const bk=a=>a==null?null:a<3?'1ER':a<=5?'35':a<=7?'67':'8';
  const AGEX=['STAR','LASER','SKY','KID'];
  const R={
    BLO:o=>fam(o)=='BLO', MINI:o=>fam(o)=='MINI', SEQ:o=>fam(o)=='SEQ', PIX:o=>fam(o)=='PIX', ML:o=>fam(o)=='ML', CS:o=>fam(o)=='CS', SP:o=>fam(o)=='SP', YUM:o=>fam(o)=='YUM', SKY:o=>fam(o)=='SKY', MIR:o=>fam(o)=='MIR',
    POUP:o=>['BEBE','SKY','BIZ'].includes(fam(o)),
    DESS:o=>['BLO','PIX','ML','DECO'].includes(fam(o)),
    PERL:o=>['CS','SP','TIS','MIR'].includes(fam(o)),
    LOIS:o=>['BLO','PIX','ML','DECO','CS','SP','COF','TIS','MIR','SEQ','MINI','YUM','STICK'].includes(fam(o)),
    OFF:o=>true,
    A1:o=>bk(ageOf(o))=='1ER'&&!AGEX.includes(fam(o)), A35:o=>bk(ageOf(o))=='35'&&!AGEX.includes(fam(o)),
    A67:o=>bk(ageOf(o))=='67'&&!AGEX.includes(fam(o)), A8:o=>bk(ageOf(o))=='8'&&!AGEX.includes(fam(o)),
  };
  const sortDead=a=>a.filter(x=>!dead.has(x)).concat(a.filter(x=>dead.has(x)));
  const root=await api(C.R); const nav=root.store.widgets.navigation.content.nav;
  const log=[];
  for(const id of Object.keys(nav)){
    const p=id==C.R?root:await api(id); const key=C.map[p.title]; if(!key) continue;
    const s=p.page.find(x=>(x.sectionType=='ProductGrid'||x.sectionType=='DealsAndCoupons')&&x.content.productType!='dynamic');
    if(!s){log.push(p.title+': pas de grille');continue}
    const c=s.content; const L=new Set(c.ASINList);
    const add=act.filter(o=>R[key](o)&&!L.has(o.a)).map(o=>o.a);
    if(!add.length) continue;
    c.ASINList=sortDead(c.ASINList.concat(add));
    if(c.search&&Array.isArray(c.search.ASINList)) c.search.ASINList=sortDead(c.search.ASINList.concat(add.filter(a=>!c.search.ASINList.includes(a))));
    if(s.sectionType=='ProductGrid'&&c.ASINList.some(a=>dead.has(a))) c.includeOutOfStock=false;
    let st='dry';
    if(!dry){const r=await fetch('/builder/api/savePageData?entityId='+C.E+'&subEntityId='+C.S,{method:'POST',headers:{'content-type':'application/json','anti-csrftoken-a2z':tk},body:JSON.stringify({pageId:id,pageData:p,entityId:C.E,deleted:false,storeId:C.R,parentPageId:'',edition:C.ed})});st=r.status}
    log.push(p.title+' +'+add.length+' '+st+' : '+add.map(a=>cat.find(o=>o.a==a).n.slice(0,22)).join(' | '));
  }
  return log;
};
