import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={classNames(styles.btn, {
        [styles.primary]: variant === 'primary',
        [styles.secondary]: variant === 'secondary',
        [styles.ghost]: variant === 'ghost',
        [styles.lg]: size === 'lg',
        [styles.full]: !!fullWidth,
      }, [className])}
      {...rest}
    >
      {children}
    </button>
  );
};
