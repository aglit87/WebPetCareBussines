export type OtpPurpose = 'register' | 'login';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export type AuthStatus = 'idle' | 'pendingOtp' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  pendingEmail: string | null;
  pendingPurpose: OtpPurpose | null;
}
