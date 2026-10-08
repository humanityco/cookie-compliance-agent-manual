// manual.hu-manity.co: copy buttons and the sidebar. No dependencies, nothing
// loaded from elsewhere. Copied to site/assets/ by scripts/build-pages.mjs.
(function () {
  'use strict';

  // Copy `source`'s text; if the clipboard is unavailable, select it instead.
  function copy(source, button) {
    var label = button.textContent, name = button.getAttribute('aria-label');
    var say = function (text, accessible) {
      button.textContent = text;
      if (name) button.setAttribute('aria-label', accessible);
    };
    var done = function () {
      say('Copied', 'Copied');
      setTimeout(function () { say(label, name); }, 2000);
    };
    var fallback = function () {
      var range = document.createRange();
      range.selectNodeContents(source);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      say('Selected: copy it with your keyboard shortcut', 'Selected: copy it with your keyboard shortcut');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(source.textContent).then(done, fallback);
    } else {
      fallback();
    }
  }

  // Every rendered code block gets a Copy button.
  Array.prototype.forEach.call(document.querySelectorAll('.code'), function (box) {
    var pre = box.querySelector('pre');
    if (!pre) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code');
    button.addEventListener('click', function () { copy(pre, button); });
    box.appendChild(button);
  });

  // A button with data-copy="<id>" copies that element (the home page prompt).
  Array.prototype.forEach.call(document.querySelectorAll('button[data-copy]'), function (button) {
    var source = document.getElementById(button.getAttribute('data-copy'));
    if (source) button.addEventListener('click', function () { copy(source, button); });
  });

  // The sidebar <details> ships open, so it shows without JavaScript. Here it is
  // collapsed on narrow screens; on wide screens it is a column, always open
  // (its summary is hidden there by the stylesheet).
  var sidebar = document.querySelector('details.sidebar');
  if (sidebar && window.matchMedia) {
    var wide = window.matchMedia('(min-width: 60em)');
    var sync = function () { sidebar.open = wide.matches; };
    sync();
    if (wide.addEventListener) wide.addEventListener('change', sync);
  }
})();
