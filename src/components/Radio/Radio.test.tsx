import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { RadioGroup, Radio } from "./Radio";

function Options(props: { defaultValue?: string; value?: string; onChange?: (v: string) => void; disabled?: boolean }) {
  return (
    <RadioGroup label="Preferred contact method" {...props}>
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>
  );
}

describe("RadioGroup / Radio", () => {
  it("exposes a group label and per-option radio roles", () => {
    render(<Options />);
    expect(screen.getByRole("radiogroup", { name: "Preferred contact method" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Phone" })).toBeInTheDocument();
  });

  it("only allows one selected option at a time", async () => {
    const user = userEvent.setup();
    render(<Options defaultValue="email" />);
    expect(screen.getByRole("radio", { name: "Email" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Phone" }));
    expect(screen.getByRole("radio", { name: "Phone" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Email" })).not.toBeChecked();
  });

  it("navigates between options with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Options defaultValue="email" />);
    screen.getByRole("radio", { name: "Email" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Phone" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Phone" })).toBeChecked();
  });

  it("works controlled via value/onChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("email");
      return <Options value={value} onChange={setValue} />;
    }
    render(<Controlled />);
    await user.click(screen.getByRole("radio", { name: "SMS" }));
    expect(screen.getByRole("radio", { name: "SMS" })).toBeChecked();
  });

  it("disables every option in the group", () => {
    render(<Options disabled />);
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<Options defaultValue="email" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
