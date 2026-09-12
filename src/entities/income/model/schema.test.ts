import { describe, expect, it } from 'vitest';
import { IncomeDTOSchema, IncomeStatDTOSchema } from './schema';

const valid = {
  stats: [{ id: 'i1', icon: 'payments', iconColor: '#000', iconTint: '#fff', value: '24 600 ₽', label: 'доход за день', delta: '+12%' }],
  days: [{ id: 'd1', date: 'Пн · 23 июня', amount: '21 400 ₽', count: 9, share: 72 }],
};

describe('entities/income zod-schemas', () => {
  it('принимает валидный ответ', () => {
    expect(IncomeDTOSchema.safeParse(valid).success).toBe(true);
  });

  it('принимает stat без опциональных полей', () => {
    expect(IncomeStatDTOSchema.safeParse({ id: 'i1', icon: 'x', iconColor: '#000', iconTint: '#fff', value: '1', label: 'y' }).success).toBe(true);
  });

  it('отклоняет ответ без массива days', () => {
    const { days: _days, ...rest } = valid;
    expect(IncomeDTOSchema.safeParse(rest).success).toBe(false);
  });

  it('отклоняет day без amount', () => {
    const { amount: _amount, ...day } = valid.days[0];
    expect(IncomeDTOSchema.safeParse({ ...valid, days: [day] }).success).toBe(false);
  });
});