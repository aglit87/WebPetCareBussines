import { ZodError } from 'zod';

interface ErrorWithMessage {
  message: string;
}

interface FetchBaseQueryErrorLike {
  status: number | string;
  data?: unknown;
}

const hasMessage = (value: unknown): value is ErrorWithMessage =>
  typeof value === 'object' && value !== null && 'message' in value && typeof (value as ErrorWithMessage).message === 'string';

const hasStatus = (value: unknown): value is FetchBaseQueryErrorLike =>
  typeof value === 'object' && value !== null && 'status' in value;

/** Превращает ошибку валидации/мутации RTK Query в читаемое сообщение для пользователя. */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ZodError) return error.issues[0]?.message ?? 'Проверьте правильность заполнения формы';
  if (hasStatus(error)) {
    const data = error.data;
    if (hasMessage(data)) return data.message;
    return 'Не удалось сохранить — сервер вернул ошибку';
  }
  if (hasMessage(error)) return error.message;
  return 'Не удалось сохранить. Попробуйте ещё раз';
};
