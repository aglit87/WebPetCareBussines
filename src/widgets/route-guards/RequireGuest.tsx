import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { selectIsAuthenticated } from '@/entities/auth';

export const RequireGuest = ({ children }: { children: ReactNode }) => {
  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};
