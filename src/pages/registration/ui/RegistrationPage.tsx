import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import { completeRegistration, selectBusinessType, setType } from '@/entities/business';
import { getBusinessConfig, type BusinessType } from '@/shared/config/businessTypes';
import { useBusinessTheme } from '@/shared/lib/useBusinessTheme';
import { BusinessTypeSelect } from '@/features/business-type-select';
import { OtpConfirmForm } from '@/features/otp-confirm';
import { selectIsAuthenticated, useRegisterMutation } from '@/entities/auth';
import { Button, Icon } from '@/shared/ui';
import styles from './RegistrationPage.module.scss';

type WizardStep = 1 | 2 | 3;
type AccountPhase = 'credentials' | 'otp';

export const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const storedType = useAppSelector(selectBusinessType);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Account already exists (e.g. user just logged in but hasn't finished
  // business setup) — skip straight to the business wizard.
  const [accountDone, setAccountDone] = useState<boolean>(isAuthenticated);
  const [accountPhase, setAccountPhase] = useState<AccountPhase>('credentials');
  const [accountEmail, setAccountEmail] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [register, { isLoading: registering, error: registerError }] = useRegisterMutation();

  const [step, setStep] = useState<WizardStep>(1);
  const [type, setLocalType] = useState<BusinessType | null>(storedType);
  const [name, setName] = useState<string>('');

  const cfg = type ? getBusinessConfig(type) : null;
  const themeStyle = useBusinessTheme(type ?? 'vet');
  const dot = accountDone ? step + 1 : 1;

  const submitAccount = async (): Promise<void> => {
    if (!accountEmail || !accountPassword || !accountName) return;
    try {
      await register({ email: accountEmail, password: accountPassword }).unwrap();
      setAccountPhase('otp');
    } catch {
      /* error surfaced via registerError below */
    }
  };

  const goStep2 = (): void => {
    if (!type) return;
    dispatch(setType(type));
    setName((n) => n || defaultName(type));
    setStep(2);
  };

  const finish = (): void => {
    if (!type) return;
    dispatch(
      completeRegistration({
        type,
        profile: { name: name || defaultName(type), phone: '', address: '', staffCount: 1, services: getBusinessConfig(type).services },
      }),
    );
    setStep(3);
  };

  return (
    <div className={styles.page} style={themeStyle}>
      <aside className={styles.hero}>
        <div className={styles.brand}>
          <span className={styles.brandLogo}><Icon name={cfg?.icon ?? 'storefront'} fill size={30} color="#fff" /></span>
          <div>
            <div className={styles.brandName}>PetCare Бизнес</div>
            {cfg && <div className={styles.brandKicker}>{cfg.label.toUpperCase()}</div>}
          </div>
        </div>
        <div className={styles.heroBody}>
          <div className={styles.dots}>
            {[1, 2, 3, 4].map((d) => <span key={d} className={d === dot ? styles.dotActive : styles.dot} />)}
          </div>
          <h1 className={styles.heroTitle}>{HERO[dot].title}</h1>
          <p className={styles.heroText}>{cfg ? HERO[dot].text.replace('{noun}', cfg.noun) : HERO[dot].text}</p>
        </div>
        <Icon name={cfg?.icon ?? 'add_business'} className={styles.heroGlyph} size={280} />
      </aside>

      <main className={styles.panel}>
        {!accountDone ? (
          accountPhase === 'credentials' ? (
            <AccountStep
              email={accountEmail}
              password={accountPassword}
              accountName={accountName}
              onEmail={setAccountEmail}
              onPassword={setAccountPassword}
              onName={setAccountName}
              onNext={submitAccount}
              loading={registering}
              error={!!registerError}
            />
          ) : (
            <>
              <div className={styles.panelTop}>
                <span className={styles.stepTag}>Шаг 1 из 4</span>
              </div>
              <h2 className={styles.panelTitle}>Подтверждение email</h2>
              <p className={styles.panelSub}>Остался последний шаг — введите код, который мы отправили вам на почту</p>
              <OtpConfirmForm
                email={accountEmail}
                purpose="register"
                onVerified={() => setAccountDone(true)}
                onBack={() => setAccountPhase('credentials')}
              />
            </>
          )
        ) : (
          <>
            {step === 1 && (
              <Step1 type={type} onPick={setLocalType} onNext={goStep2} cfgLabel={cfg?.noun} />
            )}
            {step === 2 && cfg && (
              <Step2 cfg={cfg} name={name} onName={setName} onBack={() => setStep(1)} onFinish={finish} />
            )}
            {step === 3 && cfg && (
              <Step3 cfg={cfg} name={name} onGo={() => navigate('/')} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

const AccountStep = ({
  email, password, accountName, onEmail, onPassword, onName, onNext, loading, error,
}: {
  email: string; password: string; accountName: string;
  onEmail: (v: string) => void; onPassword: (v: string) => void; onName: (v: string) => void;
  onNext: () => void; loading: boolean; error: boolean;
}) => {
  return (
    <>
      <div className={styles.panelTop}>
        <span className={styles.stepTag}>Шаг 1 из 4</span>
        <span className={styles.muted}>Уже есть аккаунт? <Link to="/login" className={styles.accentText}>Войти</Link></span>
      </div>
      <h2 className={styles.panelTitle}>Создайте аккаунт</h2>
      <p className={styles.panelSub}>Email и пароль для входа в кабинет — дальше подтвердите его кодом с почты</p>
      <div className={styles.grow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Ваше имя</span>
          <div className={styles.input}>
            <Icon name="person" size={21} color="var(--accent)" />
            <input value={accountName} onChange={(e) => onName(e.target.value)} placeholder="Имя" />
          </div>
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <div className={styles.input}>
            <Icon name="mail" size={21} color="var(--accent)" />
            <input value={email} onChange={(e) => onEmail(e.target.value)} type="email" placeholder="you@example.com" />
          </div>
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Пароль</span>
          <div className={styles.input}>
            <Icon name="lock" size={21} color="var(--accent)" />
            <input
              value={password}
              onChange={(e) => onPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              onKeyDown={(e) => { if (e.key === 'Enter') onNext(); }}
            />
          </div>
        </label>
        {error && <p className={styles.error}>Не удалось создать аккаунт — проверьте данные или email уже занят</p>}
      </div>
      <Button size="lg" fullWidth disabled={!email || !password || !accountName || loading} onClick={onNext}>
        {loading ? 'Отправляем код…' : 'Далее · подтвердить email'}
        <Icon name="arrow_forward" size={20} />
      </Button>
    </>
  );
};

const Step1 = ({ type, onPick, onNext, cfgLabel }: { type: BusinessType | null; onPick: (t: BusinessType) => void; onNext: () => void; cfgLabel?: string }) => {
  return (
    <>
      <div className={styles.panelTop}>
        <span className={styles.stepTag}>Шаг 2 из 4</span>
      </div>
      <h2 className={styles.panelTitle}>Какой у вас бизнес?</h2>
      <p className={styles.panelSub}>От выбора зависят разделы кабинета, услуги и аналитика</p>
      <div className={styles.grow}>
        <BusinessTypeSelect value={type} onChange={onPick} />
      </div>
      <Button size="lg" fullWidth disabled={!type} onClick={onNext}>
        {type ? `Далее · настроить ${cfgLabel}` : 'Выберите тип бизнеса'}
        <Icon name="arrow_forward" size={20} />
      </Button>
    </>
  );
};

const Step2 = ({ cfg, name, onName, onBack, onFinish }: { cfg: ReturnType<typeof getBusinessConfig>; name: string; onName: (v: string) => void; onBack: () => void; onFinish: () => void }) => {
  return (
    <>
      <div className={styles.panelTop}>
        <span className={styles.stepTag}>Шаг 3 из 4</span>
        <button type="button" className={styles.backBtn} onClick={onBack}><Icon name="arrow_back" size={18} />Назад</button>
      </div>
      <h2 className={styles.panelTitle}>Данные · {cfg.noun}</h2>
      <p className={styles.panelSub}>Эти данные увидят клиенты в приложении PetCare</p>
      <div className={styles.grow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Название</span>
          <div className={styles.input}>
            <Icon name="badge" size={21} color="var(--accent)" />
            <input value={name} onChange={(e) => onName(e.target.value)} placeholder="Название бизнеса" />
          </div>
        </label>
        <div className={styles.servicesLabel}>Услуги настроены под «{cfg.label}»</div>
        <div className={styles.chips}>
          {cfg.services.map((s) => (
            <span key={s} className={styles.chip}><Icon name="check" fill size={15} />{s}</span>
          ))}
        </div>
      </div>
      <Button size="lg" fullWidth onClick={onFinish}>Создать кабинет<Icon name="arrow_forward" size={20} /></Button>
    </>
  );
};

const Step3 = ({ cfg, name, onGo }: { cfg: ReturnType<typeof getBusinessConfig>; name: string; onGo: () => void }) => {
  return (
    <div className={styles.success}>
      <span className={styles.successIcon}><Icon name="task_alt" fill size={58} color="var(--accent)" /></span>
      <h2 className={styles.panelTitle}>Кабинет создан</h2>
      <p className={styles.panelSub}>«{name}» · разделы и услуги настроены под «{cfg.label}». Можно принимать заявки.</p>
      <Button size="lg" onClick={onGo}>Перейти в кабинет<Icon name="arrow_forward" size={20} /></Button>
    </div>
  );
};

const HERO: Record<number, { title: string; text: string }> = {
  1: { title: 'Создайте аккаунт', text: 'Email и пароль — дальше подтвердите его кодом, который придёт на почту.' },
  2: { title: 'Создайте кабинет под свой бизнес', text: 'Выберите тип — интерфейс, услуги и аналитика настроятся автоматически.' },
  3: { title: 'Расскажите о бизнесе', text: 'Кабинет уже настроен под {noun}. Осталось заполнить данные.' },
  4: { title: 'Всё готово!', text: 'Кабинет настроен под {noun}. Другой тип даст другой интерфейс.' },
};

const defaultName = (type: BusinessType): string => {
  return { vet: 'ВетДоктор', grooming: 'Лапки и Хвост', boarding: 'ДогХолидей', taxi: 'ЗооТакси Сити' }[type];
};
