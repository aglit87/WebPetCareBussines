import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { BusinessProfile, BusinessState } from './types';

const STORAGE_KEY: string = 'petcare.business';

const loadInitial = (): BusinessState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BusinessState;
  } catch {
    /* ignore */
  }
  return { type: null, profile: null, registered: false };
};

const persist = (state: BusinessState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
};

const businessSlice = createSlice({
  name: 'business',
  initialState: loadInitial(),
  reducers: {
    setType(state, action: PayloadAction<BusinessType>) {
      state.type = action.payload;
      persist(state);
    },
    updateProfile(state, action: PayloadAction<Partial<BusinessProfile>>) {
      state.profile = { ...(state.profile ?? emptyProfile()), ...action.payload };
      persist(state);
    },
    completeRegistration(state, action: PayloadAction<{ type: BusinessType; profile: BusinessProfile }>) {
      state.type = action.payload.type;
      state.profile = action.payload.profile;
      state.registered = true;
      persist(state);
    },
    resetBusiness(state) {
      state.type = null;
      state.profile = null;
      state.registered = false;
      persist(state);
    },
  },
});

const emptyProfile = (): BusinessProfile => {
  return { name: '', phone: '', address: '', staffCount: 1, services: [] };
};

export const { setType, updateProfile, completeRegistration, resetBusiness } = businessSlice.actions;
export const businessReducer = businessSlice.reducer;
