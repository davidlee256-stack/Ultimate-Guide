/* The Ultimate Guide for Architects Using AI — page behaviour.
   Three jobs only: the mobile buy bar, the footer year, and keeping the
   sticky bar out of the way of the two CTAs it would otherwise duplicate. */

(function () {
  'use strict';

  /* --- Footer year ------------------------------------------------------ */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* --- Mobile sticky buy bar -------------------------------------------- */
  var bar = document.getElementById('stickybar');
  var hero = document.getElementById('top');
  var finalCta = document.getElementById('buy');

  if (!bar || !hero) return;

  // Reveal the element to CSS; it stays translated off-screen until shown.
  bar.hidden = false;

  if (!('IntersectionObserver' in window)) return;

  var pastHero = false;
  var atFinal = false;

  function update() {
    bar.classList.toggle('is-visible', pastHero && !atFinal);
  }

  new IntersectionObserver(function (entries) {
    pastHero = !entries[0].isIntersecting;
    update();
  }, { rootMargin: '-120px 0px 0px 0px' }).observe(hero);

  if (finalCta) {
    new IntersectionObserver(function (entries) {
      atFinal = entries[0].isIntersecting;
      update();
    }, { threshold: 0.2 }).observe(finalCta);
  }
})();
