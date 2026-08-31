import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { OtpInput } from "./OtpInput";

const meta: Meta<typeof OtpInput> = {
  title: "Custom Components/OtpInput",
  component: OtpInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Designed from the WAI-ARIA APG pattern plus this system's own visual language (radius, spacing, colour and focus tokens), and re-checked against the corrected tokens after the Figma audit. Not present in the source Figma file — the segmented-boxes pattern follows WAI-ARIA APG's PIN/OTP recommendations. Plain `<input>` elements, no behavior library needed: typing auto-advances, Backspace on an empty box moves back, arrow keys move between boxes, and pasting a full code fills every box at once. **Use when:** entering a one-time verification code.",
      },
    },
  },
  args: { label: "Verification code", length: 6 },
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

export const Playground: Story = {};

export const FourDigits: Story = {
  args: { length: 4 },
};

export const WithHelperText: Story = {
  args: { helperText: "We sent a code to your email." },
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  args: { errorMessage: "That code didn't work. Try again." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123" },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByLabelText("Digit 1 of 6");
    first.focus();
    await userEvent.keyboard("123456");
    await expect(canvas.getByLabelText("Digit 6 of 6")).toHaveValue("6");
  },
};
