import { useState } from 'react';
import { Card, Icon, Button, Skeleton } from '@/shared/ui';
import { useGetReviewsQuery, type ReviewDTO } from '@/entities/reviews';
import type { BusinessType } from '@/shared/config/businessTypes';
import { ReviewReplyModal } from './ReviewReplyModal';
import styles from './ReviewsWidget.module.scss';

const Stars = ({ rating }: { rating: number }) => {
  return (
    <span className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" fill={i < rating} size={15} color={i < rating ? '#E8902B' : '#D8E0EC'} />
      ))}
    </span>
  );
};

export const ReviewsWidget = ({ type }: { type: BusinessType }) => {
  const { data, isLoading, isError, refetch } = useGetReviewsQuery(type);
  const [editing, setEditing] = useState<ReviewDTO | undefined>(undefined);

  if (isLoading) return <ReviewsSkeleton />;
  if (isError || !data) return <ReviewsError onRetry={refetch} />;

  return (
    <div className={styles.wrap}>
      <Card padding={20} className={styles.summary}>
        <span className={styles.summaryValue}>{data.avgRating.toFixed(1)}</span>
        <div>
          <Stars rating={Math.round(data.avgRating)} />
          <div className={styles.summaryCount}>{data.count} отзывов</div>
        </div>
      </Card>

      <div className={styles.list}>
        {data.reviews.map((r) => (
          <Card key={r.id} padding={18} onClick={() => setEditing(r)}>
            <div className={styles.head}>
              <img className={styles.avatar} src={r.avatar} alt="" />
              <div className={styles.rowMain}>
                <div className={styles.name}>{r.name}</div>
                <Stars rating={r.rating} />
              </div>
              <span className={styles.date}>{r.date}</span>
            </div>
            <p className={styles.text}>{r.text}</p>
            {r.reply && (
              <div className={styles.reply}>
                <Icon name="reply" size={15} color="var(--accent)" />
                {r.reply}
              </div>
            )}
          </Card>
        ))}
      </div>

      <ReviewReplyModal
        key={editing?.id ?? 'none'}
        open={editing !== undefined}
        type={type}
        review={editing ?? null}
        onClose={() => setEditing(undefined)}
      />
    </div>
  );
};

const ReviewsError = ({ onRetry }: { onRetry: () => void }) => {
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

const ReviewsSkeleton = () => {
  return (
    <div className={styles.wrap}>
      <Card padding={20}>
        <Skeleton width={160} height={40} />
      </Card>
      <div className={styles.list}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} padding={18}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 10 }} />
            <Skeleton width="90%" height={13} style={{ marginBottom: 6 }} />
            <Skeleton width="70%" height={13} />
          </Card>
        ))}
      </div>
    </div>
  );
};
