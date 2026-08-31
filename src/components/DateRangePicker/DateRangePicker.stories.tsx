import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { getLocalTimeZone, isWeekend, parseDate, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { DateRangePicker } from "./DateRangePicker";

const meta: Meta<typeof DateRangePicker> = {
  title: "Custom Components/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' DateRangePicker — two DateInputs (start/end) for typing plus a RangeCalendar popover for picking, kept in sync by the behavior layer. Not present in the source Figma file (design-inventory.md §2.14); field chrome matches DatePicker's group, the trigger matches DatePicker's toggle, and the popover reuses this library's own RangeCalendar component. **Use when:** the value is a start/end range that should default to compact text entry with an optional visual picker. **Don't use when:** only a single date is needed (use `DatePicker`) or the range should always be picked visually inline (use `RangeCalendar`).",
      },
    },
  },
  args: { label: "Trip dates" },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Playground: Story = {};

export const WithValue: Story = {
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState({ start: parseDate("2026-08-15"), end: parseDate("2026-08-22") });
      return <DateRangePicker {...args} value={value} onChange={(range) => range && setValue(range as typeof value)} />;
    }
    return <Controlled />;
  },
};

export const HelperText: Story = {
  args: { helperText: "Minimum 3-night stay." },
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

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: { start: parseDate("2026-08-15"), end: parseDate("2026-08-22") } },
};

export const OpenAndSelect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button");
    await userEvent.click(trigger);
    const grid = await within(document.body).findByRole("grid");
    const focusedCell = within(grid).getAllByRole("button").find((cell) => cell.getAttribute("tabindex") === "0");
    focusedCell?.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  },
};
