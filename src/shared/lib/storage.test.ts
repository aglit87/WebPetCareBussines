import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadStorage, saveStorage } from './storage';

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

beforeEach(() => {
  storage.clear();
  vi.stubGlobal('localStorage', fakeLocalStorage);
});

describe('shared/lib/storage', () => {
  it('сохраняет и загружает под версионированным ключом', () => {
    saveStorage('auth', { user: { id: 'u1' }, refreshToken: 'rt' });
    expect(storage.has('petcare.v1.auth')).toBe(true);
    expect(loadStorage<{ user: { id: string } }>('auth', { user: { id: '' } }).user.id).toBe('u1');
  });

  it('не читает legacy-ключ без версии', () => {
    storage.set('petcare.auth', JSON.stringify({ user: { id: 'legacy' }, refreshToken: 'old' }));
    expect(loadStorage<{ user: { id: string } | null }>('auth', { user: null }).user).toBeNull();
  });

  it('возвращает fallback при битом JSON', () => {
    storage.set('petcare.v1.auth', '{broken');
    expect(loadStorage('auth', 'fallback')).toBe('fallback');
  });

  it('возвращает fallback при отсутствии ключа', () => {
    expect(loadStorage('missing', 42)).toBe(42);
  });

  it('разделяет ключи между сущностями', () => {
    saveStorage('auth', 'a');
    saveStorage('business', 'b');
    expect(loadStorage('auth', 'missing')).toBe('a');
    expect(loadStorage('business', 'missing')).toBe('b');
  });

  it('не падает, если localStorage недоступен', () => {
    vi.stubGlobal('localStorage', undefined);
    saveStorage('auth', 'x');
    expect(loadStorage('auth', 'fallback')).toBe('fallback');
  });
});