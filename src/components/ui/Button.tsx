import type { ReactNode } from 'react';
import { cx } from './classNames';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'sm';

interface ButtonProps {
  children: ReactNode;
  href?: string | null;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-strong',
  secondary:
    'border border-line bg-surface text-ink hover:border-accent hover:text-accent-strong',
};

const sizeClass: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-sm',
  sm: 'px-4 py-2 text-xs',
};

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
}: ButtonProps) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200',
    variantClass[variant],
    sizeClass[size],
    !href && 'cursor-default opacity-70',
    className,
  );

  if (!href) {
    return (
      <span className={classes} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <a className={classes} href={href}>
      {children}
    </a>
  );
}
