import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { Input } from "./Input";

describe("Input", () => {
  it("associates the visible label programmatically", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("forwards a ref to the underlying input element", () => {
    let node: HTMLInputElement | null = null;
    render(
      <Input
        label="Email"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLInputElement);
  });

  it("accepts className and style passthrough on the root", () => {
    render(<Input label="Email" className="custom" style={{ marginTop: 4 }} data-testid="wrapper" />);
    // className/style land on the outer wrapper; data-testid passes through to the input via ...rest.
    expect(document.querySelector(".wsu-Input.custom")).toBeInTheDocument();
  });

  it("works uncontrolled via defaultValue", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" defaultValue="a@b.com" />);
    const input = screen.getByLabelText("Email") as HTMLInputElement;
    expect(input.value).toBe("a@b.com");
    await user.type(input, "x");
    expect(input.value).toBe("a@b.comx");
  });

  it("works controlled via value/onChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("");
      return <Input label="Email" value={value} onChange={setValue} />;
    }
    render(<Controlled />);
    const input = screen.getByLabelText("Email") as HTMLInputElement;
    await user.type(input, "hi");
    expect(input.value).toBe("hi");
  });

  it("shows the error message with role=alert and marks the field invalid", () => {
    render(<Input label="Email" errorMessage="Enter a valid email" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Enter a valid email");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("links helperText via aria-describedby", () => {
    render(<Input label="Email" helperText="We'll never share this" />);
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent("We'll never share this");
  });

  it("marks required fields as required, not color alone", () => {
    // Default `validationBehavior="native"` uses the real `required` attribute (native form
    // validation) rather than `aria-required` — see react-aria's useTextField.
    render(<Input label="Email" isRequired />);
    expect(screen.getByLabelText(/Email/)).toBeRequired();
  });

  it("toggles password visibility via a labeled, keyboard-operable button", async () => {
    const user = userEvent.setup();
    render(<Input label="Password" type="password" defaultValue="secret" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");

    const toggle = screen.getByRole("button", { name: "Show password" });
    await user.click(toggle);
    expect(input.type).toBe("text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
  });

  it("supports disabling the field", () => {
    render(<Input label="Email" isDisabled />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("renders a bare input when unstyled", () => {
    render(<Input unstyled label="Segment" placeholder="000" aria-label="First segment" />);
    const input = screen.getByLabelText("First segment");
    expect(input).toHaveClass("wsu-Input__control", "wsu-Input__control--unstyled");
    expect(document.querySelector(".wsu-Input")).not.toBeInTheDocument();
    expect(document.querySelector(".wsu-Input__field")).not.toBeInTheDocument();
  });

  it("forwards className and style to the bare input when unstyled", () => {
    render(<Input unstyled label="Segment" className="custom" style={{ flex: 1 }} aria-label="Segment" />);
    const input = screen.getByLabelText("Segment");
    expect(input).toHaveClass("wsu-Input__control", "custom");
    expect(input).toHaveStyle({ flex: "1" });
  });

  it("has no axe violations across default, error, disabled, and password variants", async () => {
    const { container } = render(
      <div>
        <Input label="Email" helperText="We'll never share this" />
        <Input label="Email" errorMessage="Enter a valid email" />
        <Input label="Email" isDisabled />
        <Input label="Password" type="password" />
        <Input label="Email" isRequired />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
