import { useState } from 'react';
import { Modal, Button, Icon, ConfirmDelete, FormError } from '@/shared/ui';
import { useUpdateReviewReplyMutation, useDeleteReviewMutation, REVIEW_REPLY_MAX_LENGTH, type ReviewDTO } from '@/entities/reviews';
import type { BusinessType } from '@/shared/config/businessTypes';
import { classNames } from '@/shared/lib/classNames';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
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
  const [error, setError] = useState<string | null>(null);
  const [updateReply, { isLoading: saving }] = useUpdateReviewReplyMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

  if (!review) return null;

  const overLimit: boolean = reply.length > REVIEW_REPLY_MAX_LENGTH;

  const handleSaveReply = async () => {
    setError(null);
    try {
      await updateReply({ id: review.id, type, reply }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteReview({ id: review.id, type }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} title="Отзыв" onClose={onClose} closeDisabled={saving || deleting}>
      {confirmingDelete ? (
        <ConfirmDelete
          message={`Удалить отзыв «${review.name}»? Это действие нельзя отменить.`}
          deleting={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : (
        <>
          <FormError message={error} />
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
            <textarea
              rows={4}
              maxLength={REVIEW_REPLY_MAX_LENGTH + 50}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Спасибо за отзыв!"
            />
            <span className={classNames(styles.charCount, { [styles.charCountOver]: overLimit })}>
              {reply.length} / {REVIEW_REPLY_MAX_LENGTH}
            </span>
          </label>

          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => setConfirmingDelete(true)} className={styles.deleteBtn}>
              <Icon name="delete" size={18} />Удалить отзыв
            </Button>
            <div className={styles.spacer} />
            <Button variant="secondary" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSaveReply} disabled={saving || !reply.trim() || overLimit}>
              {saving ? 'Сохранение…' : review.reply ? 'Изменить ответ' : 'Ответить'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
