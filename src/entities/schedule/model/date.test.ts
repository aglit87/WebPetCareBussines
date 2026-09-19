import { describe, expect, it } from 'vitest';
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
  parseISODate,
  toISODate,
  toISOMonth,
  todayISODate,
  weekOfDate,
} from './date';

describe('entities/schedule/model/date', () => {
  describe('toISODate / toISOMonth / parseISODate', () => {
    it('форматирует дату с паддингом месяца и дня', () => {
      expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
      expect(toISODate(new Date(2026, 11, 31))).toBe('2026-12-31');
      expect(toISOMonth(new Date(2026, 8, 12))).toBe('2026-09');
    });

    it('parseISODate делает round-trip', () => {
      expect(toISODate(parseISODate('2026-09-12'))).toBe('2026-09-12');
    });
  });

  describe('addDays', () => {
    it('пересекает границы месяца и года', () => {
      expect(addDays('2026-09-30', 1)).toBe('2026-10-01');
      expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
      expect(addDays('2027-01-01', -1)).toBe('2026-12-31');
    });

    it('не падает в високосный февраль', () => {
      expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
      expect(addDays('2028-02-29', 1)).toBe('2028-03-01');
    });
  });

  describe('addMonths / monthOfDate', () => {
    it('пересекает год', () => {
      expect(addMonths('2026-12', 1)).toBe('2027-01');
      expect(addMonths('2026-01', -1)).toBe('2025-12');
      expect(monthOfDate('2026-09-12')).toBe('2026-09');
    });
  });

  describe('weekOfDate / addWeeks / getWeekDays', () => {
    it('возвращает понедельник недели для среды', () => {
      // 2026-09-12 — суббота
      expect(weekOfDate('2026-09-12')).toBe('2026-09-07');
    });

    it('воскресенье относится к неделе, начинающейся в понедельник', () => {
      expect(weekOfDate('2026-09-13')).toBe('2026-09-07');
    });

    it('addWeeks сохраняет понедельник недели', () => {
      expect(addWeeks('2026-09-07', 1)).toBe('2026-09-14');
      expect(addWeeks('2026-09-07', -1)).toBe('2026-08-31');
    });

    it('getWeekDays возвращает 7 дат от понедельника', () => {
      expect(getWeekDays('2026-09-07')).toEqual([
        '2026-09-07',
        '2026-09-08',
        '2026-09-09',
        '2026-09-10',
        '2026-09-11',
        '2026-09-12',
        '2026-09-13',
      ]);
    });
  });

  describe('getMonthGrid', () => {
    it('строит сетку 6x7 для сентября 2026', () => {
      const grid = getMonthGrid('2026-09');
      expect(grid).toHaveLength(6);
      grid.forEach((week) => expect(week).toHaveLength(7));
      // 2026-09-01 — вторник, значит сетка начинается с 2026-08-31 (пн)
      expect(grid[0][0]).toEqual({ date: '2026-08-31', inMonth: false });
      expect(grid[0][1]).toEqual({ date: '2026-09-01', inMonth: true });
      expect(grid[5][6]).toEqual({ date: '2026-10-11', inMonth: false });
    });
  });

  describe('formatScheduleDate', () => {
    it('помечает сегодня/завтра/вчера относительно текущей даты', () => {
      const today = todayISODate();
      expect(formatScheduleDate(today)).toMatch(/^Сегодня · /);
      expect(formatScheduleDate(addDays(today, 1))).toMatch(/^Завтра · /);
      expect(formatScheduleDate(addDays(today, -1))).toMatch(/^Вчера · /);
    });

    it('помечает дальние даты днём недели', () => {
      const future = addDays(todayISODate(), 5);
      expect(formatScheduleDate(future)).not.toMatch(/^(Сегодня|Завтра|Вчера) · /);
    });
  });

  describe('formatMonthLabel / formatWeekLabel', () => {
    it('форматирует заголовок месяца', () => {
      expect(formatMonthLabel('2026-09')).toMatch(/^[Сс]ентябр\w*/);
      expect(formatMonthLabel('2026-09')).toContain('2026');
    });

    it('форматирует диапазон недели с годом', () => {
      const label = formatWeekLabel('2026-08-31');
      expect(label).toMatch(/^31 /);
      expect(label).toContain('сентябр');
      expect(label).toContain('2026');
    });
  });
});