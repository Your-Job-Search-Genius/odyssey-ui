import {
  DatePicker as AriaDatePicker,
  Group,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Button as AriaButton,
  Popover,
  Label,
  Text,
} from "react-aria-components";
import type { DatePickerProps as AriaDatePickerProps, DateValue } from "react-aria-components";
import { Calendar01Icon } from "@your-job-search-genius/icons";
import { Calendar } from "../Calendar/Calendar";
import "../Select/popover-menu.css";
import "./DatePicker.css";

export interface DatePickerProps<T extends DateValue> extends Omit<AriaDatePickerProps<T>, "className" | "style" | "children"> {
  /** Visible, programmatically-associated label (WCAG 3.3.2 — always required, no `aria-label` escape hatch). */
  label: string;
  helperText?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DatePicker — built on `react-aria-components`' `DatePicker`: a `DateField`
 * for typing plus a `Calendar` popover for picking, kept in sync by the
 * behavior layer (value, `minValue`/`maxValue`, `isDateUnavailable` all flow
 * from `DatePicker` into the nested `Calendar` automatically via context —
 * see the composed API in the upstream docs). Not in the source Figma file
 * (design-inventory.md §2.14) — the field chrome matches `DateField`'s field
 * box exactly, the trigger button matches `ComboBox`'s toggle, and the
 * popover reuses this library's own `Calendar` component and shared
 * popover-menu chrome rather than inventing new visual language. **Use
 * when:** the value should default to compact text entry with an optional
 * visual picker. **Don't use when:** the user should always pick visually
 * from a grid inline (use `Calendar` directly) or only ever type a value
 * (use `DateField`).
 */
export function DatePicker<T extends DateValue>({
  label,
  helperText,
  errorMessage,
  className,
  style,
  isInvalid,
  ...props
}: DatePickerProps<T>) {
  const invalid = isInvalid ?? Boolean(errorMessage);

  return (
    <AriaDatePicker
      {...props}
      isInvalid={invalid}
      className={className ? `wsu-DatePicker ${className}` : "wsu-DatePicker"}
      style={style}
    >
      <Label className="wsu-DatePicker__label">{label}</Label>
      <Group className="wsu-DatePicker__group">
        <AriaDateInput className="wsu-DatePicker__field">
          {(segment) => <AriaDateSegment segment={segment} className="wsu-DatePicker__segment" />}
        </AriaDateInput>
        {/* react-aria-components' DatePicker context defaults this button's aria-label
            to "Calendar" and pairs it with an aria-labelledby of [self, field label] —
            unlike a plain VisuallyHidden child (silenced by that aria-labelledby, per
            ComboBox's toggle button comment), an explicit aria-label prop here *does*
            override the context default, since local props win over context. */}
        <AriaButton aria-label="Open calendar" className="wsu-DatePicker__trigger">
          <Calendar01Icon size="1rem" />
        </AriaButton>
      </Group>
      {invalid ? (
        <Text slot="errorMessage" className="wsu-DatePicker__message wsu-DatePicker__message--error">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text slot="description" className="wsu-DatePicker__message">
          {helperText}
        </Text>
      ) : null}
      {/* The dialog role react-aria-components puts on Popover needs its own accessible
          name (axe's aria-dialog-name rule) — it isn't satisfied by the Calendar inside
          having one, since that's a separate application-role landmark, not the dialog's
          own label. */}
      <Popover aria-label={`${label} calendar`} className="wsu-Popover wsu-DatePicker__popover">
        <Calendar aria-label={label} />
      </Popover>
    </AriaDatePicker>
  );
}
