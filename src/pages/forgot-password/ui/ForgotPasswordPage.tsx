import { useEffect, useState } from 'react';
import { Link, useNavigate, type NavigateFunction } from 'react-router-dom';
import {
  isPasswordValid,
  PASSWORD_RULES,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} from '@/entities/auth';
import { Button, Icon, PasswordInput } from '@/shared/ui';
import styles from './ForgotPasswordPage.module.scss';

type Phase = 'email' | 'reset';
const RESEND_COOLDOWN_S: number = 60;

export const ForgotPasswordPage = () => {
  const navigate: NavigateFunction = useNavigate();
  const [phase, setPhase] = useState<Phase>('email');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [cooldown, setCooldown] = useState<number>(RESEND_COOLDOWN_S);

  const [forgotPassword, { isLoading: sending }] = useForgotPasswordMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();
  const [resetPassword, { isLoading: resetting, error: resetError }] = useResetPasswordMutation();

  const passwordValid = isPasswordValid(password);
  const passwordsMatch = password.length > 0 && password === passwordConfirm;

  useEffect(() => {
    if (phase !== 'reset' || cooldown <= 0) return;
    const t: ReturnType<typeof setTimeout> = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, cooldown]);

  const submitEmail = async () => {
    if (!email) return;
    try {
      await forgotPassword({ email }).unwrap();
      setCooldown(RESEND_COOLDOWN_S);
      setPhase('reset');
    } catch {
      /* mock backend never errors here — email existence isn't leaked */
    }
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    try {
      await resendOtp({ email, purpose: 'reset' }).unwrap();
    } finally {
      setCooldown(RESEND_COOLDOWN_S);
    }
  };

  const submitReset = async () => {
    if (code.length !== 6 || !passwordValid || !passwordsMatch) return;
    try {
      await resetPassword({ email, code, password }).unwrap();
      navigate('/login', { replace: true, state: { passwordResetDone: true } });
    } catch {
      /* error surfaced below via resetError */
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandLogo}><Icon name="storefront" fill size={26} color="#fff" /></span>
          <div className={styles.brandName}>PetCare Бизнес</div>
        </div>

        {phase === 'email' ? (
          <>
            <h1 className={styles.title}>Восстановление пароля</h1>
            <p className={styles.sub}>Введите email — мы пришлём код для сброса пароля</p>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <div className={styles.input}>
                <Icon name="mail" size={21} color="var(--accent)" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  onKeyDown={(e) => { if (e.key === 'Enter') submitEmail(); }}
                  autoFocus
                />
              </div>
            </label>
            <Button size="lg" fullWidth disabled={!email || sending} onClick={submitEmail}>
              {sending ? 'Отправляем код…' : 'Отправить код'}
              <Icon name="arrow_forward" size={20} />
            </Button>
            <p className={styles.footer}>
              <Link to="/login" className={styles.accentLink}>Назад ко входу</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Новый пароль</h1>
            <p className={styles.sub}>Код отправлен на <b>{email}</b>. Введите его и придумайте новый пароль.</p>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Код подтверждения</span>
              <div className={styles.input}>
                <Icon name="mark_email_read" size={21} color="var(--accent)" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                />
              </div>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Новый пароль</span>
              <div className={styles.input}>
                <Icon name="lock" size={21} color="var(--accent)" />
                <PasswordInput value={password} onChange={setPassword} placeholder="••••••••" />
              </div>
            </label>
            {password.length > 0 && (
              <ul className={styles.rules}>
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(password);
                  return (
                    <li key={rule.id} className={ok ? styles.ruleOk : styles.ruleFail}>
                      <Icon name={ok ? 'check_circle' : 'cancel'} fill size={15} />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Повторите пароль</span>
              <div className={styles.input}>
                <Icon name="lock" size={21} color="var(--accent)" />
                <PasswordInput
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                  placeholder="••••••••"
                  onKeyDown={(e) => { if (e.key === 'Enter') submitReset(); }}
                />
              </div>
            </label>
            {passwordConfirm.length > 0 && !passwordsMatch && <p className={styles.error}>Пароли не совпадают</p>}
            {resetError && <p className={styles.error}>Неверный или просроченный код</p>}
            <div className={styles.actions}>
              <button type="button" className={styles.linkBtn} onClick={() => setPhase('email')}>
                <Icon name="arrow_back" size={18} />Изменить email
              </button>
              <button type="button" className={styles.linkBtn} disabled={cooldown > 0 || resending} onClick={resend}>
                {cooldown > 0 ? `Отправить код повторно (${cooldown}с)` : 'Отправить код повторно'}
              </button>
            </div>
            <Button size="lg" fullWidth disabled={code.length !== 6 || !passwordValid || !passwordsMatch || resetting} onClick={submitReset}>
              {resetting ? 'Сохраняем…' : 'Сохранить пароль'}
              <Icon name="arrow_forward" size={20} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
