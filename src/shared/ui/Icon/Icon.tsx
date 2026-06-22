import type { CSSProperties } from 'react';
import { classNames } from '@/shared/lib/classNames';
import styles from './Icon.module.scss';

interface IconProps {
  name: string;
  fill?: boolean;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export const Icon = ({ name, fill, size = 24, color, className, style }: IconProps) => {
  return (
    <span
      className={classNames('ms', { 'ms--fill': !!fill }, [styles.icon, className])}
      style={{ fontSize: size, color, ...style }}
    >
      {name}
    </span>
  );
};
