import { useState } from 'react';
import { Card, Icon, Button, Skeleton, WidgetError, WidgetSkeleton } from '@/shared/ui';
import { useGetServicesQuery, type ServiceDTO } from '@/entities/services';
import type { BusinessType } from '@/shared/config/businessTypes';
import { ServiceFormModal } from './ServiceFormModal';
import styles from './ServicesWidget.module.scss';

export const ServicesWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetServicesQuery(type);
  const [editing, setEditing] = useState<ServiceDTO | null | undefined>(undefined);

  if (isLoading) {
    return (
      <WidgetSkeleton>
        <div className={styles.wrap}>
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} padding={18}>
                <Skeleton width={44} height={44} radius={14} style={{ marginBottom: 14 }} />
                <Skeleton width="70%" height={15} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={12} />
              </Card>
            ))}
          </div>
        </div>
      </WidgetSkeleton>
    );
  }
  if (isError || !data) return <div className={styles.wrap}><WidgetError onRetry={refetch} /></div>;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button onClick={() => setEditing(null)}><Icon name="add" size={19} />Добавить услугу</Button>
      </div>
      <div className={styles.grid}>
        {data.services.map((s) => (
          <Card key={s.id} padding={18} className={styles.card} onClick={() => setEditing(s)}>
            <span className={styles.iconBox}><Icon name={s.icon} fill size={22} color="var(--accent)" /></span>
            <div className={styles.name}>{s.name}</div>
            <div className={styles.meta}>{s.durationMin} мин</div>
            <div className={styles.price}>{s.price}</div>
          </Card>
        ))}
      </div>
      <ServiceFormModal
        key={editing?.id ?? 'new'}
        open={editing !== undefined}
        type={type}
        service={editing ?? null}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
};
