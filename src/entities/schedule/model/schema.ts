import { z } from 'zod';
import type { ScheduleDayCountDTO, ScheduleDTO, ScheduleMonthDTO, ScheduleSlotDTO } from './types';

/** Zod-схема слота расписания. Соответствует {@link ScheduleSlotDTO}. */
export const ScheduleSlotDTOSchema = z.object({
  time: z.string(),
  status: z.enum(['free', 'busy']),
  pet: z.string().optional(),
  client: z.string().optional(),
  service: z.string().optional(),
}) satisfies z.ZodType<ScheduleSlotDTO>;

/** Zod-схема ответа расписания на день. Соответствует {@link ScheduleDTO}. */
export const ScheduleDTOSchema = z.object({
  date: z.string(),
  slots: z.array(ScheduleSlotDTOSchema),
}) satisfies z.ZodType<ScheduleDTO>;

/** Zod-схема сводки занятости одного дня. Соответствует {@link ScheduleDayCountDTO}. */
export const ScheduleDayCountDTOSchema = z.object({
  date: z.string(),
  busy: z.number(),
  free: z.number(),
}) satisfies z.ZodType<ScheduleDayCountDTO>;

/** Zod-схема сводки расписания за месяц. Соответствует {@link ScheduleMonthDTO}. */
export const ScheduleMonthDTOSchema = z.object({
  days: z.array(ScheduleDayCountDTOSchema),
}) satisfies z.ZodType<ScheduleMonthDTO>;
