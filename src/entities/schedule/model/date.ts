const pad = (n: number): string => String(n).padStart(2, '0');
const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export const toISODate = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const toISOMonth = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

export const parseISODate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayISODate = (): string => toISODate(new Date());
export const monthOfDate = (iso: string): string => iso.slice(0, 7);

export const addDays = (iso: string, delta: number): string => {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + delta);
  return toISODate(date);
};

export const addMonths = (monthIso: string, delta: number): string => {
  const [y, m] = monthIso.split('-').map(Number);
  return toISOMonth(new Date(y, m - 1 + delta, 1));
};

/** «Сегодня · вторник, 24 июня» / «Завтра · …» / «Среда, 25 июня». */
export const formatScheduleDate = (iso: string): string => {
  const date = parseISODate(iso);
  const diffDays = Math.round((date.getTime() - parseISODate(todayISODate()).getTime()) / 86_400_000);
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  const dayMonth = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  if (diffDays === 0) return `Сегодня · ${weekday}, ${dayMonth}`;
  if (diffDays === 1) return `Завтра · ${weekday}, ${dayMonth}`;
  if (diffDays === -1) return `Вчера · ${weekday}, ${dayMonth}`;
  return `${capitalize(weekday)}, ${dayMonth}`;
};

/** «Июнь 2026». */
export const formatMonthLabel = (monthIso: string): string => {
  const [y, m] = monthIso.split('-').map(Number);
  return capitalize(new Date(y, m - 1, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }));
};

/** Понедельник ISO-недели, которой принадлежит дата. */
export const weekOfDate = (iso: string): string => {
  const date = parseISODate(iso);
  const monday = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - monday);
  return toISODate(date);
};

export const addWeeks = (mondayIso: string, delta: number): string => addDays(mondayIso, delta * 7);

/** 7 дат недели (пн–вс), начиная с переданного понедельника. */
export const getWeekDays = (mondayIso: string): string[] => Array.from({ length: 7 }, (_, i) => addDays(mondayIso, i));

/** «23–29 июня 2026». */
export const formatWeekLabel = (mondayIso: string): string => {
  const start = parseISODate(mondayIso);
  const end = parseISODate(addDays(mondayIso, 6));
  const startDay = start.getDate();
  const endLabel = end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  if (start.getMonth() === end.getMonth()) return `${startDay}–${endLabel}`;
  const startLabel = start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  return `${startLabel} – ${endLabel}`;
};

export interface MonthGridDay {
  date: string;
  inMonth: boolean;
}

export const WEEKDAY_LABELS: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/** Полная сетка месяца (6 недель по 7 дней, пн–вс), с днями соседних месяцев для заполнения. */
export const getMonthGrid = (monthIso: string): MonthGridDay[][] => {
  const [y, m] = monthIso.split('-').map(Number);
  const firstOfMonth = new Date(y, m - 1, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const cursor = new Date(firstOfMonth);
  cursor.setDate(cursor.getDate() - startWeekday);

  const weeks: MonthGridDay[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: MonthGridDay[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({ date: toISODate(cursor), inMonth: cursor.getMonth() === m - 1 });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
};
