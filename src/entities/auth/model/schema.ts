import { z } from 'zod';
import type { AuthUser, OtpPurpose } from './types';

/**
 * Zod-схема причины запроса OTP-кода. Соответствует {@link OtpPurpose}.
 */
export const OtpPurposeSchema = z.enum(['register', 'login']) satisfies z.ZodType<OtpPurpose>;

/**
 * Zod-схема пользователя. Соответствует {@link AuthUser}.
 */
export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
}) satisfies z.ZodType<AuthUser>;

/** Тело запроса регистрации. */
export const RegisterRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
});

/** Тело запроса входа. */
export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

/** Тело запроса подтверждения OTP-кода. */
export const VerifyOtpRequestSchema = z.object({
  email: z.string(),
  code: z.string(),
  purpose: OtpPurposeSchema,
});

/** Тело запроса повторной отправки OTP-кода. */
export const ResendOtpRequestSchema = z.object({
  email: z.string(),
  purpose: OtpPurposeSchema,
});

/** Тело запроса обновления токенов. */
export const RefreshRequestSchema = z.object({
  refreshToken: z.string(),
});

/** Тело запроса выхода из системы. */
export const LogoutRequestSchema = z.object({
  refreshToken: z.string(),
});

/** Ответ на регистрацию/вход — ожидается подтверждение по OTP. */
export const PendingAuthResponseSchema = z.object({
  email: z.string(),
});

/** Ответ с парой токенов и пользователем после подтверждения OTP. */
export const TokensResponseSchema = z.object({
  user: AuthUserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

/** Ответ на обновление токенов. */
export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

/** Ответ на повторную отправку OTP-кода. */
export const ResendOtpResponseSchema = z.object({ ok: z.literal(true) });
