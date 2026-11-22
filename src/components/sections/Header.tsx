import { profile } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 md:py-4">
        <a
          href="#main"
          className="w-full text-lg font-bold tracking-tight md:w-auto"
        >
          {profile.brand}
          <span className="text-accent" aria-hidden="true">
            .
          </span>
        </a>

        <nav
          aria-label={profile.ui.primaryNav}
          className="min-w-0 flex-1 md:ml-auto md:flex-none"
        >
          <ul className="nav-scroll flex items-center gap-1 overflow-x-auto text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted md:gap-2 md:text-eyebrow">
            {profile.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onFocus={(event) => {
                    event.currentTarget.scrollIntoView({
                      block: 'nearest',
                      inline: 'nearest',
                    });
                  }}
                  className="inline-flex whitespace-nowrap rounded-full px-3 py-2 transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle
          labels={{
            toDark: profile.ui.themeToDark,
            toLight: profile.ui.themeToLight,
          }}
        />
      </Container>
    </header>
  );
}
