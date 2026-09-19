import { Card, StatCard, Skeleton, WidgetError, WidgetSkeleton } from '@/shared/ui';
import { useGetIncomeQuery } from '@/entities/income';
import type { BusinessType } from '@/shared/config/businessTypes';
import styles from './IncomeWidget.module.scss';

export const IncomeWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetIncomeQuery(type);

  if (isLoading) {
    return (
      <WidgetSkeleton>
        <div className={styles.wrap}>
          <div className={styles.stats}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} padding={20}>
                <Skeleton width={40} height={40} radius={12} style={{ marginBottom: 14 }} />
                <Skeleton width="55%" height={26} style={{ marginBottom: 9 }} />
                <Skeleton width="80%" height={12} />
              </Card>
            ))}
          </div>
          <Card padding={20}>
            <Skeleton width={140} height={16} style={{ marginBottom: 18 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={36} radius={10} style={{ marginBottom: 12, opacity: 1 - i * 0.12 }} />
            ))}
          </Card>
        </div>
      </WidgetSkeleton>
    );
  }
  if (isError || !data) return <div className={styles.wrap}><WidgetError onRetry={refetch} /></div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.stats}>
        {data.stats.map((s) => (
          <StatCard key={s.id} {...s} />
        ))}
      </div>

      <Card padding={20}>
        <h3 className={styles.cardTitle}>Доход по дням</h3>
        <div className={styles.days}>
          {data.days.map((d) => (
            <div key={d.id} className={styles.day}>
              <span className={styles.dayDate}>{d.date}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${d.share}%` }} />
              </div>
              <span className={styles.dayCount}>{d.count}</span>
              <span className={styles.dayAmount}>{d.amount}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
