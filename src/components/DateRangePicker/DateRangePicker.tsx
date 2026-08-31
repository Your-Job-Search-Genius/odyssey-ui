import {
  DateRangePicker as AriaDateRangePicker,
  Group,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Button as AriaButton,
  Popover,
  Label,
  Text,
} from "react-aria-components";
import type { DateRangePickerProps as AriaDateRangePickerProps, DateValue } from "react-aria-components";
import { Calendar01Icon } from "@your-job-search-genius/icons";
import { RangeCalendar } from "../RangeCalendar/RangeCalendar";
import "../Select/popover-menu.css";
import "./DateRangePicker.css";

export interface DateRangePickerProps<T extends DateValue> extends Omit<AriaDateRangePickerProps<T>, "className" | "style" | "children"> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DateRangePicker — built on `react-aria-components`' `DateRangePicker`: two
 * `DateInput`s (start/end) for typing plus a `RangeCalendar` popover for
 * picking, kept in sync by the behavior layer (value, `minValue`/`maxValue`,
 * `isDateUnavailable` all flow from `DateRangePicker` into the nested
 * `RangeCalendar` automatically via context, same composed-API pattern as
 * `DatePicker`/`Calendar`). Not in the source Figma file
 * (design-inventory.md §2.14) — the field chrome matches `DatePicker`'s
 * group exactly (44px row, 10px radius, inset stroke), the trigger reuses
 * `DatePicker`'s toggle button, and the popover reuses this library's own
 * `RangeCalendar` and shared popover-menu chrome rather than inventing new
 * visual language. **Use when:** the value is a start/end range that should
 * default to compact text entry with an optional visual picker. **Don't use
 * when:** only a single date is needed (use `DatePicker`) or the range
 * should always be picked visually inline (use `RangeCalendar` directly).
 */
export function DateRangePicker<T extends DateValue>({
  label,
  helperText,
  errorMessage,
  className,
  style,
  isInvalid,
  ...props
}: DateRangePickerProps<T>) {
  const invalid = isInvalid ?? Boolean(errorMessage);

  return (
    <AriaDateRangePicker
      {...props}
      isInvalid={invalid}
      className={className ? `wsu-DateRangePicker ${className}` : "wsu-DateRangePicker"}
      style={style}
    >
      <Label className="wsu-DateRangePicker__label">{label}</Label>
      <Group className="wsu-DateRangePicker__group">
        <div className="wsu-DateRangePicker__fields">
          <AriaDateInput slot="start" className="wsu-DateRangePicker__field">
            {(segment) => <AriaDateSegment segment={segment} className="wsu-DateRangePicker__segment" />}
          </AriaDateInput>
          <span className="wsu-DateRangePicker__dash" aria-hidden="true">
            –
          </span>
          <AriaDateInput slot="end" className="wsu-DateRangePicker__field">
            {(segment) => <AriaDateSegment segment={segment} className="wsu-DateRangePicker__segment" />}
          </AriaDateInput>
        </div>
        {/* react-aria-components' DateRangePicker context defaults this button's
            aria-label to "Calendar" and pairs it with an aria-labelledby of [self,
            field label] — an explicit aria-label prop here overrides the context
            default, since local props win over context (same as DatePicker's trigger). */}
        <AriaButton aria-label="Open calendar" className="wsu-DateRangePicker__trigger">
          <Calendar01Icon size="1rem" />
        </AriaButton>
      </Group>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-DateRangePicker__message wsu-DateRangePicker__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-DateRangePicker__message">
          {helperText}
        </Text>
      ) : null}
      {/* The dialog role react-aria-components puts on Popover needs its own accessible
          name (axe's aria-dialog-name rule) — it isn't satisfied by the RangeCalendar
          inside having one, since that's a separate application-role landmark, not the
          dialog's own label. */}
      <Popover aria-label={`${label} calendar`} className="wsu-Popover wsu-DateRangePicker__popover">
        <RangeCalendar aria-label={label} />
      </Popover>
    </AriaDateRangePicker>
  );
}
