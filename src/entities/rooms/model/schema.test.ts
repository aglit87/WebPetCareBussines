import { describe, expect, it } from 'vitest';
import { CreateRoomRequestSchema, RoomDTOSchema, UpdateRoomRequestSchema } from './schema';

const baseRoom = { id: 'rm1', number: '№1', kind: 'Стандартный', status: 'free' as const };

describe('entities/rooms zod-schemas', () => {
  it('принимает валидный DTO свободного номера', () => {
    expect(RoomDTOSchema.safeParse(baseRoom).success).toBe(true);
  });

  it('отклоняет slug с неверным статусом', () => {
    expect(RoomDTOSchema.safeParse({ ...baseRoom, status: 'rented' }).success).toBe(false);
  });

  it('принимает создание занятого номера только с pet/client/checkout', () => {
    const { id: _id, ...body } = baseRoom;
    const payload = { ...body, status: 'occupied', pet: 'Гера', client: 'Олег', checkout: '30 июня', type: 'boarding' };
    expect(CreateRoomRequestSchema.safeParse(payload).success).toBe(true);
  });

  it('отклоняет создание занятого номера без питомца', () => {
    const { id: _id, ...body } = baseRoom;
    const payload = { ...body, status: 'occupied', client: 'Олег', checkout: '30 июня', type: 'boarding' };
    expect(CreateRoomRequestSchema.safeParse(payload).success).toBe(false);
  });

  it('отклоняет создание занятого номера без даты выезда', () => {
    const { id: _id, ...body } = baseRoom;
    const payload = { ...body, status: 'occupied', pet: 'Гера', client: 'Олег', type: 'boarding' };
    expect(CreateRoomRequestSchema.safeParse(payload).success).toBe(false);
  });

  it('принимает создание свободного номера без полей жильца', () => {
    const { id: _id, ...body } = baseRoom;
    expect(CreateRoomRequestSchema.safeParse({ ...body, type: 'boarding' }).success).toBe(true);
  });

  it('принимает валидное обновление', () => {
    const payload = { ...baseRoom, status: 'cleaning', type: 'vet' };
    expect(UpdateRoomRequestSchema.safeParse(payload).success).toBe(true);
  });
});