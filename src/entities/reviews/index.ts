export {
  reviewsApi,
  useGetReviewsQuery,
  useUpdateReviewReplyMutation,
  useDeleteReviewMutation,
} from './api/reviewsApi';
export type { ReviewsDTO, ReviewDTO } from './model/types';
export type { UpdateReviewReplyRequest } from './api/reviewsApi';
export { REVIEW_REPLY_MAX_LENGTH } from './model/schema';
