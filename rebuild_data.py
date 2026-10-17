import csv,json,hashlib,collections,shutil
from pathlib import Path
root=Path(__file__).resolve().parent; rows=list(csv.reader(open(root/'data/naver_webtoon_raw.csv',encoding='utf-8-sig')));headers=rows.pop(0)
genres=[g for g,n in collections.Counter(r[3] for r in rows).most_common()]
periods=['2005–2009','2010–2014','2015–2019','2020–2024','2025–2026']
years=list(range(2005,2027));annual={y:collections.Counter() for y in years};period={p:collections.Counter() for p in periods}
for r in rows:
 if r[6]:
  y=int(r[6]);annual[y][r[3]]+=1;period[periods[min((y-2005)//5,4)]][r[3]]+=1
payload={'n':len(rows),'known':sum(sum(c.values()) for c in annual.values()),'genres':genres,'years':years,'periods':periods,'annual':{y:dict(c) for y,c in annual.items()},'period':{p:dict(c) for p,c in period.items()},'genreCounts':dict(collections.Counter(r[3] for r in rows)),'statusCounts':dict(collections.Counter(r[7] for r in rows)),'coverage':{g:{'total':sum(r[3]==g for r in rows),'known':sum(r[3]==g and bool(r[6]) for r in rows)} for g in genres},'source_sha256':hashlib.sha256((root/'data/naver_webtoon_raw.csv').read_bytes()).hexdigest()}
(root/'data/stats.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'data/stats.js').write_text('window.STATS='+json.dumps(payload,ensure_ascii=False)+';',encoding='utf-8')
print('Aggregated',payload['n'],payload['known'])
