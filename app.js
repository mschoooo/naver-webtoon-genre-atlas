/* All plotted values derive from data/stats.js, aggregated from the unchanged CSV. */
'use strict';
const D=window.STATS, colors=['#db755c','#37795c','#899f56','#365f70','#be9d51','#b87d99','#627f9a','#9d775a','#84aaa1','#a9a09c'];
const color=Object.fromEntries(D.genres.map((g,i)=>[g,colors[i]]));
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0), pct=(n,d)=>100*n/d, fmt=n=>n.toLocaleString('ko-KR');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(id,w,h,body)=>document.getElementById(id).innerHTML=`<svg role="img" aria-label="${document.getElementById(id).closest('section').dataset.title}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const text=(x,y,s,extra='')=>`<text x="${x}" y="${y}" ${extra}>${esc(s)}</text>`;
const rect=(x,y,w,h,fill,tip='',extra='')=>`<rect class="bar" x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" fill="${fill}" ${tip?`data-tip="${esc(tip)}"`:''} ${extra}/>`;
// Quality: exact counts, no imputation.
{
 const w=530,h=390,x=265,y=182,r=132,circ=2*Math.PI*r,known=D.known/D.n;
 svg('qualityChart',w,h,`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#d4dacb" stroke-width="35"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#147c58" stroke-width="35" stroke-dasharray="${circ*known} ${circ}" transform="rotate(-90 ${x} ${y})"/>`+text(x,y-3,(known*100).toFixed(1)+'%','text-anchor="middle" font-size="62" font-weight="800" fill="#147c58"')+text(x,y+35,'최초 게시연도 확인','text-anchor="middle" font-size="21" fill="#66756b"')+text(x,370,`${fmt(D.known)} / ${fmt(D.n)} 작품`,'text-anchor="middle" font-size="23"'));
}
// Annual counts. Last calendar year explicitly partial.
{
 const w=1424,h=425,l=60,t=30,b=65,ph=h-t-b,max=Math.ceil(Math.max(...D.years.map(y=>sum(D.annual[y])))/100)*100,bw=(w-l-15)/D.years.length;
 let s='';for(let v=0;v<=max;v+=100){let y=t+ph*(1-v/max);s+=`<line class="grid" x1="${l}" x2="${w}" y1="${y}" y2="${y}"/>`+text(l-12,y+5,v,'text-anchor="end" class="axis"');}
 D.years.forEach((y,i)=>{let n=sum(D.annual[y]),bh=ph*n/max,x=l+i*bw+6;s+=rect(x,t+ph-bh,bw-12,bh,y===2026?'#d98b55':'#147c58',`${y}${y===2026?' (부분 연도)':''}\n${fmt(n)}작품`)+text(x+(bw-12)/2,t+ph-bh-9,n,'text-anchor="middle" font-size="16" fill="#35543e"')+text(x+(bw-12)/2,h-28,y,'text-anchor="middle" class="axis" transform="rotate(-40 '+(x+(bw-12)/2)+' '+(h-28)+')"');});svg('annualChart',w,h,s);
}
// 100% composition by cohort. Order kept consistent with all other charts.
{
 const w=1424,h=390,l=175,r=35,t=25,ph=310,pw=w-l-r;
 let s='';[0,20,40,60,80,100].forEach(v=>s+=text(l+pw*v/100,t-8,v+'%','text-anchor="middle" class="axis"'));
 D.periods.forEach((p,i)=>{let o=D.period[p],n=sum(o),y=t+i*66,at=l;s+=text(l-20,y+24,p,'text-anchor="end" font-size="20" font-weight="700"')+text(l-20,y+45,'n = '+fmt(n),'text-anchor="end" font-size="14" fill="#66756b"');D.genres.forEach(g=>{let v=o[g]||0,share=pct(v,n),ww=pw*share/100;s+=rect(at,y,ww,45,color[g],`${p} · ${g}\n${v} / ${n}작품 (${share.toFixed(1)}%)`);if(share>=9)s+=text(at+ww/2,y+29,share.toFixed(1)+'%','text-anchor="middle" font-size="17" font-weight="700" fill="white" pointer-events="none"');at+=ww;});});svg('stackChart',w,h,s);
 document.getElementById('legend').innerHTML=D.genres.map(g=>`<span><i style="background:${color[g]}"></i>${esc(g)}</span>`).join('');
}
// Diverging percentage-point changes with exact numerator/denominator tooltips.
{
 const a=D.period[D.periods[1]],b=D.period[D.periods[3]],na=sum(a),nb=sum(b),items=D.genres.map(g=>({g,a:pct(a[g]||0,na),b:pct(b[g]||0,nb)})).map(o=>({...o,d:o.b-o.a})).sort((x,y)=>y.d-x.d);
 const w=1424,h=390,left=150,x0=620,scale=20,rh=35;let s='';[-20,-10,0,10,20,30].forEach(v=>{let x=x0+v*scale;s+=`<line class="grid" x1="${x}" x2="${x}" y1="18" y2="363"/>`+text(x,385,(v>0?'+':'')+v+'%p','text-anchor="middle" class="axis"');});
 items.forEach((o,i)=>{let y=20+i*rh,tip=`${o.g}\n2010–2014: ${o.a.toFixed(1)}%\n2020–2024: ${o.b.toFixed(1)}%\n변화: ${o.d>0?'+':''}${o.d.toFixed(1)}%p`;s+=text(left-10,y+19,o.g,'text-anchor="end" font-size="20"')+rect(x0+Math.min(0,o.d)*scale,y,Math.abs(o.d)*scale,24,o.d>=0?'#147c58':'#c58a64',tip)+text(x0+o.d*scale+(o.d>=0?12:-12),y+19,(o.d>0?'+':'')+o.d.toFixed(1),'text-anchor="'+(o.d>=0?'start':'end')+'" font-size="19" font-weight="700" fill="#35543e"')+text(1360,y+19,`${o.a.toFixed(1)} → ${o.b.toFixed(1)}%`,'text-anchor="end" font-size="18" fill="#66756b"');});svg('changeChart',w,h,s);
}
// Heatmap, consistent continuous scale, no raster statistics.
{
 let s='<div></div>'+D.genres.map(g=>`<div class="col">${esc(g)}</div>`).join('');D.periods.forEach(p=>{let n=sum(D.period[p]);s+=`<div class="rowlabel">${p}<small>n = ${fmt(n)}</small></div>`;D.genres.forEach(g=>{let v=D.period[p][g]||0,q=pct(v,n),k=Math.min(q/35,1),c=[229,238,220].map((a,i)=>Math.round(a+([20,124,88][i]-a)*k));s+=`<div class="cell" style="background:rgb(${c});color:${k>.5?'white':'#244632'}" data-tip="${esc(`${p} · ${g}\n${v} / ${n}작품 (${q.toFixed(1)}%)`)}">${q.toFixed(1)}</div>`;});});document.getElementById('heatmap').innerHTML=s;
}
// Date ascertainment rate by genre, all 4,225 records in denominators.
{
 const w=640,h=410,l=90,pw=400,rh=36;let s='';D.genres.forEach((g,i)=>{let o=D.coverage[g],q=pct(o.known,o.total),y=10+i*rh;s+=text(l-12,y+19,g,'text-anchor="end" font-size="19"')+rect(l,y,pw,23,'#d9e0d0')+rect(l,y,pw*q/100,23,'#147c58',`${g}\n확인 ${o.known} / 전체 ${o.total}작품\n결측 ${o.total-o.known}작품`)+text(l+pw+12,y+19,q.toFixed(1)+'%','font-size="19" fill="#36543d"');});s+=text(l,403,'0%','class="axis"')+text(l+pw,403,'100%','text-anchor="end" class="axis"');svg('coverageChart',w,h,s);
}
const slides=[...document.querySelectorAll('.slide')],reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let current=0;
function fit(){const scale=Math.min(innerWidth/1600,innerHeight/900);document.getElementById('deck').style.transform=`scale(${scale})`;}
function go(n,update=true){n=Math.max(0,Math.min(slides.length-1,n));slides[current].classList.remove('active');slides[current].setAttribute('aria-hidden','true');current=n;let s=slides[n];s.classList.add('active');s.setAttribute('aria-hidden','false');document.getElementById('counter').textContent=`${String(n+1).padStart(2,'0')} / ${slides.length}`;document.getElementById('progress').style.width=(n+1)/slides.length*100+'%';document.getElementById('prev').disabled=n===0;document.getElementById('next').disabled=n===slides.length-1;if(update)history.replaceState(null,'','#'+(n+1));document.title=`${n+1}. ${s.dataset.title} — 스크롤의 시대`;if(!reduce&&window.anime){anime.remove(s.querySelectorAll('h1,h2,.eyebrow,.chart,.metrics,.cards,.heatmap'));anime({targets:s.querySelectorAll('h1,h2,.eyebrow,.chart,.metrics,.cards,.heatmap'),opacity:[0,1],translateY:[18,0],duration:650,delay:anime.stagger(65),easing:'easeOutCubic'});}}
slides.forEach((s,i)=>{s.setAttribute('aria-hidden','true');const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0')+'  '+s.dataset.title;b.onclick=()=>{go(i);document.getElementById('toc').close()};document.getElementById('tocItems').append(b)});
document.getElementById('prev').onclick=()=>go(current-1);document.getElementById('next').onclick=()=>go(current+1);document.getElementById('overview').onclick=()=>document.getElementById('toc').showModal();document.getElementById('closeToc').onclick=()=>document.getElementById('toc').close();document.getElementById('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)){e.preventDefault();go(current+1)}if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(current-1)}if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);if(e.key.toLowerCase()==='f')document.getElementById('fullscreen').click();if(e.key.toLowerCase()==='o')document.getElementById('overview').click()});
let sx=0;addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true});addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60)go(current+(dx<0?1:-1))},{passive:true});
const tip=document.getElementById('tooltip');addEventListener('pointermove',e=>{const el=e.target.closest('[data-tip]');if(!el){tip.style.display='none';return}tip.textContent=el.dataset.tip;tip.style.display='block';tip.style.left=Math.min(e.clientX+15,innerWidth-tip.offsetWidth-12)+'px';tip.style.top=Math.min(e.clientY+15,innerHeight-tip.offsetHeight-12)+'px'});addEventListener('resize',fit);addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1))||1)-1,false));fit();go((parseInt(location.hash.slice(1))||1)-1,false);

const coverAsset=new Image();coverAsset.onload=()=>document.getElementById("imageCredit").hidden=false;coverAsset.src="assets/cover.png";
