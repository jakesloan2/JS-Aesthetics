/* JS Aesthetics Beauty Lounge — shared behaviour */
(function () {
  'use strict';
  var d = document;

  /* year */
  var yr = d.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* header state */
  var hdr = d.getElementById('hdr');
  var floatBtn = d.querySelector('.float');
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle('is-solid', y > 40);
    if (floatBtn) floatBtn.classList.toggle('is-on', y > 500);
  }
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* full-screen nav */
  var nav = d.getElementById('nav'),
      burger = d.getElementById('burger'),
      navClose = d.getElementById('navClose');
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  if (navClose) navClose.addEventListener('click', function () { setNav(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* treatment filters */
  var filters = [].slice.call(d.querySelectorAll('.filter'));
  var gcards = [].slice.call(d.querySelectorAll('.gcard'));
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      f.setAttribute('aria-pressed', 'true');
      var c = f.dataset.filter;
      gcards.forEach(function (g) {
        g.hidden = !(c === 'all' || (g.dataset.cat || '').split(' ').indexOf(c) > -1);
      });
    });
  });

  /* scroll reveal */
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
})();
