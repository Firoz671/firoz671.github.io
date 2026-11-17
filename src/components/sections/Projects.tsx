import { projects } from '../../data/portfolio';
import type { ProjectVisual } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { cx } from '../ui/classNames';

const visualClass: Record<ProjectVisual, string> = {
  a: 'project-visual-a',
  b: 'project-visual-b',
  c: 'project-visual-c',
};

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-b border-line/70 py-section"
    >
      <Container>
        <SectionHeading
          id="projects-heading"
          eyebrow={projects.eyebrow}
          title={projects.heading}
          description={projects.intro}
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.items.map((project, index) => (
            <li
              key={project.title}
              className={cx(index === 0 && 'md:col-span-2')}
            >
              <article className="card-lift group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card">
                <div
                  aria-hidden="true"
                  className={cx(
                    'h-32 w-full border-b border-line md:h-40',
                    visualClass[project.visual],
                  )}
                />

                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 text-eyebrow font-semibold uppercase text-subtle">
                    <span>{project.kind}</span>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-4 text-h3 transition-colors group-hover:text-accent-strong">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-sm text-muted">
                    {project.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <li
                        key={`${tag}-${tagIndex}`}
                        className="rounded-full border border-line bg-surface-2 px-3 py-1 text-caption font-semibold text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-auto pt-6 text-caption font-semibold text-subtle">
                    {project.meta}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
