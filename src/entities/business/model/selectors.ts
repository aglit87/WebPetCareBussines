import type { RootState } from '@/app/store';
import { getBusinessConfig } from '@/shared/config/businessTypes';

export const selectBusinessType = (s: RootState) => s.business.type;
export const selectBusinessProfile = (s: RootState) => s.business.profile;
export const selectIsRegistered = (s: RootState) => s.business.registered;
export const selectBusinessConfig = (s: RootState) =>
  s.business.type ? getBusinessConfig(s.business.type) : null;
