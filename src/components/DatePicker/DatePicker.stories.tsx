import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { getLocalTimeZone, isWeekend, parseDate, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Custom Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' DatePicker — a DateField for typing plus a Calendar popover for picking, kept in sync by the behavior layer. Not present in the source Figma file (design-inventory.md §2.14); field chrome matches DateField, the trigger matches ComboBox's toggle, and the popover reuses this library's own Calendar component. **Use when:** the value should default to compact text entry with an optional visual picker. **Don't use when:** the user should always pick visually from a grid inline (use `Calendar`) or only ever type a value (use `DateField`).",
      },
    },
  },
  args: { label: "Appointment date" },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Playground: Story = {};

export const WithValue: Story = {
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState(parseDate("2026-08-31"));
      return <DatePicker {...args} value={value} onChange={(date) => date && setValue(date as typeof value)} />;
    }
    return <Controlled />;
  },
};

export const HelperText: Story = {
  args: { helperText: "Business hours only." },
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
  args: { isDisabled: true, defaultValue: parseDate("2026-08-31") },
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
    await expect(canvas.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  },
};
