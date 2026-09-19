import { useState } from 'react';
import { Card, Badge, Icon, Button, Skeleton, WidgetError, WidgetSkeleton } from '@/shared/ui';
import { useGetDriversQuery, type DriverDTO, type DriverStatus } from '@/entities/drivers';
import type { BusinessType } from '@/shared/config/businessTypes';
import { DriverFormModal } from './DriverFormModal';
import styles from './DriversWidget.module.scss';

const STATUS_TONE: Record<DriverStatus, { tone: 'success' | 'warning' | 'neutral'; label: string }> = {
  online: { tone: 'success', label: 'На линии' },
  busy: { tone: 'warning', label: 'В поездке' },
  offline: { tone: 'neutral', label: 'Не на смене' },
};

export const DriversWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetDriversQuery(type);
  const [editing, setEditing] = useState<DriverDTO | null | undefined>(undefined);

  if (isLoading) {
    return (
      <WidgetSkeleton>
        <div className={styles.wrap}>
          <Card padding={20}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={52} radius={12} style={{ marginBottom: 12, opacity: 1 - i * 0.15 }} />
            ))}
          </Card>
        </div>
      </WidgetSkeleton>
    );
  }
  if (isError || !data) return <div className={styles.wrap}><WidgetError onRetry={refetch} /></div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button onClick={() => setEditing(null)}><Icon name="add" size={19} />Добавить водителя</Button>
      </div>
      {data.drivers.length === 0 ? (
        <DriversEmpty />
      ) : (
        <Card padding={0}>
          {data.drivers.map((d) => {
            const st: { tone: 'success' | 'warning' | 'neutral'; label: string } = STATUS_TONE[d.status];
            return (
              <div key={d.id} className={styles.row} onClick={() => setEditing(d)}>
                <img className={styles.avatar} src={d.avatar} alt="" />
                <div className={styles.rowMain}>
                  <div className={styles.rowTitle}>{d.name}</div>
                  <div className={styles.rowSub}>{d.phone} · {d.tripsToday} поездок сегодня</div>
                </div>
                <span className={styles.rating}><Icon name="star" fill size={14} color="#E8902B" />{d.rating.toFixed(1)}</span>
                <Badge tone={st.tone}>{st.label}</Badge>
              </div>
            );
          })}
        </Card>
      )}
      <DriverFormModal
        key={editing?.id ?? 'new'}
        open={editing !== undefined}
        type={type}
        driver={editing ?? null}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
};

const DriversEmpty = () => {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, var(--accent-tint), #fff)' }}>
        <Icon name="directions_car" size={56} color="var(--accent)" />
      </span>
      <div className={styles.stateTitle}>Пока нет водителей</div>
      <div className={styles.stateText}>Добавьте водителей, чтобы принимать заказы на поездки.</div>
    </div>
  );
};
