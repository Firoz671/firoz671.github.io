import { profile } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function About() {
  const { about } = profile;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-line/70 py-section"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <SectionHeading
              id="about-heading"
              eyebrow={about.eyebrow}
              title={about.heading}
            />
            <div className="mt-8 space-y-5 text-body text-muted">
              {about.paragraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
            <div className="flex items-start gap-5">
              <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-accent/10 text-2xl font-bold text-accent-strong">
                {profile.initials}
              </div>
              <p className="text-caption text-subtle">{about.portraitNote}</p>
            </div>

            <dl className="mt-7 divide-y divide-line border-t border-line">
              {about.facts.map((fact, index) => (
                <div
                  key={`${fact.label}-${index}`}
                  className="flex items-baseline justify-between gap-6 py-3.5"
                >
                  <dt className="text-caption text-subtle">{fact.label}</dt>
                  <dd className="text-right text-sm font-semibold">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
