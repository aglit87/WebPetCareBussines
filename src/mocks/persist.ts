const PREFIX: string = 'petcare.mock.';

export const loadPersisted = <T,>(key: string, fallback: T): T => {
  try {
    const raw: string | null = localStorage.getItem(PREFIX + key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
};

export const savePersisted = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};
