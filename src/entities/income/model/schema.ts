import { z } from 'zod';
import type { IncomeDayDTO, IncomeDTO, IncomeStatDTO } from './types';

/** Zod-схема карточки статистики дохода. Соответствует {@link IncomeStatDTO}. */
export const IncomeStatDTOSchema = z.object({
  id: z.string(),
  icon: z.string(),
  iconColor: z.string(),
  iconTint: z.string(),
  value: z.string(),
  label: z.string(),
  delta: z.string().optional(),
  deltaPositive: z.boolean().optional(),
}) satisfies z.ZodType<IncomeStatDTO>;

/** Zod-схема дохода за день. Соответствует {@link IncomeDayDTO}. */
export const IncomeDayDTOSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.string(),
  count: z.number(),
  share: z.number(),
}) satisfies z.ZodType<IncomeDayDTO>;

/** Zod-схема ответа по доходам. Соответствует {@link IncomeDTO}. */
export const IncomeDTOSchema = z.object({
  stats: z.array(IncomeStatDTOSchema),
  days: z.array(IncomeDayDTOSchema),
}) satisfies z.ZodType<IncomeDTO>;
