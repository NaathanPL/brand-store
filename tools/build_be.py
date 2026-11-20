import json,re,uuid,copy
fr=json.load(open('/tmp/fr.json'));cat={o['a']:o for o in json.load(open('cata_actif.json'))}
be=json.load(open('BE/be_meta.json'))
OK={'UE','FR + BE','FR + BE + NL','FR + BE + DE + NL'}
bad=lambda a:a in cat and cat[a]['t'] not in OK
dead=lambda a:a in cat and re.search('Définitivement|Annulé',cat[a]['st'])
FR_R='2F884A82-A229-41EC-8113-9498852F3172';BE_R=be['root']
nav=fr[FR_R]['store']['widgets']['navigation']['content']['nav']
DROP={'PISTOLET LASER','LASER X'}
keep=[k for k in nav if nav[k]['title'] not in DROP]
M={FR_R:BE_R}
for k in keep:
  if k==FR_R: continue
  M[k]=be['ids'].get(' '.join(nav[k]['title'].split())) or str(uuid.uuid4()).upper()
# replacements for FR-only single tiles (no dup on page)
REPL={'LANSAY':{'B00JR1ZZDA':['B0GH885X5J','B0DSLZKR83']}}
log=[]
def fix_page(t,p):
  page=[]
  pageAsins=set(re.findall(r'B0[A-Z0-9]{8}',json.dumps(p['page'])))
  for i,s in enumerate(p['page']):
    s=copy.deepcopy(s)
    if 'tiles' in s:
      tiles=[]
      for ti in s['tiles']:
        L=ti.get('content',{}).get('ASINList') or []
        b=[a for a in L if bad(a)]
        if b:
          r=REPL.get(t,{}).get(b[0])
          if r:
            new=next(x for x in r if x not in pageAsins);r.remove(new);pageAsins.add(new)
            ti['content']['ASINList']=[new];log.append(f'{t}: {b[0]} -> {new}');tiles.append(ti);continue
          log.append(f'{t}: tuile {ti["type"]} {b} retirée');continue
        if ti['type']=='product' and L and all(dead(a) for a in L):
          if t=='LANSAY': log.append(f'{t}: tuile morte {L} retirée (homepage)');continue
          ti['content']['displayOutOfStockASIN']=False
        pid=ti.get('content',{}).get('pageId')
        if pid and pid in nav and nav[pid]['title'] in DROP: log.append(f'{t}: tuile lien {nav[pid]["title"]} retirée');continue
        tiles.append(ti)
      if not tiles: log.append(f'{t}: rangée {i} supprimée');continue
      if len(tiles)!=len(s['tiles']):
        n=len(tiles);o=[x['size'] for x in s['tiles']];sz={1:['large'],2:['medium','medium']}.get(n) or (['small']+['mini']*6 if n==7 and o==['mini']*8 else None) or (['small','mini','mini','medium'] if n==4 and o==['mini']*4+['medium'] else None) or (['medium','small','mini','mini'] if n==4 and o==['medium']+['mini']*4 else None)
        if not sz: log.append(f'{t}: rangée {i} ({n} tuiles restantes) supprimée');continue
        for ti,z in zip(tiles,sz): ti['size']=z
        log.append(f'{t}: rangée {i} passée à {n} tuiles')
      s['tiles']=tiles
    else:
      c=s.get('content',{})
      for obj in [c,c.get('search') or {}]:
        L=obj.get('ASINList') if isinstance(obj,dict) else None
        if isinstance(L,list):
          L2=[a for a in L if not bad(a)]
          L2=[a for a in L2 if not dead(a)]+[a for a in L2 if dead(a)]
          if len(L2)!=len(L): log.append(f'{t}: {s["sectionType"]} -{len(L)-len(L2)} FR only')
          obj['ASINList']=L2
          if s['sectionType']=='ProductGrid' and any(dead(a) for a in L2): c['includeOutOfStock']=False
    page.append(s)
  return page
newnav={}
for k in keep:
  n=nav[k];newnav[M[k]]={'parent':M.get(n['parent']) if n['parent'] else None,'level':n['level'],'children':[M[c] for c in n['children'] if c in M],'pageId':M[k],'title':'LANSAY' if k==FR_R else n['title']}
out={}
for k in keep:
  p=fr[k];t=nav[k]['title'];pg=fix_page(t,p)
  s=json.dumps(pg)
  for a,b in M.items(): s=s.replace(a,b)
  s=s.replace('FC2B7F53-1661-4DEC-A030-6ECDD1D1486C',M[[x for x in nav if nav[x]['title']=='MINI DELICES'][0]])
  for d in [x for x in nav if x not in M]:
    if d in s: log.append(f'{t}: lien vers page supprimée {nav[d]["title"]}')
  pg=json.loads(s)
  st={'settings':dict(be['settings']) if k==FR_R else dict(p['store']['settings']),
      'widgets':{'navigation':dict(be['navW'],content={'nav':newnav,'id':'bebmwtjjrf','type':'Navigation'}),'header':p['store']['widgets'].get('header')}}
  o={'template':p['template'],'id':M[k],'store':st,'page':pg,'title':'LANSAY' if k==FR_R else p['title']}
  out[M[k]]=o
dele=[v for t,v in be['ids'].items() if v not in out]
json.dump({'pages':out,'delete':dele,'root':BE_R},open('BE/be_build.json','w'),ensure_ascii=False)
print('\n'.join(log));print('pages',len(out),'delete',[t for t,v in be['ids'].items() if v in dele])
