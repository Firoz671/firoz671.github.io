import type { ReactNode } from 'react';
import { cx } from './classNames';

interface ExternalLinkProps {
  href: string;
  newTabLabel: string;
  children: ReactNode;
  className?: string;
}

export function ExternalLink({
  href,
  newTabLabel,
  children,
  className,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(className)}
    >
      {children}
      <span className="sr-only"> ({newTabLabel})</span>
    </a>
  );
}
