/* Beginner-friendly research story. All numbers come from the validated CSV summaries. */
'use strict';
const R=window.RESEARCH,D=window.STATS,E=window.EPISODES;
const A=Object.fromEntries(R.annual.map(o=>[+o.year,o]));
const P=Object.fromEntries(R.periods.map(o=>[o.period,o]));
const OLD=P['2010–2014'],NEW=P['2020–2024'];
const n=(v,d=0)=>Number(v).toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d});
const pct=v=>n(+v*100,1)+'%';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stages=['연구 질문','데이터','발견','검증','결론'];
const count=(v,{dec=0,suffix='',start=0}={})=>`<span class="count-up" data-value="${v}" data-dec="${dec}" data-start="${start}" data-suffix="${esc(suffix)}">${n(v,dec)}${suffix}</span>`;
const step=(label,title,stage)=>`<header class="story-header"><span>${label}</span><ol>${stages.map((s,i)=>`<li class="${stage===i?'current':''}">${s}</li>`).join('')}</ol></header><h2>${title}</h2>`;
const foot=s=>`<p class="story-note">${s}</p>`;
const chart=id=>`<div id="${id}" class="story-chart"></div>`;
const art=()=>`<div class="art-grid cover-art">${['183559','703846','641253','651673','747269','20853'].map(id=>{const a=R.artworks.find(o=>o.id===id);return `<figure><a href="${a.work_url}" target="_blank" rel="noopener"><img src="${a.file}" alt="${esc(a.title)} 공식 썸네일"><figcaption><b>${esc(a.title)}</b><span>${esc(a.authors)}</span></figcaption></a></figure>`}).join('')}</div>`;
const rows=[
 ['신작이 늘면 장르도 다양해질까?',0,`<div class="cover-copy"><p class="eyebrow">NAVER WEBTOON / DIVERSITY STUDY</p><h1>신작이 늘면,<br>장르도 다양해질까?</h1><p class="cover-sub">작품 수만 늘었는지,<br>여러 장르가 고르게 늘었는지 살펴봅니다.</p><div class="cover-meta"><b>2005—2026</b><span>네이버웹툰 4,225작품의 관측 목록</span></div><p class="art-note">이미지는 예시 작품입니다. 분석은 전체 CSV를 사용했습니다.</p></div>${art()}<p class="cover-route">질문 하나에서 시작해, 데이터와 한계를 함께 읽습니다.</p>`,'cover'],
 ['날짜를 아는 3,975작품으로 비교합니다',1,`${step('분석의 출발점','날짜를 아는 <em>3,975작품</em>으로 비교합니다.',1)}<p class="explain">첫 회차가 언제 올라왔는지 알아야, 같은 시기의 작품끼리 비교할 수 있습니다.</p><div class="data-route"><div><strong>${count(4225)}</strong><span>현재 목록에서 수집한 작품</span></div><div class="route-arrow">→</div><div class="selected"><strong>${count(3975)}</strong><span>시작연도가 확인된 작품</span></div><div class="missing-card"><strong>${count(250)}</strong><span>시작연도를 모름<br>연도 비교에서 제외</span></div></div><div class="plain-callout"><b>주요 비교</b><span>2010–2014년</span><i>vs.</i><span>2020–2024년</span><small>같은 길이의 5년 구간</small></div>${foot('원본 CSV는 그대로 보존했습니다. 장르는 현재의 대표 장르 분류를 사용했습니다.')}`],
 ['같은 5년 동안 관측 신작은 약 5.6배 늘었습니다',2,`${step('발견 1 / 작품 수','같은 5년 동안 관측 신작은 <em>약 5.6배</em> 늘었습니다.',2)}<p class="explain">2010년대 초반보다 2020년대 초반에 시작한 작품이 훨씬 많이 관측됩니다.</p>${chart('growthBars')}<div class="result-strip">작품이 많아졌다는 것은 분명합니다. <b>그렇다면 장르도 더 고르게 늘었을까요?</b></div>${foot('‘신작’은 현재 목록에서 관측되고 첫 게시연도가 확인된 작품입니다. 과거의 전체 출시량을 뜻하지 않습니다.')}`],
 ['100작품 중 로맨스는 약 8편에서 34편으로 늘었습니다',2,`${step('발견 2 / 장르 비중','100작품 중 로맨스는 <em>약 8편에서 34편</em>으로 늘었습니다.',2)}<p class="explain">각 시기의 전체 작품을 100편으로 맞춰 보면, 비중의 변화가 더 잘 보입니다.</p><div class="waffle-compare"><div><span class="period-label">2010–2014년</span><div class="waffle-slot" id="romanceOld"></div><p><strong class="coral">${count(+OLD.romance_share*100,{dec:1,suffix:'%'})}</strong><span>로맨스 ${n(OLD.romance_count)} / 전체 ${n(OLD.n)}작품</span></p></div><div class="waffle-arrow">→</div><div><span class="period-label">2020–2024년</span><div class="waffle-slot" id="romanceNew"></div><p><strong class="coral">${count(+NEW.romance_share*100,{dec:1,suffix:'%'})}</strong><span>로맨스 ${n(NEW.romance_count)} / 전체 ${n(NEW.n)}작품</span></p></div></div><div class="simple-legend"><i class="romance-key"></i>로맨스 <i class="other-key"></i>나머지 장르 <small>한 칸 = 전체의 1% · 비율을 나타낸 그림입니다.</small></div>${foot('두 시기의 작품 수가 달라서 비율로 비교했습니다. 색칠된 칸은 실제 작품 한 편을 뜻하지 않습니다.')}`],
 ['비중이 줄었다고 작품 수가 줄어든 것은 아닙니다',2,`${step('발견 3 / 수와 비율의 차이','비중이 줄었다고 <em>작품 수가 줄어든 것은 아닙니다.</em>',2)}<p class="explain">개그와 일상도 작품은 늘었습니다. 다른 장르가 더 빠르게 늘어 전체에서 차지하는 몫이 작아졌습니다.</p><div class="genre-cards">${['개그','일상'].map(genre=>{const g=R.growth.find(o=>o.genre===genre);return `<article><h3>${genre}</h3><div class="genre-count-row"><div><span>2010–2014</span><b>${count(+g.count_2010_2014,{suffix:'편'})}</b></div><i>→</i><div><span>2020–2024</span><b>${count(+g.count_2020_2024,{suffix:'편',start:+g.count_2010_2014})}</b></div></div><div class="genre-share-row"><span>전체에서 차지하는 비중</span><strong>${pct(g.share_2010_2014)} → ${pct(g.share_2020_2024)}</strong></div></article>`}).join('')}</div><div class="result-strip"><b>10개 장르 모두</b> 절대 작품 수는 증가했습니다.</div>${foot('2010–2014년과 2020–2024년 비교. ‘비중 감소’를 ‘장르가 사라졌다’ 또는 ‘작품 수가 감소했다’로 읽으면 안 됩니다.')}`],
 ['장르 종류는 같아도 2022년에는 로맨스에 더 쏠렸습니다',2,`${step('발견 4 / 다양성을 읽는 방법','장르 종류는 같아도, <em>2022년에는 로맨스에 더 쏠렸습니다.</em>',2)}<p class="explain">두 해 모두 10개 장르가 있었습니다. 다양성을 보려면 종류의 수뿐 아니라 비중이 고른지도 봐야 합니다.</p><div class="mix-example"><div class="mix-label"><b>2015년</b><span>총 ${n(A[2015].n)}작품</span></div><div id="mix2015"></div><div class="mix-share">로맨스 <strong>${count(+A[2015].romance_share*100,{dec:1,suffix:'%'})}</strong></div><div class="mix-label"><b>2022년</b><span>총 ${n(A[2022].n)}작품</span></div><div id="mix2022"></div><div class="mix-share">로맨스 <strong>${count(+A[2022].romance_share*100,{dec:1,suffix:'%'})}</strong></div></div><div class="genre-key" id="mixLegend"></div><div class="result-strip"><b>한 장르의 몫이 커지면</b>, 여러 장르가 고르게 나뉜 구성과는 달라집니다.</div>${foot('직사각형의 전체 길이는 각 해의 작품 100%입니다. 연도별 관측 작품 수가 달라 실제 비율로 맞췄습니다.')}`],
 ['집중은 계속 심해지지 않았고 2022년 이후 일부 회복됐습니다',2,`${step('발견 5 / 시간에 따른 변화','집중은 계속 심해지지 않았고, <em>2022년 이후 일부 회복됐습니다.</em>',2)}<p class="explain">장르의 비중까지 고려해 ‘고르게 나뉜 장르 수’로 환산하면, 다양성은 해마다 오르내립니다.</p><div class="trend-layout"><div>${chart('balanceTrend')}<p class="axis-explainer">위로 갈수록 장르 비중이 고릅니다. 10개 장르가 똑같은 비중이면 10입니다.</p></div><aside><span>같은 방식으로 환산한 장르 수</span>${[2015,2022,2025].map(y=>`<div><b>${y}년</b><strong>${count(+A[y].effective_genres_shannon,{dec:2,suffix:'개'})}</strong></div>`).join('')}</aside></div>${foot('2008–2025년 표시. 이 환산값은 Shannon 엔트로피에서 계산한 exp(H)이며 실제 장르 이름의 개수는 아닙니다. 2025년은 2024년보다 다시 낮아졌습니다.')}`],
 ['적은 작품과 미완성 연도에 휘둘리지 않게 확인했습니다',3,`${step('검증 1 / 비교 조건','적은 작품과 미완성 연도에 <em>휘둘리지 않게 확인했습니다.</em>',3)}<p class="explain">몇 작품만 있는 해나 아직 끝나지 않은 해를, 다른 해와 그대로 비교하면 오해할 수 있습니다.</p><div class="check-cards"><article><span>초기 연도</span><h3>너무 적은 작품</h3><div class="tiny-years"><p>2005년 <b>${count(+A[2005].n,{suffix:'편'})}</b></p><p>2006년 <b>${count(+A[2006].n,{suffix:'편'})}</b></p><p>2007년 <b>${count(+A[2007].n,{suffix:'편'})}</b></p></div><p>그래프의 주 비교에서 분리했습니다.</p></article><article><span>2026년</span><h3>아직 끝나지 않은 해</h3><strong class="partial-number">${count(+A[2026].n,{suffix:'편'})}</strong><p>수집일까지의 수치입니다.<br>연간 증가·감소 판단에서 제외했습니다.</p></article><article class="check-selected"><span>다시 확인한 결과</span><h3>같은 수로 비교해도</h3><b class="check-word">흐름 유지</b><p>연도별 작품 수를 맞춘 비교에서도<br>2022년 하락과 이후 부분 회복이 남았습니다.</p></article></div>${foot('앞의 시간 그래프는 n≥30인 2008–2025년입니다. 동일 수 비교·보정 계산과 HHI 점검은 분석 보고서에 보존했습니다.')}`],
 ['연도를 모르는 250작품 때문에 전체의 변화는 확정할 수 없습니다',3,`${step('검증 2 / 모르는 데이터','연도를 모르는 250작품 때문에 <em>전체의 변화는 확정할 수 없습니다.</em>',3)}<p class="explain">이 작품들이 어느 시기에 시작했는지에 따라, 어느 시기가 더 고른지 달라질 수 있습니다.</p><div class="uncertainty-layout"><div class="unknown-pool"><strong>${count(250,{suffix:'작품'})}</strong><p>장르는 알지만<br>시작연도는 모릅니다.</p><span>실제 연도를 추정하지 않았습니다.</span></div><div class="scenario-list"><article><span>연도가 확인된 작품만 비교</span><b>최근 구간이 더 쏠린 것으로 관측</b></article><article class="alternative"><span>결측 연도를 극단적으로 가상 배분</span><b>반대 방향의 결론도 가능</b><p>과거 143건 / 최근 107건으로 놓는 예시에서<br>다양성 변화의 방향이 뒤집혔습니다.</p></article></div></div><div class="result-strip"><b>관측 자료의 결과</b>를 플랫폼 전체 역사에 그대로 적용할 수 없습니다.</div>${foot('가상 배분은 실제 데이터를 채운 것이 아닙니다. 결론이 가정에 민감한지 살피는 점검입니다. 삭제·목록 비노출 작품은 별도의 한계입니다.')}`],
 ['로맨스 비중 확대는 알려진 결측을 고려해도 유지됩니다',3,`${step('검증 3 / 더 확실하게 말할 수 있는 것','로맨스 비중 확대는 <em>알려진 결측을 고려해도 유지됩니다.</em>',3)}<p class="explain">과거의 로맨스 비중을 최대한 높이고 최근 비중을 최대한 낮춰도, 최근이 더 높습니다.</p>${chart('robustBars')}<div class="robust-conclusion">${count(+R.bounds.find(o=>o.period==='2010–2014').upper*100,{dec:1,suffix:'%'})}<span>보다</span>${count(+R.bounds.find(o=>o.period==='2020–2024').lower*100,{dec:1,suffix:'%'})}<span>가 여전히 높습니다.</span></div>${foot('알려진 연도 결측 250건만 고려한 경계입니다. 과거 상한 29.2%, 최근 하한 31.8%. 관측되지 않은 과거 작품까지 포함하는 보장은 아닙니다.')}`],
 ['신작은 늘었지만 장르가 꾸준히 다양해진 것은 아닙니다',4,`${step('연구 질문에 대한 답','신작은 늘었지만, <em>장르가 꾸준히 다양해진 것은 아닙니다.</em>',4)}<p class="explain">현재 목록에서 시작연도가 확인된 작품을 기준으로 내릴 수 있는 결론입니다.</p><div class="final-statement"><p><span>확인한 것</span><b>최근 비교 구간에서 로맨스의 몫이 커졌습니다.</b></p><p><span>함께 기억할 것</span><b>집중과 회복이 번갈아 나타났습니다.</b></p><p><span>아직 모르는 것</span><b>플랫폼 전체 역사가 더 획일화됐는지는 확정할 수 없습니다.</b></p></div><div class="final-boundary">현재의 장르 분류 · 불완전한 과거 목록 · 시작연도 결측을 반영한 해석</div><div class="final-resources"><a href="data/research/analysis_report.html" target="_blank" rel="noopener">상세 분석 보고서 ↗</a><a href="data/naver_webtoon_raw.csv" download>원본 CSV ↓</a><button class="credits-trigger">작품 이미지 출처</button></div>${foot('상세 보고서에 Shannon·HHI, 표본 크기 점검, 구성 분해와 전체 연도 표를 보존했습니다. 통계 수치는 검증된 기존 집계만 사용했습니다.')}`]
];
// Orient first-time readers without repeating the findings or adding statistical machinery.
rows.splice(1,0,['이 발표는 작품 수와 장르의 몫을 살펴봅니다',0,
 `${step('처음 보는 분을 위한 안내','작품이 늘어난 만큼, <em>장르도 고르게 늘었는지 보는 발표입니다.</em>',0)}<p class="explain">대상은 네이버웹툰 목록에서 수집한 연재 중·완결·휴재 작품입니다. 로맨스·판타지·개그 같은 분류를 ‘장르’라고 부릅니다.</p><div class="orientation-cards"><article><span>먼저</span><h3>작품 수를 셉니다</h3><p>각 시기에 새로 시작한 작품이<br>얼마나 많아졌는지 봅니다.</p></article><article><span>그다음</span><h3>장르의 몫을 봅니다</h3><p>전체를 100작품으로 맞추면<br>각 장르가 몇 편쯤 되는지 봅니다.</p></article><article><span>마지막으로</span><h3>고르게 나뉘었는지 봅니다</h3><p>한 장르에 몰렸는지,<br>여러 장르에 나뉘었는지 살핍니다.</p></article></div><div class="orientation-unit"><b>작품 1편 = 비교의 1단위</b><span>작품마다 같은 비중으로 계산합니다.</span></div>${foot('그래프의 작품 수는 현재 목록에서 관측한 값입니다. 조회수나 독서 시간으로 가중하지 않았습니다. 비교 결과와 남는 한계를 함께 설명합니다.')}`]);
const hook=rows[1];
hook[0]='두 해 모두 장르는 10개인데 똑같이 다양할까요?';
hook[2]=`${step('두 장면으로 시작하기','두 해 모두 장르는 10개인데, <em>똑같이 다양할까요?</em>',0)}<p class="explain">현재 목록에서 시작연도가 확인된 작품입니다. 로맨스의 몫만 먼저 눈여겨보세요.</p><div class="hook-cards">${[2015,2022].map(y=>`<article><span>${y}년 시작 · 관측 ${n(A[y].n)}작품</span><h3>장르 종류는 <b>10개</b></h3><div id="hook${y}"></div><p>로맨스의 몫 <strong>${count(+A[y].romance_share*100,{dec:1,suffix:'%'})}</strong></p></article>`).join('')}</div><div class="hook-question">장르의 이름이 많다는 것과 <b>여러 장르가 고르게 나뉜다는 것</b>은 같을까요?</div>${foot('막대 전체가 각 해에 시작한 관측 작품 100%입니다. 주황은 로맨스, 초록 계열은 나머지 장르입니다. 실제 네이버웹툰 전체 신작의 완전한 목록은 아닙니다.')}`;
const trend=rows.find(row=>row[0]==='집중은 계속 심해지지 않았고 2022년 이후 일부 회복됐습니다');
trend[2]=`${step('발견 5 / 시간에 따른 변화','집중은 계속 심해지지 않았고, <em>2022년 이후 일부 회복됐습니다.</em>',2)}<div class="metric-primer"><p><b>유효 장르 수</b>는 이 구성의 다양성이 <b>“같은 비중으로 나뉜 장르 몇 개”</b>와 같은지 환산한 값입니다.</p><span>예: 관측된 2022년은 장르 이름이 10개여도, 고른 장르 <strong>5.68개</strong>와 같은 다양성입니다.</span></div><div class="trend-layout"><div>${chart('balanceTrend')}<p class="axis-explainer">높을수록 여러 장르의 비중이 고릅니다. 10개 장르가 같은 비중이면 10입니다.</p></div><aside><span>유효 장르 수 · 실제 장르 이름 수와 다름</span>${[2015,2022,2025].map(y=>`<div><b>${y}년</b><strong>${count(+A[y].effective_genres_shannon,{dec:2,suffix:'개'})}</strong></div>`).join('')}</aside></div>${foot('현재 목록에서 연도를 확인한 작품 중 n≥30인 2008–2025년 기준. 계산은 exp(H), 자세한 방법은 보고서에 있습니다. 2025년은 2024년보다 다시 낮아졌습니다.')}`;
// Keep the deck compact: comparison safeguards are incorporated into the data slide.
const safeguards=rows.findIndex(row=>row[0]==='적은 작품과 미완성 연도에 휘둘리지 않게 확인했습니다');
if(safeguards>=0)rows.splice(safeguards,1);
const dataRow=rows.find(row=>row[0]==='날짜를 아는 3,975작품으로 비교합니다');
dataRow[2]=dataRow[2].replace(foot('원본 CSV는 그대로 보존했습니다. 장르는 현재의 대표 장르 분류를 사용했습니다.'),
 `<div class="data-safeguards"><span>시간 그래프: 2008–2025년 · 연도별 30작품 이상</span><span>2026년은 부분 연도이므로 연간 비교에서 제외</span></div>${foot('원본 CSV와 현재의 대표 장르 분류를 사용했습니다. 같은 작품 수로 맞춘 점검에서도 2022년 하락·이후 부분 회복이 유지됐습니다. 계산은 보고서에 보존했습니다.')}`);
const extraIndex=rows.length;
rows.splice(extraIndex,0,['부록 · 회차를 아는 작품의 약 75%는 100회 이하입니다',4,
 `${step('장르 밖의 작은 발견 / 회차 수','회차를 아는 작품의 <em>약 75%는 100회 이하</em>입니다.',2)}<p class="explain">회차를 확인한 ${n(E.known_n)}작품의 수집 시점 값입니다. 작품마다 누적 회차 수에는 큰 차이가 있습니다.</p>${chart('episodeShare')}<div class="episode-context"><div><span>회차 수의 가운데 값(중앙값)</span><strong>${count(E.median,{suffix:'회'})}</strong></div><div><span>회차 수의 최댓값</span><strong>${count(E.max,{suffix:'회'})}</strong></div><p>이 발표에서는 회차가 달라도<br><b>각각 1작품으로 셉니다.</b></p></div>${foot('이 장은 회차 확인 3,976건 기준(결측 249건 제외)이며 연도 확인 표본과 다릅니다. 연재 중·휴재 포함, 최종 길이가 아닙니다. 유료·미리보기·공지 등이 포함될 수 있습니다.')}`]);
const appendix=rows[rows.length-1];
appendix[3]='appendix';
appendix[2]=appendix[2].replace(step('장르 밖의 작은 발견 / 회차 수','회차를 아는 작품의 <em>약 75%는 100회 이하</em>입니다.',2),step('부록 / 회차 수 · 본문과 별도의 참고','회차를 아는 작품의 <em>약 75%는 100회 이하</em>입니다.',4));
appendix[2]=appendix[2].replace('회차를 확인한 '+n(E.known_n)+'작품의 수집 시점 값입니다. 작품마다 누적 회차 수에는 큰 차이가 있습니다.','장르 분석을 마친 뒤 보는 별도 참고입니다. 현재 목록에서 회차를 확인한 '+n(E.known_n)+'작품의 수집 시점 값입니다.');
rows.filter(row=>row[1]===3).forEach(row=>row[2]=row[2].replace('검증 2 / 모르는 데이터','검증 1 / 모르는 데이터').replace('검증 3 / 더 확실하게 말할 수 있는 것','검증 2 / 더 확실하게 말할 수 있는 것'));
const conclusion=rows.find(row=>row[1]===4);
conclusion[2]=conclusion[2].replace('<button class="credits-trigger">작품 이미지 출처</button>',
 '<button id="appendixJump">부록: 회차 수 →</button><button class="credits-trigger">작품 이미지 출처</button>');
// Maintain the distinction between this observed catalog and all historical launches.
rows[0][2]=rows[0][2].replace('작품 수만 늘었는지,<br>여러 장르가 고르게 늘었는지 살펴봅니다.','현재 목록에서 확인한 작품으로,<br>장르의 비중 변화를 살펴봅니다.');
rows.forEach(row=>{
 row[0]=row[0].replace(/^신작은 늘었지만/,'관측 신작은 늘었지만');
 row[2]=row[2].replace('신작은 늘었지만, <em>','관측 신작은 늘었지만, <em>').replace('작품이 많아졌다는 것은 분명합니다.','현재 목록에서 확인한 신작이 더 많습니다.').replace('두 해 모두 10개 장르가 있었습니다.','관측 작품에서는 두 해 모두 10개 장르가 확인됐습니다.');
});
document.getElementById('deck').innerHTML=rows.map(([title,stage,body,cls=''],i)=>`<section class="slide story ${cls} ${i===0?'active':''}" data-title="${esc(title)}" data-stage="${stage}" aria-hidden="${i!==0}">${body}<footer class="slide-footer"><span>현재 목록에서 확인한 작품 기준${cls==='appendix'?' · 부록':''}</span><span>${String(i+1).padStart(2,'0')} / ${rows.length}</span></footer></section>`).join('');
document.getElementById('creditsContent').innerHTML=`<p>표지에 사용한 네이버웹툰 공식 썸네일입니다. 원작 이미지의 권리는 각 권리자에게 있습니다.</p>${R.artworks.map(o=>`<a href="${o.work_url}" target="_blank" rel="noopener"><b>${esc(o.title)}</b><span>${esc(o.authors)}</span></a>`).join('')}<p><a href="assets/artwork_sources.json">원본 이미지 URL과 파일 기록 ↗</a></p>`;

// Statistical graphics: geometric encodings of the existing numerical data.
const txt=(x,y,t,a='')=>`<text x="${x}" y="${y}" ${a}>${esc(t)}</text>`;
const rect=(x,y,w,h,c,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${a}/>`;
const grid=(x,y,x2,y2)=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#d5ddcb"/>`;
const svg=(id,w,h,s)=>document.getElementById(id).innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(document.getElementById(id).closest('.slide').dataset.title)}">${s}</svg>`;
{
 const w=1424,h=215,left=45,right=45,top=40,pw=w-left-right,ww=pw*E.le100_share;
 let s=rect(left,top,ww,84,'#2e7e55',`class="grow-bar" data-seq="0" data-tip="100회 이하 ${n(E.le100_n)} / ${n(E.known_n)}작품 (${pct(E.le100_share)})"`)+rect(left+ww,top,pw-ww,84,'#c4cfb6',`class="grow-bar" data-seq="1" data-tip="100회 초과 ${n(E.gt100_n)} / ${n(E.known_n)}작품 (${pct(E.gt100_share)})"`);
 s+=txt(left+ww/2,top+53,pct(E.le100_share),'text-anchor="middle" font-size="36" font-weight="800" class="episode-white"')+txt(left+ww+(pw-ww)/2,top+53,pct(E.gt100_share),'text-anchor="middle" font-size="30" font-weight="700"');
 s+=txt(left,top+128,'100회 이하 · '+n(E.le100_n)+'작품','font-size="25" font-weight="600"')+txt(w-right,top+128,'100회 초과 · '+n(E.gt100_n)+'작품','text-anchor="end" font-size="25"');svg('episodeShare',w,h,s);
}
{
 const w=1424,h=350,l=280,r=120,t=48,bw=w-l-r,max=2100;let s='';
 [[OLD,'2010–2014',0],[NEW,'2020–2024',1]].forEach(([o,label,i])=>{let y=t+i*145,ww=+o.n/max*bw;s+=txt(l-35,y+38,label,'text-anchor="end" font-size="29" font-weight="600"')+rect(l,y,ww,66,i?'#297c55':'#a6baa0',`class="grow-bar" data-seq="${i}" data-tip="${label} · ${o.n}작품"`)+txt(l+ww+20,y+44,n(o.n)+'편',`class="chart-number" data-value="${o.n}" data-dec="0" data-suffix="편" data-seq="${i}" font-size="42" font-weight="800"`)});svg('growthBars',w,h,s);
}
function waffle(id,share){
 const w=450,h=230,cols=20,gap=5,sz=17;let s='';
 for(let i=0;i<100;i++){const x=20+(i%cols)*(sz+gap),y=15+Math.floor(i/cols)*(sz+gap),v=Math.min(1,Math.max(0,share*100-i));s+=rect(x,y,sz,sz,'#d8e0cf','rx="2"');if(v>0)s+=rect(x,y,sz*v,sz,'#db7b59','class="waffle-fill" rx="2"')}
 s+=txt(235,175,'100작품으로 맞춘 비율','text-anchor="middle" font-size="20" fill="#64775c"');svg(id,w,h,s);
}
waffle('romanceOld',+OLD.romance_share);waffle('romanceNew',+NEW.romance_share);
const mixColors=['#db7b59','#5d7e62','#6b8a6a','#779773','#83a27c','#8eae84','#9bb78e','#a8c199','#b5cba6','#c2d5b2'];
const mixPalette=Object.fromEntries(D.genres.map((g,i)=>[g,mixColors[i]]));
function mixture(id,year){let s='',at=0;const w=1050,h=90,total=+A[year].n;D.genres.forEach(g=>{let v=D.annual[year][g]||0,ww=w*v/total;s+=rect(at,12,ww,66,mixPalette[g],`class="mix-part" data-tip="${year} · ${esc(g)} ${pct(v/total)} (${v}/${total}작품)"`);at+=ww});svg(id,w,h,s)}
mixture('mix2015',2015);mixture('mix2022',2022);
mixture('hook2015',2015);mixture('hook2022',2022);
document.getElementById('mixLegend').innerHTML=D.genres.map(g=>`<span><i style="background:${mixPalette[g]}"></i>${g}</span>`).join('');
{
 const data=R.annual.filter(o=>+o.year>=2008&&+o.year<=2025),w=1035,h=255,l=65,r=55,t=32,b=50,min=5,max=8,
 X=y=>l+(y-2008)/17*(w-l-r),Y=v=>t+(max-v)/(max-min)*(h-t-b);let s='';
 [5,6,7,8].forEach(v=>s+=grid(l,Y(v),w-r,Y(v))+txt(l-18,Y(v)+7,v,'text-anchor="end" font-size="21" fill="#708167"'));
 [2008,2011,2014,2017,2020,2023,2025].forEach(y=>s+=txt(X(y),h-12,y,'text-anchor="middle" font-size="19" fill="#708167"'));
 s+=`<path class="trend-path" d="${data.map((o,i)=>(i?'L':'M')+X(+o.year)+','+Y(+o.effective_genres_shannon)).join(' ')}" stroke="#879b78" stroke-width="3" fill="none"/>`;
 data.forEach(o=>{let emph=[2015,2022,2025].includes(+o.year),x=X(+o.year),y=Y(+o.effective_genres_shannon);s+=`<circle cx="${x}" cy="${y}" r="${emph?7:3.5}" fill="${+o.year===2022?'#d77d55':emph?'#287a54':'#879b78'}" data-tip="${o.year}년 · ${n(o.effective_genres_shannon,2)}개로 환산\nn = ${o.n}"/>`;if(emph)s+=txt(x,y-17,n(o.effective_genres_shannon,2),`class="chart-number" data-value="${o.effective_genres_shannon}" data-dec="2" font-size="25" font-weight="800" text-anchor="middle"`)});svg('balanceTrend',w,h,s);
}
{
 const old=+R.bounds.find(o=>o.period==='2010–2014').upper*100,recent=+R.bounds.find(o=>o.period==='2020–2024').lower*100,w=1424,h=260,l=430,r=155,pw=w-l-r,max=40;let s='';
 [[old,'과거 비중을 최대한 높여도',0],[recent,'최근 비중을 최대한 낮춰도',1]].forEach(([v,label,i])=>{let y=26+i*115,ww=pw*v/max;s+=txt(l-30,y+35,label,'text-anchor="end" font-size="25"')+rect(l,y,ww,54,i?'#db7b59':'#a4b99c',`class="grow-bar" data-seq="${i}" data-tip="${label} ${n(v,1)}%"`)+txt(l+ww+20,y+38,n(v,1)+'%',`class="chart-number" data-value="${v}" data-dec="1" data-suffix="%" data-seq="${i}" font-size="35" font-weight="800"`)});svg('robustBars',w,h,s);
}

// Enter-slide reveals: titles, comparative bars, count-ups and line drawing tell the story.
const slides=[...document.querySelectorAll('.slide')],reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let current=0,animations=[];
const labels=new Map();
document.querySelectorAll('.count-up,.chart-number').forEach(el=>labels.set(el,el.textContent));
function animateSlide(s){
 animations.forEach(a=>a.pause());animations=[];
 const targets=s.querySelectorAll('.story-header,h1,h2,.explain,.data-route,.plain-callout,.genre-cards article,.scenario-list article,.final-statement p,.result-strip,.check-cards article,.waffle-compare>div,.mix-example,.trend-layout aside,.robust-conclusion,.art-grid,.orientation-cards article,.orientation-unit,.episode-context,.data-safeguards,.hook-cards article,.hook-question,.metric-primer');
 anime.remove(targets);anime.set(targets,{opacity:1,translateY:0});
 s.querySelectorAll('.count-up,.chart-number').forEach(el=>el.textContent=labels.get(el));
 s.querySelectorAll('.grow-bar').forEach(el=>el.setAttribute('width',el.dataset.width||el.getAttribute('width')));
 if(reduce||!window.anime)return;
 animations.push(anime({targets,opacity:[0,1],translateY:[18,0],delay:anime.stagger(75),duration:600,easing:'easeOutCubic'}));
 s.querySelectorAll('.count-up,.chart-number').forEach((el,i)=>{
  const v={x:+el.dataset.start||0},end=+el.dataset.value,delay=350+(+el.dataset.seq||0)*500+Math.min(i*45,220);
  animations.push(anime({targets:v,x:end,round:0,duration:1200,delay,easing:'easeOutCubic',update:()=>el.textContent=n(v.x,+el.dataset.dec||0)+(el.dataset.suffix||''),complete:()=>el.textContent=labels.get(el)}));
 });
 s.querySelectorAll('.grow-bar').forEach(el=>{if(!el.dataset.width)el.dataset.width=el.getAttribute('width');animations.push(anime({targets:el,width:[0,+el.dataset.width],duration:1150,delay:250+(+el.dataset.seq||0)*550,easing:'easeOutCubic'}));});
 const cells=s.querySelectorAll('.waffle-fill');if(cells.length)animations.push(anime({targets:cells,opacity:[0,1],delay:anime.stagger(23,{start:400}),duration:250,easing:'linear'}));
 const parts=s.querySelectorAll('.mix-part');if(parts.length)animations.push(anime({targets:parts,opacity:[0,1],delay:anime.stagger(70,{start:300}),duration:450,easing:'linear'}));
 s.querySelectorAll('.trend-path').forEach(path=>{anime.remove(path);animations.push(anime({targets:path,strokeDashoffset:[anime.setDashoffset,0],duration:1600,delay:250,easing:'easeInOutSine'}));});
}
function fit(){document.getElementById('deck').style.transform=`scale(${Math.min(innerWidth/1600,innerHeight/900)})`}
function go(index,update=true){index=Math.max(0,Math.min(slides.length-1,index));slides[current].classList.remove('active');slides[current].inert=true;slides[current].setAttribute('aria-hidden','true');current=index;const s=slides[index];s.classList.add('active');s.inert=false;s.setAttribute('aria-hidden','false');document.getElementById('counter').textContent=`${String(index+1).padStart(2,'0')} / ${slides.length}`;document.getElementById('progress').style.width=(index+1)/slides.length*100+'%';document.getElementById('prev').disabled=index===0;document.getElementById('next').disabled=index===slides.length-1;document.getElementById('tooltip').hidden=true;document.title=`${index+1}. ${s.dataset.title} — 네이버웹툰 장르 연구`;if(update)history.replaceState(null,'','#'+(index+1));animateSlide(s);}
slides.forEach((s,i)=>{s.inert=true;const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0')+'  '+s.dataset.title;b.onclick=()=>{go(i);document.getElementById('toc').close()};document.getElementById('tocItems').append(b)});
document.getElementById('prev').onclick=()=>go(current-1);document.getElementById('next').onclick=()=>go(current+1);
document.getElementById('overview').onclick=()=>document.getElementById('toc').showModal();document.getElementById('closeToc').onclick=()=>document.getElementById('toc').close();
document.getElementById('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.getElementById('replay').onclick=()=>animateSlide(slides[current]);
document.getElementById('appendixJump').onclick=()=>go(rows.length-1);
document.querySelectorAll('.credits-trigger').forEach(el=>el.onclick=()=>document.getElementById('credits').showModal());document.getElementById('closeCredits').onclick=()=>document.getElementById('credits').close();
addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.closest('input,textarea,select'))return;if(e.key===' '&&e.target.closest('a,button'))return;if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)){e.preventDefault();go(current+1)}if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(current-1)}if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);if(e.key.toLowerCase()==='f')document.getElementById('fullscreen').click();if(e.key.toLowerCase()==='o')document.getElementById('overview').click();if(e.key.toLowerCase()==='r')animateSlide(slides[current]);});
let sx=0;addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true});addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>70)go(current+(dx<0?1:-1))},{passive:true});
const tooltip=document.getElementById('tooltip');addEventListener('pointermove',e=>{let el=e.target.closest('[data-tip]');if(!el){tooltip.hidden=true;return}tooltip.textContent=el.dataset.tip;tooltip.hidden=false;tooltip.style.left=Math.min(e.clientX+16,innerWidth-tooltip.offsetWidth-12)+'px';tooltip.style.top=Math.min(e.clientY+16,innerHeight-tooltip.offsetHeight-12)+'px'});
addEventListener('beforeprint',()=>{animations.forEach(a=>a.pause());document.querySelectorAll('.count-up,.chart-number').forEach(el=>el.textContent=labels.get(el));document.querySelectorAll('.grow-bar').forEach(el=>{if(el.dataset.width)el.setAttribute('width',el.dataset.width)});document.querySelectorAll('.trend-path').forEach(el=>el.style.strokeDashoffset=0);slides.forEach(s=>s.inert=false)});
addEventListener('afterprint',()=>slides.forEach((s,i)=>s.inert=i!==current));
addEventListener('resize',fit);addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1))||1)-1,false));window.go=go;fit();go((parseInt(location.hash.slice(1))||1)-1,false);
