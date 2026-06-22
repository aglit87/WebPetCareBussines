import { z } from 'zod';
import type { ScheduleDTO, ScheduleSlotDTO } from './types';

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
