import { Card } from '@/shared/ui/Card/Card';
import { Icon } from '@/shared/ui/Icon/Icon';
import styles from './StatCard.module.scss';

export interface StatCardProps {
  icon: string;
  iconColor: string;
  iconTint: string;
  value: string;
  label: string;
  delta?: string;
  deltaPositive?: boolean;
}

export const StatCard = ({ icon, iconColor, iconTint, value, label, delta, deltaPositive = true }: StatCardProps) => {
  return (
    <Card padding={20} className={styles.stat}>
      <div className={styles.head}>
        <span className={styles.iconBox} style={{ background: iconTint }}>
          <Icon name={icon} fill size={21} color={iconColor} />
        </span>
        {delta && (
          <span className={styles.delta} data-positive={deltaPositive}>
            {delta}
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </Card>
  );
};
