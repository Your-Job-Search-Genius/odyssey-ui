import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { CheckboxGroup, Checkbox } from "./Checkbox";

function Options(props: { defaultValue?: string[]; value?: string[]; onChange?: (v: string[]) => void; disabled?: boolean }) {
  return (
    <CheckboxGroup label="Notification preferences" {...props}>
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
      <Checkbox value="marketing" label="Marketing Emails" />
    </CheckboxGroup>
  );
}

describe("CheckboxGroup / Checkbox", () => {
  it("exposes a group label and per-option checkbox roles", () => {
    render(<Options />);
    expect(screen.getByRole("group", { name: "Notification preferences" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Product Updates" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Security Alerts" })).toBeInTheDocument();
  });

  it("allows multiple options selected simultaneously", async () => {
    const user = userEvent.setup();
    render(<Options defaultValue={["product"]} />);
    expect(screen.getByRole("checkbox", { name: "Product Updates" })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Security Alerts" }));
    expect(screen.getByRole("checkbox", { name: "Product Updates" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Security Alerts" })).toBeChecked();
  });

  it("toggles via keyboard (Space) and preserves independent tab order", async () => {
    const user = userEvent.setup();
    render(<Options />);
    screen.getByRole("checkbox", { name: "Product Updates" }).focus();
    await user.keyboard(" ");
    expect(screen.getByRole("checkbox", { name: "Product Updates" })).toBeChecked();
    await user.tab();
    expect(screen.getByRole("checkbox", { name: "Security Alerts" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("checkbox", { name: "Security Alerts" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Product Updates" })).toBeChecked();
  });

  it("works uncontrolled via defaultValue, using a bare Checkbox with no local checked prop", () => {
    render(<Options defaultValue={["security"]} />);
    expect(screen.getByRole("checkbox", { name: "Security Alerts" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Product Updates" })).not.toBeChecked();
  });

  it("works controlled via value/onChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<string[]>([]);
      return <Options value={value} onChange={setValue} />;
    }
    render(<Controlled />);
    await user.click(screen.getByRole("checkbox", { name: "Marketing Emails" }));
    expect(screen.getByRole("checkbox", { name: "Marketing Emails" })).toBeChecked();
  });

  it("calls onChange with the full updated value array", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Options defaultValue={["product"]} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox", { name: "Security Alerts" }));
    expect(onChange).toHaveBeenCalledWith(["product", "security"]);
  });

  it("disables every option in the group", () => {
    render(<Options disabled />);
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toBeDisabled();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<Options defaultValue={["product"]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
