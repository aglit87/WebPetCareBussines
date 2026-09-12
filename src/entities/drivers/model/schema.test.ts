import { describe, expect, it } from 'vitest';
import { CreateDriverRequestSchema, DriverDTOSchema, UpdateDriverRequestSchema } from './schema';

const validDriver = { id: 'dr1', name: 'Павел Морозов', avatar: 'img.png', phone: '+7 916 220-91-04', status: 'busy' as const, tripsToday: 9, rating: 4.9, x: 32, y: 38 };

describe('entities/drivers zod-schemas', () => {
  it('принимает валидный DTO водителя', () => {
    expect(DriverDTOSchema.safeParse(validDriver).success).toBe(true);
  });

  it('принимает валидное тело создания', () => {
    const { id: _id, ...body } = validDriver;
    expect(CreateDriverRequestSchema.safeParse({ ...body, type: 'taxi' }).success).toBe(true);
  });

  it('отклоняет создание с рейтингом выше 5', () => {
    const { id: _id, ...body } = validDriver;
    expect(CreateDriverRequestSchema.safeParse({ ...body, rating: 6, type: 'taxi' }).success).toBe(false);
  });

  it('отклоняет создание с координатой вне 0..100', () => {
    const { id: _id, ...body } = validDriver;
    expect(CreateDriverRequestSchema.safeParse({ ...body, x: 101, type: 'taxi' }).success).toBe(false);
  });

  it('принимает валидное обновление', () => {
    expect(UpdateDriverRequestSchema.safeParse({ ...validDriver, type: 'taxi' }).success).toBe(true);
  });
});