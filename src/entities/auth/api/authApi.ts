import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { validateRequest, validateResponse } from '@/shared/lib/zod/apiValidation';
import { credentialsRequested, loggedOut, otpVerified, passwordResetCompleted, tokensRefreshed } from '../model/slice';
import type { AuthUser, OtpPurpose } from '../model/types';
import {
  ForgotPasswordRequestSchema,
  LoginRequestSchema,
  LogoutRequestSchema,
  PendingAuthResponseSchema,
  RefreshRequestSchema,
  RefreshResponseSchema,
  RegisterRequestSchema,
  ResendOtpRequestSchema,
  ResendOtpResponseSchema,
  ResetPasswordRequestSchema,
  ResetPasswordResponseSchema,
  TokensResponseSchema,
  VerifyOtpRequestSchema,
} from '../model/schema';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  purpose: OtpPurpose;
}

export interface ResendOtpRequest {
  email: string;
  purpose: OtpPurpose;
}

export interface PendingAuthResponse {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
}

export interface TokensResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (build) => ({
    register: build.mutation<PendingAuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body: validateRequest(RegisterRequestSchema, body) }),
      transformResponse: validateResponse(PendingAuthResponseSchema),
      async onQueryStarted({ email }, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(credentialsRequested({ email, purpose: 'register' }));
      },
    }),
    login: build.mutation<PendingAuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body: validateRequest(LoginRequestSchema, body) }),
      transformResponse: validateResponse(PendingAuthResponseSchema),
      async onQueryStarted({ email }, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(credentialsRequested({ email, purpose: 'login' }));
      },
    }),
    verifyOtp: build.mutation<TokensResponse, VerifyOtpRequest>({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body: validateRequest(VerifyOtpRequestSchema, body) }),
      transformResponse: validateResponse(TokensResponseSchema),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(otpVerified(data));
      },
    }),
    resendOtp: build.mutation<{ ok: true }, ResendOtpRequest>({
      query: (body) => ({ url: '/auth/resend-otp', method: 'POST', body: validateRequest(ResendOtpRequestSchema, body) }),
      transformResponse: validateResponse(ResendOtpResponseSchema),
    }),
    forgotPassword: build.mutation<PendingAuthResponse, ForgotPasswordRequest>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body: validateRequest(ForgotPasswordRequestSchema, body) }),
      transformResponse: validateResponse(PendingAuthResponseSchema),
      async onQueryStarted({ email }, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(credentialsRequested({ email, purpose: 'reset' }));
      },
    }),
    resetPassword: build.mutation<{ ok: true }, ResetPasswordRequest>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body: validateRequest(ResetPasswordRequestSchema, body) }),
      transformResponse: validateResponse(ResetPasswordResponseSchema),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(passwordResetCompleted());
      },
    }),
    refresh: build.mutation<{ accessToken: string; refreshToken: string }, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body: validateRequest(RefreshRequestSchema, body) }),
      transformResponse: validateResponse(RefreshResponseSchema),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(tokensRefreshed(data));
        } catch {
          // expired/invalid refresh token — bootstrap can't recover the session
          dispatch(loggedOut());
        }
      },
    }),
    logout: build.mutation<void, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/logout', method: 'POST', body: validateRequest(LogoutRequestSchema, body) }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
