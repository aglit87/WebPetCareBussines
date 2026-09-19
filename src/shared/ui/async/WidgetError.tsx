import { Button, Icon } from 'petcare-storybook-ui';
import styles from './WidgetError.module.scss';

export interface WidgetErrorProps {
  onRetry?: () => void;
}

// Единый экран ошибки данных для всех data-виджетов кабинета.
// Раньше разметка и текст дублировались в каждом виджете.
export const WidgetError = ({ onRetry }: WidgetErrorProps) => {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, #FCE4EC, #FFF1F5)' }}>
        <Icon name="cloud_off" size={56} color="#EE7BA0" />
      </span>
      <div className={styles.stateTitle}>Нет соединения с сервером</div>
      <div className={styles.stateText}>Проверьте подключение и попробуйте снова — данные сохранены.</div>
      {onRetry ? (
        <Button size="lg" onClick={onRetry}><Icon name="refresh" size={19} />Повторить</Button>
      ) : null}
    </div>
  );
};