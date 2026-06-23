import { useState } from 'react';
import { Modal, Button, Icon, ConfirmDelete, FormError } from '@/shared/ui';
import { useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation, type ServiceDTO } from '@/entities/services';
import type { BusinessType } from '@/shared/config/businessTypes';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
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
  const [error, setError] = useState<string | null>(null);

  const [createService, { isLoading: creating }] = useCreateServiceMutation();
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: deleting }] = useDeleteServiceMutation();
  const saving: boolean = creating || updating;

  const handleSave = async () => {
    setError(null);
    try {
      if (service) await updateService({ id: service.id, type, name, icon, price, durationMin }).unwrap();
      else await createService({ type, name, icon, price, durationMin }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    setError(null);
    try {
      await deleteService({ id: service.id, type }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Изменить услугу' : 'Новая услуга'} onClose={onClose} closeDisabled={saving || deleting}>
      {confirmingDelete ? (
        <ConfirmDelete
          message={`Удалить «${service?.name}»? Это действие нельзя отменить.`}
          deleting={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : (
        <>
          <FormError message={error} />
          <label className={styles.field}>
            <span>Название</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Осмотр терапевта" />
          </label>
          <div className={styles.iconRow}>
            <span className={styles.iconPreview}><Icon name={icon || 'help'} size={22} /></span>
            <label className={styles.field}>
              <span>Иконка (Material Symbols)</span>
              <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="stethoscope" />
            </label>
          </div>
          <label className={styles.field}>
            <span>Цена</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="800 ₽" />
          </label>
          <label className={styles.field}>
            <span>Длительность (мин)</span>
            <input type="number" min={1} value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} />
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
