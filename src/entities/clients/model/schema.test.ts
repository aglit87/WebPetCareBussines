import { describe, expect, it } from 'vitest';
import { CreateClientRequestSchema, ClientDTOSchema, DeleteClientRequestSchema, UpdateClientRequestSchema } from './schema';

const validClient = { id: 'c1', name: 'Аня', avatar: 'img.png', phone: '+7 900 000-00-00', pets: 'Мявра · кошка', visits: 3, lastVisit: 'Сегодня', totalSpent: '1 800 ₽' };

describe('entities/clients zod-schemas', () => {
  it('принимает валидный DTO клиента', () => {
    expect(ClientDTOSchema.safeParse(validClient).success).toBe(true);
  });

  it('отклоняет DTO с нечисловым visits', () => {
    expect(ClientDTOSchema.safeParse({ ...validClient, visits: 'три' }).success).toBe(false);
  });

  it('принимает валидное тело создания с type', () => {
    const { id: _id, ...body } = validClient;
    expect(CreateClientRequestSchema.safeParse({ ...body, type: 'vet' }).success).toBe(true);
  });

  it('отклоняет создание с коротким телефоном', () => {
    const { id: _id, ...body } = validClient;
    expect(CreateClientRequestSchema.safeParse({ ...body, phone: '12', type: 'vet' }).success).toBe(false);
  });

  it('принимает валидное тело обновления и удаления', () => {
    expect(UpdateClientRequestSchema.safeParse({ ...validClient, type: 'grooming' }).success).toBe(true);
    expect(DeleteClientRequestSchema.safeParse({ id: 'c1', type: 'vet' }).success).toBe(true);
  });

  it('отклоняет удаление без type', () => {
    expect(DeleteClientRequestSchema.safeParse({ id: 'c1' }).success).toBe(false);
  });
});