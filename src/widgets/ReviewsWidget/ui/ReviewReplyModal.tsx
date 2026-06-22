import { useState } from 'react';
import { Modal, Button, Icon } from '@/shared/ui';
import { useUpdateReviewReplyMutation, useDeleteReviewMutation, type ReviewDTO } from '@/entities/reviews';
import type { BusinessType } from '@/shared/config/businessTypes';
import styles from './ReviewReplyModal.module.scss';

interface Props {
  open: boolean;
  type: BusinessType;
  review: ReviewDTO | null;
  onClose: () => void;
}

const Stars = ({ rating }: { rating: number }) => {
  return (
    <span className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" fill={i < rating} size={14} color={i < rating ? '#E8902B' : '#D8E0EC'} />
      ))}
    </span>
  );
};

export const ReviewReplyModal = ({ open, type, review, onClose }: Props) => {
  const [reply, setReply] = useState<string>(review?.reply ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [updateReply, { isLoading: saving }] = useUpdateReviewReplyMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

  if (!review) return null;

  const handleSaveReply = async () => {
    await updateReply({ id: review.id, type, reply });
    onClose();
  };

  const handleDelete = async () => {
    await deleteReview({ id: review.id, type });
    onClose();
  };

  return (
    <Modal open={open} title="Отзыв" onClose={onClose}>
      {confirmingDelete ? (
        <div className={styles.confirm}>
          <p>Удалить отзыв «{review.name}»? Это действие нельзя отменить.</p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>Отмена</Button>
            <Button onClick={handleDelete} disabled={deleting}>{deleting ? 'Удаление…' : 'Удалить'}</Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.reviewHead}>
            <img src={review.avatar} alt="" className={styles.avatar} />
            <div className={styles.rowMain}>
              <div className={styles.name}>{review.name}</div>
              <div className={styles.meta}><Stars rating={review.rating} /><span>{review.date}</span></div>
            </div>
          </div>
          <p className={styles.text}>{review.text}</p>

          <label className={styles.field}>
            <span>Ответ от бизнеса</span>
            <textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Спасибо за отзыв!" />
          </label>

          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => setConfirmingDelete(true)} className={styles.deleteBtn}>
              <Icon name="delete" size={18} />Удалить отзыв
            </Button>
            <div className={styles.spacer} />
            <Button variant="secondary" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSaveReply} disabled={saving}>
              {saving ? 'Сохранение…' : review.reply ? 'Изменить ответ' : 'Ответить'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
