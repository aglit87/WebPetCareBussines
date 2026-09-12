import { describe, expect, it } from 'vitest';
import { ScheduleDTOSchema, ScheduleMonthDTOSchema } from './schema';

describe('entities/schedule zod-schemas', () => {
  it('принимает валидный ответ на день', () => {
    const day = { date: '2026-09-12', slots: [{ time: '09:00', status: 'free' }, { time: '10:00', status: 'busy', pet: 'Мявра', client: 'Аня', service: 'Осмотр' }] };
    expect(ScheduleDTOSchema.safeParse(day).success).toBe(true);
  });

  it('принимает свободный слот без данных питомца', () => {
    const day = { date: '2026-09-12', slots: [{ time: '09:00', status: 'free' }] };
    expect(ScheduleDTOSchema.safeParse(day).success).toBe(true);
  });

  it('отклоняет слот с неверным статусом', () => {
    const day = { date: '2026-09-12', slots: [{ time: '09:00', status: 'reserved' }] };
    expect(ScheduleDTOSchema.safeParse(day).success).toBe(false);
  });

  it('принимает валидную месячную сводку', () => {
    const month = { days: [{ date: '2026-09-01', busy: 3, free: 8 }] };
    expect(ScheduleMonthDTOSchema.safeParse(month).success).toBe(true);
  });

  it('отклоняет месячную сводку без поля busy', () => {
    const { busy: _busy, ...day } = { date: '2026-09-01', busy: 3, free: 8 };
    expect(ScheduleMonthDTOSchema.safeParse({ days: [day] }).success).toBe(false);
  });
});