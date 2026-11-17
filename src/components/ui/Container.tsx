import type { ReactNode } from 'react';
import { cx } from './classNames';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cx('mx-auto w-full max-w-6xl px-gutter', className)}>
      {children}
    </div>
  );
}
