import { z } from 'zod';
import type { BusinessType } from './businessTypes';

/**
 * Zod-схема для {@link BusinessType} — переиспользуется во всех entity API,
 * чтобы не дублировать список типов бизнеса в каждой zod-схеме запроса.
 *
 * `satisfies` гарантирует на этапе компиляции, что список значений схемы
 * не разойдётся с типом `BusinessType`.
 */
export const BusinessTypeSchema = z.enum(['vet', 'grooming', 'boarding', 'taxi']) satisfies z.ZodType<BusinessType>;
