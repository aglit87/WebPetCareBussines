import { z } from 'zod';
import { BusinessTypeSchema } from '@/shared/config/businessTypes.schema';
import type { DriverDTO, DriverStatus, DriversDTO } from './types';

/** Zod-схема статуса водителя. Соответствует {@link DriverStatus}. */
export const DriverStatusSchema = z.enum(['online', 'busy', 'offline']) satisfies z.ZodType<DriverStatus>;

/** Zod-схема водителя. Соответствует {@link DriverDTO}. */
export const DriverDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  phone: z.string(),
  status: DriverStatusSchema,
  tripsToday: z.number(),
  rating: z.number(),
  x: z.number(),
  y: z.number(),
}) satisfies z.ZodType<DriverDTO>;

/** Zod-схема ответа списка водителей. Соответствует {@link DriversDTO}. */
export const DriversDTOSchema = z.object({
  drivers: z.array(DriverDTOSchema),
}) satisfies z.ZodType<DriversDTO>;

/** Поля формы водителя, проверяемые перед отправкой на сервер. */
const DriverFormFieldsSchema = {
  name: z.string().trim().min(2, 'Введите имя водителя'),
  phone: z.string().trim().regex(/^[+()\d\s-]{7,}$/, 'Введите телефон в формате +7 900 000-00-00'),
  tripsToday: z.number().int('Целое число').min(0, 'Не может быть отрицательным'),
  rating: z.number().min(1, 'От 1 до 5').max(5, 'От 1 до 5'),
  x: z.number().min(0, 'От 0 до 100').max(100, 'От 0 до 100'),
  y: z.number().min(0, 'От 0 до 100').max(100, 'От 0 до 100'),
};

/** Тело запроса на создание водителя. */
export const CreateDriverRequestSchema = DriverDTOSchema.omit({ id: true }).extend({
  ...DriverFormFieldsSchema,
  type: BusinessTypeSchema,
});

/** Тело запроса на обновление водителя. */
export const UpdateDriverRequestSchema = DriverDTOSchema.extend({
  ...DriverFormFieldsSchema,
  type: BusinessTypeSchema,
});

/** Тело запроса на удаление водителя. */
export const DeleteDriverRequestSchema = z.object({ id: z.string(), type: BusinessTypeSchema });

/** Ответ на удаление водителя. */
export const DeleteDriverResponseSchema = z.object({ id: z.string() });
