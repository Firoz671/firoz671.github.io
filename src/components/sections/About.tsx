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
            <div className="mt-8 max-w-prose space-y-5 text-body text-muted">
              {about.paragraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-accent/10 text-xl font-bold text-accent-strong">
                {profile.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold">{profile.name}</p>
                <p className="text-caption text-muted">{profile.role}</p>
              </div>
            </div>

            <dl className="mt-7 divide-y divide-line border-t border-line">
              {about.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-0.5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <dt className="text-caption text-subtle">{fact.label}</dt>
                  <dd className="text-sm font-semibold sm:text-right">
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
