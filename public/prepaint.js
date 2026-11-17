try {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !sessionStorage.getItem('ping-intro-done') && !sessionStorage.getItem('ping-dismissed') && innerWidth >= 480 && innerHeight >= 520) document.documentElement.classList.add('intro');
} catch (e) {}
