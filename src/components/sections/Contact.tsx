import { contact, profile } from '../../data/portfolio';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-section"
    >
      <Container>
        <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-14">
            <div>
              <SectionHeading
                id="contact-heading"
                eyebrow={contact.eyebrow}
                title={contact.heading}
                description={contact.lead}
              />

              <div className="mt-8">
                <Button href={contact.email.href}>
                  {contact.emailCtaLabel}
                </Button>
              </div>

              <div className="mt-5 space-y-1 text-caption text-subtle">
                <p>{contact.email.label}</p>
                <p>{contact.responseNote}</p>
              </div>
            </div>

            <div className="lg:border-l lg:border-line lg:pl-10">
              <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
                {contact.linksHeading}
              </h3>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {contact.links.map((link, index) => (
                  <li
                    key={`${link.label}-${index}`}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                  >
                    <span className="text-caption text-subtle">
                      {link.label}
                    </span>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="text-right text-sm font-semibold underline decoration-line underline-offset-4 transition-colors hover:text-accent-strong"
                      >
                        {link.value}
                      </a>
                    ) : (
                      <span className="text-right text-sm font-semibold text-muted">
                        {link.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-baseline justify-between gap-6">
                <span className="text-caption text-subtle">
                  {contact.locationLabel}
                </span>
                <span className="text-right text-sm font-semibold">
                  {profile.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
