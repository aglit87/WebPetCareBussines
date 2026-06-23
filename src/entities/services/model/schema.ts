import { z } from 'zod';
import { BusinessTypeSchema } from '@/shared/config/businessTypes.schema';
import type { ServiceDTO, ServicesDTO } from './types';

/** Zod-схема услуги. Соответствует {@link ServiceDTO}. */
export const ServiceDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  price: z.string(),
  durationMin: z.number(),
}) satisfies z.ZodType<ServiceDTO>;

/** Zod-схема ответа списка услуг. Соответствует {@link ServicesDTO}. */
export const ServicesDTOSchema = z.object({
  services: z.array(ServiceDTOSchema),
}) satisfies z.ZodType<ServicesDTO>;

/** Поля формы услуги, проверяемые перед отправкой на сервер. */
const ServiceFormFieldsSchema = {
  name: z.string().trim().min(2, 'Введите название услуги'),
  icon: z.string().trim().min(1, 'Укажите иконку'),
  price: z.string().trim().min(1, 'Укажите цену'),
  durationMin: z.number().int('Целое число').min(1, 'Минимум 1 минута'),
};

/** Тело запроса на создание услуги. */
export const CreateServiceRequestSchema = ServiceDTOSchema.omit({ id: true }).extend({
  ...ServiceFormFieldsSchema,
  type: BusinessTypeSchema,
});

/** Тело запроса на обновление услуги. */
export const UpdateServiceRequestSchema = ServiceDTOSchema.extend({
  ...ServiceFormFieldsSchema,
  type: BusinessTypeSchema,
});

/** Тело запроса на удаление услуги. */
export const DeleteServiceRequestSchema = z.object({ id: z.string(), type: BusinessTypeSchema });

/** Ответ на удаление услуги. */
export const DeleteServiceResponseSchema = z.object({ id: z.string() });
