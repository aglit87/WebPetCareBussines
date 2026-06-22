import { useState } from 'react';
import { Card, Badge, Icon, Button, Skeleton } from '@/shared/ui';
import { useGetClientsQuery, type ClientDTO } from '@/entities/clients';
import type { BusinessType } from '@/shared/config/businessTypes';
import { ClientFormModal } from './ClientFormModal';
import styles from './ClientsWidget.module.scss';

export const ClientsWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetClientsQuery(type);
  const [editing, setEditing] = useState<ClientDTO | null | undefined>(undefined);

  if (isLoading) return <ClientsSkeleton />;
  if (isError || !data) return <ClientsError onRetry={refetch} />;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button onClick={() => setEditing(null)}><Icon name="add" size={19} />Добавить клиента</Button>
      </div>
      {data.clients.length === 0 ? (
        <ClientsEmpty />
      ) : (
        <Card padding={0}>
          {data.clients.map((c) => (
            <div key={c.id} className={styles.row} onClick={() => setEditing(c)}>
              <img className={styles.avatar} src={c.avatar} alt="" />
              <div className={styles.rowMain}>
                <div className={styles.rowTitle}>{c.name}</div>
                <div className={styles.rowSub}>{c.pets} · {c.phone}</div>
              </div>
              <div className={styles.lastVisit}>
                <div className={styles.lastVisitLabel}>Был(а)</div>
                <div className={styles.lastVisitValue}>{c.lastVisit}</div>
              </div>
              <span className={styles.amount}>{c.totalSpent}</span>
              <Badge tone="accent">{c.visits} визит{plural(c.visits)}</Badge>
            </div>
          ))}
        </Card>
      )}
      <ClientFormModal
        key={editing?.id ?? 'new'}
        open={editing !== undefined}
        type={type}
        client={editing ?? null}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
};

const plural = (n: number): string => {
  const mod10: number = n % 10;
  const mod100: number = n % 100;
  if (mod10 === 1 && mod100 !== 11) return '';
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'а';
  return 'ов';
};

const ClientsEmpty = () => {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, var(--accent-tint), #fff)' }}>
        <Icon name="person_off" size={56} color="var(--accent)" />
      </span>
      <div className={styles.stateTitle}>Пока нет клиентов</div>
      <div className={styles.stateText}>Здесь появятся клиенты, как только они оставят первую запись.</div>
    </div>
  );
};

const ClientsError = ({ onRetry }: { onRetry: () => void }) => {
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

const ClientsSkeleton = () => {
  return (
    <div className={styles.wrap}>
      <Card padding={20}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={52} radius={12} style={{ marginBottom: 12, opacity: 1 - i * 0.1 }} />
        ))}
      </Card>
    </div>
  );
};
