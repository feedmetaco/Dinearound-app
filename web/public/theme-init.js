// Runs before paint to avoid a flash of the wrong theme. Default theme is now
// light ("Marketplace Light" — DONESKI-inspired). Dark is opt-in via Account page.
(function () {
  try {
    var stored = localStorage.getItem('dinearound-theme');
    var isDark = stored === 'dark';
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
  } catch (_e) {
    document.documentElement.classList.add('light');
  }
})();
