import { cx } from './classNames';

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cx('max-w-2xl', className)}>
      <p className="flex items-center gap-3 text-eyebrow font-semibold uppercase text-accent-strong">
        <span className="h-px w-8 bg-accent" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 text-h2">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-prose text-lead text-muted">{description}</p>
      ) : null}
    </div>
  );
}
