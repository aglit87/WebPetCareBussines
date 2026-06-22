import { useState, type ReactNode } from 'react';
import type { BusinessConfig } from '@/shared/config/businessTypes';
import { useBusinessTheme } from '@/shared/lib/useBusinessTheme';
import { Sidebar } from '@/widgets/Sidebar';
import { Topbar } from '@/widgets/Topbar';
import styles from './CabinetLayout.module.scss';

interface Props {
  config: BusinessConfig;
  title: string;
  subtitle: string;
  activeId: string;
  onSelect: (id: string) => void;
  children: ReactNode;
}

export const CabinetLayout = ({ config, title, subtitle, activeId, onSelect, children }: Props) => {
  const themeStyle = useBusinessTheme(config.type);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className={styles.cabinet} style={themeStyle}>
      <Sidebar config={config} activeId={activeId} collapsed={collapsed} onSelect={onSelect} />
      <div className={styles.main}>
        <Topbar title={title} subtitle={subtitle} onMenu={() => setCollapsed((c) => !c)} />
        <div className={styles.content}>
          <div className={styles.contentInner}>{children}</div>
        </div>
      </div>
    </div>
  );
};
