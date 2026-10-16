/* Small shared countdowns on Zedong Zhou's academic homepage and blog. */
(() => {
  'use strict';
  const items = [...document.querySelectorAll('[data-inline-deadline]')].map(node => ({
    node,
    row: node.closest('[data-inline-row]'),
    due: Date.parse(node.getAttribute('data-inline-deadline') || '')
  })).filter(item => Number.isFinite(item.due));

  if (!items.length) return;
  function clock(milliseconds) {
    if (milliseconds <= 0) return 'Closed';
    const seconds = Math.ceil(milliseconds / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const pad = n => String(n).padStart(2, '0');
    return days + 'd ' + pad(hours) + 'h ' + pad(minutes) + 'm';
  }
  function update() {
    const now = Date.now();
    let visible = 0;
    for (const item of items) {
      const remaining = item.due - now;
      item.node.textContent = clock(remaining);
      if (item.row) {
        const show = remaining > 0 && visible < 3;
        item.row.hidden = !show;
        if (show) visible++;
      }
    }
  }
  update();
  const timer = window.setInterval(() => {
    if (!document.hidden) update();
  }, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) update();
  });
  window.addEventListener('pagehide', () => window.clearInterval(timer), {once:true});
})();
