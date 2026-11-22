import { profile, projects } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { ExternalLink } from '../ui/ExternalLink';
import { SectionHeading } from '../ui/SectionHeading';
import { cx } from '../ui/classNames';

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
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.items.map((project, index) => (
            <li
              key={project.title}
              className={cx(index === 0 && 'md:col-span-2')}
            >
              <article className="card-lift flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card">
                {project.image ? (
                  <img
                    src={project.image.src}
                    width={project.image.width}
                    height={project.image.height}
                    alt={project.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full border-b border-line object-cover"
                  />
                ) : null}

                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 text-eyebrow font-semibold uppercase text-subtle">
                    <span>{project.kind}</span>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-3 text-h3">{project.title}</h3>

                  <ul className="mt-5 max-w-prose space-y-2.5 text-sm text-muted">
                    {project.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          className="mt-[0.7em] h-px w-3 shrink-0 bg-accent"
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {project.outcome ? (
                    <p className="mt-5 max-w-prose border-l-2 border-accent pl-4 text-sm text-muted">
                      <span className="font-semibold text-ink">
                        {projects.outcomeLabel}:{' '}
                      </span>
                      {project.outcome}
                    </p>
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                    <ul className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line bg-surface-2 px-3 py-1 text-caption font-semibold text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>

                    {project.live ? (
                      <ExternalLink
                        href={project.live.href}
                        newTabLabel={profile.ui.opensInNewTab}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong underline-offset-4 hover:underline"
                      >
                        {project.live.label}
                        <span aria-hidden="true">↗</span>
                      </ExternalLink>
                    ) : null}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
