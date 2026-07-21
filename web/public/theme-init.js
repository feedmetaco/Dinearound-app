// Runs before paint to avoid a light-mode flash. Default theme is dark ("Midnight Gourmet").
(function () {
  try {
    var stored = localStorage.getItem('dinearound-theme');
    var isLight = stored === 'light';
    document.documentElement.classList.add(isLight ? 'light' : 'dark');
  } catch (_e) {
    document.documentElement.classList.add('dark');
  }
})();
