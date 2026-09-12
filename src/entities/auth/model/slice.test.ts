import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { authReducer, credentialsRequested, otpVerified, tokensRefreshed, loggedOut, passwordResetCompleted } from './slice';

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe('entities/auth/model/slice', () => {
  it('стартует как unauthenticated с пустыми токенами', () => {
    const store = makeStore();
    expect(store.getState().auth.status).toBe('unauthenticated');
    expect(store.getState().auth.accessToken).toBeNull();
    expect(store.getState().auth.refreshToken).toBeNull();
  });

  it('credentialsRequested переводит в pendingOtp и сохраняет email/purpose', () => {
    const store = makeStore();
    store.dispatch(credentialsRequested({ email: 'a@b.ru', purpose: 'register' }));
    const { auth } = store.getState();
    expect(auth.status).toBe('pendingOtp');
    expect(auth.pendingEmail).toBe('a@b.ru');
    expect(auth.pendingPurpose).toBe('register');
  });

  it('otpVerified переходит в authenticated и чистит pending-поля', () => {
    const store = makeStore();
    store.dispatch(credentialsRequested({ email: 'a@b.ru', purpose: 'login' }));
    store.dispatch(
      otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at1', refreshToken: 'rt1' }),
    );
    const { auth } = store.getState();
    expect(auth.status).toBe('authenticated');
    expect(auth.accessToken).toBe('at1');
    expect(auth.pendingEmail).toBeNull();
    expect(auth.pendingPurpose).toBeNull();
  });

  it('tokensRefreshed обновляет токены без побочных изменений', () => {
    const store = makeStore();
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at1', refreshToken: 'rt1' }));
    store.dispatch(tokensRefreshed({ accessToken: 'at2', refreshToken: 'rt2' }));
    const { auth } = store.getState();
    expect(auth.accessToken).toBe('at2');
    expect(auth.refreshToken).toBe('rt2');
    expect(auth.status).toBe('authenticated');
  });

  it('loggedOut полностью очищает состояние', () => {
    const store = makeStore();
    store.dispatch(otpVerified({ user: { id: 'u1', email: 'a@b.ru', name: 'Аня' }, accessToken: 'at1', refreshToken: 'rt1' }));
    store.dispatch(loggedOut());
    const { auth } = store.getState();
    expect(auth.status).toBe('unauthenticated');
    expect(auth.user).toBeNull();
    expect(auth.accessToken).toBeNull();
    expect(auth.refreshToken).toBeNull();
  });

  it('passwordResetCompleted очищает pending-поля', () => {
    const store = makeStore();
    store.dispatch(credentialsRequested({ email: 'a@b.ru', purpose: 'reset' }));
    store.dispatch(passwordResetCompleted());
    const { auth } = store.getState();
    expect(auth.status).toBe('unauthenticated');
    expect(auth.pendingEmail).toBeNull();
    expect(auth.pendingPurpose).toBeNull();
  });
});