import { z } from 'zod';
import { BusinessTypeSchema } from '@/shared/config/businessTypes.schema';
import type { RecordDTO, RecordsDTO, RecordStatus } from './types';

/** Zod-схема статуса записи. Соответствует {@link RecordStatus}. */
export const RecordStatusSchema = z.enum(['paid', 'onsite', 'later', 'done', 'cancelled']) satisfies z.ZodType<RecordStatus>;

/** Zod-схема записи. Соответствует {@link RecordDTO}. */
export const RecordDTOSchema = z.object({
  id: z.string(),
  date: z.string(),
  time: z.string(),
  pet: z.string(),
  client: z.string(),
  service: z.string(),
  amount: z.string(),
  status: RecordStatusSchema,
  avatar: z.string(),
}) satisfies z.ZodType<RecordDTO>;

/** Zod-схема ответа списка записей. Соответствует {@link RecordsDTO}. */
export const RecordsDTOSchema = z.object({
  records: z.array(RecordDTOSchema),
}) satisfies z.ZodType<RecordsDTO>;

/** Поля формы записи, проверяемые перед отправкой на сервер. */
const RecordFormFieldsSchema = {
  date: z.string().trim().min(1, 'Укажите дату'),
  time: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Время в формате ЧЧ:ММ'),
  pet: z.string().trim().min(1, 'Укажите питомца'),
  client: z.string().trim().min(1, 'Укажите клиента'),
  service: z.string().trim().min(1, 'Укажите услугу'),
};

/** Тело запроса на создание записи. */
export const CreateRecordRequestSchema = RecordDTOSchema.omit({ id: true }).extend({
  ...RecordFormFieldsSchema,
  type: BusinessTypeSchema,
});

/** Тело запроса на обновление записи. */
export const UpdateRecordRequestSchema = RecordDTOSchema.extend({
  ...RecordFormFieldsSchema,
  type: BusinessTypeSchema,
});

/** Тело запроса на удаление записи. */
export const DeleteRecordRequestSchema = z.object({ id: z.string(), type: BusinessTypeSchema });

/** Ответ на удаление записи. */
export const DeleteRecordResponseSchema = z.object({ id: z.string() });
