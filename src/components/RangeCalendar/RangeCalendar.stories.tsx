import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import {
  CalendarDate,
  GregorianCalendar,
  getLocalTimeZone,
  isWeekend,
  parseDate,
  startOfWeek,
  today,
} from "@internationalized/date";
import type { AnyCalendarDate, Calendar as ICalendar, DateValue } from "@internationalized/date";
import {
  Button as AriaButton,
  CalendarMonthPicker,
  CalendarYearPicker,
  I18nProvider,
  RangeCalendar as AriaRangeCalendar,
} from "react-aria-components";
import { ArrowLeft01SharpIcon, ArrowRight01SharpIcon } from "@your-job-search-genius/icons";
import { Button } from "../Button/Button";
import { RangeCalendar, CalendarGrid, CalendarCell } from "./RangeCalendar";

const meta: Meta<typeof RangeCalendar> = {
  title: "Custom Components/RangeCalendar",
  component: RangeCalendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' RangeCalendar/CalendarGrid — the WAI-ARIA APG grid keyboard model plus range-anchoring (click a start date, arrow keys preview, click again commits the end) is handled entirely by the behavior layer. Not present in the source Figma file (design-inventory.md §2.14); reuses `Calendar`'s grid/cell/nav tokens, with a flat connecting bar between the start/end pills. **Use when:** picking a start/end range inline. **Don't use when:** only a single date is needed (use `Calendar`).",
      },
    },
  },
  args: { "aria-label": "Trip dates" },
};

export default meta;
type Story = StoryObj<typeof RangeCalendar>;

export const Playground: Story = {};

export const WithValue: Story = {
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState({ start: parseDate("2026-08-15"), end: parseDate("2026-08-22") });
      return <RangeCalendar {...args} value={value} onChange={(range) => range && setValue(range as typeof value)} />;
    }
    return <Controlled />;
  },
};

export const Validation: Story = {
  name: "Validation (designed, not in Figma)",
  args: {
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({ months: 2 }),
    isDateUnavailable: (date: DateValue) => isWeekend(date, "en-US"),
    errorMessage: "Weekends and dates outside the next two months aren't available.",
  },
};

export const MultiMonth: Story = {
  name: "Multi-month",
  args: { visibleDuration: { months: 2 } },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: { start: parseDate("2026-08-15"), end: parseDate("2026-08-22") } },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    const focusedCell = within(grid).getAllByRole("button").find((cell) => cell.getAttribute("tabindex") === "0");
    focusedCell?.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{Enter}");
    const selectedCells = canvas.getAllByRole("button").filter((cell) => cell.getAttribute("aria-selected") === "true");
    await expect(selectedCells.length).toBeGreaterThan(1);
  },
};

export const NonContiguousRanges: Story = {
  name: "Non-contiguous ranges (designed, not in Figma)",
  render: (args) => {
    function Controlled() {
      const now = today(getLocalTimeZone());
      const [range, setRange] = useState({ start: now.add({ days: 6 }), end: now.add({ days: 14 }) });
      const disabledRanges: [DateValue, DateValue][] = [
        [now, now.add({ days: 5 })],
        [now.add({ days: 15 }), now.add({ days: 17 })],
        [now.add({ days: 23 }), now.add({ days: 24 })],
      ];
      const isInvalid = range.end.compare(range.start) > 7;

      return (
        <RangeCalendar
          {...args}
          value={range}
          onChange={(value) => value && setRange(value as typeof range)}
          allowsNonContiguousRanges
          minValue={now}
          isDateUnavailable={(date, anchorDate) =>
            Boolean(anchorDate && Math.abs(date.compare(anchorDate)) > 7) ||
            disabledRanges.some((interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0)
          }
          isInvalid={isInvalid}
          errorMessage={isInvalid ? "Maximum stay duration is 1 week" : undefined}
        />
      );
    }
    return <Controlled />;
  },
};

export const InternationalCalendar: Story = {
  name: "International calendar (designed, not in Figma)",
  render: (args) => (
    <I18nProvider locale="en-US-u-ca-hebrew">
      <RangeCalendar {...args} defaultValue={{ start: parseDate("2025-02-03"), end: parseDate("2025-02-12") }} />
    </I18nProvider>
  ),
};

/**
 * A custom `Calendar` implementation following a fiscal 4-5-4 year (each
 * quarter is three months of 4/5/4 weeks) — see
 * https://nrf.com/resources/4-5-4-calendar. Ported from the
 * react-aria-components docs verbatim: it demonstrates that `createCalendar`
 * accepts any `@internationalized/date` `Calendar`, not just the built-in
 * (Gregorian/Hebrew/Islamic/etc.) identifiers `I18nProvider` switches
 * between.
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

export const CustomCalendarSystem: Story = {
  name: "Custom calendar system (designed, not in Figma)",
  args: {
    firstDayOfWeek: "sun",
    createCalendar: () => new Custom454(),
  },
};

export const DisplayOptions: Story = {
  name: "Display options — page behavior & first day of week",
  args: {
    visibleDuration: { months: 2 },
    pageBehavior: "single",
    firstDayOfWeek: "mon",
  },
};

export const ControlledFocusedDate: Story = {
  name: "Controlling the focused date",
  render: (args) => {
    function Controlled() {
      const defaultDate = new CalendarDate(2025, 7, 1);
      const [focusedDate, setFocusedDate] = useState<DateValue>(defaultDate);
      return (
        <div>
          <Button variant="secondary" size="sm" style={{ marginBottom: "1.25rem" }} onClick={() => setFocusedDate(today(getLocalTimeZone()))}>
            Today
          </Button>
          <RangeCalendar {...args} focusedValue={focusedDate} onFocusChange={setFocusedDate} />
        </div>
      );
    }
    return <Controlled />;
  },
};

export const MonthYearPickers: Story = {
  name: "Month and year pickers",
  render: (args) => (
    <AriaRangeCalendar aria-label={args["aria-label"]} className="wsu-Calendar wsu-RangeCalendar">
      <div className="wsu-Calendar__months">
        <div className="wsu-Calendar__month">
          {/* Composed directly from the raw react-aria-components primitives (not the
              `RangeCalendar` wrapper above, which always renders its own fixed
              CalendarHeading) plus this file's exported `CalendarGrid`/`CalendarCell`
              for the day-grid visuals. This system's own `Select` renders a mandatory
              visible label and popover chrome sized for a form field, not a compact
              inline header slot, so plain native `<select>`s stand in for the picker
              widgets here — matching how the header's prev/next controls are also
              unstyled `Button` primitives. */}
          <div className="wsu-Calendar__header">
            <AriaButton slot="previous" className="wsu-Calendar__nav">
              <ArrowLeft01SharpIcon size="1rem" />
            </AriaButton>
            <CalendarMonthPicker>
              {({ "aria-label": ariaLabel, value, onChange, items }) => (
                <select
                  aria-label={ariaLabel}
                  className="wsu-Calendar__heading"
                  value={String(value)}
                  onChange={(event) => onChange(Number(event.target.value))}
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.formatted}
                    </option>
                  ))}
                </select>
              )}
            </CalendarMonthPicker>
            <CalendarYearPicker>
              {({ "aria-label": ariaLabel, value, onChange, items }) => (
                <select
                  aria-label={ariaLabel}
                  className="wsu-Calendar__heading"
                  value={String(value)}
                  onChange={(event) => onChange(Number(event.target.value))}
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.formatted}
                    </option>
                  ))}
                </select>
              )}
            </CalendarYearPicker>
            <AriaButton slot="next" className="wsu-Calendar__nav">
              <ArrowRight01SharpIcon size="1rem" />
            </AriaButton>
          </div>
          <CalendarGrid className="wsu-CalendarGrid">{(date) => <CalendarCell date={date} />}</CalendarGrid>
        </div>
      </div>
    </AriaRangeCalendar>
  ),
};
