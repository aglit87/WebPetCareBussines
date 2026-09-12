import { describe, expect, it } from 'vitest';
import { DashboardDTOSchema } from './schema';

const valid = {
  title: 'Обзор',
  subtitle: 'Клиника «ВетДоктор» · вторник, 24 июня',
  stats: [{ id: 's1', icon: 'event_available', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '8', label: 'записей сегодня' }],
  today: [{ id: 't1', time: '14:00', pet: 'Мявра', client: 'Аня', service: 'Осмотр', amount: '800 ₽', status: 'paid', avatar: 'img.png' }],
  requests: [{ id: 'r1', pet: 'Мявра', client: 'Аня', when: 'Завтра 14:00', amount: '800 ₽', avatar: 'img.png' }],
};

describe('entities/dashboard zod-schemas', () => {
  it('принимает валидный ответ дашборда', () => {
    expect(DashboardDTOSchema.safeParse(valid).success).toBe(true);
  });

  it('принимает stat без delta', () => {
    const stat = { id: 's1', icon: 'event_available', iconColor: '#2F58B0', iconTint: '#E7EEFB', value: '8', label: 'записей сегодня' };
    expect(DashboardDTOSchema.safeParse({ ...valid, stats: [stat] }).success).toBe(true);
  });

  it('отклоняет ответ с неверным статусом визита', () => {
    const bad = { ...valid, today: [{ ...valid.today[0], status: 'booked' }] };
    expect(DashboardDTOSchema.safeParse(bad).success).toBe(false);
  });

  it('отклоняет ответ без subtitle', () => {
    const { subtitle: _s, ...rest } = valid;
    expect(DashboardDTOSchema.safeParse(rest).success).toBe(false);
  });
});