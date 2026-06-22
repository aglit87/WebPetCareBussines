import type { CSSProperties, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames';
import styles from './Card.module.scss';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: number;
  style?: CSSProperties;
  onClick?: () => void;
}

export const Card = ({ children, className, padding = 20, style, onClick }: CardProps) => {
  return (
    <div
      className={classNames(styles.card, { [styles.clickable]: !!onClick }, [className])}
      style={{ padding, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
