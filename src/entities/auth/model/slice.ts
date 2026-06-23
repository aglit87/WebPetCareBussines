import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser, OtpPurpose } from './types';

const STORAGE_KEY: string = 'petcare.auth';

interface PersistedAuth {
  user: AuthUser | null;
  refreshToken: string | null;
}

const loadInitial = (): AuthState => {
  let persisted: PersistedAuth = { user: null, refreshToken: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) persisted = JSON.parse(raw) as PersistedAuth;
  } catch {
    /* ignore */
  }
  return {
    user: persisted.user,
    accessToken: null,
    refreshToken: persisted.refreshToken,
    status: persisted.refreshToken && persisted.user ? 'idle' : 'unauthenticated',
    pendingEmail: null,
    pendingPurpose: null,
  };
};

const persist = (state: AuthState): void => {
  try {
    const payload: PersistedAuth = { user: state.user, refreshToken: state.refreshToken };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitial(),
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
      persist(state);
    },
    tokensRefreshed(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.status = 'authenticated';
      persist(state);
    },
    loggedOut(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.pendingEmail = null;
      state.pendingPurpose = null;
      state.status = 'unauthenticated';
      persist(state);
    },
    passwordResetCompleted(state) {
      state.pendingEmail = null;
      state.pendingPurpose = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { credentialsRequested, otpVerified, tokensRefreshed, loggedOut, passwordResetCompleted } = authSlice.actions;
export const authReducer = authSlice.reducer;
