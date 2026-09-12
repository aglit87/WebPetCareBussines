import { z } from 'zod';

// Тело запроса сверяется с той же zod-схемой, что использует клиент, —
// мок-бэкенд ведёт себя как честный экземпляр контракта, а не второй источник правды.
export const validateBody = (schema: z.ZodTypeAny, body: unknown): { ok: boolean; message?: string } => {
  const result = schema.safeParse(body);
  if (!result.success) return { ok: false, message: result.error.issues[0]?.message ?? 'Некорректное тело запроса' };
  return { ok: true };
};