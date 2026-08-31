import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { RadioGroup, Radio } from "./Radio";

function Options(props: {
  defaultValue?: string;
  value?: string | null;
  onChange?: (v: string) => void;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
}) {
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

  it("disables a single option without affecting the rest", () => {
    render(
      <RadioGroup label="Shipping method" defaultValue="standard">
        <Radio value="standard">Standard</Radio>
        <Radio value="overnight" disabled>
          Overnight
        </Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Standard" })).toBeEnabled();
    expect(screen.getByRole("radio", { name: "Overnight" })).toBeDisabled();
  });

  it("associates a per-option description via aria-describedby", () => {
    render(
      <RadioGroup label="Shipping method" defaultValue="standard">
        <Radio value="standard" description="Delivers in 5–7 business days">
          Standard Shipping
        </Radio>
      </RadioGroup>,
    );
    const radio = screen.getByRole("radio", { name: "Standard Shipping" });
    const describedBy = radio.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent("Delivers in 5–7 business days");
  });

  it("renders helper text when there is no error", () => {
    render(<Options helperText="Used to route your reply." />);
    expect(screen.getByText("Used to route your reply.")).toBeInTheDocument();
  });

  it("renders an error message and marks the group invalid instead of helper text", () => {
    render(<Options helperText="Used to route your reply." errorMessage="Choose a contact method." />);
    expect(screen.getByText("Choose a contact method.")).toBeInTheDocument();
    expect(screen.queryByText("Used to route your reply.")).not.toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
  });

  it("blocks native form submission when required and nothing is selected", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <RadioGroup label="Favorite pet" name="pet" required>
          <Radio value="dog">Dog</Radio>
          <Radio value="cat">Cat</Radio>
        </RadioGroup>
        <button type="submit">Submit</button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Dog" })).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Options defaultValue="email" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with descriptions and an error message", async () => {
    const { container } = render(
      <RadioGroup label="Shipping method" required errorMessage="Choose a shipping method.">
        <Radio value="standard" description="Delivers in 5–7 business days">
          Standard
        </Radio>
        <Radio value="overnight" description="Next-day delivery" disabled>
          Overnight
        </Radio>
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
