import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { store } from './index';
import { recordsApi } from '@/entities/records';
import { loggedOut, otpVerified, tokensRefreshed } from '@/entities/auth/model/slice';
import { TEST_BASE, installAbsoluteRequest } from '@/shared/api/testEnv';

let recordHits = 0;
const server = setupServer(
  http.get(`${TEST_BASE}/api/records`, () => {
    recordHits += 1;
    return HttpResponse.json({ records: [] });
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  installAbsoluteRequest();
});

beforeEach(() => {
  recordHits = 0;
});

afterAll(() => server.close());

describe('app/store: сброс кэшей RTK Query при потере авторизации', () => {
  it('logout очищает кэши, а tokensRefreshed — нет', async () => {
    // Пока не аутентифицированы — обычный запрос в сеть.
    await store.dispatch(recordsApi.endpoints.getRecords.initiate('vet'));
    expect(recordHits).toBe(1);

    // Авторизуемся — повторный запрос идёт из кэша.
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at1', refreshToken: 'rt1' }));
    await store.dispatch(recordsApi.endpoints.getRecords.initiate('vet'));
    expect(recordHits).toBe(1);

    // Logout (authenticated -> unauthenticated) сбрасывает кэш: снова в сеть.
    store.dispatch(loggedOut());
    await store.dispatch(recordsApi.endpoints.getRecords.initiate('vet'));
    expect(recordHits).toBe(2);

    // tokensRefreshed не трогает кэш: последующие запросы идут из кэша.
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at1', refreshToken: 'rt1' }));
    await store.dispatch(recordsApi.endpoints.getRecords.initiate('vet'));
    store.dispatch(tokensRefreshed({ accessToken: 'at2', refreshToken: 'rt2' }));
    await store.dispatch(recordsApi.endpoints.getRecords.initiate('vet'));
    expect(recordHits).toBe(2);
  });
});