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

/** Поля формы номера, проверяемые перед отправкой на сервер. */
const RoomFormFieldsSchema = {
  number: z.string().trim().min(1, 'Укажите номер'),
  kind: z.string().trim().min(1, 'Укажите тип номера'),
};

/** Если номер занят — питомец, клиент и дата выезда обязательны. */
const refineOccupied = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((value, ctx) => {
    const v = value as { status: RoomStatus; pet?: string; client?: string; checkout?: string };
    if (v.status !== 'occupied') return;
    if (!v.pet?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Укажите питомца', path: ['pet'] });
    if (!v.client?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Укажите клиента', path: ['client'] });
    if (!v.checkout?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Укажите дату выезда', path: ['checkout'] });
  });

/** Тело запроса на создание номера. */
export const CreateRoomRequestSchema = refineOccupied(
  RoomDTOSchema.omit({ id: true }).extend({ ...RoomFormFieldsSchema, type: BusinessTypeSchema }),
);

/** Тело запроса на обновление номера. */
export const UpdateRoomRequestSchema = refineOccupied(
  RoomDTOSchema.extend({ ...RoomFormFieldsSchema, type: BusinessTypeSchema }),
);

/** Тело запроса на удаление номера. */
export const DeleteRoomRequestSchema = z.object({ id: z.string(), type: BusinessTypeSchema });

/** Ответ на удаление номера. */
export const DeleteRoomResponseSchema = z.object({ id: z.string() });
