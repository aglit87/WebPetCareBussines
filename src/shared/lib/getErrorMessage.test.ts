import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getErrorMessage } from './getErrorMessage';

describe('shared/lib/getErrorMessage', () => {
  it('возвращает сообщение первого issue из ZodError', () => {
    const error = fallible<unknown>(() => z.string().min(2).parse('a'));
    expect(getErrorMessage(error)).toBe((error as z.ZodError).issues[0].message);
  });

  it('возвращает fallback при пустом ZodError', () => {
    const error = new z.ZodError([]);
    expect(getErrorMessage(error)).toBe('Проверьте правильность заполнения формы');
  });

  it('берёт data.message у ошибки с status', () => {
    const error = { status: 400, data: { message: 'Неверный email или пароль' } };
    expect(getErrorMessage(error)).toBe('Неверный email или пароль');
  });

  it('возвращает серверный fallback, если в ошибке со status нет сообщения', () => {
    expect(getErrorMessage({ status: 500 })).toBe('Не удалось сохранить — сервер вернул ошибку');
  });

  it('игнорирует поле message на верхнем уровне, когда есть status', () => {
    expect(getErrorMessage({ status: 400, message: 'скрытый текст' })).toBe('Не удалось сохранить — сервер вернул ошибку');
  });

  it('возвращает message обычной ошибки', () => {
    expect(getErrorMessage(new Error('Сеть недоступна'))).toBe('Сеть недоступна');
  });

  it('возвращает финальный fallback для неизвестного типа', () => {
    expect(getErrorMessage(null)).toBe('Не удалось сохранить. Попробуйте ещё раз');
    expect(getErrorMessage(undefined)).toBe('Не удалось сохранить. Попробуйте ещё раз');
    expect(getErrorMessage('строка')).toBe('Не удалось сохранить. Попробуйте ещё раз');
  });
});

const fallible = <T,>(fn: () => T): T => {
  try {
    return fn();
  } catch (error) {
    return error as T;
  }
};