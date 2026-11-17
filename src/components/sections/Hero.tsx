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

      <Container className="relative py-20 sm:py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="hero-stagger">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-caption font-semibold text-muted">
              <span
                className="size-2 rounded-full bg-accent"
                aria-hidden="true"
              />
              {hero.eyebrow}
            </p>

            <h1 id="hero-title" className="mt-6 text-display">
              {hero.titleLines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
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

            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6 sm:gap-6">
              {hero.highlights.map((item) => (
                <div key={item.label}>
                  <dt className="text-caption text-subtle">{item.label}</dt>
                  <dd className="mt-1 text-h3 text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="motion-fade w-full max-w-md lg:justify-self-end">
            <div className="rounded-card border border-line bg-surface/90 shadow-card backdrop-blur">
              <div className="flex flex-col items-start gap-2 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-eyebrow font-semibold uppercase text-muted">
                  {hero.panel.title}
                </p>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-caption font-semibold text-muted">
                  <span
                    className="size-1.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {hero.panel.status}
                </span>
              </div>

              <dl className="divide-y divide-line">
                {hero.panel.rows.map((row, index) => (
                  <div
                    key={`${row.label}-${index}`}
                    className="flex items-baseline justify-between gap-6 px-5 py-4"
                  >
                    <dt className="text-caption text-subtle">{row.label}</dt>
                    <dd className="text-right text-sm font-semibold">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-line px-5 py-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    aria-hidden="true"
                    className="h-full w-2/3 rounded-full bg-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
