const PREFIX: string = 'petcare.';
const VERSION: string = 'v1';

// Версия в ключе защищает от чтения данных, записанных предыдущими версиями
// приложения: схема хранения изменилась — старые ключи попросту не читаются.
const keyFor = (key: string): string => `${PREFIX}${VERSION}.${key}`;

export const loadStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw: string | null = localStorage.getItem(keyFor(key));
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
};

export const saveStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(keyFor(key), JSON.stringify(value));
  } catch {
    /* ignore */
  }
};