(() => {
  const navbar = document.querySelector('.cyber-navbar');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-navigation');
  if (menu && navbar && nav) {
    menu.addEventListener('click', () => {
      const open = navbar.classList.toggle('menu-open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
      menu.setAttribute('aria-expanded','false');
    }));
  }
  const field = document.querySelector('#blog-search');
  const cards = Array.from(document.querySelectorAll('#searchable-posts .post-card'));
  const empty = document.querySelector('#no-search-results');
  if (field) {
    field.addEventListener('input', () => {
      const q = field.value.trim().toLocaleLowerCase();
      let count = 0;
      cards.forEach(card => {
        const haystack = (card.getAttribute('data-search') || card.textContent || '').toLocaleLowerCase();
        const show = !q || haystack.includes(q);
        card.hidden = !show;
        if (show) count++;
      });
      if (empty) empty.style.display = cards.length && !count ? 'block' : 'none';
    });
  }
})();