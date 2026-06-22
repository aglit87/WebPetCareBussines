import { Card, StatCard, Badge, Icon, Button, Skeleton } from '@/shared/ui';
import { useGetDashboardQuery, type AppointmentStatus } from '@/entities/dashboard';
import type { BusinessType } from '@/shared/config/businessTypes';
import styles from './DashboardWidget.module.scss';

const STATUS_TONE: Record<AppointmentStatus, { tone: 'success' | 'warning' | 'neutral'; label: string }> = {
  paid: { tone: 'success', label: 'Оплачено' },
  onsite: { tone: 'warning', label: 'При визите' },
  later: { tone: 'neutral', label: 'Позже' },
};

export const DashboardWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery(type);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <DashboardError onRetry={refetch} />;

  return (
    <div className={styles.root}>
      <div className={styles.stats}>
        {data.stats.map((s) => (
          <StatCard key={s.id} {...s} />
        ))}
      </div>

      <div className={styles.cols}>
        <Card padding={20}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Сегодня · расписание</h3>
            <button type="button" className={styles.link}>Открыть</button>
          </div>
          <div className={styles.list}>
            {data.today.map((a) => {
              const st: { tone: 'success' | 'warning' | 'neutral'; label: string } = STATUS_TONE[a.status];
              return (
                <div key={a.id} className={styles.row}>
                  <span className={styles.time}>{a.time}</span>
                  <img className={styles.avatar} src={a.avatar} alt="" />
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>{a.pet}</div>
                    <div className={styles.rowSub}>{a.client}</div>
                  </div>
                  <span className={styles.amount}>{a.amount}</span>
                  <Badge tone={st.tone}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding={20}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Новые заявки</h3>
            <Badge tone="danger">{data.requests.length} новые</Badge>
          </div>
          <div className={styles.requests}>
            {data.requests.length === 0 ? (
              <EmptyRequests />
            ) : (
              data.requests.map((r) => (
                <div key={r.id} className={styles.request}>
                  <div className={styles.requestHead}>
                    <img className={styles.avatarSm} src={r.avatar} alt="" />
                    <div className={styles.rowMain}>
                      <div className={styles.rowTitle}>{r.pet}</div>
                      <div className={styles.rowSub}>{r.when} · {r.amount}</div>
                    </div>
                  </div>
                  <div className={styles.requestActions}>
                    <Button variant="secondary" className={styles.smBtn}>Отклонить</Button>
                    <Button className={styles.smBtn}>Принять</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const EmptyRequests = () => {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}><Icon name="inbox" size={40} color="#9fb8e0" /></span>
      <div className={styles.emptyTitle}>Пока нет новых заявок</div>
      <div className={styles.emptyText}>Заявки клиентов появятся здесь</div>
    </div>
  );
};

const DashboardError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, #FCE4EC, #FFF1F5)' }}>
        <Icon name="cloud_off" size={56} color="#EE7BA0" />
      </span>
      <div className={styles.stateTitle}>Нет соединения с сервером</div>
      <div className={styles.stateText}>Проверьте подключение и попробуйте снова — данные сохранены.</div>
      <Button size="lg" onClick={onRetry}><Icon name="refresh" size={19} />Повторить</Button>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className={styles.root}>
      <div className={styles.stats}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding={20}>
            <Skeleton width={40} height={40} radius={12} style={{ marginBottom: 14 }} />
            <Skeleton width="55%" height={26} style={{ marginBottom: 9 }} />
            <Skeleton width="80%" height={12} />
          </Card>
        ))}
      </div>
      <div className={styles.cols}>
        <Card padding={20}>
          <Skeleton width={170} height={18} style={{ marginBottom: 20 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={48} radius={12} style={{ marginBottom: 12, opacity: 1 - i * 0.18 }} />
          ))}
        </Card>
        <Card padding={20}>
          <Skeleton width={130} height={18} style={{ marginBottom: 18 }} />
          <Skeleton height={92} radius={14} style={{ marginBottom: 12 }} />
          <Skeleton height={92} radius={14} style={{ opacity: 0.6 }} />
        </Card>
      </div>
    </div>
  );
};
