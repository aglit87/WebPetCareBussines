import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/shared/ui';
import type { ClientDTO } from '@/entities/clients';
import { ClientFormModal } from './ClientFormModal';

const existingClient: ClientDTO = {
  id: 'demo-1',
  name: 'Анна Кузнецова',
  avatar: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=120&q=75',
  phone: '+7 900 123-45-67',
  pets: 'Мявра · кошка',
  visits: 6,
  lastVisit: 'Сегодня',
  totalSpent: '18 400 ₽',
};

const ClientFormModalDemo = ({ client }: { client: ClientDTO | null }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{client ? 'Изменить клиента' : 'Новый клиент'}</Button>
      <ClientFormModal open={open} type="vet" client={client} onClose={() => setOpen(false)} />
    </>
  );
};

const meta = {
  title: 'widgets/ClientsWidget/ClientFormModal',
  component: ClientFormModalDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof ClientFormModalDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = { args: { client: null } };

export const Edit: Story = { args: { client: existingClient } };
