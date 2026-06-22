import { z } from 'zod';
import { BusinessTypeSchema } from '@/shared/config/businessTypes.schema';
import type { RoomDTO, RoomsDTO, RoomStatus } from './types';

/** Zod-схема статуса номера. Соответствует {@link RoomStatus}. */
export const RoomStatusSchema = z.enum(['occupied', 'free', 'cleaning']) satisfies z.ZodType<RoomStatus>;

/** Zod-схема номера. Соответствует {@link RoomDTO}. */
export const RoomDTOSchema = z.object({
  id: z.string(),
  number: z.string(),
  kind: z.string(),
  status: RoomStatusSchema,
  pet: z.string().optional(),
  client: z.string().optional(),
  checkout: z.string().optional(),
}) satisfies z.ZodType<RoomDTO>;

/** Zod-схема ответа списка номеров. Соответствует {@link RoomsDTO}. */
export const RoomsDTOSchema = z.object({
  rooms: z.array(RoomDTOSchema),
}) satisfies z.ZodType<RoomsDTO>;

/** Тело запроса на создание номера. */
export const CreateRoomRequestSchema = RoomDTOSchema.omit({ id: true }).extend({ type: BusinessTypeSchema });

/** Тело запроса на обновление номера. */
export const UpdateRoomRequestSchema = RoomDTOSchema.extend({ type: BusinessTypeSchema });

/** Тело запроса на удаление номера. */
export const DeleteRoomRequestSchema = z.object({ id: z.string(), type: BusinessTypeSchema });

/** Ответ на удаление номера. */
export const DeleteRoomResponseSchema = z.object({ id: z.string() });
