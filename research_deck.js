/* CSV-derived statistics only. Artwork is confined to cover/chapter slides. */
'use strict';
const R=window.RESEARCH,D=window.STATS;
const num=(x,d=0)=>Number(x).toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d});
const f=(x,d=4)=>Number(x).toFixed(d),pc=(x,d=1)=>f(Number(x)*100,d)+'%',signed=(x,d=4)=>(Number(x)>0?'+':'')+f(x,d);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const A=Object.fromEntries(R.annual.map(x=>[+x.year,x]));
const P=Object.fromEntries(R.periods.map(x=>[x.period,x]));
const early=P['2010–2014'],late=P['2020–2024'];
const years=R.annual.map(x=>+x.year),primary=R.annual.filter(x=>+x.year>=2008&&+x.year<=2025);
const palette=['#df795b','#3a7b58','#899e52','#446c83','#c0a355','#b0849e','#6687a0','#a27b59','#7ca798','#a29b95'];
const colors=Object.fromEntries(D.genres.map((g,i)=>[g,palette[i]]));
const sum=o=>Object.values(o).reduce((a,b)=>a+Number(b),0);
const art=(ids,cls='')=>`<div class="art-grid ${cls}">${ids.map(id=>{const a=R.artworks.find(x=>x.id===id);return `<figure><a href="${a.work_url}" target="_blank" rel="noopener"><img src="${a.file}" alt="${esc(a.title)} 공식 썸네일"><figcaption><b>${esc(a.title)}</b><span>${esc(a.authors)}</span></figcaption></a></figure>`}).join('')}</div>`;
const eyebrow=s=>`<p class="eyebrow">${s}</p>`;
const chart=(id,cls='')=>`<div id="${id}" class="chart ${cls}"></div>`;
const note=s=>`<p class="note">${s}</p>`;
const card=(value,label,small='')=>`<div class="metric"><strong>${value}</strong><span>${label}</span>${small?`<small>${small}</small>`:''}</div>`;
const slides=[
['많아진 작품, 다양해진 장르?',`<div class="cover-copy">${eyebrow('NAVER WEBTOON / DIVERSITY STUDY')}<h1>많아진 작품,<br>다양해진 장르?</h1><p class="cover-sub">신규 연재 규모의 확대와<br>장르 다양성·집중도의 변화</p><div class="cover-meta"><b>2005—2026</b><span>4,225작품의 관측 목록</span></div><p class="art-note">공식 썸네일의 예시 작품 · 통계 표본 선정과 무관</p></div>${art(['183559','703846','641253','651673','747269','20853'],'cover-art')}<span class="edition">RESEARCH EDITION · 2026.10.17</span>`,'cover'],
['먼저, 결론',`${eyebrow('THE FINDING')}<h2>신작의 확대가<br><em>지속적 다양화로 이어지지는 않았다.</em></h2><div class="answer-grid"><div class="answer-copy"><p class="lead">관측 신작 규모는 커졌지만,<br>최근 비교 구간의 장르 구성은<br>더 불균등했습니다.</p><div class="badge">연도가 확인된 관측 작품 기준</div></div><div class="comparison"><div class="comparison-head"><span>같은 길이의 5년 구간</span><b>2010–2014</b><b>2020–2024</b></div><div><span>관측 작품 수</span><strong>${num(early.n)}</strong><strong>${num(late.n)}</strong></div><div><span>유효 장르 수 exp(H)</span><strong>${f(early.effective_genres_shannon,2)}</strong><strong class="accent">${f(late.effective_genres_shannon,2)}</strong></div><div><span>HHI · 높을수록 집중</span><b>${f(early.hhi)}</b><b>${f(late.hhi)}</b></div></div></div><div class="takeaway">변화는 단조롭지 않았습니다. 전체 역사에 대한 다양성 감소로 일반화하지 않습니다.</div>`],
['분석의 분모',`${eyebrow('01 / SCOPE')}<h2>먼저, 어떤 작품을<br>비교하는지 구분합니다.</h2><div class="metrics">${card('4,225','전체 수집 작품','작품 ID 중복 0건')}${card('3,975','게시연도 확인 작품','연도·장르 추이의 분모')}${card('250','게시연도 결측','추정·대치하지 않음')}${card('18년','주 관계 분석','2008–2025 · 연도별 n≥30')}</div><div class="scope-grid"><div><b>신작 수의 의미</b><p>현재 목록에서 관측되며,<br>첫 회차 게시연도가 확인된 작품 수.</p></div><div><b>현재의 대표 장르</b><p>고정된 10개 범주로 집계.<br>연재 당시 분류 이력은 아님.</p></div><div><b>2026년은 부분 연도</b><p>수집일까지 ${num(A[2026].n)}작품.<br>연간 비교·상관 분석에서 제외.</p></div></div>${note('자료: 기존 CSV 수집본(2026.10.17). 삭제·서비스 종료·목록 비노출 작품은 관측되지 않을 수 있습니다.')}`],
['장르 수와 균등성',`${eyebrow('HOW TO READ DIVERSITY')}<h2>10개 장르가 모두 있어도,<br>다양성은 같지 않습니다.</h2><div class="definition-grid"><div class="definition"><span>SHANNON</span><h3>다양성 <b>↑</b></h3><p class="formula">H = −Σ p<sub>g</sub> ln p<sub>g</sub></p><p>각 장르의 비중을 함께 고려합니다.<br><strong>exp(H)</strong>는 같은 다양성을 내는<br>균등한 장르의 수입니다.</p></div><div class="definition"><span>HHI</span><h3>집중도 <b>↑</b></h3><p class="formula">HHI = Σ p<sub>g</sub>²</p><p>큰 비중의 장르에 더 민감합니다.<br>여기서는 <strong>0–1 척도</strong>입니다.<br>10개 장르 균등 시 0.1.</p></div><div class="year-contrast"><b>실제 관측값</b><div><span>2015년 · 장르 10개</span><strong>${f(A[2015].effective_genres_shannon,2)}<small>유효 장르</small></strong></div><div><span>2022년 · 장르 10개</span><strong>${f(A[2022].effective_genres_shannon,2)}<small>유효 장르</small></strong></div></div></div>${note('p_g = 해당 장르 작품 수 / 연도 내 작품 수. 자연로그 사용. 두 지표는 같은 비율에서 계산한 보완적 기술지표입니다.')}`],
['규모와 균등성',`<div class="chapter-copy">${eyebrow('02 / MORE TITLES')}<h2>모든 장르의 작품이 늘어도,<br>구성은 더 집중될 수 있다.</h2><p>절대 작품 수와 상대적 비중을 함께 읽기</p></div>${art(['20853','183559','641253'],'chapter-art')}${note('작품 이미지: 마음의소리(조석) · 신의 탑(SIU) · 외모지상주의(박태준). 공식 썸네일, 각 작품 페이지에 출처 연결.')}`,'chapter'],
['연도별 규모와 구성',`${eyebrow('COHORTS / 2005—2026')}<h2>관측 신작은 늘고,<br>장르 비중은 이동했습니다.</h2>${chart('annualCount','count-chart')}${chart('annualMix','mix-chart')}<div class="legend" id="genreLegend"></div>${note('첫 회차 게시연도 기준 3,975작품. 회색: n<30 초기 연도. 주황: 2026년 부분 연도. 목록의 역사적 완전성을 보장하지 않습니다.')}`],
['절대 증가와 상대 감소',`${eyebrow('COUNTS ≠ SHARES')}<h2>개그·일상도 늘었습니다.<br><em>전체에서 차지하는 비중이 줄었을 뿐.</em></h2><div class="dual-charts"><div><h3>장르 구성비의 차이</h3>${chart('shareDelta')}</div><div><h3>같은 기간의 작품 수 차이</h3>${chart('countDelta')}</div></div>${note('2010–2014 → 2020–2024. 모든 10개 장르에서 절대 작품 수 증가. 전체 증가 1,611건 중 로맨스 증가 642건은 39.9%. 인과적 기여율이 아닙니다.')}`],
['집중과 부분 회복',`${eyebrow('DIVERSITY THROUGH TIME')}<h2>2022년 강한 집중,<br>이후에는 부분 회복.</h2><div class="trends"><div><span>Shannon H <small>높을수록 다양</small></span>${chart('entropyTrend')}</div><div><span>HHI <small>높을수록 집중</small></span>${chart('hhiTrend')}</div></div><div class="mini-metrics"><span>2015 exp(H) <b>${f(A[2015].effective_genres_shannon,2)}</b></span><span>2022 exp(H) <b>${f(A[2022].effective_genres_shannon,2)}</b></span><span>2025 exp(H) <b>${f(A[2025].effective_genres_shannon,2)}</b></span><span>2025년은 2024년보다 H가 낮음</span></div>${note('2008–2026년 표시. 2022년은 n≥30 완전 연도 중 관측 극값이며 추정된 구조적 전환점이 아닙니다. 주황: 부분 연도.')}`],
['같은 작품 수로 비교',`${eyebrow('SAMPLE SIZE CHECK')}<h2>30작품씩 비교해도,<br>다양성의 등락은 남습니다.</h2><div class="rarefaction-layout"><div>${chart('rareTrend')}</div><aside><span class="aside-label">동일 표본 크기에서 기대 H</span><div class="year-list"><p><span>2015</span><b>${f(R.rarefaction.find(x=>+x.year===2015&&+x.m===30).expected_shannon,3)}</b></p><p><span>2022</span><b>${f(R.rarefaction.find(x=>+x.year===2022&&+x.m===30).expected_shannon,3)}</b></p><p><span>2025</span><b>${f(R.rarefaction.find(x=>+x.year===2025&&+x.m===30).expected_shannon,3)}</b></p></div><p>50·80작품 비교에서도<br>2022년 하락과 이후<br>부분 회복이 유지됩니다.</p></aside></div>${note('각 연도 관측 집합에서 비복원 30작품 추출 시 H의 정확한 기대값. 초기하분포로 계산. 누락된 역사적 작품·날짜 결측을 보정하는 방법은 아닙니다.')}`],
['규모와 다양성의 관계',`${eyebrow('GROWTH & DIVERSITY')}<h2>작품 수가 많은 해가<br>더 다양한 해는 아닙니다.</h2><div class="scatter-layout">${chart('growthScatter')}<aside><p class="aside-label">2008–2025 · 18개 연도</p><div class="coefficient"><span>작품 수–H · Spearman</span><b>−0.218</b></div><div class="coefficient"><span>작품 수–HHI · Spearman</span><b>+0.505</b></div><p>전년 대비 변화량의 관계는<br>H −0.140, HHI +0.313으로<br>더 약했습니다.</p><p class="muted">탐색적 상관입니다.<br>인과 효과를 뜻하지 않습니다.</p></aside></div>${note('연도별 동등 가중. n≥50·100도 방향 점검. n=2·7·18인 2005–2007년을 포함하면 H 상관 방향이 달라지므로 소표본 처리에 주의.')}`],
['로맨스와 나머지 장르',`<div class="chapter-copy">${eyebrow('03 / INSIDE THE MIX')}<h2>로맨스의 확대,<br>그 밖의 장르에서는 무슨 일이?</h2><p>전체의 집중과 내부의 다양화가 동시에</p></div>${art(['703846','651673','747269'],'chapter-art')}${note('작품 이미지: 여신강림(야옹이) · 유미의 세포들(이동건) · 전지적 독자 시점(UMI / 슬리피-C / 싱숑). 공식 썸네일.')}`,'chapter'],
['구성 변화의 분해',`${eyebrow('ROMANCE / COMPOSITION DECOMPOSITION')}<h2>로맨스 비중 상승은 집중 방향,<br>나머지 내부 변화는 완화 방향.</h2><div class="dual-charts decomposition"><div><h3>Shannon H의 변화</h3>${chart('entropyDecomp')}</div><div><h3>HHI의 변화</h3>${chart('hhiDecomp')}</div></div><div class="formula-strip">전체 변화 = 로맨스 비중 변화분 + 비로맨스 내부 구성 변화분</div>${note('2010–2014 → 2020–2024. 두 요인을 교체하는 순서를 평균한 Shapley 구성 분해. 인과적 기여도가 아니며 반올림 전 합계가 정확히 일치합니다.')}`],
['회복의 구성',`${eyebrow('RECOVERY / 2022—2025')}<h2>회복도 두 변화가 함께했습니다.</h2><div class="recovery-grid"><div class="recovery-table"><div class="recovery-head"><span>관측 구성</span><b>2022</b><b>2025</b></div><div><span>작품 수</span><b>${num(A[2022].n)}</b><b>${num(A[2025].n)}</b></div><div><span>로맨스 비중</span><b>${pc(A[2022].romance_share)}</b><b>${pc(A[2025].romance_share)}</b></div><div><span>비로맨스 내부 H</span><b>${f(A[2022].nonromance_shannon,3)}</b><b>${f(A[2025].nonromance_shannon,3)}</b></div><div><span>전체 유효 장르 수</span><b>${f(A[2022].effective_genres_shannon,2)}</b><b>${f(A[2025].effective_genres_shannon,2)}</b></div></div><div class="recovery-explain"><span class="aside-label">전체 H 변화 +0.1535</span>${chart('recoveryDecomp')}<p>큰 장르의 비중 하락과<br>나머지 장르 내부의 다양화가 함께 관측됐습니다.</p></div></div>${note('2022년과 2025년 두 관측 구성의 비교이며 변화 원인을 식별한 결과가 아닙니다. 2025년은 2024년보다 H가 낮아, 회복도 단조롭지 않습니다.')}`],
['결측이 바꾸는 결론',`${eyebrow('WHAT IS ROBUST?')}<h2>로맨스 확대는 유지되지만,<br>다양성 감소는 확정할 수 없습니다.</h2><div class="sensitivity-grid"><div><h3>H 변화의 방향</h3>${chart('missingH')}</div><div class="sensitivity-copy"><b class="aside-label">연도 결측 250건을 고려하면</b><p>극단적 가상 배분에서<br>H·HHI 변화 방향이 모두 뒤집힙니다.</p><div class="robust"><span>과거 로맨스 비중 상한</span><strong>${pc(baselineBound('2010–2014','upper'))}</strong><b>&lt;</b><strong>${pc(baselineBound('2020–2024','lower'))}</strong><span>최근 로맨스 비중 하한</span></div><p class="muted">반면, 알려진 연도 결측만으로는<br>로맨스 확대가 뒤집히지 않습니다.</p></div></div>${note('가상 배분: 결측 로맨스 105·드라마 38건은 과거, 나머지 107건은 최근 구간. 실제 연도 추정·대치가 아님. 관측되지 않은 삭제·비노출 작품에는 이 경계가 적용되지 않습니다.')}`],
['연구 질문에 대한 답',`${eyebrow('THE ANSWER, WITH ITS BOUNDARIES')}<h2>관측 규모는 확대.<br><em>장르의 균등성은 지속 확대되지 않음.</em></h2><div class="closing-points"><article><span>01</span><h3>확인한 변화</h3><p>최근 비교 구간은 더 집중.<br>2022년 집중 이후 부분 회복.<br>비로맨스 내부 다양화도 공존.</p></article><article><span>02</span><h3>말할 수 없는 것</h3><p>플랫폼 전체 역사의 획일화.<br>독자 수요·인기도의 변화.<br>작품 증가가 집중을 낳았다는 인과.</p></article><article><span>03</span><h3>남는 한계</h3><p>불완전한 과거 목록.<br>현재의 단일 장르 분류.<br>무작위가 아닌 날짜 결측.</p></article></div><div class="takeaway">가장 강한 결론은 “로맨스 비중의 확대”. 다양성 감소는 연도 확인 관측 목록에 한정합니다.</div>`],
['데이터와 이미지 출처',`${eyebrow('SOURCES & REPRODUCIBILITY')}<h2>숫자와 이미지의 출처를 남깁니다.</h2><div class="resource-grid"><div><h3>분석 데이터</h3><a class="resource-link" href="data/naver_webtoon_raw.csv" download>원본 CSV <span>4,225작품 ↗</span></a><a class="resource-link" href="data/research/analysis_report.html">추가 분석 보고서 <span>방법·결과·한계 ↗</span></a><a class="resource-link" href="data/research/annual_metrics.csv" download>연도별 H·HHI 집계 <span>CSV ↗</span></a><a class="resource-link" href="data/research.json">차트 데이터·이미지 출처 <span>JSON ↗</span></a><p class="source-note">자료 수집: 2026.10.17 · 분석: 기존 CSV만 사용<br>통계: JavaScript/SVG · 전환: anime.js<br>이미지: 공식 썸네일 · 표지/섹션 전환에만 사용</p></div><div class="image-credits"><h3>작품 이미지</h3>${R.artworks.map(a=>`<a href="${a.work_url}" target="_blank" rel="noopener"><b>${esc(a.title)}</b><span>${esc(a.authors)}</span></a>`).join('')}<p>원작 이미지의 권리는 각 권리자에게 있습니다.<br>작품 링크 및 원본 이미지 URL은 출처 JSON에 기록했습니다.</p></div></div>${note('원본 CSV SHA-256: '+R.source_sha256.slice(0,32)+'… · 이미지 속에 통계 수치를 합성하지 않았습니다.')}`,'sources']
];
function baselineBound(period,key){return +R.bounds.find(x=>x.period===period)[key];}
document.getElementById('deck').innerHTML=slides.map(([title,body,cls=''],i)=>`<section class="slide ${cls} ${i===0?'active':''}" data-title="${esc(title)}" aria-hidden="${i!==0}">${body}<footer class="slide-footer"><span>WEBTOON / DIVERSITY</span><span>${String(i+1).padStart(2,'0')} — ${slides.length}</span></footer></section>`).join('');

// SVG primitives: all plotted values come from R or D, not artwork.
const txt=(x,y,s,attr='')=>`<text x="${x}" y="${y}" ${attr}>${esc(s)}</text>`;
const box=(x,y,w,h,fill,tip='',attr='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" fill="${fill}" ${tip?`data-tip="${esc(tip)}"`:''} ${attr}/>`;
const svg=(id,w,h,s)=>{document.getElementById(id).innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(document.getElementById(id).closest('.slide').dataset.title)}">${s}</svg>`};
const grid=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d5ddcc"/>`;

// Annual count chart and complete genre composition.
{
 const w=1424,h=180,l=55,r=10,t=20,b=35,pw=w-l-r,ph=h-t-b,bw=pw/years.length,max=600;let s='';
 [0,200,400,600].forEach(v=>{let y=t+ph*(1-v/max);s+=grid(l,y,w-r,y)+txt(l-12,y+5,v,'class="axis" text-anchor="end"')});
 years.forEach((y,i)=>{let n=+A[y].n,x=l+i*bw+7,bh=ph*n/max;s+=box(x,t+ph-bh,bw-14,bh,y===2026?'#d29155':y<2008?'#a1ad99':'#2a7955',`${y}${y===2026?' (부분 연도)':''}\n${n}작품`)+txt(x+(bw-14)/2,t+ph-bh-7,n,'font-size="15" text-anchor="middle" fill="#315e42"')+txt(x+(bw-14)/2,h-9,String(y).slice(2),'class="axis" text-anchor="middle"')});
 svg('annualCount',w,h,s);
 let mix='';const mh=220,mt=5,mp=180;[0,50,100].forEach(v=>mix+=txt(l-12,mt+mp*(1-v/100)+5,v+'%','class="axis" text-anchor="end"'));
 years.forEach((y,i)=>{let n=+A[y].n,x=l+i*bw+1,at=mt+mp;D.genres.forEach(g=>{let v=D.annual[y][g]||0,bh=mp*v/n;at-=bh;mix+=box(x,at,bw-2,bh,colors[g],`${y} · ${g}\n${v} / ${n} (${pc(v/n)})`)});mix+=txt(x+(bw-2)/2,mh-8,y,'font-size="15" text-anchor="middle"')});svg('annualMix',w,mh,mix);
 document.getElementById('genreLegend').innerHTML=D.genres.map(g=>`<span><i style="background:${colors[g]}"></i>${g}</span>`).join('');
}

function changeBars(id,field,max,x0,width,dec,suffix){
 const w=690,h=350,l=95,t=16,rh=32;let s='';
 s+=grid(x0,0,x0,h-15);
 R.growth.forEach((o,i)=>{let v=+o[field],y=t+i*rh,x=x0+Math.min(v,0)/max*width,bw=Math.abs(v)/max*width;
 s+=txt(l-12,y+17,o.genre,'text-anchor="end" font-size="18"')+box(x,y,bw,22,o.genre==='로맨스'?'#dc795b':'#6d977b',`${o.genre}\n${o.count_2010_2014} → ${o.count_2020_2024}작품\n구성비 ${signed(o.share_change_pp,1)}%p`)+txt(x0+v/max*width+(v<0?-8:8),y+17,signed(v,dec)+suffix,`text-anchor="${v<0?'end':'start'}" font-size="17" fill="#355d41"`)
 });svg(id,w,h,s);
}
changeBars('shareDelta','share_change_pp',30,300,300,1,'%p');
changeBars('countDelta','count_change',700,105,485,0,'');

function lineChart(id,data,field,{min,max,w=1424,h=170,color='#277a54',marks=[],fixedTicks=null,dec=2,partial=true}={}){
 const l=70,r=45,t=17,b=35,pw=w-l-r,ph=h-t-b,xx=data.map(o=>+o.year),xlo=Math.min(...xx),xhi=Math.max(...xx),X=x=>l+(x-xlo)/(xhi-xlo)*pw,Y=y=>t+(max-y)/(max-min)*ph;
 let s='';if(partial&&xhi===2026)s+=box(X(2025.5),0,w-X(2025.5),h,'#ead1ac','2026년은 부분 연도','opacity=".35"');
 for(let i=0;i<4;i++){let v=min+(max-min)*i/3,y=Y(v);s+=grid(l,y,w-r,y)+txt(l-12,y+5,f(v,dec),'class="axis" text-anchor="end"')}
 const ticks=fixedTicks||[xlo,2011,2014,2017,2020,2023,xhi].filter((x,i,a)=>x>=xlo&&x<=xhi&&a.indexOf(x)===i);
 ticks.forEach(x=>s+=txt(X(x),h-8,x,'class="axis" text-anchor="middle"'));
 s+=`<path class="line-path" d="${data.map((o,i)=>(i?'L':'M')+X(+o.year)+','+Y(+o[field])).join(' ')}" fill="none" stroke="${color}" stroke-width="3"/>`;
 data.forEach(o=>{let x=X(+o.year),y=Y(+o[field]);s+=`<circle cx="${x}" cy="${y}" r="${marks.includes(+o.year)?6:4}" fill="${+o.year===2026?'#c78a50':color}" data-tip="${esc(`${o.year}년\n${field}: ${f(o[field])}${o.n?'\nn = '+o.n:''}`)}"/>`;if(marks.includes(+o.year))s+=txt(x,y-13,f(o[field],dec),'text-anchor="middle" font-size="16" font-weight="700" fill="'+color+'"')});svg(id,w,h,s);
}
lineChart('entropyTrend',R.annual.filter(x=>+x.year>=2008),'shannon',{min:1.7,max:2.05,marks:[2022,2025],dec:2});
lineChart('hhiTrend',R.annual.filter(x=>+x.year>=2008),'hhi',{min:.14,max:.25,color:'#b2724d',marks:[2022,2025],dec:2});
lineChart('rareTrend',R.rarefaction.filter(x=>+x.m===30&&+x.year<=2025),'expected_shannon',{min:1.5,max:2.0,w:1000,h:355,marks:[2015,2022,2025],fixedTicks:[2008,2011,2014,2017,2020,2023,2025],dec:2,partial:false});

{
 const w=1000,h=390,l=70,r=35,t=25,b=50,pw=w-l-r,ph=h-t-b,X=n=>l+(Math.log(n)-Math.log(30))/(Math.log(650)-Math.log(30))*pw,Y=h=>t+(2.05-h)/.35*ph;let s='';
 [1.7,1.8,1.9,2].forEach(v=>{s+=grid(l,Y(v),w-r,Y(v))+txt(l-14,Y(v)+5,f(v,1),'class="axis" text-anchor="end"')});
 [40,80,160,320,640].forEach(v=>s+=txt(X(v),h-22,v,'class="axis" text-anchor="middle"'));
 primary.forEach(o=>{let x=X(+o.n),y=Y(+o.shannon),late=+o.year>=2020;s+=`<circle cx="${x}" cy="${y}" r="7" fill="${late?'#d47b58':'#35795b'}" stroke="#fffef7" stroke-width="2" data-tip="${esc(`${o.year}년\nn=${o.n}\nH=${f(o.shannon)}\nHHI=${f(o.hhi)}`)}"/>`;if([2008,2012,2015,2020,2022,2025].includes(+o.year))s+=txt(x+10,y-8,o.year,'font-size="16" fill="#42684c"')});
 s+=txt(w/2,h-1,'관측 최초 게시 작품 수 · 로그 축','font-size="17" text-anchor="middle"');svg('growthScatter',w,h,s);
}

function decomposition(id,metric,comparison,w=690,h=310){
 const o=R.decomposition.find(x=>x.metric===metric&&x.comparison===comparison),vals=[+o.romance_share_effect_shapley,+o.other_genre_composition_effect_shapley,+o.change];
 const labels=['로맨스 비중','비로맨스 내부','전체 변화'];const l=45,r=25,t=28,b=65,range=Math.max(...vals.map(Math.abs))*1.4,Y=v=>t+(range-v)/(range*2)*(h-t-b),zero=Y(0),cw=(w-l-r)/3;let s=grid(l,zero,w-r,zero);
 vals.forEach((v,i)=>{let x=l+i*cw+cw*.18,bw=cw*.64,y=Y(Math.max(v,0));s+=box(x,y,bw,Math.abs(Y(v)-zero),['#d27a59','#7ca582','#355f75'][i],`${labels[i]}\n${signed(v)}\n구성 분해, 인과 아님`)+txt(x+bw/2,Y(v)+(v>=0?-12:25),signed(v),'font-size="23" font-weight="700" text-anchor="middle" fill="#294e36"')+txt(x+bw/2,h-28,labels[i],'font-size="18" text-anchor="middle"')});svg(id,w,h,s);
}
decomposition('entropyDecomp','shannon','2010–2014 vs 2020–2024');
decomposition('hhiDecomp','hhi','2010–2014 vs 2020–2024');
decomposition('recoveryDecomp','shannon','2022 vs 2025',620,240);

{
 const w=680,h=330,l=45,r=25,t=25,b=60,min=-.11,max=.06,Y=v=>t+(max-v)/(max-min)*(h-t-b),z=Y(0),labels=['年도 확인 작품만','극단적 가상 배분'];let s=grid(l,z,w-r,z);
 R.missingScenarios.forEach((o,i)=>{let v=+o.shannon_change,x=105+i*290,y=Y(Math.max(0,v));s+=box(x,y,160,Math.abs(Y(v)-z),i?'#b68c58':'#337a58',`${i?'가상 배분':'관측값'}\nH 변화 ${signed(v)}\nHHI 변화 ${signed(o.hhi_change)}`)+txt(x+80,Y(v)+(v>=0?-14:28),signed(v),'text-anchor="middle" font-size="26" font-weight="700"')+txt(x+80,h-18,i?'극단적 가상 배분':'연도 확인 작품만','text-anchor="middle" font-size="19"')});svg('missingH',w,h,s);
}

// Navigation / keyboard / touch / accessible overview / reduced motion.
const elements=[...document.querySelectorAll('.slide')],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let current=0;
function fit(){document.getElementById('deck').style.transform=`scale(${Math.min(innerWidth/1600,innerHeight/900)})`;}
function go(n,update=true){n=Math.max(0,Math.min(elements.length-1,n));elements[current].classList.remove('active');elements[current].inert=true;elements[current].setAttribute('aria-hidden','true');current=n;const s=elements[n];s.classList.add('active');s.inert=false;s.setAttribute('aria-hidden','false');document.getElementById('counter').textContent=`${String(n+1).padStart(2,'0')} / ${elements.length}`;document.getElementById('progress').style.width=(n+1)/elements.length*100+'%';document.getElementById('prev').disabled=n===0;document.getElementById('next').disabled=n===elements.length-1;if(update)history.replaceState(null,'','#'+(n+1));document.title=`${n+1}. ${s.dataset.title} — 네이버웹툰 장르 다양성`;
 if(!reduced&&window.anime){const targets=s.querySelectorAll('.eyebrow,h1,h2,.chart,.metrics,.comparison,.closing-points,.art-grid');anime.remove(targets);anime({targets,opacity:[0,1],translateY:[17,0],delay:anime.stagger(55),duration:600,easing:'easeOutCubic'});s.querySelectorAll('.line-path').forEach(path=>{anime.remove(path);anime({targets:path,strokeDashoffset:[anime.setDashoffset,0],duration:950,delay:220,easing:'easeInOutSine'})});}
 document.getElementById('tooltip').hidden=true;
}
elements.forEach((s,i)=>{s.inert=true;const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0')+'  '+s.dataset.title;b.onclick=()=>{go(i);document.getElementById('toc').close()};document.getElementById('tocItems').append(b)});
document.getElementById('prev').onclick=()=>go(current-1);document.getElementById('next').onclick=()=>go(current+1);
document.getElementById('overview').onclick=()=>document.getElementById('toc').showModal();document.getElementById('closeToc').onclick=()=>document.getElementById('toc').close();
document.getElementById('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.closest('input,textarea,select'))return;if(e.key===' '&&e.target.closest('a,button'))return;if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)){e.preventDefault();go(current+1)}if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(current-1)}if(e.key==='Home')go(0);if(e.key==='End')go(elements.length-1);if(e.key.toLowerCase()==='f')document.getElementById('fullscreen').click();if(e.key.toLowerCase()==='o')document.getElementById('overview').click()});
let sx=0;addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true});addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>70)go(current+(dx<0?1:-1))},{passive:true});
const tooltip=document.getElementById('tooltip');addEventListener('pointermove',e=>{const target=e.target.closest('[data-tip]');if(!target){tooltip.hidden=true;return}tooltip.textContent=target.dataset.tip;tooltip.hidden=false;tooltip.style.left=Math.min(e.clientX+16,innerWidth-tooltip.offsetWidth-12)+'px';tooltip.style.top=Math.min(e.clientY+16,innerHeight-tooltip.offsetHeight-12)+'px'});
addEventListener('resize',fit);addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1))||1)-1,false));
addEventListener('beforeprint',()=>elements.forEach(s=>{s.inert=false;s.querySelectorAll('[style]').forEach(el=>{if(el.style.opacity==='0')el.style.opacity='1'})}));
addEventListener('afterprint',()=>elements.forEach((s,i)=>s.inert=i!==current));
window.go=go;fit();go((parseInt(location.hash.slice(1))||1)-1,false);
