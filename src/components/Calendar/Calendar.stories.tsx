import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { getLocalTimeZone, isWeekend, parseDate, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { Calendar } from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Custom Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' Calendar/CalendarGrid — the WAI-ARIA APG grid keyboard model (arrow keys move by day, Page Up/Down page by month) is handled entirely by the behavior layer. Not present in the source Figma file (design-inventory.md §2.14); spacing/radius/color/focus-ring reuse this system's existing tokens. **Use when:** picking a single date inline. **Don't use when:** the value needs to live behind a trigger/popover (compose this inside a `Popover`) or a range of dates must be selected.",
      },
    },
  },
  args: { "aria-label": "Appointment date" },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Playground: Story = {};

export const WithValue: Story = {
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState(parseDate("2026-08-31"));
      return <Calendar {...args} value={value} onChange={(date) => setValue(date as typeof value)} />;
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
  args: { isDisabled: true, defaultValue: parseDate("2026-08-31") },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    const focusedCell = within(grid).getAllByRole("button").find((cell) => cell.getAttribute("tabindex") === "0");
    focusedCell?.focus();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{Enter}");
    const selectedCells = canvas.getAllByRole("button").filter((cell) => cell.getAttribute("aria-selected") === "true");
    await expect(selectedCells.length).toBeGreaterThan(0);
  },
};
