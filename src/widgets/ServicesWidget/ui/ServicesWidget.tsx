import { useState } from 'react';
import { Card, Icon, Button, Skeleton } from '@/shared/ui';
import { useGetServicesQuery, type ServiceDTO } from '@/entities/services';
import type { BusinessType } from '@/shared/config/businessTypes';
import { ServiceFormModal } from './ServiceFormModal';
import styles from './ServicesWidget.module.scss';

export const ServicesWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetServicesQuery(type);
  const [editing, setEditing] = useState<ServiceDTO | null | undefined>(undefined);

  if (isLoading) return <ServicesSkeleton />;
  if (isError || !data) return <ServicesError onRetry={refetch} />;

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

const ServicesError = ({ onRetry }: { onRetry: () => void }) => {
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

const ServicesSkeleton = () => {
  return (
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
  );
};
