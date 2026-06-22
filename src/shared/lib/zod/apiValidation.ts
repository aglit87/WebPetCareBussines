import type { z } from 'zod';

/**
 * Оборачивает zod-схему в валидатор ответа сервера для RTK Query.
 *
 * Используется как `transformResponse` в `endpoints` — гарантирует,
 * что в кэш RTK Query попадут только данные, реально соответствующие
 * контракту API. При расхождении бросает `ZodError`, и RTK Query
 * превращает его в обычную ошибку запроса.
 *
 * @param schema - zod-схема, описывающая ожидаемый ответ сервера
 * @returns функция `(raw) => T`, пригодная для `transformResponse`
 */
export const validateResponse =
  <T>(schema: z.ZodType<T>) =>
  (raw: unknown): T =>
    schema.parse(raw);

/**
 * Валидирует тело запроса перед отправкой на сервер.
 *
 * Бросает `ZodError`, если данные не соответствуют схеме — запрос
 * в этом случае вообще не уходит в сеть.
 *
 * @param schema - zod-схема, описывающая ожидаемое тело запроса
 * @param payload - данные, которые валидируются
 * @returns те же данные, что и `payload`, но проверенные и типизированные
 */
export const validateRequest = <T>(schema: z.ZodType<T>, payload: T): T => schema.parse(payload);
