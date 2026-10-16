/* Decorative canvas effects; no remote services or telemetry collection. */
(() => {
  const hero = document.querySelector('.cyber-hero');
  const canvas = document.querySelector('#cyber-signal-canvas');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hero || !canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d', { alpha:true });
  if (!ctx) return;
  let w = 0, h = 0, ratio = 1, running = true, frame = 0;
  let traces = [];
  const makeTrace = () => ({
    x: Math.random(), y: Math.random(), v: .12 + Math.random() * .33,
    len: 7 + Math.random() * 36, alpha: .08 + Math.random() * .20,
    tint: Math.random() > .85 ? '95,180,255' : '32,255,205'
  });
  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    traces = Array.from({length: Math.min(72, Math.max(26, Math.round(w / 17)))}, makeTrace);
  }
  function draw() {
    if (!running || !w || !h) return;
    ctx.clearRect(0,0,w,h);
    frame++;
    traces.forEach(t => {
      const x = t.x * w, y = t.y * h;
      ctx.beginPath();ctx.strokeStyle='rgba('+t.tint+','+t.alpha+')';ctx.lineWidth=1;
      ctx.moveTo(x,y);ctx.lineTo(x+3,y+t.len);ctx.stroke();
      t.y += t.v/h;
      if(t.y > 1.08){ t.y=-.1; t.x=Math.random(); }
    });
    if(frame % 3===0){
      const sweepY=(frame*.19)%h;
      const grd=ctx.createLinearGradient(0,sweepY-20,0,sweepY+20);
      grd.addColorStop(0,'rgba(0,255,187,0)');grd.addColorStop(.5,'rgba(0,255,187,.045)');grd.addColorStop(1,'rgba(0,255,187,0)');
      ctx.fillStyle=grd;ctx.fillRect(0,sweepY-20,w,40);
    }
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize, {passive:true});
  document.addEventListener('visibilitychange', () => {
    const was=running;
    running=!document.hidden;
    if(running && !was) requestAnimationFrame(draw);
  });
  requestAnimationFrame(draw);
})();

(() => {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-cinematic');
  const items = Array.from(document.querySelectorAll('.channel-card, .post-card'));
  items.forEach((el, i) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = (i%4)*55+'ms';
  });
  const watcher = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        watcher.unobserve(entry.target);
      }
    });
  }, {threshold:.05,rootMargin:'0px 0px 70px 0px'});
  items.forEach(el => watcher.observe(el));
})();