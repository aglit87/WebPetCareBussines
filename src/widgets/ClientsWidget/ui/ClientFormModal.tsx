import { useState } from 'react';
import { Modal, Button, Icon, ConfirmDelete, FormError, AvatarUpload } from '@/shared/ui';
import { useCreateClientMutation, useUpdateClientMutation, useDeleteClientMutation, type ClientDTO } from '@/entities/clients';
import type { BusinessType } from '@/shared/config/businessTypes';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import styles from './ClientFormModal.module.scss';

interface Props {
  open: boolean;
  type: BusinessType;
  client: ClientDTO | null; // null = создание
  onClose: () => void;
}

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/initials/svg?seed=PC';

export const ClientFormModal = ({ open, type, client, onClose }: Props) => {
  const isEdit: boolean = !!client;
  const [name, setName] = useState<string>(client?.name ?? '');
  const [avatar, setAvatar] = useState<string>(client?.avatar ?? '');
  const [phone, setPhone] = useState<string>(client?.phone ?? '');
  const [pets, setPets] = useState<string>(client?.pets ?? '');
  const [visits, setVisits] = useState<number>(client?.visits ?? 0);
  const [lastVisit, setLastVisit] = useState<string>(client?.lastVisit ?? 'Сегодня');
  const [totalSpent, setTotalSpent] = useState<string>(client?.totalSpent ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: deleting }] = useDeleteClientMutation();
  const saving: boolean = creating || updating;

  const handleSave = async () => {
    setError(null);
    const payload = { name, avatar, phone, pets, visits, lastVisit, totalSpent };
    try {
      if (client) await updateClient({ id: client.id, type, ...payload }).unwrap();
      else await createClient({ type, ...payload }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!client) return;
    setError(null);
    try {
      await deleteClient({ id: client.id, type }).unwrap();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Изменить клиента' : 'Новый клиент'} onClose={onClose} closeDisabled={saving || deleting}>
      {confirmingDelete ? (
        <ConfirmDelete
          message={`Удалить клиента «${client?.name}»? Это действие нельзя отменить.`}
          deleting={deleting}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      ) : (
        <>
          <FormError message={error} />
          <AvatarUpload label="Фото клиента" value={avatar} onChange={setAvatar} fallback={FALLBACK_AVATAR} />
          <label className={styles.field}><span>Имя</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Анна Кузнецова" /></label>
          <label className={styles.field}><span>Телефон</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 900 000-00-00" /></label>
          <label className={styles.field}><span>Питомец</span><input value={pets} onChange={(e) => setPets(e.target.value)} placeholder="Мявра · кошка" /></label>
          <div className={styles.row2}>
            <label className={styles.field}><span>Визитов</span><input type="number" min={0} value={visits} onChange={(e) => setVisits(Number(e.target.value))} /></label>
            <label className={styles.field}><span>Последний визит</span><input value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} placeholder="Сегодня" /></label>
          </div>
          <label className={styles.field}><span>Сумма покупок</span><input value={totalSpent} onChange={(e) => setTotalSpent(e.target.value)} placeholder="18 400 ₽" /></label>

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
