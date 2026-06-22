import type { RootState } from '@/app/store';

export const selectAuthUser = (s: RootState) => s.auth.user;
export const selectAccessToken = (s: RootState) => s.auth.accessToken;
export const selectRefreshToken = (s: RootState) => s.auth.refreshToken;
export const selectAuthStatus = (s: RootState) => s.auth.status;
export const selectPendingEmail = (s: RootState) => s.auth.pendingEmail;
export const selectPendingPurpose = (s: RootState) => s.auth.pendingPurpose;
export const selectIsAuthenticated = (s: RootState) => s.auth.status === 'authenticated';
