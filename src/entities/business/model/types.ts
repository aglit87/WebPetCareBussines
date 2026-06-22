import type { BusinessType } from '@/shared/config/businessTypes';

export interface BusinessProfile {
  name: string;
  phone: string;
  address: string;
  staffCount: number;
  services: string[];
}

export interface BusinessState {
  type: BusinessType | null;
  profile: BusinessProfile | null;
  registered: boolean;
}
