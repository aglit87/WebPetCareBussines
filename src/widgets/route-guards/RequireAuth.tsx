import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { selectIsAuthenticated } from '@/entities/auth';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const isAuthenticated: boolean = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
