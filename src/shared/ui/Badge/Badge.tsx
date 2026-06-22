import type { ReactNode } from 'react';
import styles from './Badge.module.scss';

type Tone = 'success' | 'warning' | 'neutral' | 'danger' | 'accent';

const TONES: Record<Tone, { bg: string; color: string }> = {
  success: { bg: '#E8F3E6', color: '#4F9A52' },
  warning: { bg: '#FFF0DB', color: '#E8902B' },
  neutral: { bg: '#EEF3FA', color: '#6b7a92' },
  danger: { bg: '#FCE4EC', color: '#E5356A' },
  accent: { bg: 'var(--accent-tint)', color: 'var(--accent)' },
};

export const Badge = ({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) => {
  const t: { bg: string; color: string } = TONES[tone];
  return (
    <span className={styles.badge} style={{ background: t.bg, color: t.color }}>
      {children}
    </span>
  );
};
