import { describe, expect, it } from 'vitest';
import { CreateServiceRequestSchema, ServiceDTOSchema, UpdateServiceRequestSchema } from './schema';

const validService = { id: 's1', name: 'Осмотр', icon: 'stethoscope', price: '800 ₽', durationMin: 20 };

describe('entities/services zod-schemas', () => {
  it('принимает валидный DTO услуги', () => {
    expect(ServiceDTOSchema.safeParse(validService).success).toBe(true);
  });

  it('принимает валидное тело создания', () => {
    const { id: _id, ...body } = validService;
    expect(CreateServiceRequestSchema.safeParse({ ...body, type: 'vet' }).success).toBe(true);
  });

  it('отклоняет создание с нулевой длительностью', () => {
    const { id: _id, ...body } = validService;
    expect(CreateServiceRequestSchema.safeParse({ ...body, durationMin: 0, type: 'vet' }).success).toBe(false);
  });

  it('отклоняет создание с коротким названием', () => {
    const { id: _id, ...body } = validService;
    expect(CreateServiceRequestSchema.safeParse({ ...body, name: 'о', type: 'vet' }).success).toBe(false);
  });

  it('принимает валидное обновление', () => {
    expect(UpdateServiceRequestSchema.safeParse({ ...validService, type: 'grooming' }).success).toBe(true);
  });
});