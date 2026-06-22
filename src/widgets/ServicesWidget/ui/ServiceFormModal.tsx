import { useState } from 'react';
import { Modal, Button, Icon } from '@/shared/ui';
import { useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation, type ServiceDTO } from '@/entities/services';
import type { BusinessType } from '@/shared/config/businessTypes';
import styles from './ServiceFormModal.module.scss';

interface Props {
  open: boolean;
  type: BusinessType;
  service: ServiceDTO | null; // null = создание
  onClose: () => void;
}

export const ServiceFormModal = ({ open, type, service, onClose }: Props) => {
  const isEdit: boolean = !!service;
  const [name, setName] = useState<string>(service?.name ?? '');
  const [icon, setIcon] = useState<string>(service?.icon ?? 'medical_services');
  const [price, setPrice] = useState<string>(service?.price ?? '');
  const [durationMin, setDurationMin] = useState<number>(service?.durationMin ?? 30);
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);

  const [createService, { isLoading: creating }] = useCreateServiceMutation();
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();
  const saving: boolean = creating || updating;

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) return;
    if (service) await updateService({ id: service.id, type, name, icon, price, durationMin });
    else await createService({ type, name, icon, price, durationMin });
    onClose();
  };

  const handleDelete = async () => {
    if (!service) return;
    await deleteService({ id: service.id, type });
    onClose();
  };

  return (
    <Modal open={open} title={isEdit ? 'Изменить услугу' : 'Новая услуга'} onClose={onClose}>
      {confirmingDelete ? (
        <div className={styles.confirm}>
          <p>Удалить «{service?.name}»? Это действие нельзя отменить.</p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>Отмена</Button>
            <Button onClick={handleDelete} disabled={deleting}>{deleting ? 'Удаление…' : 'Удалить'}</Button>
          </div>
        </div>
      ) : (
        <>
          <label className={styles.field}>
            <span>Название</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Осмотр терапевта" />
          </label>
          <label className={styles.field}>
            <span>Иконка (Material Symbols)</span>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="stethoscope" />
          </label>
          <label className={styles.field}>
            <span>Цена</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="800 ₽" />
          </label>
          <label className={styles.field}>
            <span>Длительность (мин)</span>
            <input type="number" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} />
          </label>

          <div className={styles.actions}>
            {isEdit && (
              <Button variant="ghost" onClick={() => setConfirmingDelete(true)} className={styles.deleteBtn}>
                <Icon name="delete" size={18} />Удалить
              </Button>
            )}
            <div className={styles.spacer} />
            <Button variant="secondary" onClick={onClose}>Отмена</Button>
            <Button onClick={handleSave} disabled={saving || !name.trim() || !price.trim()}>
              {saving ? 'Сохранение…' : isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
