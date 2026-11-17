import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  labels: {
    toDark: string;
    toLight: string;
  };
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? labels.toLight : labels.toDark}
      className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent-strong"
    >
      {theme === 'dark' ? (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.15rem]"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.15rem]"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
