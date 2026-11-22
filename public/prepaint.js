(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme =
      stored === 'light' || stored === 'dark' ? stored : 'dark';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0c0d10' : '#f7f5f0');
    }
  } catch (e) {}
})();
