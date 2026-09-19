import { useState } from 'react';
import { Card, Badge, Icon, Button, Skeleton, WidgetError, WidgetSkeleton } from '@/shared/ui';
import { useGetRecordsQuery, type RecordDTO, type RecordStatus } from '@/entities/records';
import type { BusinessType } from '@/shared/config/businessTypes';
import { RecordFormModal } from './RecordFormModal';
import styles from './RecordsWidget.module.scss';

const STATUS_TONE: Record<RecordStatus, { tone: 'success' | 'warning' | 'neutral' | 'danger' | 'accent'; label: string }> = {
  paid: { tone: 'success', label: 'Оплачено' },
  onsite: { tone: 'warning', label: 'При визите' },
  later: { tone: 'neutral', label: 'Запланировано' },
  done: { tone: 'accent', label: 'Выполнено' },
  cancelled: { tone: 'danger', label: 'Отменено' },
};

const groupByDate = (records: RecordDTO[]): Array<[string, RecordDTO[]]> => {
  const groups: Array<[string, RecordDTO[]]> = [];
  for (const r of records) {
    const last: [string, RecordDTO[]] | undefined = groups[groups.length - 1];
    if (last && last[0] === r.date) last[1].push(r);
    else groups.push([r.date, [r]]);
  }
  return groups;
};

export const RecordsWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetRecordsQuery(type);
  const [editing, setEditing] = useState<RecordDTO | null | undefined>(undefined);

  if (isLoading) {
    return (
      <WidgetSkeleton>
        <div className={styles.wrap}>
          <Card padding={20}>
            <Skeleton width={90} height={13} style={{ marginBottom: 16 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={52} radius={12} style={{ marginBottom: 12, opacity: 1 - i * 0.12 }} />
            ))}
          </Card>
        </div>
      </WidgetSkeleton>
    );
  }
  if (isError || !data) return <div className={styles.wrap}><WidgetError onRetry={refetch} /></div>;

  const groups: Array<[string, RecordDTO[]]> = groupByDate(data.records);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button onClick={() => setEditing(null)}><Icon name="add" size={19} />Добавить запись</Button>
      </div>
      {data.records.length === 0 ? (
        <RecordsEmpty />
      ) : (
        <Card padding={0}>
          {groups.map(([date, records]) => (
            <div key={date} className={styles.group}>
              <div className={styles.groupTitle}>{date}</div>
              {records.map((r) => {
                const st: { tone: 'success' | 'warning' | 'neutral' | 'danger' | 'accent'; label: string } = STATUS_TONE[r.status];
                return (
                  <div key={r.id} className={styles.row} onClick={() => setEditing(r)}>
                    <span className={styles.time}>{r.time}</span>
                    <img className={styles.avatar} src={r.avatar} alt="" />
                    <div className={styles.rowMain}>
                      <div className={styles.rowTitle}>{r.pet}</div>
                      <div className={styles.rowSub}>{r.client} · {r.service}</div>
                    </div>
                    <span className={styles.amount}>{r.amount}</span>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      )}
      <RecordFormModal
        key={editing?.id ?? 'new'}
        open={editing !== undefined}
        type={type}
        record={editing ?? null}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
};

const RecordsEmpty = () => {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, var(--accent-tint), #fff)' }}>
        <Icon name="event_busy" size={56} color="var(--accent)" />
      </span>
      <div className={styles.stateTitle}>Пока нет записей</div>
      <div className={styles.stateText}>Здесь появятся записи клиентов, как только они будут созданы.</div>
    </div>
  );
};
