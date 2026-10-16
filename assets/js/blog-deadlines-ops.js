/* Cybersecurity blog: radar mini-dashboard and true deadline timezone display */
(() => {
 'use strict';
 const panel=document.querySelector('#conference-deadlines');
 if(!panel)return;
 const rows=[...panel.querySelectorAll('.blog-ddl-row[data-blog-utc]')].map(row=>({
   row,due:Date.parse(row.dataset.blogUtc),
   source:row.dataset.blogSource||'community',
   original:row.dataset.blogOriginal||'',
   zone:row.dataset.blogZone||'AoE (UTC−12)',
   name:row.querySelector('.blog-ddl-name')?.textContent.trim()||'Conference',
   detail:row.querySelector('.blog-ddl-detail')?.textContent.trim()||'',
   display:row.querySelector('.blog-ddl-date')
 })).filter(r=>Number.isFinite(r.due)).sort((a,b)=>a.due-b.due);
 const name=panel.querySelector('#blog-ops-next-title');
 const count=panel.querySelector('#blog-ops-next-time');
 const meta=panel.querySelector('#blog-ops-next-meta');
 const progress=panel.querySelector('#blog-ops-progress-fill');
 const toggle=panel.querySelector('#blog-zone-toggle');
 const pad=n=>String(n).padStart(2,'0');
 const dateLocal=new Intl.DateTimeFormat(undefined,{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'short'});
 let local=false;
 function dueText(r){
   if(local)return dateLocal.format(new Date(r.due));
   if(r.source==='community'&&r.original)return r.original+' · '+r.zone;
   const stamp=new Date(r.due-12*3600000).toISOString();
   return stamp.slice(0,10)+' 23:59:59 AoE';
 }
 function clock(diff){
   if(diff<=0)return 'Closed';
   const seconds=Math.ceil(diff/1000);
   return Math.floor(seconds/86400)+'d '+pad(Math.floor(seconds%86400/3600))+'h '+pad(Math.floor(seconds%3600/60))+'m '+pad(seconds%60)+'s';
 }
 function tick(){
   if(document.hidden)return;
   const now=Date.now();
   rows.forEach(r=>{if(r.display)r.display.textContent=dueText(r);});
   const upcoming=rows.find(r=>r.due>now);
   if(!upcoming){if(name)name.textContent='Awaiting the next CFP';if(count)count.textContent='STANDBY';if(meta)meta.textContent='New dates are checked from published listings.';if(progress)progress.style.width='0%';return;}
   if(name)name.textContent=upcoming.name.replace(/CCF\s*[ABC]/g,'').trim();
   if(count)count.textContent=clock(upcoming.due-now);
   if(meta)meta.textContent=upcoming.detail+' · '+(upcoming.source==='community'?'Community listing — verify CFP':'Official-checked');
   // A 30-day visual proximity meter (does not represent verification confidence).
   if(progress)progress.style.width=Math.max(4,Math.min(100,100-(upcoming.due-now)/86400000/30*100)).toFixed(1)+'%';
 }
 if(toggle)toggle.addEventListener('click',()=>{local=!local;toggle.setAttribute('aria-pressed',String(local));toggle.textContent=local?'TIME ZONE · MY LOCAL':'TIME ZONE · ORIGINAL / AoE';tick();});
 tick();window.setInterval(tick,1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
})();
