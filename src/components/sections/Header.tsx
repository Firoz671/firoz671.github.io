import { profile } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 md:py-4">
        <a href="#main" className="text-lg font-bold tracking-tight">
          {profile.brand}
          <span className="text-accent" aria-hidden="true">
            .
          </span>
        </a>

        <div className="ml-auto md:order-last md:ml-0">
          <ThemeToggle
            labels={{
              toDark: profile.ui.themeToDark,
              toLight: profile.ui.themeToLight,
            }}
          />
        </div>

        <nav
          aria-label={profile.ui.primaryNav}
          className="order-last w-full md:order-none md:ml-auto md:w-auto"
        >
          <ul className="flex items-center gap-1 overflow-x-auto text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted md:gap-2 md:text-eyebrow">
            {profile.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex whitespace-nowrap rounded-full px-3 py-2 transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
