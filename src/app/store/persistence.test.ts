import { beforeEach, describe, expect, it, vi } from 'vitest';

const storage = new Map<string, string>();
const fakeLocalStorage: Storage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => {
    storage.set(key, String(value));
  },
  removeItem: (key) => {
    storage.delete(key);
  },
  clear: () => {
    storage.clear();
  },
  key: (index) => [...storage.keys()][index] ?? null,
  get length() {
    return storage.size;
  },
};

type StoreResult = typeof import('./index');
let slice: typeof import('@/entities/auth/model/slice');

const loadFreshest = async (): Promise<StoreResult> => {
  vi.stubGlobal('localStorage', fakeLocalStorage);
  vi.resetModules();
  slice = await import('@/entities/auth/model/slice');
  return import('./index');
};

beforeEach(() => {
  storage.clear();
});

describe('app/store: персист состояния auth/business', () => {
  it('восстанавливает сессию в статусе idle из версионированного ключа', async () => {
    storage.set('petcare.v1.auth', JSON.stringify({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, refreshToken: 'rt1' }));
    const { store } = await loadFreshest();
    const { auth } = store.getState();
    expect(auth.status).toBe('idle');
    expect(auth.user?.email).toBe('a@b.ru');
    expect(auth.refreshToken).toBe('rt1');
    expect(auth.accessToken).toBeNull();
  });

  it('игнорирует legacy-ключи без версии', async () => {
    storage.set('petcare.auth', JSON.stringify({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, refreshToken: 'rt1' }));
    const { store } = await loadFreshest();
    expect(store.getState().auth.status).toBe('unauthenticated');
  });

  it('записывает изменения auth в localStorage', async () => {
    const { store } = await loadFreshest();
    store.dispatch(slice.otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at1', refreshToken: 'rt1' }));
    expect(JSON.parse(storage.get('petcare.v1.auth') ?? 'null')).toEqual({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, refreshToken: 'rt1' });

    store.dispatch(slice.loggedOut());
    expect(JSON.parse(storage.get('petcare.v1.auth') ?? 'null')).toEqual({ user: null, refreshToken: null });
  });

  it('пишет state бизнеса при изменении', async () => {
    const { store } = await loadFreshest();
    const business = await import('@/entities/business');
    store.dispatch(business.setType('vet'));
    expect(JSON.parse(storage.get('petcare.v1.business') ?? 'null').type).toBe('vet');
  });
});