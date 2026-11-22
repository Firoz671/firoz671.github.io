import { certifications, education } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function EducationCertifications() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="border-b border-line/70 bg-surface-2/40 py-section"
    >
      <Container>
        <SectionHeading
          id="education-heading"
          eyebrow={education.eyebrow}
          title={education.heading}
        />

        <div className="mt-12 rounded-card border border-line bg-surface p-6 shadow-card sm:p-10">
          <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
            {education.listHeading}
          </h3>

          {education.items.map((item) => (
            <div key={item.degree} className="mt-5">
              <p className="text-caption font-semibold text-subtle">
                {item.period}
              </p>
              <h4 className="mt-1 text-lg">{item.degree}</h4>
              <p className="text-sm text-muted">{item.institution}</p>
              <p className="mt-3 max-w-prose text-sm text-muted">
                <span className="font-semibold text-ink">
                  {education.thesisLabel}:{' '}
                </span>
                {item.thesis}
              </p>
            </div>
          ))}

          <div className="mt-10 grid gap-10 border-t border-line pt-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
                {certifications.heading}
              </h3>
              <ul className="mt-5 space-y-5">
                {certifications.items.map((item) => (
                  <li key={item.title}>
                    <h4 className="text-lg">{item.title}</h4>
                    <p className="text-sm text-muted">{item.issuer}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:border-l lg:border-line lg:pl-12">
              <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
                {education.activities.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {education.activities.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-muted"
                  >
                    <span
                      className="mt-[0.7em] h-px w-3 shrink-0 bg-accent"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
