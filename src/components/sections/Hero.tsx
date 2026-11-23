import { useState } from 'react';
import { profile } from '../../data/portfolio';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { cx } from '../ui/classNames';

export function Hero() {
  const { hero } = profile;
  const [portraitFailed, setPortraitFailed] = useState(false);

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

          <div className="motion-fade mx-auto w-full max-w-md lg:justify-self-end">
            <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
              <div className="p-2">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-2 ring-1 ring-ink/10 sm:aspect-[4/5]">
                  {portraitFailed ? (
                    <div
                      role="img"
                      aria-label={hero.portrait.alt}
                      className="flex h-full w-full items-center justify-center bg-surface-2"
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-24 place-items-center rounded-3xl bg-accent/10 text-3xl font-bold text-accent-strong"
                      >
                        {profile.initials}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={hero.portrait.src}
                      width={hero.portrait.width}
                      height={hero.portrait.height}
                      alt={hero.portrait.alt}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={() => setPortraitFailed(true)}
                      className="block h-full w-full object-cover object-[70%_30%]"
                    />
                  )}
                </div>
              </div>

              <div className="border-t border-line px-5 py-4">
                <p className="text-eyebrow font-semibold uppercase text-muted">
                  {hero.panel.title}
                </p>

                <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {hero.panel.rows.map((row) => (
                    <div key={row.label} className="min-w-0">
                      <dt className="text-caption text-subtle">{row.label}</dt>
                      <dd className="text-sm font-semibold">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
