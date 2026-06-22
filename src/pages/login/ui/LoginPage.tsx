import { useState } from 'react';
import { Link, useNavigate, type NavigateFunction } from 'react-router-dom';
import { useLoginMutation } from '@/entities/auth';
import { OtpConfirmForm } from '@/features/otp-confirm';
import { Button, Icon } from '@/shared/ui';
import styles from './LoginPage.module.scss';

type Phase = 'credentials' | 'otp';

export const LoginPage = () => {
  const navigate: NavigateFunction = useNavigate();
  const [phase, setPhase] = useState<Phase>('credentials');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [login, { isLoading, error }] = useLoginMutation();

  const submit = async () => {
    if (!email || !password) return;
    try {
      await login({ email, password }).unwrap();
      setPhase('otp');
    } catch {
      /* error surfaced below via `error` */
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandLogo}><Icon name="storefront" fill size={26} color="#fff" /></span>
          <div className={styles.brandName}>PetCare Бизнес</div>
        </div>

        {phase === 'credentials' ? (
          <>
            <h1 className={styles.title}>Вход в кабинет</h1>
            <p className={styles.sub}>Введите email и пароль — мы пришлём код подтверждения на почту</p>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <div className={styles.input}>
                <Icon name="mail" size={21} color="var(--accent)" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
              </div>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Пароль</span>
              <div className={styles.input}>
                <Icon name="lock" size={21} color="var(--accent)" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                />
              </div>
            </label>
            {error && <p className={styles.error}>Неверный email или пароль</p>}
            <Button size="lg" fullWidth disabled={!email || !password || isLoading} onClick={submit}>
              {isLoading ? 'Входим…' : 'Войти'}
              <Icon name="arrow_forward" size={20} />
            </Button>
            <p className={styles.footer}>
              Нет аккаунта? <Link to="/register" className={styles.accentLink}>Зарегистрироваться</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Подтверждение входа</h1>
            <OtpConfirmForm
              email={email}
              purpose="login"
              onVerified={() => navigate('/', { replace: true })}
              onBack={() => setPhase('credentials')}
            />
          </>
        )}
      </div>
    </div>
  );
};
