import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { getLocalTimeZone, parseDate, parseZonedDateTime, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { DateField } from "./DateField";

const meta: Meta<typeof DateField> = {
  title: "Custom Components/DateField",
  component: DateField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' `DateField`/`DateInput` — splitting a date into individually-editable, arrow-key-adjustable segments and formatting/parsing per the user's locale and calendar system is handled entirely by the behavior layer. Not present in the source Figma file (design-inventory.md §2.14); field chrome matches `Input`/`ColorField`'s field box, and the focused-segment highlight reuses the primary color token. **Use when:** typing an exact date/time value directly. **Don't use when:** the user should pick visually from a grid (use `Calendar`).",
      },
    },
  },
  args: { label: "Appointment date" },
};

export default meta;
type Story = StoryObj<typeof DateField>;

export const Playground: Story = {};

export const WithValue: Story = {
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState<DateValue | null>(parseDate("2026-08-31"));
      return <DateField {...args} value={value} onChange={setValue} />;
    }
    return <Controlled />;
  },
};

export const WithTime: Story = {
  name: "With time (granularity=minute)",
  args: { defaultValue: parseZonedDateTime("2026-08-31T08:45:00[America/Los_Angeles]") },
};

export const Required: Story = {
  args: { isRequired: true, minValue: today(getLocalTimeZone()) },
};

export const WithHelperText: Story = {
  args: { helperText: "Use MM/DD/YYYY format." },
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  args: { errorMessage: "That date isn't available.", isInvalid: true, defaultValue: parseDate("2026-08-31") },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: parseDate("2026-08-31") },
};

export const TypingUpdatesValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const segments = canvas.getAllByRole("spinbutton");
    (segments[0] as HTMLElement).focus();
    await userEvent.keyboard("08");
    await userEvent.keyboard("31");
    await userEvent.keyboard("2026");
    await expect(canvas.getByLabelText(/^year/i)).toHaveTextContent("2026");
  },
};
