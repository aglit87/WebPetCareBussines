import { useEffect, useRef, type ReactNode } from 'react';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { selectAuthStatus, selectRefreshToken, useRefreshMutation } from '@/entities/auth';
import { Skeleton } from '@/shared/ui';
import styles from './AuthBootstrap.module.scss';

// Runs a one-shot silent refresh on app load when a refreshToken survived a
// reload but the (memory-only) accessToken didn't — avoids a flash of the
// login screen before the session is confirmed restored.
export const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  const status = useAppSelector(selectAuthStatus);
  const refreshToken = useAppSelector(selectRefreshToken);
  const [refresh] = useRefreshMutation();
  const started = useRef(false);

  useEffect(() => {
    if (status !== 'idle' || !refreshToken || started.current) return;
    started.current = true;
    refresh({ refreshToken });
  }, [status, refreshToken, refresh]);

  if (status === 'idle') {
    return (
      <div className={styles.boot}>
        <Skeleton width={120} height={120} radius={28} />
      </div>
    );
  }

  return <>{children}</>;
};
