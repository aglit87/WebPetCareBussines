import { useState } from 'react';
import { Modal, Button, Icon, ConfirmDelete, FormError, AvatarUpload } from '@/shared/ui';
import { useCreateDriverMutation, useUpdateDriverMutation, useDeleteDriverMutation, type DriverDTO, type DriverStatus } from '@/entities/drivers';
import type { BusinessType } from '@/shared/config/businessTypes';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import styles from './DriverFormModal.module.scss';

interface Props {
  open: boolean;
  type: BusinessType;
  driver: DriverDTO | null; // null = создание
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{ value: DriverStatus; label: string }> = [
  { value: 'online', label: 'На линии' },
  { value: 'busy', label: 'В поездке' },
  { value: 'offline', label: 'Не на смене' },
];

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/initials/svg?seed=PC';

export const DriverFormModal = ({ open, type, driver, onClose }: Props) => {
  const isEdit: boolean = !!driver;
  const [name, setName] = useState<string>(driver?.name ?? '');
  const [avatar, setAvatar] = useState<string>(driver?.avatar ?? '');
  const [phone, setPhone] = useState<string>(driver?.phone ?? '');
  const [status, setStatus] = useState<DriverStatus>(driver?.status ?? 'offline');
  const [tripsToday, setTripsToday] = useState<number>(driver?.tripsToday ?? 0);
  const [rating, setRating] = useState<number>(driver?.rating ?? 5);
  const [x, setX] = useState<number>(driver?.x ?? 50);
  const [y, setY] = useState<number>(driver?.y ?? 50);
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [createDriver, { isLoading: creating }] = useCreateDriverMutation();
  const [updateDriver, { isLoading: updating }] = useUpdateDriverMutation();
  const [deleteDriver, { isLoading: deleting }] = useDeleteDriverMutation();
  const saving: boolean = creating || updating;

  const clampedX = Math.min(100, Math.max(0, x));
  const clampedY = Math.min(100, Math.max(0, y));

  const handleSave = async () => {
    setError(null);
    const payload = { name, avatar, phone, status, tripsToday, rating, x, y };
    try {
      if (driver) await updateDriver({ id: driver.id, type, ...payload }).unwrap();
      else await createDriver({ type, ...payload }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!driver) return;
    setError(null);
    try {
      await deleteDriver({ id: driver.id, type }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Изменить водителя' : 'Новый водитель'} onClose={onClose} closeDisabled={saving || deleting}>
      {confirmingDelete ? (
        <ConfirmDelete
          message={`Удалить водителя «${driver?.name}»? Это действие нельзя отменить.`}
          deleting={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : (
        <>
          <FormError message={error} />
          <AvatarUpload label="Фото водителя" value={avatar} onChange={setAvatar} fallback={FALLBACK_AVATAR} />
          <label className={styles.field}><span>Имя</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Павел Морозов" /></label>
          <label className={styles.field}><span>Телефон</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" /></label>
          <label className={styles.field}>
            <span>Статус</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as DriverStatus)}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <div className={styles.row2}>
            <label className={styles.field}><span>Поездок сегодня</span><input type="number" min={0} value={tripsToday} onChange={(e) => setTripsToday(Number(e.target.value))} /></label>
            <label className={styles.field}><span>Рейтинг</span><input type="number" step="0.1" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} /></label>
          </div>
          <div className={styles.row2}>
            <label className={styles.field}><span>Позиция X (0–100)</span><input type="number" min="0" max="100" value={x} onChange={(e) => setX(Number(e.target.value))} /></label>
            <label className={styles.field}><span>Позиция Y (0–100)</span><input type="number" min="0" max="100" value={y} onChange={(e) => setY(Number(e.target.value))} /></label>
          </div>
          <div className={styles.posPreview}>
            <span className={styles.posDot} style={{ left: `${clampedX}%`, top: `${clampedY}%` }} />
          </div>

          <div className={styles.actions}>
            {isEdit && (
              <Button variant="ghost" onClick={() => setConfirmingDelete(true)} className={styles.deleteBtn}>
                <Icon name="delete" size={18} />Удалить
              </Button>
            )}
            <div className={styles.spacer} />
            <Button variant="secondary" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSave} disabled={saving || !name.trim() || !phone.trim()}>
              {saving ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
