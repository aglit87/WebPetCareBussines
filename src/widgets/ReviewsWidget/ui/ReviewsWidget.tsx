import { useState } from 'react';
import { Card, Icon, Skeleton, WidgetError, WidgetSkeleton } from '@/shared/ui';
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

  if (isLoading) {
    return (
      <WidgetSkeleton>
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
      </WidgetSkeleton>
    );
  }
  if (isError || !data) return <div className={styles.wrap}><WidgetError onRetry={refetch} /></div>;

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
