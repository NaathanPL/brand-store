// window.__H = {E,S,R,ed, byTitle:{title: spec}} ; spec = 'N:<neutralKey>' or 'U:<uploadName>' ; window.__UPS = uploads {name:{imageKey,imageUrl,assetId,imageWidth,imageHeight}}
window.__NEUTRAL={
 b3ba61db:['al-eu-726f4d26-7fdb/b3ba61db-143c-4367-9865-8f4131d3eaa0.jpg','ef80bec928e2df202a01b0dae4684fa6',3000,600],
 '2d9aa8cf':['stores-image-uploads-eu-prod/9/AmazonStores/A13V1IB3VIYZZH/2d9aa8cfb653f129f93f3e0ed0773182.w3000.h600.jpg','54fe9bf8996ed34f21f39285595d62e8:version_v1',3000,600],
 '4b01f6a4':['stores-image-uploads-eu-prod/0/AmazonStores/A13V1IB3VIYZZH/4b01f6a47509b9a2d3ed4cd1e34ca528.w3000.h600.jpg','fbeabc8f885076c706b26b4f63158e53:version_v1',3000,600],
 '54387665':['al-eu-726f4d26-7fdb/54387665-86f1-433b-8d90-949e22c87fa8.png','4adb04b62e08f39e91ba7ad3b2c08496',2172,435],
 '9f48cc84':['al-eu-726f4d26-7fdb/9f48cc84-3853-4f41-b968-3a3ed42434b1.jpg','7221e79ece98a1e4db5dc2acc0235952',3000,601],
 cebef9ea:['al-eu-726f4d26-7fdb/cebef9ea-12d0-4ec3-8834-d2fcd8b4ee7a.png','5b68986d421f2312186fd09ae09ad641',3000,600],
 '1afc47d2':['al-eu-726f4d26-7fdb/1afc47d2-51a4-4237-8765-4dbeae4a0c95.png','21b8e485199e3f534d3ef6cbc3ec3f36',3000,600],
 '5b0379f9':['al-eu-726f4d26-7fdb/5b0379f9-3d2c-4132-a4b0-347e47a11e0e.png','390136dc87f9686b6341a0dd371ea044',2172,434],
 c472d981:['al-eu-726f4d26-7fdb/c472d981-7099-4e8a-9183-92d5fa98ee5c.png','96eccae58de3f98e306515b8020f6e8e',2172,434],
 '368ca946':['stores-image-uploads-eu-prod/3/AmazonStores/A13V1IB3VIYZZH/368ca9462e13dd556e4a0d5a5f430732.w3000.h600.jpg','c84418ada1edad93b03442ae94d8eb32:version_v1',3000,600],
 '2819bed5':['al-eu-726f4d26-7fdb/2819bed5-8eaf-48d3-8288-f26bae11b36b.png','52a7ca60a85fa70c36c98eea8f5c2f7b',3000,600]
};
window.__setHeaders = async (dry) => {
  const C=window.__H; const tk=document.querySelector('meta[name="builder-csrf-token"]').content;
  const api=async p=>JSON.parse((await (await fetch('/builder/api/getPageData?entityId='+C.E+'&subEntityId='+C.S,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded','anti-csrftoken-a2z':tk},body:`pageId=${p}&storeId=${C.R}&edition=${C.ed}`})).json()).pageData);
  const spec=s=>{if(s.startsWith('N:')){const n=__NEUTRAL[s.slice(2)];return {key:n[0],url:'https://m.media-amazon.com/images/S/'+n[0],asset:'amzn1.assetlibrary.asset1.'+n[1],w:n[2],h:n[3]}}const u=window.__UPS[s.slice(2)];if(!u)throw 'no upload '+s;return {key:u.imageKey,url:u.imageUrl,asset:u.assetId,w:+u.imageWidth,h:+u.imageHeight}};
  const root=await api(C.R); const nav=root.store.widgets.navigation.content.nav; const log=[];
  for(const id of Object.keys(nav)){
    const p=id==C.R?root:await api(id); const t=id==C.R?'__ROOT__':p.title; const s=C.byTitle[t];
    if(!s){log.push('NO SPEC '+t);continue}
    const x=spec(s); const h=JSON.parse(JSON.stringify(p.store.widgets.header));
    for(const c of [h.content,h.content.mobileContent]){c.imageKey=x.key;c.imageUrl=x.url;c.assetId=x.asset;c.imageWidth=c===h.content?x.w:String(x.w);c.imageHeight=c===h.content?x.h:String(x.h);c.imageOffsetTop=0;c.imageOffsetLeft=0;delete c.canvasData}
    p.store.widgets.header=h;
    if(!dry){const r=await fetch('/builder/api/savePageData?entityId='+C.E+'&subEntityId='+C.S,{method:'POST',headers:{'content-type':'application/json','anti-csrftoken-a2z':tk},body:JSON.stringify({pageId:id,pageData:p,entityId:C.E,deleted:false,storeId:C.R,parentPageId:'',edition:C.ed})});if(r.status!=200)log.push(t+' '+r.status)}
    else log.push(t+' -> '+x.key.split('/').pop().slice(0,8));
  }
  return log;
};
