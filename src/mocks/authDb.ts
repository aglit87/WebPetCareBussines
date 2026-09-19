import { loadPersisted, savePersisted } from './persist';
import type { OtpPurpose } from '@/entities/auth/model/types';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  verified: boolean;
}

export interface OtpEntry {
  code: string;
  purpose: OtpPurpose;
  expiresAt: number;
}

interface AuthDb {
  users: MockUser[];
  otps: Record<string, OtpEntry>;
  refreshTokens: Record<string, string>;
}

// Access tokens carry their own short expiry so the mock backend can force a
// refresh during manual testing without waiting around for a "real" TTL.
const ACCESS_TOKEN_TTL_MS: number = 5 * 60 * 1000;
const OTP_TTL_MS: number = 5 * 60 * 1000;

export let authDb: AuthDb = loadPersisted('auth', { users: [], otps: {}, refreshTokens: {} } as AuthDb);

export const setAuthDb = (next: AuthDb) => {
  authDb = next;
  savePersisted('auth', next);
};

export const generateOtp = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const otpExpiry = (): number => {
  return Date.now() + OTP_TTL_MS;
};

export const issueTokens = (userId: string): { accessToken: string; refreshToken: string } => {
  const payload: { sub: string; exp: number } = { sub: userId, exp: Date.now() + ACCESS_TOKEN_TTL_MS };
  const accessToken: string = `mock.${btoa(JSON.stringify(payload))}`;
  const refreshToken: string = crypto.randomUUID();
  setAuthDb({ ...authDb, refreshTokens: { ...authDb.refreshTokens, [refreshToken]: userId } });
  return { accessToken, refreshToken };
};

export const toAuthUser = (user: MockUser) => {
  return { id: user.id, email: user.email, name: user.name };
};

export const getUserFromRequest = (request: Request): MockUser | null => {
  const header: string | null = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  const token: string = header.slice(7);
  if (!token.startsWith('mock.')) return null;
  try {
    const payload = JSON.parse(atob(token.slice(5))) as { sub: string; exp: number };
    if (payload.exp < Date.now()) return null;
    return authDb.users.find((u) => u.id === payload.sub) ?? null;
  } catch {
    return null;
  }
};
