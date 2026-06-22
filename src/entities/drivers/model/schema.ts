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

/** Тело запроса на создание водителя. */
export const CreateDriverRequestSchema = DriverDTOSchema.omit({ id: true }).extend({ type: BusinessTypeSchema });

/** Тело запроса на обновление водителя. */
export const UpdateDriverRequestSchema = DriverDTOSchema.extend({ type: BusinessTypeSchema });

/** Тело запроса на удаление водителя. */
export const DeleteDriverRequestSchema = z.object({ id: z.string(), type: BusinessTypeSchema });

/** Ответ на удаление водителя. */
export const DeleteDriverResponseSchema = z.object({ id: z.string() });
