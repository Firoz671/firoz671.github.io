import { profile } from '../../data/portfolio';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { cx } from '../ui/classNames';

export function Hero() {
  const { hero } = profile;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-line/70"
    >
      <div aria-hidden="true" className="absolute inset-0 hero-backdrop" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid bg-grid-fade"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="hero-stagger">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-caption font-semibold text-muted">
              <span
                className="size-2 rounded-full bg-accent"
                aria-hidden="true"
              />
              {hero.eyebrow}
            </p>

            <h1
              id="hero-title"
              aria-label={profile.name}
              className="mt-6 text-display"
            >
              {hero.titleLines.map((line, index) => (
                <span
                  key={line}
                  className={cx(
                    'block',
                    index === hero.titleLines.length - 1 && 'text-accent',
                  )}
                >
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-xl text-lead text-muted">{hero.lead}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            </div>

            <ul className="mt-12 grid max-w-xl gap-3 border-t border-line pt-6 sm:grid-cols-3">
              {hero.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-xl border border-line bg-surface/70 px-4 py-3 text-sm font-semibold"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="motion-fade w-full max-w-md lg:justify-self-end">
            <div className="rounded-card border border-line bg-surface/90 shadow-card backdrop-blur">
              <div className="flex items-center gap-2 border-b border-line px-5 py-4">
                <span
                  className="size-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <p className="text-eyebrow font-semibold uppercase text-muted">
                  {hero.panel.title}
                </p>
              </div>

              <dl className="divide-y divide-line">
                {hero.panel.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-0.5 px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="text-caption text-subtle">{row.label}</dt>
                    <dd className="text-sm font-semibold sm:text-right">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
