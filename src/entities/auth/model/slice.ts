import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser, OtpPurpose } from './types';

// Редуктор чистый: без сайд-эффектов. Персист в localStorage выполняет
// app-слой (см. src/app/store) через подписку на изменения слайса.
export const authInitialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: 'unauthenticated',
  pendingEmail: null,
  pendingPurpose: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    credentialsRequested(state, action: PayloadAction<{ email: string; purpose: OtpPurpose }>) {
      state.pendingEmail = action.payload.email;
      state.pendingPurpose = action.payload.purpose;
      state.status = 'pendingOtp';
    },
    otpVerified(state, action: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.pendingEmail = null;
      state.pendingPurpose = null;
      state.status = 'authenticated';
    },
    tokensRefreshed(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.status = 'authenticated';
    },
    loggedOut(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.pendingEmail = null;
      state.pendingPurpose = null;
      state.status = 'unauthenticated';
    },
    passwordResetCompleted(state) {
      state.pendingEmail = null;
      state.pendingPurpose = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { credentialsRequested, otpVerified, tokensRefreshed, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;