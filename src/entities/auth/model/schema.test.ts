import { describe, expect, it } from 'vitest';
import { RegisterRequestSchema, TokensResponseSchema, AuthUserSchema, PasswordSchema, ResetPasswordRequestSchema } from './schema';

describe('entities/auth zod-schemas', () => {
  it('принимает валидную регистрацию', () => {
    expect(RegisterRequestSchema.safeParse({ email: 'a@b.ru', password: 'Str0ng!pass', name: 'Аня' }).success).toBe(true);
  });

  it('отклоняет слабый пароль на регистрации', () => {
    expect(RegisterRequestSchema.safeParse({ email: 'a@b.ru', password: 'weak', name: 'Аня' }).success).toBe(false);
  });

  it('проверяет все требования PasswordSchema по отдельности', () => {
    expect(PasswordSchema.safeParse('Ab1!cd23').success).toBe(true);
    expect(PasswordSchema.safeParse('abcdefgh').success).toBe(false);
    expect(PasswordSchema.safeParse('ABCDEFGH').success).toBe(false);
    expect(PasswordSchema.safeParse('Abcdefgh').success).toBe(false);
    expect(PasswordSchema.safeParse('Abcdef1g').success).toBe(false);
  });

  it('принимает валидный ответ с токенами', () => {
    const tokens = { user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at', refreshToken: 'rt' };
    expect(TokensResponseSchema.safeParse(tokens).success).toBe(true);
  });

  it('отклоняет ответ без accessToken', () => {
    const { accessToken: _at, ...rest } = { user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at', refreshToken: 'rt' };
    expect(TokensResponseSchema.safeParse(rest).success).toBe(false);
  });

  it('отклоняет пользователя без name', () => {
    expect(AuthUserSchema.safeParse({ id: 'u1', email: 'a@b.ru' }).success).toBe(false);
  });

  it('отклоняет сброс пароля со слабым паролем', () => {
    expect(ResetPasswordRequestSchema.safeParse({ email: 'a@b.ru', code: '123456', password: 'weak' }).success).toBe(false);
  });
});