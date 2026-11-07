/* Blog-only English/Chinese content visibility and localized post cards.
   Complements the existing site-i18n navigation; never sends user text to a translation API. */
(() => {
 'use strict';
 const langSelect = document.querySelector('.cyber-navbar [data-site-language]');
 if (!langSelect) return;
 const labels = {
  en: {back:'← Back to Blog',notes:'Research notes',journal:'Research journal',all:'← All research notes',poster:'Open poster PDF ↗',summary:'Research poster overview',feature:'Featured research'},
  zh: {back:'← 返回博客',notes:'研究笔记',journal:'研究日志',all:'← 所有研究笔记',poster:'打开原始海报 PDF ↗',summary:'科研海报概览',feature:'重点研究'},
  ja: {back:'← ブログに戻る',notes:'研究ノート',journal:'研究記録',all:'← すべての記事',poster:'オリジナルPDFを開く ↗'},
  ko: {back:'← 블로그로 돌아가기',notes:'연구 노트',journal:'연구 기록',all:'← 모든 글',poster:'원본 포스터 PDF 열기 ↗'},
  de: {back:'← Zurück zum Blog',notes:'Forschungsnotizen',journal:'Forschungsjournal',all:'← Alle Artikel',poster:'Originalposter als PDF öffnen ↗'},
  fr: {back:'← Retour au blog',notes:'Notes de recherche',journal:'Journal de recherche',all:'← Tous les articles',poster:'Ouvrir le poster PDF original ↗'}
 };
 function language() {return ['en','zh','ja','ko','de','fr'].includes(langSelect.value)?langSelect.value:'en';}
 const extraHome = {
  '.cyber-hud-panel .cyber-hud-heading': ['Kernel defense · eBPF / LSM','内核防护 · eBPF / LSM'],
  '.cyber-hud-panel small': ['CONCEPT VISUALIZATION · NOT LIVE DATA','概念示意图 · 非实时数据'],
  '.blog-ops-ping': ['RESEARCH RADAR / SIGNAL ACTIVE','科研雷达 / 信号正常'],
  '.blog-ops-marker': ['LIVE CFP FEED · ACADEMIC TRACKER','会议征稿信息 · 学术追踪'],
  '.blog-deadlines-header .section-code': ['AUTOMATED INTELLIGENCE · SUBMISSION TRACKER','自动信息追踪 · 投稿时间表'],
  '.blog-ops-terminal-key': ['> NEXT SUBMISSION SIGNAL','> 下一个投稿节点'],
  '.blog-ops-next-meta': ['Upcoming deadlines · official / community sources','即将到来的截稿时间 · 官方 / 社区来源'],
  '.blog-ops-controls > strong': ['UPCOMING MILESTONES / NEXT 03 SIGNALS','近期截稿 / 接下来 3 项'],
  '.blog-ops-sensor-label small': ['SECURITY RESEARCH','网络安全研究'],
  '#searchable-posts .post-card .tags .tag:first-child': ['Research Note','研究笔记'],
  '#investigation-title + p': ['',''],
 };
 const originalText = new WeakMap();
 function extraTranslations(lang){
  Object.entries(extraHome).forEach(([selector,pair])=>document.querySelectorAll(selector).forEach(el=>{
   if(!originalText.has(el)) originalText.set(el,el.textContent);
   if(pair[0] && (lang==='zh'||lang==='en')) el.textContent=lang==='zh'?pair[1]:originalText.get(el);
  }));
 }
 function apply(){
  const lang=language();
  document.documentElement.lang=lang==='zh'?'zh-CN':lang;
  document.querySelectorAll('[data-blog-lang]').forEach(el=>{
    const visible=el.getAttribute('data-blog-lang')===lang;
    el.hidden=!visible;
    el.setAttribute('aria-hidden',String(!visible));
  });
  document.querySelectorAll('[data-blog-locale]').forEach(el=>{
    el.hidden=el.getAttribute('data-blog-locale')!==lang;
  });
  const t=labels[lang];
  extraTranslations(lang);
  const replacements={'.article-breadcrumb a':t.back,'.article-breadcrumb > span': ' / '+t.notes,'.article-head .eyebrow':t.journal,'.article-end a':t.all};
  Object.entries(replacements).forEach(([selector,value])=>document.querySelectorAll(selector).forEach(el=>el.textContent=value));
  const cta=document.querySelector('#featured-investigation .feature-primary');
  if(cta) cta.textContent=t.poster;
  document.querySelectorAll('[data-blog-locale-title]').forEach(el=>{
    const title=el.getAttribute('data-blog-title-'+lang);
    if(title)el.textContent=title;
  });
  const headline=document.querySelector('.article-head h1');
  if(headline) document.title=headline.textContent.trim()+' | Zedong Zhou';
  const search=document.querySelector('#blog-search');
  if(search)search.dispatchEvent(new Event('input',{bubbles:true}));
 }
 langSelect.addEventListener('change',()=>{window.requestAnimationFrame(apply)});
 document.addEventListener('zedong:language-changed',apply);
 apply();
})();
