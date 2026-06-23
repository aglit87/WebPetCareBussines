import { useState } from 'react';
import { Modal, Button, Icon, ConfirmDelete, FormError } from '@/shared/ui';
import { useCreateRoomMutation, useUpdateRoomMutation, useDeleteRoomMutation, type RoomDTO, type RoomStatus } from '@/entities/rooms';
import type { BusinessType } from '@/shared/config/businessTypes';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import styles from './RoomFormModal.module.scss';

interface Props {
  open: boolean;
  type: BusinessType;
  room: RoomDTO | null; // null = создание
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{ value: RoomStatus; label: string }> = [
  { value: 'free', label: 'Свободен' },
  { value: 'occupied', label: 'Занят' },
  { value: 'cleaning', label: 'Уборка' },
];

export const RoomFormModal = ({ open, type, room, onClose }: Props) => {
  const isEdit: boolean = !!room;
  const [number, setNumber] = useState<string>(room?.number ?? '');
  const [kind, setKind] = useState<string>(room?.kind ?? 'Стандартный');
  const [status, setStatus] = useState<RoomStatus>(room?.status ?? 'free');
  const [pet, setPet] = useState<string>(room?.pet ?? '');
  const [client, setClient] = useState<string>(room?.client ?? '');
  const [checkout, setCheckout] = useState<string>(room?.checkout ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [createRoom, { isLoading: creating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: updating }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: deleting }] = useDeleteRoomMutation();
  const saving: boolean = creating || updating;
  const occupied: boolean = status === 'occupied';

  const handleSave = async () => {
    setError(null);
    const payload = {
      number,
      kind,
      status,
      pet: occupied ? pet : undefined,
      client: occupied ? client : undefined,
      checkout: occupied ? checkout : undefined,
    };
    try {
      if (room) await updateRoom({ id: room.id, type, ...payload }).unwrap();
      else await createRoom({ type, ...payload }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!room) return;
    setError(null);
    try {
      await deleteRoom({ id: room.id, type }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Изменить номер' : 'Новый номер'} onClose={onClose} closeDisabled={saving || deleting}>
      {confirmingDelete ? (
        <ConfirmDelete
          message={`Удалить номер «${room?.number}»? Это действие нельзя отменить.`}
          deleting={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : (
        <>
          <FormError message={error} />
          <div className={styles.row2}>
            <label className={styles.field}><span>Номер</span><input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="№1" /></label>
            <label className={styles.field}><span>Тип</span><input value={kind} onChange={(e) => setKind(e.target.value)} placeholder="Стандартный" /></label>
          </div>
          <label className={styles.field}>
            <span>Статус</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as RoomStatus)}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          {status === 'occupied' && (
            <>
              <label className={styles.field}><span>Питомец</span><input value={pet} onChange={(e) => setPet(e.target.value)} placeholder="Гера" /></label>
              <label className={styles.field}><span>Клиент</span><input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Олег Дроздов" /></label>
              <label className={styles.field}><span>Выезд до</span><input value={checkout} onChange={(e) => setCheckout(e.target.value)} placeholder="30 июня" /></label>
            </>
          )}

          <div className={styles.actions}>
            {isEdit && (
              <Button variant="ghost" onClick={() => setConfirmingDelete(true)} className={styles.deleteBtn}>
                <Icon name="delete" size={18} />Удалить
              </Button>
            )}
            <div className={styles.spacer} />
            <Button variant="secondary" onClick={onClose}>Отмена</Button>
            <Button
              onClick={handleSave}
              disabled={saving || !number.trim() || !kind.trim() || (occupied && (!pet.trim() || !client.trim() || !checkout.trim()))}
            >
              {saving ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
