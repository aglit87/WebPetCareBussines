import { Card, Icon, Button, Skeleton } from '@/shared/ui';
import { useGetScheduleQuery } from '@/entities/schedule';
import type { BusinessType } from '@/shared/config/businessTypes';
import styles from './ScheduleWidget.module.scss';

export const ScheduleWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetScheduleQuery(type);

  if (isLoading) return <ScheduleSkeleton />;
  if (isError || !data) return <ScheduleError onRetry={refetch} />;

  return (
    <div className={styles.wrap}>
      <Card padding={0}>
        <div className={styles.header}>{data.date}</div>
        {data.slots.map((s) => (
          <div key={s.time} className={s.status === 'busy' ? styles.rowBusy : styles.rowFree}>
            <span className={styles.time}>{s.time}</span>
            {s.status === 'busy' ? (
              <div className={styles.rowMain}>
                <div className={styles.rowTitle}>{s.pet}</div>
                <div className={styles.rowSub}>{s.client} · {s.service}</div>
              </div>
            ) : (
              <div className={styles.rowFreeText}>
                <Icon name="add" size={16} color="var(--accent)" />
                Свободно
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

const ScheduleError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.state}>
        <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, #FCE4EC, #FFF1F5)' }}>
          <Icon name="cloud_off" size={56} color="#EE7BA0" />
        </span>
        <div className={styles.stateTitle}>Нет соединения с сервером</div>
        <div className={styles.stateText}>Проверьте подключение и попробуйте снова — данные сохранены.</div>
        <Button size="lg" onClick={onRetry}><Icon name="refresh" size={19} />Повторить</Button>
      </div>
    </div>
  );
};

const ScheduleSkeleton = () => {
  return (
    <div className={styles.wrap}>
      <Card padding={20}>
        <Skeleton width={150} height={14} style={{ marginBottom: 18 }} />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} height={44} radius={12} style={{ marginBottom: 10, opacity: 1 - i * 0.08 }} />
        ))}
      </Card>
    </div>
  );
};
