import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { authDb } from './authDb';
import { TEST_BASE } from '@/shared/api/testEnv';

const server = setupServer(...handlers);

const VALID_BODY = {
  name: 'Аня',
  avatar: 'img.png',
  phone: '+7 900 000-00-00',
  pets: 'Мявра · кошка',
  visits: 3,
  lastVisit: 'Сегодня',
  totalSpent: '800 ₽',
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  authDb.users.push({ id: 'user-1', email: 't@t.ru', password: 'Str0ng!pass1', name: 'Тест', verified: true });
});

afterAll(() => server.close());

const token = (): string => `mock.${btoa(JSON.stringify({ sub: 'user-1', exp: Date.now() + 60_000 }))}`;

describe('src/mocks/handlers: zod-валидация тел запросов', () => {
  it('принимает валидный POST /clients и возвращает 201', async () => {
    const res = await fetch(`${TEST_BASE}/api/clients?type=vet`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(VALID_BODY),
    });
    expect(res.status).toBe(201);
    const created = await res.json();
    expect(created.id).toBeTypeOf('string');
    expect(created.phone).toBe(VALID_BODY.phone);
  });

  it('отклоняет невалидный POST /clients и возвращает 400', async () => {
    const res = await fetch(`${TEST_BASE}/api/clients?type=vet`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, phone: '12' }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  it('отклоняет создание занятого номера без питомца (условные поля)', async () => {
    const res = await fetch(`${TEST_BASE}/api/rooms?type=boarding`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: '№2', kind: 'Стандартный', status: 'occupied', client: 'Олег', checkout: '30 июня' }),
    });
    expect(res.status).toBe(400);
  });
});