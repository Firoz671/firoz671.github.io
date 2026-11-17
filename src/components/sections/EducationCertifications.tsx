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
          description={education.intro}
        />

        <div className="mt-12 rounded-card border border-line bg-surface p-6 shadow-card sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
                {education.listHeading}
              </h3>
              <ul className="mt-6 space-y-6">
                {education.items.map((item) => (
                  <li
                    key={item.title}
                    className="border-t border-line pt-6 first:border-t-0 first:pt-0"
                  >
                    <p className="text-caption font-semibold text-subtle">
                      {item.period}
                    </p>
                    <h4 className="mt-1 text-lg">{item.title}</h4>
                    <p className="text-sm text-muted">{item.institution}</p>
                    <p className="mt-2 text-sm text-muted">{item.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line pt-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
                {certifications.heading}
              </h3>
              <p className="mt-3 text-sm text-muted">
                {certifications.intro}
              </p>
              <ul className="mt-6 space-y-6">
                {certifications.items.map((item) => (
                  <li
                    key={item.title}
                    className="border-t border-line pt-6 first:border-t-0 first:pt-0"
                  >
                    <p className="text-caption font-semibold text-subtle">
                      {item.year}
                    </p>
                    <h4 className="mt-1 text-lg">{item.title}</h4>
                    <p className="text-sm text-muted">{item.issuer}</p>
                    <p className="mt-2 text-sm text-muted">{item.note}</p>
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
