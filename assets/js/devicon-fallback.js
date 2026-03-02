document.addEventListener('DOMContentLoaded', function () {
  var icons = document.querySelectorAll('[data-devicon-name]');
  if (!icons.length) return;

  icons.forEach(function (el) {
    var name = el.getAttribute('data-devicon-name');
    if (!name) return;

    var style = el.getAttribute('data-devicon-style') || 'plain';
    var faIcon = el.getAttribute('data-fa-icon');

    var img = new Image();

    img.onload = function () {
      // Devicon SVG exists; keep the current icon.
    };

    img.onerror = function () {
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
    };

    img.src =
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/' +
      name +
      '/' +
      name +
      '-' +
      style +
      '.svg';
  });
});

