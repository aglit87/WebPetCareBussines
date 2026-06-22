import { z } from 'zod';
import { BusinessTypeSchema } from '@/shared/config/businessTypes.schema';
import type { ReviewDTO, ReviewsDTO } from './types';

/** Zod-схема отзыва. Соответствует {@link ReviewDTO}. */
export const ReviewDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  rating: z.number(),
  text: z.string(),
  date: z.string(),
  reply: z.string().optional(),
}) satisfies z.ZodType<ReviewDTO>;

/** Zod-схема ответа списка отзывов. Соответствует {@link ReviewsDTO}. */
export const ReviewsDTOSchema = z.object({
  avgRating: z.number(),
  count: z.number(),
  reviews: z.array(ReviewDTOSchema),
}) satisfies z.ZodType<ReviewsDTO>;

/** Тело запроса на ответ на отзыв. Соответствует `UpdateReviewReplyRequest` из `api/reviewsApi.ts`. */
export const UpdateReviewReplyRequestSchema = z.object({
  id: z.string(),
  type: BusinessTypeSchema,
  reply: z.string(),
});

/** Тело запроса на удаление отзыва. */
export const DeleteReviewRequestSchema = z.object({ id: z.string(), type: BusinessTypeSchema });

/** Ответ на удаление отзыва. */
export const DeleteReviewResponseSchema = z.object({ id: z.string() });
