import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { loggedOut, selectAuthUser, selectRefreshToken, useLogoutMutation } from '@/entities/auth';
import { Icon } from '@/shared/ui';
import styles from './Topbar.module.scss';

interface Props {
  title: string;
  subtitle: string;
  onMenu?: () => void;
}

export const Topbar = ({ title, subtitle, onMenu }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const refreshToken = useAppSelector(selectRefreshToken);
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    if (refreshToken) logout({ refreshToken });
    dispatch(loggedOut());
  };

  return (
    <header className={styles.bar}>
      {onMenu && (
        <button type="button" className={styles.menu} onClick={onMenu} aria-label="Меню">
          <Icon name="menu" size={24} color="#5a6a82" />
        </button>
      )}
      <div className={styles.titles}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      <div className={styles.search}>
        <Icon name="search" size={20} color="#9fb0c8" />
        <span>Поиск…</span>
      </div>
      <button type="button" className={styles.iconBtn} aria-label="Уведомления">
        <Icon name="notifications" size={21} color="#172033" />
        <span className={styles.dot} />
      </button>
      <div className={styles.user}>
        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=75" alt="" />
        <div>
          <div className={styles.userName}>{user?.name ?? 'Профиль'}</div>
          <div className={styles.userRole}>{user?.email ?? ''}</div>
        </div>
      </div>
      <button type="button" className={styles.iconBtn} aria-label="Выйти" onClick={handleLogout}>
        <Icon name="logout" size={20} color="#172033" />
      </button>
    </header>
  );
};
