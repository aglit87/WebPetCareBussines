import { http, HttpResponse, delay } from 'msw';
import {
  authDb,
  setAuthDb,
  generateOtp,
  otpExpiry,
  issueTokens,
  toAuthUser,
  type MockUser,
  type OtpPurpose,
} from './authDb';

export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    await delay(400);
    const { email, password, name } = (await request.json()) as { email: string; password: string; name: string };
    if (authDb.users.some((u) => u.email === email)) {
      return HttpResponse.json({ message: 'Email уже зарегистрирован' }, { status: 409 });
    }
    const user: MockUser = { id: crypto.randomUUID(), email, password, name, verified: false };
    const code = generateOtp();
    setAuthDb({
      ...authDb,
      users: [...authDb.users, user],
      otps: { ...authDb.otps, [email]: { code, purpose: 'register', expiresAt: otpExpiry() } },
    });
    console.log(`[mock email] OTP для ${email} (регистрация): ${code}`);
    return HttpResponse.json({ email });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(400);
    const { email, password } = (await request.json()) as { email: string; password: string };
    const user = authDb.users.find((u) => u.email === email && u.password === password && u.verified);
    if (!user) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 400 });
    }
    const code = generateOtp();
    setAuthDb({ ...authDb, otps: { ...authDb.otps, [email]: { code, purpose: 'login', expiresAt: otpExpiry() } } });
    console.log(`[mock email] OTP для ${email} (вход): ${code}`);
    return HttpResponse.json({ email });
  }),

  http.post('/api/auth/verify-otp', async ({ request }) => {
    await delay(300);
    const { email, code, purpose } = (await request.json()) as { email: string; code: string; purpose: OtpPurpose };
    const entry = authDb.otps[email];
    if (!entry || entry.purpose !== purpose || entry.code !== code || entry.expiresAt < Date.now()) {
      return HttpResponse.json({ message: 'Неверный или просроченный код' }, { status: 400 });
    }
    const user = authDb.users.find((u) => u.email === email);
    if (!user) {
      return HttpResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    const updatedUser = purpose === 'register' ? { ...user, verified: true } : user;
    const { [email]: _omit, ...restOtps } = authDb.otps;
    setAuthDb({
      ...authDb,
      users: authDb.users.map((u) => (u.id === user.id ? updatedUser : u)),
      otps: restOtps,
    });
    const tokens = issueTokens(user.id);
    return HttpResponse.json({ user: toAuthUser(updatedUser), ...tokens });
  }),

  http.post('/api/auth/resend-otp', async ({ request }) => {
    await delay(300);
    const { email, purpose } = (await request.json()) as { email: string; purpose: OtpPurpose };
    const code = generateOtp();
    setAuthDb({ ...authDb, otps: { ...authDb.otps, [email]: { code, purpose, expiresAt: otpExpiry() } } });
    console.log(`[mock email] OTP для ${email} (повтор): ${code}`);
    return HttpResponse.json({ ok: true });
  }),

  http.post('/api/auth/forgot-password', async ({ request }) => {
    await delay(400);
    const { email } = (await request.json()) as { email: string };
    const user = authDb.users.find((u) => u.email === email);
    if (user) {
      const code = generateOtp();
      setAuthDb({ ...authDb, otps: { ...authDb.otps, [email]: { code, purpose: 'reset', expiresAt: otpExpiry() } } });
      console.log(`[mock email] OTP для ${email} (сброс пароля): ${code}`);
    }
    // Не подтверждаем существование email в ответе — иначе можно перебирать базу.
    return HttpResponse.json({ email });
  }),

  http.post('/api/auth/reset-password', async ({ request }) => {
    await delay(400);
    const { email, code, password } = (await request.json()) as { email: string; code: string; password: string };
    const entry = authDb.otps[email];
    if (!entry || entry.purpose !== 'reset' || entry.code !== code || entry.expiresAt < Date.now()) {
      return HttpResponse.json({ message: 'Неверный или просроченный код' }, { status: 400 });
    }
    const user = authDb.users.find((u) => u.email === email);
    if (!user) {
      return HttpResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }
    const { [email]: _omit, ...restOtps } = authDb.otps;
    setAuthDb({
      ...authDb,
      users: authDb.users.map((u) => (u.id === user.id ? { ...u, password } : u)),
      otps: restOtps,
    });
    return HttpResponse.json({ ok: true });
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    await delay(200);
    const { refreshToken } = (await request.json()) as { refreshToken: string };
    const userId = authDb.refreshTokens[refreshToken];
    if (!userId) {
      return HttpResponse.json({ message: 'Сессия истекла' }, { status: 401 });
    }
    const { [refreshToken]: _omit, ...restTokens } = authDb.refreshTokens;
    setAuthDb({ ...authDb, refreshTokens: restTokens });
    const tokens = issueTokens(userId);
    return HttpResponse.json(tokens);
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    await delay(150);
    const { refreshToken } = (await request.json()) as { refreshToken: string };
    const { [refreshToken]: _omit, ...restTokens } = authDb.refreshTokens;
    setAuthDb({ ...authDb, refreshTokens: restTokens });
    return new HttpResponse(null, { status: 204 });
  }),
];
