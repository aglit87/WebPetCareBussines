import { useState } from 'react';
import { Modal, Button, Icon, ConfirmDelete, FormError, DatePicker, AvatarUpload } from '@/shared/ui';
import { useCreateRecordMutation, useUpdateRecordMutation, useDeleteRecordMutation, type RecordDTO, type RecordStatus } from '@/entities/records';
import type { BusinessType } from '@/shared/config/businessTypes';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import styles from './RecordFormModal.module.scss';

interface Props {
  open: boolean;
  type: BusinessType;
  record: RecordDTO | null; // null = создание
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{ value: RecordStatus; label: string }> = [
  { value: 'paid', label: 'Оплачено' },
  { value: 'onsite', label: 'При визите' },
  { value: 'later', label: 'Запланировано' },
  { value: 'done', label: 'Выполнено' },
  { value: 'cancelled', label: 'Отменено' },
];

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/initials/svg?seed=PC';

export const RecordFormModal = ({ open, type, record, onClose }: Props) => {
  const isEdit: boolean = !!record;
  const [date, setDate] = useState<string>(record?.date ?? 'Сегодня');
  const [time, setTime] = useState<string>(record?.time ?? '');
  const [pet, setPet] = useState<string>(record?.pet ?? '');
  const [client, setClient] = useState<string>(record?.client ?? '');
  const [service, setService] = useState<string>(record?.service ?? '');
  const [amount, setAmount] = useState<string>(record?.amount ?? '');
  const [status, setStatus] = useState<RecordStatus>(record?.status ?? 'later');
  const [avatar, setAvatar] = useState<string>(record?.avatar ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [createRecord, { isLoading: creating }] = useCreateRecordMutation();
  const [updateRecord, { isLoading: updating }] = useUpdateRecordMutation();
  const [deleteRecord, { isLoading: deleting }] = useDeleteRecordMutation();
  const saving: boolean = creating || updating;

  const handleSave = async () => {
    setError(null);
    const payload = { date, time, pet, client, service, amount, status, avatar };
    try {
      if (record) await updateRecord({ id: record.id, type, ...payload }).unwrap();
      else await createRecord({ type, ...payload }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!record) return;
    setError(null);
    try {
      await deleteRecord({ id: record.id, type }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Изменить запись' : 'Новая запись'} onClose={onClose} closeDisabled={saving || deleting}>
      {confirmingDelete ? (
        <ConfirmDelete
          message={`Удалить запись «${record?.pet}»? Это действие нельзя отменить.`}
          deleting={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : (
        <>
          <FormError message={error} />
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>Дата</span>
              <DatePicker value={date} onPick={setDate} placeholder="Выберите дату" />
            </label>
            <label className={styles.field}><span>Время</span><input value={time} onChange={(e) => setTime(e.target.value)} placeholder="14:00" /></label>
          </div>
          <label className={styles.field}><span>Питомец</span><input value={pet} onChange={(e) => setPet(e.target.value)} placeholder="Мявра" /></label>
          <label className={styles.field}><span>Клиент</span><input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Анна Кузнецова" /></label>
          <label className={styles.field}><span>Услуга</span><input value={service} onChange={(e) => setService(e.target.value)} placeholder="Осмотр терапевта" /></label>
          <div className={styles.row2}>
            <label className={styles.field}><span>Сумма</span><input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="800 ₽" /></label>
            <label className={styles.field}>
              <span>Статус</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as RecordStatus)}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>
          <AvatarUpload label="Фото питомца" value={avatar} onChange={setAvatar} fallback={FALLBACK_AVATAR} />

          <div className={styles.actions}>
            {isEdit && (
              <Button variant="ghost" onClick={() => setConfirmingDelete(true)} className={styles.deleteBtn}>
                <Icon name="delete" size={18} />Удалить
              </Button>
            )}
            <div className={styles.spacer} />
            <Button variant="secondary" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSave} disabled={saving || !pet.trim() || !client.trim() || !time.trim()}>
              {saving ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
