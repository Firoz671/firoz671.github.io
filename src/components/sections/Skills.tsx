import { skills } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-b border-line/70 bg-surface-2/40 py-section"
    >
      <Container>
        <SectionHeading
          id="skills-heading"
          eyebrow={skills.eyebrow}
          title={skills.heading}
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.groups.map((group, groupIndex) => (
            <li
              key={group.title}
              className="card-lift rounded-card border border-line bg-surface p-6 shadow-card"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="min-w-0 text-h3">{group.title}</h3>
                <span
                  className="text-eyebrow font-semibold text-subtle"
                  aria-hidden="true"
                >
                  {String(groupIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <ul className="mt-5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-t border-line py-3 text-sm text-muted"
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="learning-heading"
          className="mt-12 rounded-card border border-line bg-surface p-6 shadow-card sm:p-8"
        >
          <div className="flex items-start gap-3">
            <span
              className="mt-3 h-px w-8 shrink-0 bg-accent"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h3 id="learning-heading" className="text-h3">
                {skills.learning.heading}
              </h3>
              <p className="mt-3 max-w-prose text-sm text-muted">
                {skills.learning.intro}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {skills.learning.groups.map((group) => (
              <div key={group.title}>
                <h4 className="text-eyebrow font-semibold uppercase text-subtle">
                  {group.title}
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-caption font-semibold text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </section>
  );
}
