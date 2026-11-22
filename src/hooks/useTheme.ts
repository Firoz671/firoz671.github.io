import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const META_COLORS: Record<Theme, string> = {
  light: '#f7f5f0',
  dark: '#0c0d10',
};

function readTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  if (current === 'light' || current === 'dark') return current;
  return 'dark';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', META_COLORS[theme]);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next: Theme = previous === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        return next;
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
