import type { CSSProperties } from 'react';
import styles from './Skeleton.module.scss';

export const Skeleton = ({ width, height, radius = 10, style }: { width?: number | string; height?: number | string; radius?: number; style?: CSSProperties }) => {
  return <span className={styles.sk} style={{ width, height, borderRadius: radius, ...style }} />;
};
