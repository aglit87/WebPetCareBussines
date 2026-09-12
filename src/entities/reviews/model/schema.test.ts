import { describe, expect, it } from 'vitest';
import { ReviewsDTOSchema, UpdateReviewReplyRequestSchema } from './schema';

const valid = {
  avgRating: 4.9,
  count: 214,
  reviews: [{ id: 'rv1', name: 'Аня', avatar: 'img.png', rating: 5, text: 'Хорошо', date: '23 июня', reply: 'Спасибо' }],
};

describe('entities/reviews zod-schemas', () => {
  it('принимает валидный ответ', () => {
    expect(ReviewsDTOSchema.safeParse(valid).success).toBe(true);
  });

  it('принимает отзыв без reply', () => {
    const { reply: _reply, ...review } = valid.reviews[0];
    expect(ReviewsDTOSchema.safeParse({ ...valid, reviews: [review] }).success).toBe(true);
  });

  it('отклоняет отзыв без text', () => {
    const { text: _text, ...review } = valid.reviews[0];
    expect(ReviewsDTOSchema.safeParse({ ...valid, reviews: [review] }).success).toBe(false);
  });

  it('принимает валидный ответ на отзыв', () => {
    expect(UpdateReviewReplyRequestSchema.safeParse({ id: 'rv1', type: 'vet', reply: 'Спасибо за отзыв' }).success).toBe(true);
  });

  it('отклоняет пустой ответ', () => {
    expect(UpdateReviewReplyRequestSchema.safeParse({ id: 'rv1', type: 'vet', reply: '  ' }).success).toBe(false);
  });

  it('отклоняет ответ длиннее 500 символов', () => {
    const reply = 'а'.repeat(501);
    expect(UpdateReviewReplyRequestSchema.safeParse({ id: 'rv1', type: 'vet', reply }).success).toBe(false);
  });
});