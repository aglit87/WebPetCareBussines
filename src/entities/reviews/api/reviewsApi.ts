import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { validateRequest, validateResponse } from '@/shared/lib/zod/apiValidation';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { ReviewDTO, ReviewsDTO } from '../model/types';
import {
  DeleteReviewRequestSchema,
  DeleteReviewResponseSchema,
  ReviewDTOSchema,
  ReviewsDTOSchema,
  UpdateReviewReplyRequestSchema,
} from '../model/schema';

export type UpdateReviewReplyRequest = { id: string; type: BusinessType; reply: string };

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Review'],
  endpoints: (build) => ({
    getReviews: build.query<ReviewsDTO, BusinessType>({
      query: (type) => `/reviews?type=${type}`,
      transformResponse: validateResponse(ReviewsDTOSchema),
      providesTags: (result) =>
        result
          ? [...result.reviews.map((r) => ({ type: 'Review' as const, id: r.id })), { type: 'Review' as const, id: 'LIST' }]
          : [{ type: 'Review' as const, id: 'LIST' }],
    }),
    updateReviewReply: build.mutation<ReviewDTO, UpdateReviewReplyRequest>({
      query: (request) => {
        const { id, type, reply } = validateRequest(UpdateReviewReplyRequestSchema, request);
        return { url: `/reviews/${id}/reply?type=${type}`, method: 'PUT', body: { reply } };
      },
      transformResponse: validateResponse(ReviewDTOSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Review', id }, { type: 'Review', id: 'LIST' }],
    }),
    deleteReview: build.mutation<{ id: string }, { id: string; type: BusinessType }>({
      query: (request) => {
        const { id, type } = validateRequest(DeleteReviewRequestSchema, request);
        return { url: `/reviews/${id}?type=${type}`, method: 'DELETE' };
      },
      transformResponse: validateResponse(DeleteReviewResponseSchema),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Review', id }, { type: 'Review', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useUpdateReviewReplyMutation,
  useDeleteReviewMutation,
} = reviewsApi;
