document.addEventListener('DOMContentLoaded', function () {
  var icons = document.querySelectorAll('[data-devicon-name]');
  if (!icons.length) return;

  icons.forEach(function (el) {
    var name = el.getAttribute('data-devicon-name');
    if (!name) return;

    var style = el.getAttribute('data-devicon-style') || 'plain';
    var faIcon = el.getAttribute('data-fa-icon');

    var tryStyles = [];
    if (style) tryStyles.push(style);
    if (style !== 'original') tryStyles.push('original');
    if (style !== 'plain') tryStyles.push('plain');
    if (style !== 'line') tryStyles.push('line');

    function iconUrl(iconStyle) {
      return (
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/' +
        name +
        '/' +
        name +
        '-' +
        iconStyle +
        '.svg'
      );
    }

    function replaceWithFontAwesome() {
      if (!faIcon) return;

      var fa = document.createElement('i');
      fa.className = 'fas fa-' + faIcon + ' text-5xl';
      var animation = el.getAttribute('data-animation');
      if (animation) {
        fa.setAttribute('data-animation', animation);
      }
      fa.setAttribute('aria-hidden', 'true');

      if (el.parentNode) {
        el.parentNode.replaceChild(fa, el);
      }
    }

    function setImgSrcSequentially(idx) {
      if (el.tagName !== 'IMG') {
        // If this isn't an <img>, we can't set src; fall back.
        replaceWithFontAwesome();
        return;
      }

      if (idx >= tryStyles.length) {
        replaceWithFontAwesome();
        return;
      }

      var test = new Image();
      var url = iconUrl(tryStyles[idx]);

      test.onload = function () {
        el.src = url;
      };

      test.onerror = function () {
        setImgSrcSequentially(idx + 1);
      };

      test.src = url;
    }

    setImgSrcSequentially(0);
  });
});

