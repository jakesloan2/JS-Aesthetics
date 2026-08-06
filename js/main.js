/* JS Aesthetics Beauty Lounge — shared behaviour
   Updated 06 Aug 2026 — pre-handover audit fixes marked [AUDIT]. */
(function () {
  'use strict';
  var d = document;

  /* ---------- year ---------- */
  var yr = d.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- header + sticky button state ---------- */
  var hdr = d.getElementById('hdr');
  var floatBtn = d.querySelector('.float');

  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-solid', y > 40);
    if (floatBtn) {
      /* [AUDIT] The original only revealed the button past 500px of
         scroll. On short pages (404, privacy, terms) that point is never
         reached and the button never appeared at all. It now also shows
         on any page that isn't tall enough to scroll that far. */
      var shortPage = d.documentElement.scrollHeight < window.innerHeight * 1.6;
      floatBtn.classList.toggle('is-on', y > 500 || shortPage);
    }
  }
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });

  /* ---------- full-screen nav ---------- */
  var nav = d.getElementById('nav'),
      burger = d.getElementById('burger'),
      navClose = d.getElementById('navClose');

  var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.style.overflow = open ? 'hidden' : '';

    /* [AUDIT] Focus was never moved into the panel on open, and never
       returned to the burger on close — a keyboard or screen reader user
       opened the menu and stayed stranded behind it. */
    if (open) {
      if (navClose) navClose.focus();
    } else if (burger) {
      burger.focus();
    }
  }

  function isOpen() { return !!nav && nav.classList.contains('is-open'); }

  if (burger) burger.addEventListener('click', function () { setNav(!isOpen()); });
  if (navClose) navClose.addEventListener('click', function () { setNav(false); });

  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { setNav(false); return; }

    /* [AUDIT] Tab used to walk straight out of the open menu and into the
       page behind it. This keeps focus cycling inside the panel. */
    if (e.key !== 'Tab' || !isOpen()) return;
    var items = [].slice.call(nav.querySelectorAll(FOCUSABLE))
                  .filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* Close the menu if the viewport grows to desktop while it's open. */
  addEventListener('resize', function () {
    if (isOpen() && window.innerWidth >= 900) setNav(false);
  });

  /* ---------- treatment filters ---------- */
  var filters = [].slice.call(d.querySelectorAll('.filter'));
  var gcards = [].slice.call(d.querySelectorAll('.gcard'));
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      f.setAttribute('aria-pressed', 'true');
      var c = f.dataset.filter;
      var shown = 0;
      gcards.forEach(function (g) {
        var match = (c === 'all' || (g.dataset.cat || '').split(' ').indexOf(c) > -1);
        g.hidden = !match;
        if (match) shown++;
      });
      /* [AUDIT] Filtering changed the grid silently. Screen reader users
         got no confirmation that anything had happened. */
      var live = d.getElementById('filterStatus');
      if (live) {
        live.textContent = (c === 'all')
          ? 'Showing all ' + shown + ' treatments.'
          : 'Showing ' + shown + ' treatment' + (shown === 1 ? '' : 's') + ' in ' + f.textContent.trim() + '.';
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  var risers = [].slice.call(d.querySelectorAll('.rise'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    risers.forEach(function (el) { io.observe(el); });
  } else {
    risers.forEach(function (el) { el.classList.add('in'); });
  }

  /* [AUDIT] Safety net: if anything above throws before the observer
     runs, reveal everything rather than leaving the page blank. */
  addEventListener('load', function () {
    setTimeout(function () {
      risers.forEach(function (el) {
        if (!el.classList.contains('in') &&
            el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('in');
        }
      });
    }, 1200);
  });
})();

