import { RangeCalendar } from "@your-job-search-genius/odyssey-ui";
import { CalendarDate, GregorianCalendar, startOfWeek } from "@internationalized/date";
import type { AnyCalendarDate, Calendar as ICalendar } from "@internationalized/date";

/**
 * A custom `Calendar` implementation following a fiscal 4-5-4 year (each
 * quarter is three months of 4/5/4 weeks) — see
 * https://nrf.com/resources/4-5-4-calendar. Ported from the
 * react-aria-components docs verbatim: it demonstrates that `createCalendar`
 * accepts any `@internationalized/date` `Calendar`, not just the built-in
 * (Gregorian/Hebrew/Islamic/etc.) identifiers locale switching uses.
 */
class Custom454 extends GregorianCalendar {
  anchorDate = new CalendarDate(2001, 2, 4);

  private getYear(year: number): [CalendarDate, number[]] {
    const anchor = this.anchorDate.set({ year });
    const startOfYear = startOfWeek(anchor, "en", "sun");
    const isBigYear = !startOfYear.add({ weeks: 53 }).compare(anchor.add({ years: 1 }));
    const weekPattern = [4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, isBigYear ? 5 : 4];
    return [startOfYear, weekPattern];
  }

  getDaysInMonth(date: AnyCalendarDate): number {
    const [, weekPattern] = this.getYear(date.year);
    return weekPattern[date.month - 1]! * 7;
  }

  fromJulianDay(jd: number): CalendarDate {
    const gregorian = super.fromJulianDay(jd);
    let year = gregorian.year;

    let [monthStart, weekPattern] = this.getYear(year);
    if (gregorian.compare(monthStart) < 0) {
      year--;
      [monthStart, weekPattern] = this.getYear(year);
    }

    for (let month = 1; month <= 12; month++) {
      const weeks = weekPattern[month - 1];
      const nextMonth = monthStart.add({ weeks });
      if (nextMonth.compare(gregorian) > 0) {
        const days = gregorian.compare(monthStart);
        return new CalendarDate(this, year, month, days + 1);
      }
      monthStart = nextMonth;
    }

    throw new Error("date not found");
  }

  toJulianDay(date: AnyCalendarDate): number {
    const [yearStart, weekPattern] = this.getYear(date.year);
    let monthStart = yearStart;
    for (let month = 1; month < date.month; month++) {
      monthStart = monthStart.add({ weeks: weekPattern[month - 1] });
    }

    const gregorian = monthStart.add({ days: date.day - 1 });
    return super.toJulianDay(gregorian);
  }

  getFormattableMonth(date: AnyCalendarDate): CalendarDate {
    const anchorMonth = this.anchorDate.month - 1;
    const dateMonth = date.month - 1;
    const month = ((anchorMonth + dateMonth) % 12) + 1;
    const year = anchorMonth + dateMonth >= 12 ? date.year + 1 : date.year;
    return new CalendarDate(year, month, 1);
  }

  isEqual(other: ICalendar): boolean {
    return other instanceof Custom454 && other.anchorDate.compare(this.anchorDate) === 0;
  }
}

export default function RangeCalendarCustomCalendarSystem() {
  return <RangeCalendar aria-label="Trip dates" firstDayOfWeek="sun" createCalendar={() => new Custom454()} />;
}
