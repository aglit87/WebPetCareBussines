import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BusinessType } from '@/shared/config/businessTypes';
import type { BusinessProfile, BusinessState } from './types';

// Редуктор чистый: без сайд-эффектов. Персист в localStorage выполняет
// app-слой (см. src/app/store) через подписку на изменения слайса.
export const businessInitialState: BusinessState = { type: null, profile: null, registered: false };

const businessSlice = createSlice({
  name: 'business',
  initialState: businessInitialState,
  reducers: {
    setType(state, action: PayloadAction<BusinessType>) {
      state.type = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<BusinessProfile>>) {
      state.profile = { ...(state.profile ?? emptyProfile()), ...action.payload };
    },
    completeRegistration(state, action: PayloadAction<{ type: BusinessType; profile: BusinessProfile }>) {
      state.type = action.payload.type;
      state.profile = action.payload.profile;
      state.registered = true;
    },
    resetBusiness(state) {
      state.type = null;
      state.profile = null;
      state.registered = false;
    },
  },
});

const emptyProfile = (): BusinessProfile => {
  return { name: '', phone: '', address: '', staffCount: 1, services: [] };
};

export const { setType, updateProfile, completeRegistration, resetBusiness } = businessSlice.actions;
export const businessReducer = businessSlice.reducer;