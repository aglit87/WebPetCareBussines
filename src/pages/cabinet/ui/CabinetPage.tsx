import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/shared/lib/hooks/redux';
import { selectBusinessConfig, selectBusinessProfile, selectIsRegistered } from '@/entities/business';
import { useGetDashboardQuery } from '@/entities/dashboard';
import type { BusinessConfig, NavItem } from '@/shared/config/businessTypes';
import { CabinetLayout } from '@/widgets/CabinetLayout';
import { DashboardWidget } from '@/widgets/DashboardWidget';
import { RecordsWidget } from '@/widgets/RecordsWidget';
import { ClientsWidget } from '@/widgets/ClientsWidget';
import { ScheduleWidget } from '@/widgets/ScheduleWidget';
import { ServicesWidget } from '@/widgets/ServicesWidget';
import { IncomeWidget } from '@/widgets/IncomeWidget';
import { ReviewsWidget } from '@/widgets/ReviewsWidget';
import { RoomsWidget } from '@/widgets/RoomsWidget';
import { DriversWidget } from '@/widgets/DriversWidget';
import { MapWidget } from '@/widgets/MapWidget';
import { Icon } from '@/shared/ui';
import styles from './CabinetPage.module.scss';

const renderSection = (activeId: string, config: BusinessConfig): JSX.Element | null => {
  switch (activeId) {
    case 'overview':
      return <DashboardWidget type={config.type} />;
    case 'records':
    case 'trips':
      return <RecordsWidget type={config.type} />;
    case 'clients':
      return <ClientsWidget type={config.type} />;
    case 'schedule':
      return <ScheduleWidget type={config.type} />;
    case 'services':
      return <ServicesWidget type={config.type} />;
    case 'income':
      return <IncomeWidget type={config.type} />;
    case 'reviews':
      return <ReviewsWidget type={config.type} />;
    case 'rooms':
      return <RoomsWidget type={config.type} />;
    case 'drivers':
      return <DriversWidget type={config.type} />;
    case 'map':
      return <MapWidget type={config.type} />;
    default:
      return null;
  }
};

export const CabinetPage = () => {
  const registered = useAppSelector(selectIsRegistered);
  const config = useAppSelector(selectBusinessConfig);
  const profile = useAppSelector(selectBusinessProfile);
  const [activeId, setActiveId] = useState<string>('overview');
  const isOverview: boolean = activeId === 'overview';
  // Подписка на дашборд для subtitle «Обзора»: кэш делится с DashboardWidget.
  const dashboard = useGetDashboardQuery(config?.type ?? 'vet', { skip: !isOverview });

  if (!registered || !config) return <Navigate to="/register" replace />;

  const activeNav: NavItem | undefined = config.nav.find((n) => n.id === activeId);
  const businessName: string = profile?.name ?? config.noun;
  const section: JSX.Element | null = renderSection(activeId, config);

  return (
    <CabinetLayout
      config={config}
      title={isOverview ? 'Обзор' : activeNav?.label ?? ''}
      subtitle={isOverview ? (dashboard.data?.subtitle ?? `${config.label} · ${businessName}`) : `${config.label} · ${businessName}`}
      activeId={activeId}
      onSelect={setActiveId}
    >
      {section ?? (
        <div className={styles.placeholder}>
          <span className={styles.icon}><Icon name={activeNav?.icon ?? 'dashboard'} size={44} color="var(--accent)" /></span>
          <div className={styles.title}>Раздел «{activeNav?.label}»</div>
          <div className={styles.text}>Этот раздел кабинета «{config.label}» в разработке.<br />Демонстрационный дашборд — на вкладке «Обзор».</div>
        </div>
      )}
    </CabinetLayout>
  );
};
