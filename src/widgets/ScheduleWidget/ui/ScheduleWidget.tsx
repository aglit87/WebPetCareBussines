import { useState } from 'react';
import { Card, Icon, Button, Skeleton } from '@/shared/ui';
import {
  addDays,
  addMonths,
  addWeeks,
  formatMonthLabel,
  formatScheduleDate,
  formatWeekLabel,
  getMonthGrid,
  getWeekDays,
  monthOfDate,
  todayISODate,
  useGetScheduleMonthQuery,
  useGetScheduleQuery,
  weekOfDate,
  WEEKDAY_LABELS,
} from '@/entities/schedule';
import type { BusinessType } from '@/shared/config/businessTypes';
import { classNames } from '@/shared/lib/classNames';
import styles from './ScheduleWidget.module.scss';

type View = 'day' | 'week' | 'month';

const HOURS: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

export const ScheduleWidget = ({ type }: { type: BusinessType }) => {
  const [view, setView] = useState<View>('day');
  const [selectedDate, setSelectedDate] = useState<string>(todayISODate());
  const [weekCursor, setWeekCursor] = useState<string>(weekOfDate(todayISODate()));
  const [monthCursor, setMonthCursor] = useState<string>(monthOfDate(todayISODate()));

  const openDay = (date: string): void => {
    setSelectedDate(date);
    setWeekCursor(weekOfDate(date));
    setMonthCursor(monthOfDate(date));
    setView('day');
  };

  return (
    <div className={styles.wrap}>
      <Card padding={0}>
        <div className={styles.toolbar}>
          <div className={styles.viewToggle}>
            <button type="button" className={view === 'day' ? styles.viewBtnActive : styles.viewBtn} onClick={() => setView('day')}>День</button>
            <button type="button" className={view === 'week' ? styles.viewBtnActive : styles.viewBtn} onClick={() => setView('week')}>Неделя</button>
            <button type="button" className={view === 'month' ? styles.viewBtnActive : styles.viewBtn} onClick={() => setView('month')}>Месяц</button>
          </div>
          {view === 'day' && <DayNav date={selectedDate} onChange={openDay} />}
          {view === 'week' && <WeekNav week={weekCursor} onChange={setWeekCursor} />}
          {view === 'month' && <MonthNav month={monthCursor} onChange={setMonthCursor} />}
        </div>
        {view === 'day' && <DayView type={type} date={selectedDate} />}
        {view === 'week' && <WeekView type={type} week={weekCursor} onPickDay={openDay} />}
        {view === 'month' && <MonthView type={type} month={monthCursor} onPickDay={openDay} />}
      </Card>
    </div>
  );
};

const DayNav = ({ date, onChange }: { date: string; onChange: (date: string) => void }) => {
  const isToday: boolean = date === todayISODate();
  return (
    <div className={styles.nav}>
      <button type="button" className={styles.navArrow} onClick={() => onChange(addDays(date, -1))} aria-label="Предыдущий день">
        <Icon name="chevron_left" size={18} />
      </button>
      <span className={styles.navLabel}>{formatScheduleDate(date)}</span>
      <button type="button" className={styles.navArrow} onClick={() => onChange(addDays(date, 1))} aria-label="Следующий день">
        <Icon name="chevron_right" size={18} />
      </button>
      {!isToday && (
        <button type="button" className={styles.todayBtn} onClick={() => onChange(todayISODate())}>Сегодня</button>
      )}
    </div>
  );
};

const WeekNav = ({ week, onChange }: { week: string; onChange: (week: string) => void }) => {
  const isCurrentWeek: boolean = week === weekOfDate(todayISODate());
  return (
    <div className={styles.nav}>
      <button type="button" className={styles.navArrow} onClick={() => onChange(addWeeks(week, -1))} aria-label="Предыдущая неделя">
        <Icon name="chevron_left" size={18} />
      </button>
      <span className={styles.navLabel}>{formatWeekLabel(week)}</span>
      <button type="button" className={styles.navArrow} onClick={() => onChange(addWeeks(week, 1))} aria-label="Следующая неделя">
        <Icon name="chevron_right" size={18} />
      </button>
      {!isCurrentWeek && (
        <button type="button" className={styles.todayBtn} onClick={() => onChange(weekOfDate(todayISODate()))}>Эта неделя</button>
      )}
    </div>
  );
};

const MonthNav = ({ month, onChange }: { month: string; onChange: (month: string) => void }) => {
  const isCurrentMonth: boolean = month === monthOfDate(todayISODate());
  return (
    <div className={styles.nav}>
      <button type="button" className={styles.navArrow} onClick={() => onChange(addMonths(month, -1))} aria-label="Предыдущий месяц">
        <Icon name="chevron_left" size={18} />
      </button>
      <span className={styles.navLabel}>{formatMonthLabel(month)}</span>
      <button type="button" className={styles.navArrow} onClick={() => onChange(addMonths(month, 1))} aria-label="Следующий месяц">
        <Icon name="chevron_right" size={18} />
      </button>
      {!isCurrentMonth && (
        <button type="button" className={styles.todayBtn} onClick={() => onChange(monthOfDate(todayISODate()))}>Этот месяц</button>
      )}
    </div>
  );
};

const DayView = ({ type, date }: { type: BusinessType; date: string }) => {
  const { data, isLoading, isError, refetch } = useGetScheduleQuery({ type, date });

  if (isLoading) return <DayViewSkeleton />;
  if (isError || !data) return <ScheduleError onRetry={refetch} />;

  return (
    <>
      {data.slots.map((s) => (
        <div key={s.time} className={s.status === 'busy' ? styles.rowBusy : styles.rowFree}>
          <span className={styles.time}>{s.time}</span>
          {s.status === 'busy' ? (
            <div className={styles.rowMain}>
              <div className={styles.rowTitle}>{s.pet}</div>
              <div className={styles.rowSub}>{s.client} · {s.service}</div>
            </div>
          ) : (
            <div className={styles.rowFreeText}>
              <Icon name="add" size={16} color="var(--accent)" />
              Свободно
            </div>
          )}
        </div>
      ))}
    </>
  );
};

const WeekView = ({ type, week, onPickDay }: { type: BusinessType; week: string; onPickDay: (date: string) => void }) => {
  const days = getWeekDays(week);
  const today: string = todayISODate();

  return (
    <div className={styles.week}>
      <div className={styles.weekHead}>
        <div className={styles.weekTimeCol} />
        {days.map((date) => {
          const d = new Date(`${date}T00:00:00`);
          return (
            <button
              key={date}
              type="button"
              className={classNames(styles.weekHeadCell, { [styles.weekHeadCellToday]: date === today })}
              onClick={() => onPickDay(date)}
            >
              <span className={styles.weekHeadWeekday}>{WEEKDAY_LABELS[(d.getDay() + 6) % 7]}</span>
              <span className={styles.weekHeadDate}>{d.getDate()}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.weekBody}>
        <div className={styles.weekTimeCol}>
          {HOURS.map((h) => <span key={h} className={styles.weekTimeLabel}>{h}</span>)}
        </div>
        {days.map((date) => <WeekDayColumn key={date} type={type} date={date} onPick={onPickDay} />)}
      </div>
    </div>
  );
};

const WEEK_EVENT_TONES = ['weekEventGreen', 'weekEventBlue', 'weekEventOrange'] as const;

const WeekDayColumn = ({ type, date, onPick }: { type: BusinessType; date: string; onPick: (date: string) => void }) => {
  const { data, isLoading } = useGetScheduleQuery({ type, date });
  const busySlots = data?.slots.filter((s) => s.status === 'busy') ?? [];

  return (
    <div className={styles.weekDayCol} onClick={() => onPick(date)} role="presentation">
      {HOURS.map((_, i) => <div key={i} className={styles.weekGridRow} />)}
      {isLoading && <Skeleton height={40} radius={8} style={{ position: 'absolute', top: 4, left: 4, right: 4 }} />}
      {busySlots.map((s, i) => {
        const rowIndex = HOURS.indexOf(s.time);
        if (rowIndex === -1) return null;
        const tone = styles[WEEK_EVENT_TONES[i % WEEK_EVENT_TONES.length]];
        return (
          <div
            key={s.time}
            className={classNames(styles.weekEvent, { [tone]: true })}
            style={{ top: `${rowIndex * 56 + 4}px` }}
            onClick={(e) => { e.stopPropagation(); onPick(date); }}
          >
            <div className={styles.weekEventTitle}>{s.pet} · {s.service}</div>
            <div className={styles.weekEventSub}>{s.time} · {s.client}</div>
          </div>
        );
      })}
    </div>
  );
};

const MonthView = ({ type, month, onPickDay }: { type: BusinessType; month: string; onPickDay: (date: string) => void }) => {
  const { data, isLoading, isError, refetch } = useGetScheduleMonthQuery({ type, month });

  if (isLoading) return <MonthViewSkeleton />;
  if (isError || !data) return <ScheduleError onRetry={refetch} />;

  const counts = new Map(data.days.map((d) => [d.date, d]));
  const weeks = getMonthGrid(month);
  const today: string = todayISODate();

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHead}>
        {WEEKDAY_LABELS.map((label) => <span key={label}>{label}</span>)}
      </div>
      {weeks.map((week) => (
        <div key={week[0].date} className={styles.calendarRow}>
          {week.map((day) => {
            const count = counts.get(day.date);
            return (
              <button
                key={day.date}
                type="button"
                className={classNames(styles.calendarCell, {
                  [styles.calendarCellMuted]: !day.inMonth,
                  [styles.calendarCellToday]: day.date === today,
                })}
                onClick={() => onPickDay(day.date)}
              >
                <span className={styles.calendarDate}>{Number(day.date.slice(8, 10))}</span>
                {!!count?.busy && <span className={styles.calendarBadge}>{count.busy}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const ScheduleError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className={styles.state}>
      <span className={styles.stateIcon} style={{ background: 'radial-gradient(circle at 50% 38%, #FCE4EC, #FFF1F5)' }}>
        <Icon name="cloud_off" size={56} color="#EE7BA0" />
      </span>
      <div className={styles.stateTitle}>Нет соединения с сервером</div>
      <div className={styles.stateText}>Проверьте подключение и попробуйте снова — данные сохранены.</div>
      <Button size="lg" onClick={onRetry}><Icon name="refresh" size={19} />Повторить</Button>
    </div>
  );
};

const DayViewSkeleton = () => {
  return (
    <div className={styles.skeletonPad}>
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} height={44} radius={12} style={{ marginBottom: 10, opacity: 1 - i * 0.08 }} />
      ))}
    </div>
  );
};

const MonthViewSkeleton = () => {
  return (
    <div className={styles.skeletonPad}>
      <Skeleton height={220} radius={12} />
    </div>
  );
};
