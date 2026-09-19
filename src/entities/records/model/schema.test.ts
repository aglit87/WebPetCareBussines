import { describe, expect, it } from 'vitest';
import { CreateRecordRequestSchema, RecordDTOSchema, UpdateRecordRequestSchema } from './schema';

const validRecord = { id: 'r1', date: 'Сегодня', time: '14:00', pet: 'Мявра', client: 'Аня', service: 'Осмотр', amount: '800 ₽', status: 'paid', avatar: 'img.png' };

describe('entities/records zod-schemas', () => {
  it('принимает валидный DTO записи', () => {
    expect(RecordDTOSchema.safeParse(validRecord).success).toBe(true);
  });

  it('отклоняет DTO с неверным статусом', () => {
    expect(RecordDTOSchema.safeParse({ ...validRecord, status: 'unknown' }).success).toBe(false);
  });

  it('принимает валидное тело создания', () => {
    const { id: _id, ...body } = validRecord;
    expect(CreateRecordRequestSchema.safeParse({ ...body, type: 'vet' }).success).toBe(true);
  });

  it('отклоняет создание с некорректным временем', () => {
    const { id: _id, ...body } = validRecord;
    expect(CreateRecordRequestSchema.safeParse({ ...body, time: '25:99', type: 'vet' }).success).toBe(false);
  });

  it('принимает валидное тело обновления', () => {
    expect(UpdateRecordRequestSchema.safeParse({ ...validRecord, type: 'boarding' }).success).toBe(true);
  });
});