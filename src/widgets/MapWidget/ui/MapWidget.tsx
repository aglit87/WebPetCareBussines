import { Card, Badge, Icon, Skeleton, WidgetError, WidgetSkeleton } from '@/shared/ui';
import { useGetDriversQuery, type DriverDTO, type DriverStatus } from '@/entities/drivers';
import type { BusinessType } from '@/shared/config/businessTypes';
import styles from './MapWidget.module.scss';

const STATUS_DOT: Record<DriverStatus, { color: string; label: string }> = {
  online: { color: '#3E8C42', label: 'На линии' },
  busy: { color: '#E07B1E', label: 'В поездке' },
  offline: { color: '#9fb0c8', label: 'Не на смене' },
};

export const MapWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetDriversQuery(type);

  if (isLoading) {
    return (
      <WidgetSkeleton>
        <div className={styles.wrap}>
          <Card padding={0} className={styles.mapCard}>
            <Skeleton height={320} radius={0} />
          </Card>
          <Card padding={16}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={44} radius={10} style={{ marginBottom: 10, opacity: 1 - i * 0.15 }} />
            ))}
          </Card>
        </div>
      </WidgetSkeleton>
    );
  }
  if (isError || !data) return <div className={styles.wrap}><WidgetError onRetry={refetch} /></div>;

  const active: DriverDTO[] = data.drivers.filter((d) => d.status !== 'offline');

  return (
    <div className={styles.wrap}>
      <Card padding={0} className={styles.mapCard}>
        <div className={styles.canvas}>
          {data.drivers.map((d) => (
            <span
              key={d.id}
              className={styles.pin}
              style={{ left: `${d.x}%`, top: `${d.y}%`, background: STATUS_DOT[d.status].color }}
              title={`${d.name} · ${STATUS_DOT[d.status].label}`}
            >
              <Icon name="local_taxi" fill size={14} color="#fff" />
            </span>
          ))}
        </div>
      </Card>

      <Card padding={16}>
        <h3 className={styles.cardTitle}>На линии сейчас · {active.length}</h3>
        <div className={styles.list}>
          {active.map((d) => (
            <div key={d.id} className={styles.row}>
              <span className={styles.dot} style={{ background: STATUS_DOT[d.status].color }} />
              <div className={styles.rowMain}>
                <div className={styles.rowTitle}>{d.name}</div>
                <div className={styles.rowSub}>{d.tripsToday} поездок сегодня</div>
              </div>
              <Badge tone={d.status === 'busy' ? 'warning' : 'success'}>{STATUS_DOT[d.status].label}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
