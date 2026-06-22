import { BUSINESS_ORDER, getBusinessConfig, type BusinessConfig, type BusinessType } from '@/shared/config/businessTypes';
import { Icon } from '@/shared/ui';
import { classNames } from '@/shared/lib/classNames';
import styles from './BusinessTypeSelect.module.scss';

interface Props {
  value: BusinessType | null;
  onChange: (type: BusinessType) => void;
}

export const BusinessTypeSelect = ({ value, onChange }: Props) => {
  return (
    <div className={styles.grid}>
      {BUSINESS_ORDER.map((type) => {
        const cfg: BusinessConfig = getBusinessConfig(type);
        const selected: boolean = value === type;
        return (
          <button
            key={type}
            type="button"
            className={classNames(styles.card, { [styles.selected]: selected })}
            style={selected ? ({ ['--c' as string]: cfg.theme.accent } as object) : undefined}
            onClick={() => onChange(type)}
          >
            {selected && (
              <span className={styles.check} style={{ background: cfg.theme.accent }}>
                <Icon name="check" fill size={17} color="#fff" />
              </span>
            )}
            <span className={styles.iconBox} style={{ background: cfg.theme.accentTint }}>
              <Icon name={cfg.icon} fill size={26} color={cfg.theme.accent} />
            </span>
            <span className={styles.label}>{cfg.label}</span>
            <span className={styles.tagline}>{cfg.tagline}</span>
          </button>
        );
      })}
    </div>
  );
};
