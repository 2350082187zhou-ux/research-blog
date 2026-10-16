/* Approximate world-map visualization for aggregated opt-in visitors.
   Requires Cloudflare Worker URL in visitor-map-config.js. */
(()=>{'use strict';
 const langs={
 en:{heading:'Visitors Around the World <span>↗</span>',eyebrow:'GLOBAL RESEARCH VISITOR RADAR',description:'An approximate geographic distribution of visitors to my research website. Individual IP addresses are never published.',badge:'● PRIVACY-FIRST TELEMETRY',visits:'Visits · 90 days',countries:'Countries / regions',locations:'Approximate locations',pending:'Visitor analytics are not connected yet. No visitor locations have been recorded by this feature.',loading:'Checking visitor map service…',error:'Visitor map service is unavailable.',empty:'Visitor map enabled. No consenting visits recorded yet.',active:'Live aggregate data · last 90 days',share:'Share my approximate region',stop:'Stop counting my future visits',privacy:'Opt-in only. No full IP addresses or GPS coordinates are saved or shown. Anonymous approximate locations are kept for up to 90 days.'},
 zh:{heading:'全球访客<span>散点地图 ↗</span>',eyebrow:'全球学术访问雷达',description:'展示本学术网站访客的近似地理分布。只展示真实的聚合统计，不会公开任何访客的完整 IP 地址。',badge:'● 隐私优先统计',visits:'访问量 · 近 90 天',countries:'国家 / 地区',locations:'来源地位置',pending:'访客统计服务尚未连接。该功能目前尚未采集真实访问位置。',loading:'正在连接全球访客统计…',error:'暂时无法连接访客统计服务。',empty:'统计已启用，但还没有获得授权的访客记录。',active:'真实聚合记录 · 近 90 天',share:'同意分享我的近似地区',stop:'停止记录我之后的访问',privacy:'仅在访客明确同意后收集；不保存或展示完整 IP、精确 GPS 或身份信息。匿名近似地理数据保留最多 90 天。'},
 fr:{heading:'Visiteurs dans le monde <span>↗</span>',eyebrow:'RADAR MONDIAL DES VISITEURS',description:'Carte des régions approximatives des visiteurs du site. Les adresses IP individuelles ne sont jamais publiées.',badge:'● STATISTIQUES RESPECTUEUSES DE LA VIE PRIVÉE',visits:'Visites · 90 jours',countries:'Pays / régions',locations:'Localisations approximatives',pending:'Le service de statistiques n’est pas connecté. Aucun emplacement n’a encore été enregistré.',loading:'Connexion aux statistiques…',error:'Le service de statistiques est indisponible.',empty:'Le service est activé, mais aucune visite consentie n’est enregistrée.',active:'Données réelles agrégées · 90 jours',share:'Partager ma région approximative',stop:'Ne plus comptabiliser mes visites',privacy:'Participation facultative. Aucune IP complète ni position GPS précise n’est enregistrée ou publiée. Conservation maximale de 90 jours.'},
 de:{heading:'Besucher weltweit <span>↗</span>',eyebrow:'WELTWEITER BESUCHERRADAR',description:'Ungefähre geografische Verteilung der Besucher meiner Forschungswebsite. Einzelne IP-Adressen werden nicht veröffentlicht.',badge:'● DATENSCHONENDE ANALYSE',visits:'Besuche · 90 Tage',countries:'Länder / Regionen',locations:'Ungefähre Standorte',pending:'Der Besucherdienst ist noch nicht verbunden. Es wurden keine Standorte erfasst.',loading:'Verbindung zum Besucherdienst…',error:'Der Besucherdienst ist nicht verfügbar.',empty:'Dienst aktiv, noch keine Besuche mit Einwilligung erfasst.',active:'Echte aggregierte Daten · 90 Tage',share:'Meine ungefähre Region teilen',stop:'Zukünftige Besuche nicht erfassen',privacy:'Nur mit Einwilligung. Keine vollständigen IP-Adressen oder präzisen GPS-Koordinaten werden gespeichert oder veröffentlicht. Aufbewahrung höchstens 90 Tage.'}
 };
 const continents=[
 'M64 105L83 101 98 83 136 74 154 79 170 97 188 88 208 96 225 92 251 114 274 122 283 143 276 160 258 171 243 196 218 202 208 218 191 207 183 186 166 195 146 175 127 168 115 145 98 143 82 129 67 120Z',
 'M235 197L252 201 271 211 278 226 261 236 244 221Z',
 'M266 232L294 222 322 235 338 253 342 277 334 302 321 330 313 351 300 384 283 430 270 418 270 392 262 366 252 346 248 316 245 285 253 260Z',
 'M300 80L323 59 352 52 373 62 359 88 346 106 335 122 312 113Z',
 'M457 109L479 101 500 95 522 102 548 93 572 84 600 90 634 79 668 86 698 94 727 103 752 100 785 110 814 126 842 127 858 137 885 142 908 157 908 175 890 184 873 191 857 210 833 214 813 206 801 192 779 199 767 191 755 208 728 211 713 202 695 218 682 206 666 217 641 220 616 213 603 218 579 212 557 222 540 204 524 196 509 177 484 170 468 153Z',
 'M467 202L498 195 527 198 552 210 572 234 578 255 571 280 550 312 541 341 528 365 516 387 503 378 489 354 476 328 457 306 445 279 454 246Z',
 'M566 220L595 220 623 245 619 266 602 267 579 247Z',
 'M665 215L684 225 699 246 704 272 693 290 674 265Z',
 'M830 342L847 331 873 328 891 334 915 349 927 369 921 386 906 401 880 405 853 399 830 403 818 384 819 358Z',
 'M568 349L578 369 567 398 558 388Z','M941 398L949 410 947 431 940 442 935 429Z',
 'M895 162L901 177 894 204 886 214Z'
 ];
 const shapes='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 470" aria-label="World visitor location map" role="img">'+
 '<rect width="1000" height="470" fill="#041827"/>'+
 Array.from({length:13},(_,i)=>'<path class="geo-grid" d="M'+(i*83.333).toFixed(1)+' 0V470"/>').join('')+
 Array.from({length:9},(_,i)=>'<path class="geo-grid" d="M0 '+(i*58.75).toFixed(1)+'H1000"/>').join('')+
 continents.map(d=>'<path class="geo-land" d="'+d+'"/>').join('')+
 '<g data-geo-dots></g><text x="26" y="446" font-family="monospace" font-size="12" fill="#398ca5">APPROXIMATE GEOIP · NO PERSONAL IP ADDRESS DISPLAY</text></svg>';
 const endpoint=typeof window.ZEDONG_VISITOR_API==='string'?window.ZEDONG_VISITOR_API.trim().replace(/\/+$/,''):'';
 const enabled=/^https:\/\/[a-z0-9.-]+(:[0-9]+)?$/i.test(endpoint);
 const views=Array.from(document.querySelectorAll('[data-visitor-geo]'));
 if(!views.length)return;
 let state='pending',data=null;
 const loc=()=>{const l=document.documentElement.lang.slice(0,2);return langs[l]?l:'en';};
 const dict=()=>langs[loc()];
 const consented=()=>{try{return localStorage.getItem('zz_geo_consent')==='yes'}catch(_){return false}};
 function status(key){state=key;for(const v of views){const n=v.querySelector('[data-geo-status]');if(n)n.textContent=dict()[key]||dict().pending;}}
 function plot(view,stats){
   const host=view.querySelector('[data-geo-map]');if(!host)return;
   host.innerHTML=shapes;
   if(!stats||!Array.isArray(stats.points))return;
   const parent=host.querySelector('[data-geo-dots]'),ns='http://www.w3.org/2000/svg';
   stats.points.slice(0,500).forEach(p=>{
     const lat=Number(p.lat),lon=Number(p.lon),count=Number(p.count);
     if(!Number.isFinite(lat)||!Number.isFinite(lon)||!Number.isFinite(count)||Math.abs(lat)>90||Math.abs(lon)>180||count<=0)return;
     const circle=document.createElementNS(ns,'circle');
     circle.setAttribute('class','geo-dot');circle.setAttribute('cx',String((lon+180)/360*1000));circle.setAttribute('cy',String((90-lat)/180*470));
     circle.setAttribute('r',String(Math.min(15,4+Math.log2(count+1)*2)));circle.setAttribute('tabindex','0');
     const label=String(p.country||'--').slice(0,2)+' · '+Math.round(count)+' visits';
     circle.setAttribute('aria-label',label);
     const title=document.createElementNS(ns,'title');title.textContent=label;circle.appendChild(title);parent.appendChild(circle);
   });
 }
 function paint(){
  const t=dict();
  for(const v of views){
   v.querySelectorAll('[data-geo-t]').forEach(el=>{const key=el.dataset.geoT;if(t[key]){if(key==='heading')el.innerHTML=t[key];else el.textContent=t[key];}});
   const n=v.querySelector('[data-geo-status]');if(n)n.textContent=t[state]||t.pending;
   const b=v.querySelector('[data-geo-optin]');if(b){b.hidden=!enabled;b.textContent=consented()?t.stop:t.share;}
   if(data){
     const pointCount=Array.isArray(data.points)?data.points.length:0;
     for(const [name,val] of Object.entries({total:data.total||0,countries:data.countries||0,points:pointCount})){
       const el=v.querySelector('[data-geo-stat="'+name+'"]');if(el)el.textContent=new Intl.NumberFormat(loc()).format(val);
     }
   }
  }
 }
 async function refresh(){
   if(!enabled)return;
   status('loading');
   try{
     const response=await fetch(endpoint+'/stats',{mode:'cors',credentials:'omit',cache:'no-store'});
     if(!response.ok)throw Error('HTTP '+response.status);
     const got=await response.json();
     if(!Array.isArray(got.points))throw Error('Invalid map data');
     data=got;for(const v of views)plot(v,got);
     status(Number(got.total)>0?'active':'empty');
   }catch(_){status('error');}
   paint();
 }
 async function collect(){
   if(!enabled||!consented())return;
   try{
     const r=await fetch(endpoint+'/collect',{method:'POST',mode:'cors',credentials:'omit',headers:{'Content-Type':'text/plain'},body:'consent=1'});
     if(r.ok)await refresh();
   }catch(_){status('error');paint();}
 }
 for(const v of views){
  plot(v,null);
  const b=v.querySelector('[data-geo-optin]');
  if(b)b.addEventListener('click',async()=>{const agree=!consented();try{if(agree)localStorage.setItem('zz_geo_consent','yes');else localStorage.removeItem('zz_geo_consent')}catch(_){}
    paint();if(agree)await collect();
  });
 }
 document.addEventListener('zedong:language-changed',paint);
 paint();if(enabled)refresh().then(()=>{if(consented())collect();});
})();
