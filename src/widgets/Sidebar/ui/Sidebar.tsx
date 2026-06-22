import type { BusinessConfig } from '@/shared/config/businessTypes';
import { Icon } from '@/shared/ui';
import { classNames } from '@/shared/lib/classNames';
import styles from './Sidebar.module.scss';

interface Props {
  config: BusinessConfig;
  activeId: string;
  collapsed?: boolean;
  onSelect: (id: string) => void;
}

export const Sidebar = ({ config, activeId, collapsed, onSelect }: Props) => {
  return (
    <aside className={classNames(styles.sidebar, { [styles.collapsed]: !!collapsed })}>
      <div className={styles.brand}>
        <span className={styles.logo} style={{ background: 'var(--accent-grad)' }}>
          <Icon name={config.icon} fill size={23} color="#fff" />
        </span>
        {!collapsed && (
          <div>
            <div className={styles.brandName}>PetCare</div>
            <div className={styles.brandKicker}>БИЗНЕС</div>
          </div>
        )}
      </div>

      <nav className={styles.nav}>
        {config.nav.map((item) => {
          const active: boolean = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              className={classNames(styles.item, { [styles.active]: active })}
              style={active ? { background: 'var(--accent-grad)' } : undefined}
              onClick={() => onSelect(item.id)}
            >
              <Icon name={item.icon} fill={active} size={21} />
              {!collapsed && <span className={styles.itemLabel}>{item.label}</span>}
              {item.badge ? (
                <span
                  className={classNames(styles.badge, { [styles.badgeCollapsed]: !!collapsed })}
                  style={{ background: active ? '#fff' : '#E5356A', color: active ? 'var(--accent)' : '#fff' }}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
