import { z } from 'zod';
import type { AppointmentDTO, AppointmentStatus, DashboardDTO, RequestDTO, StatDTO } from './types';

/** Zod-схема статуса записи в расписании. Соответствует {@link AppointmentStatus}. */
export const AppointmentStatusSchema = z.enum(['paid', 'onsite', 'later']) satisfies z.ZodType<AppointmentStatus>;

/** Zod-схема карточки статистики на дашборде. Соответствует {@link StatDTO}. */
export const StatDTOSchema = z.object({
  id: z.string(),
  icon: z.string(),
  iconColor: z.string(),
  iconTint: z.string(),
  value: z.string(),
  label: z.string(),
  delta: z.string().optional(),
  deltaPositive: z.boolean().optional(),
}) satisfies z.ZodType<StatDTO>;

/** Zod-схема записи в сегодняшнем расписании. Соответствует {@link AppointmentDTO}. */
export const AppointmentDTOSchema = z.object({
  id: z.string(),
  time: z.string(),
  pet: z.string(),
  client: z.string(),
  service: z.string(),
  amount: z.string(),
  status: AppointmentStatusSchema,
  avatar: z.string(),
}) satisfies z.ZodType<AppointmentDTO>;

/** Zod-схема новой заявки. Соответствует {@link RequestDTO}. */
export const RequestDTOSchema = z.object({
  id: z.string(),
  pet: z.string(),
  client: z.string(),
  when: z.string(),
  amount: z.string(),
  avatar: z.string(),
}) satisfies z.ZodType<RequestDTO>;

/** Zod-схема ответа дашборда. Соответствует {@link DashboardDTO}. */
export const DashboardDTOSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  stats: z.array(StatDTOSchema),
  today: z.array(AppointmentDTOSchema),
  requests: z.array(RequestDTOSchema),
}) satisfies z.ZodType<DashboardDTO>;
