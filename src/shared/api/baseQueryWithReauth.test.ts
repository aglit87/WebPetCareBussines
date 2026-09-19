import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { authReducer, otpVerified, tokensRefreshed } from '@/entities/auth/model/slice';
import { reauthBaseQuery } from '@/entities/auth';
import { TEST_BASE as BASE, installAbsoluteRequest } from '@/shared/api/testEnv';

const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: reauthBaseQuery,
  endpoints: (build) => ({
    getMe: build.query<{ ok: boolean }, void>({ query: () => '/me' }),
    second: build.query<{ ok: boolean }, void>({ query: () => '/second' }),
  }),
});

let refreshCount = 0;
const server = setupServer(
  http.get(`${BASE}/api/me`, ({ request }) => {
    const token = request.headers.get('authorization');
    if (token === 'Bearer at-valid' || token === 'Bearer at2') return HttpResponse.json({ ok: true });
    return HttpResponse.json({ message: 'expired' }, { status: 401 });
  }),
  http.get(`${BASE}/api/second`, ({ request }) => {
    const token = request.headers.get('authorization');
    if (token === 'Bearer at-valid' || token === 'Bearer at2') return HttpResponse.json({ ok: true });
    return HttpResponse.json({ message: 'expired' }, { status: 401 });
  }),
  http.post(`${BASE}/api/auth/refresh`, async ({ request }) => {
    refreshCount += 1;
    const body = (await request.json()) as { refreshToken: string };
    if (body.refreshToken !== 'rt1') return HttpResponse.json({ message: 'bad refresh' }, { status: 401 });
    return HttpResponse.json({ accessToken: 'at2', refreshToken: 'rt2' });
  }),
);

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'error' });
  installAbsoluteRequest();
});

beforeEach(() => {
  refreshCount = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [testApi.reducerPath]: testApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(testApi.middleware),
  });

describe('reauth base query (red zone)', () => {
  it('не трогает refresh при валидном токене', async () => {
    const store = makeStore();
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at-valid', refreshToken: 'rt1' }));
    const result = await store.dispatch(testApi.endpoints.getMe.initiate());
    expect(result.data?.ok).toBe(true);
    expect(refreshCount).toBe(0);
    expect(store.getState().auth.accessToken).toBe('at-valid');
  });

  it('после 401 обновляет токены и повторяет исходный запрос', async () => {
    const store = makeStore();
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at-expired', refreshToken: 'rt1' }));
    const result = await store.dispatch(testApi.endpoints.getMe.initiate());
    expect(result.data?.ok).toBe(true);
    expect(refreshCount).toBe(1);
    expect(store.getState().auth.accessToken).toBe('at2');
    expect(store.getState().auth.refreshToken).toBe('rt2');
  });

  it('параллельные 401 делят один refresh', async () => {
    const store = makeStore();
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at-expired', refreshToken: 'rt1' }));
    const [first, second] = await Promise.all([
      store.dispatch(testApi.endpoints.getMe.initiate()),
      store.dispatch(testApi.endpoints.second.initiate()),
    ]);
    expect(first.data?.ok).toBe(true);
    expect(second.data?.ok).toBe(true);
    expect(refreshCount).toBe(1);
  });

  it('неуспешный refresh разлогинивает', async () => {
    const store = makeStore();
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at-expired', refreshToken: 'rt-bad' }));
    const result = await store.dispatch(testApi.endpoints.getMe.initiate());
    expect(result.data).toBeUndefined();
    expect(store.getState().auth.status).toBe('unauthenticated');
    expect(store.getState().auth.accessToken).toBeNull();
  });

  it('без refresh-токена не вызывает refresh и разлогинивает', async () => {
    const store = makeStore();
    store.dispatch(tokensRefreshed({ accessToken: 'at-expired', refreshToken: '' }));
    const result = await store.dispatch(testApi.endpoints.getMe.initiate());
    expect(result.data).toBeUndefined();
    expect(refreshCount).toBe(0);
    expect(store.getState().auth.status).toBe('unauthenticated');
  });
});