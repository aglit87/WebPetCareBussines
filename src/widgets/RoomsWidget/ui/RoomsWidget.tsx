import { useState } from 'react';
import { Card, Badge, Icon, Button, Skeleton, WidgetError, WidgetSkeleton } from '@/shared/ui';
import { useGetRoomsQuery, type RoomDTO, type RoomStatus } from '@/entities/rooms';
import type { BusinessType } from '@/shared/config/businessTypes';
import { RoomFormModal } from './RoomFormModal';
import styles from './RoomsWidget.module.scss';

const STATUS_TONE: Record<RoomStatus, { tone: 'success' | 'warning' | 'neutral'; label: string }> = {
  occupied: { tone: 'warning', label: 'Занят' },
  free: { tone: 'success', label: 'Свободен' },
  cleaning: { tone: 'neutral', label: 'Уборка' },
};

export const RoomsWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetRoomsQuery(type);
  const [editing, setEditing] = useState<RoomDTO | null | undefined>(undefined);

  if (isLoading) {
    return (
      <WidgetSkeleton>
        <div className={styles.wrap}>
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} padding={18}>
                <Skeleton width="50%" height={16} style={{ marginBottom: 14 }} />
                <Skeleton width="70%" height={12} style={{ marginBottom: 10 }} />
                <Skeleton width="90%" height={12} />
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
        <Button onClick={() => setEditing(null)}><Icon name="add" size={19} />Добавить номер</Button>
      </div>
      {data.rooms.length === 0 ? (
        <RoomsEmpty />
      ) : (
        <div className={styles.grid}>
          {data.rooms.map((r) => {
            const st: { tone: 'success' | 'warning' | 'neutral'; label: string } = STATUS_TONE[r.status];
            return (
              <Card key={r.id} padding={18} className={styles.card} onClick={() => setEditing(r)}>
                <div className={styles.cardHead}>
                  <span className={styles.number}>{r.number}</span>
                  <Badge tone={st.tone}>{st.label}</Badge>
                </div>
                <div className={styles.kind}>{r.kind}</div>
                {r.status === 'occupied' ? (
                  <div className={styles.guest}>
                    <div className={styles.guestPet}>{r.pet}</div>
                    <div className={styles.guestClient}>{r.client}</div>
                    <div className={styles.guestCheckout}><Icon name="logout" size={14} color="#6b7a92" /> до {r.checkout}</div>
                  </div>
                ) : (
                  <div className={styles.empty}>—</div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      <RoomFormModal
        key={editing?.id ?? 'new'}
        open={editing !== undefined}
        type={type}
        room={editing ?? null}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
};

const RoomsEmpty = () => {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, var(--accent-tint), #fff)' }}>
        <Icon name="meeting_room" size={56} color="var(--accent)" />
      </span>
      <div className={styles.stateTitle}>Номера не настроены</div>
      <div className={styles.stateText}>Добавьте номера, чтобы принимать заезды питомцев.</div>
    </div>
  );
};
