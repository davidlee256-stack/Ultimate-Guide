/* The Ultimate Guide for Architects Using AI — page behaviour.
   The footer year, the mobile buy bar (kept out of the way of the two CTAs
   it would otherwise duplicate), and the free-prompts dialog. */

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

/* --- Free prompts dialog ------------------------------------------------ */
(function () {
  'use strict';

  var dialog = document.getElementById('prompts');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var status = document.getElementById('prompts-status');
  var HASH = '#prompts';

  function open() {
    if (!dialog.open) dialog.showModal();
    if (location.hash !== HASH) history.replaceState(null, '', HASH);
  }

  document.querySelectorAll('[data-prompts-open]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });
  });

  dialog.querySelector('[data-prompts-close]').addEventListener('click', function () {
    dialog.close();
  });

  // The dialog has no padding of its own, so a click on it is a backdrop click.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', function () {
    if (location.hash === HASH) history.replaceState(null, '', location.pathname + location.search);
  });

  // A shared link straight to the prompts: site address + #prompts.
  if (location.hash === HASH) open();
  window.addEventListener('hashchange', function () {
    if (location.hash === HASH) open();
  });

  /* Copy buttons. textContent keeps the prompt's own line breaks. */
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    dialog.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) {}
    dialog.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject();
  }

  dialog.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    var timer;
    btn.addEventListener('click', function () {
      var source = document.getElementById(btn.getAttribute('data-copy'));
      if (!source) return;
      var text = source.textContent;
      var copy = navigator.clipboard && window.isSecureContext
        ? navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); })
        : fallbackCopy(text);
      copy.then(function () {
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
        if (status) status.textContent = 'Prompt copied to clipboard.';
      }, function () {
        btn.textContent = 'Select and copy';
        if (status) status.textContent = 'Copy failed. Select the prompt text and copy it by hand.';
      }).then(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove('is-copied');
        }, 2000);
      });
    });
  });
})();
