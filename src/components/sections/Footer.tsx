import { profile } from '../../data/portfolio';
import { Container } from '../ui/Container';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/70 py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">{profile.name}</p>
          <p className="mt-1 text-caption text-subtle">
            {profile.footer.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-subtle">
          <span>© {year}</span>
          <a
            href="#main"
            className="font-semibold text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {profile.ui.backToTop} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
