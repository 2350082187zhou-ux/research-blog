/* Blog-only English/Chinese content visibility and localized post cards.
   Complements the existing site-i18n navigation; never sends user text to a translation API. */
(() => {
 'use strict';
 const langSelect = document.querySelector('.cyber-navbar [data-site-language]');
 if (!langSelect) return;
 const labels = {
  en: {back:'← Back to Blog',notes:'Research notes',journal:'Research journal',all:'← All research notes',poster:'Open poster PDF ↗',summary:'Research poster overview',feature:'Featured research'},
  zh: {back:'← 返回博客',notes:'研究笔记',journal:'研究日志',all:'← 所有研究笔记',poster:'打开原始海报 PDF ↗',summary:'科研海报概览',feature:'重点研究'}
 };
 function language() {return langSelect.value==='zh' ? 'zh' : 'en';}
 function apply(){
  const lang=language();
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.querySelectorAll('[data-blog-lang]').forEach(el=>{
    const visible=el.getAttribute('data-blog-lang')===lang;
    el.hidden=!visible;
    el.setAttribute('aria-hidden',String(!visible));
  });
  document.querySelectorAll('[data-blog-locale]').forEach(el=>{
    el.hidden=el.getAttribute('data-blog-locale')!==lang;
  });
  const t=labels[lang];
  const replacements={'.article-breadcrumb a':t.back,'.article-breadcrumb > span': ' / '+t.notes,'.article-head .eyebrow':t.journal,'.article-end a':t.all};
  Object.entries(replacements).forEach(([selector,value])=>document.querySelectorAll(selector).forEach(el=>el.textContent=value));
  const cta=document.querySelector('#featured-investigation .feature-primary');
  if(cta) cta.textContent=t.poster;
  document.querySelectorAll('[data-blog-locale-title]').forEach(el=>{
    const title=el.getAttribute('data-blog-title-'+lang);
    if(title)el.textContent=title;
  });
  const search=document.querySelector('#blog-search');
  if(search)search.dispatchEvent(new Event('input',{bubbles:true}));
 }
 langSelect.addEventListener('change',()=>{window.requestAnimationFrame(apply)});
 document.addEventListener('zedong:language-changed',apply);
 apply();
})();
