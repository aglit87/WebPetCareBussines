import { useEffect, useState } from 'react';
import { useResendOtpMutation, useVerifyOtpMutation, type OtpPurpose } from '@/entities/auth';
import { Button, Icon } from '@/shared/ui';
import styles from './OtpConfirmForm.module.scss';

const RESEND_COOLDOWN_S: number = 60;

interface OtpConfirmFormProps {
  email: string;
  purpose: OtpPurpose;
  onVerified: () => void;
  onBack: () => void;
}

export const OtpConfirmForm = ({ email, purpose, onVerified, onBack }: OtpConfirmFormProps) => {
  const [code, setCode] = useState<string>('');
  const [cooldown, setCooldown] = useState<number>(RESEND_COOLDOWN_S);
  const [verifyOtp, { isLoading: verifying, error: verifyError }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t: ReturnType<typeof setTimeout> = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async () => {
    if (code.length !== 6) return;
    try {
      await verifyOtp({ email, code, purpose }).unwrap();
      onVerified();
    } catch {
      /* error surfaced via verifyError below */
    }
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;
    try {
      await resendOtp({ email, purpose }).unwrap();
    } finally {
      setCooldown(RESEND_COOLDOWN_S);
    }
  };

  return (
    <>
      <p className={styles.hint}>
        Код отправлен на <b>{email}</b>. Проверьте почту (и папку «Спам»).
      </p>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Код подтверждения</span>
        <div className={styles.input}>
          <Icon name="mark_email_read" size={21} color="var(--accent)" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            placeholder="••••••"
            inputMode="numeric"
            maxLength={6}
            className={styles.codeInput}
            autoFocus
          />
        </div>
      </label>
      {verifyError && <p className={styles.error}>Неверный или просроченный код</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.linkBtn} onClick={onBack}>
          <Icon name="arrow_back" size={18} />Изменить email
        </button>
        <button type="button" className={styles.linkBtn} disabled={cooldown > 0 || resending} onClick={resend}>
          {cooldown > 0 ? `Отправить повторно (${cooldown}с)` : 'Отправить код повторно'}
        </button>
      </div>
      <Button size="lg" fullWidth disabled={code.length !== 6 || verifying} onClick={submit}>
        {verifying ? 'Проверяем…' : 'Подтвердить'}
        <Icon name="arrow_forward" size={20} />
      </Button>
    </>
  );
};
