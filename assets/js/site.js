/* Site interactions: theme, header, mobile menu, news, publication filters, contact. */
(function () {
  var root = document.documentElement;
  var SUN = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
  var MOON = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';

  /* Theme */
  var toggles = document.querySelectorAll('[data-theme-toggle]');
  function paint() {
    var dark = root.dataset.theme === 'dark';
    var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    toggles.forEach(function (b) {
      b.innerHTML = dark ? SUN : MOON;
      b.setAttribute('aria-label', label);
      b.title = label;
    });
  }
  paint();
  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      paint();
    });
  });
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', function (e) {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (saved) return;
    root.dataset.theme = e.matches ? 'dark' : 'light';
    paint();
  });

  /* Header + mobile menu */
  var header = document.querySelector('[data-site-header]');
  var menu = document.querySelector('[data-mobile-menu]');
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var menuOpen = false;
  var BURGER = menuBtn ? menuBtn.innerHTML : '';
  var CLOSE = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="22" width="22" xmlns="http://www.w3.org/2000/svg"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
  function paintHeader() {
    if (!header) return;
    var solid = window.scrollY > 8 || menuOpen;
    header.classList.toggle('bg-paper/0', !solid);
    ['bg-paper/85', 'shadow-[inset_0_-1px_0_rgb(var(--line))]', 'backdrop-blur-md'].forEach(function (c) {
      header.classList.toggle(c, solid);
    });
  }
  function setMenu(open) {
    menuOpen = open;
    if (menu) menu.hidden = !open;
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menuBtn.innerHTML = open ? CLOSE : BURGER;
    }
    paintHeader();
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
  window.addEventListener('scroll', paintHeader, { passive: true });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  paintHeader();

  /* News: show all */
  var more = document.querySelector('[data-news-more]');
  if (more) {
    var items = document.querySelectorAll('[data-news-item]');
    var label = more.querySelector('[data-news-more-label]');
    var total = items.length;
    var expanded = false;
    more.addEventListener('click', function () {
      expanded = !expanded;
      items.forEach(function (li, i) { li.hidden = !expanded && i >= 5; });
      label.textContent = expanded ? 'Show fewer' : 'Show all ' + total + ' updates';
      more.querySelector('svg').style.transform = expanded ? 'rotate(180deg)' : '';
    });
    if (total <= 5) more.hidden = true;
  }

  /* Publication filters */
  var tabs = document.querySelectorAll('[data-filter]');
  if (tabs.length) {
    var ON = ['border-ink', 'bg-ink', 'text-paper'];
    var OFF = ['border-line', 'bg-surface', 'text-muted', 'hover:border-ink/30', 'hover:text-ink'];
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var f = t.dataset.filter;
        tabs.forEach(function (o) {
          var on = o === t;
          o.setAttribute('aria-selected', String(on));
          ON.forEach(function (c) { o.classList.toggle(c, on); });
          OFF.forEach(function (c) { o.classList.toggle(c, !on); });
          var n = o.querySelector('span');
          n.classList.toggle('text-paper/60', on);
          n.classList.toggle('text-faint', !on);
        });
        document.querySelectorAll('article[data-type]').forEach(function (a) {
          a.hidden = !(f === 'All' || a.dataset.type === f);
        });
        document.querySelectorAll('[data-year]').forEach(function (s) {
          s.hidden = !s.querySelector('article[data-type]:not([hidden])');
        });
      });
    });
  }

  /* Contact: copy buttons + mailto form */
  var CHECK = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 9 17l-5-5"></path></svg>';
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    var orig = b.innerHTML;
    b.addEventListener('click', function () {
      var done = function () {
        b.innerHTML = CHECK;
        setTimeout(function () { b.innerHTML = orig; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, function () {});
    });
  });
  var form = document.querySelector('[data-contact]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = d.get('message') + '\n\n-- ' + d.get('user_name') + ' (' + d.get('user_email') + ')';
      var mail = document.querySelector('a[href^="mailto:"]').getAttribute('href');
      location.href = mail + '?subject=' + encodeURIComponent('Message from ' + d.get('user_name')) + '&body=' + encodeURIComponent(body);
      var s = form.querySelector('[data-contact-status]');
      if (s) s.textContent = 'Opening your email app…';
    });
  }

  /* Home hero web */
  var web = document.querySelector('canvas[data-web]');
  if (web && window.initWeb) window.initWeb(web);
})();
