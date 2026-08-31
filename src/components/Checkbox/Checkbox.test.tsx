import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("associates the visible label programmatically", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeInTheDocument();
  });

  it("toggles on click and reports the new value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={onChange} />);
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles via keyboard (Space)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={onChange} />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    box.focus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("works uncontrolled via defaultChecked", () => {
    render(<Checkbox label="Accept terms" defaultChecked />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeChecked();
  });

  it("works controlled via checked/onChange", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Checkbox label="Accept terms" checked={checked} onChange={setChecked} />;
    }
    render(<Controlled />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(box).not.toBeChecked();
    await user.click(box);
    expect(box).toBeChecked();
  });

  it("exposes the indeterminate state to assistive tech", () => {
    render(<Checkbox label="Select all" indeterminate />);
    const box = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" disabled onChange={onChange} />);
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has no axe violations across checked, indeterminate, and disabled states", async () => {
    const { container } = render(
      <div>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders and associates description text via aria-describedby", () => {
    render(<Checkbox label="Product Updates" description="Get notified about new features and improvements" />);
    const box = screen.getByRole("checkbox", { name: "Product Updates" });
    const describedById = box.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    expect(document.getElementById(describedById as string)).toHaveTextContent(
      "Get notified about new features and improvements",
    );
  });

  it("has no axe violations with a description", async () => {
    const { container } = render(<Checkbox label="Product Updates" description="Get notified about new features and improvements" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
