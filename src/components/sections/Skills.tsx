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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading
            id="skills-heading"
            eyebrow={skills.eyebrow}
            title={skills.heading}
            description={skills.intro}
          />

          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {skills.groups.map((group, groupIndex) => (
              <li
                key={`${group.title}-${groupIndex}`}
                className="card-lift rounded-card border border-line bg-surface p-6 shadow-card"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-h3">{group.title}</h3>
                  <span
                    className="text-eyebrow font-semibold text-subtle"
                    aria-hidden="true"
                  >
                    {String(groupIndex + 1).padStart(2, '0')}
                  </span>
                </div>
                <ul className="mt-5">
                  {group.items.map((item, itemIndex) => (
                    <li
                      key={`${item}-${itemIndex}`}
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
        </div>
      </Container>
    </section>
  );
}
