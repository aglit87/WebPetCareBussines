import { useMemo, type CSSProperties } from 'react';
import { getBusinessConfig, type BusinessType } from '@/shared/config/businessTypes';

// Maps the selected business type's theme onto CSS custom properties.
// Apply the returned style to the cabinet root — every SCSS module reads var(--accent…).
export const useBusinessTheme = (type: BusinessType): CSSProperties => {
  return useMemo(() => {
    const { theme } = getBusinessConfig(type);
    return {
      '--accent': theme.accent,
      '--accent-light': theme.accentLight,
      '--accent-dark': theme.accentDark,
      '--accent-tint': theme.accentTint,
      '--accent-grad': theme.gradient,
      '--cabinet-bg': theme.cabinetBg,
      '--sidebar-border': theme.sidebarBorder,
    } as CSSProperties;
  }, [type]);
};
