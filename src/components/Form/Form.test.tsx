import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Form } from "./Form";
import { Input } from "../Input";
import { Button } from "../Button";

describe("Form", () => {
  it("renders a native form element", () => {
    render(
      <Form aria-label="Sign up">
        <Input label="Name" name="name" />
      </Form>,
    );
    expect(screen.getByRole("form", { name: "Sign up" })).toBeInTheDocument();
  });

  it("submits with the entered field values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <Form aria-label="Sign up" onSubmit={onSubmit}>
        <Input label="Name" name="name" />
        <Button type="submit">Submit</Button>
      </Form>,
    );
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada Lovelace");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const form = screen.getByRole("form", { name: "Sign up" }) as HTMLFormElement;
    expect(new FormData(form).get("name")).toBe("Ada Lovelace");
  });

  it("does not submit a required native field left empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form aria-label="Sign up" onSubmit={onSubmit}>
        <Input label="Name" name="name" isRequired />
        <Button type="submit">Submit</Button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("resets field values on a reset button click", async () => {
    const user = userEvent.setup();
    render(
      <Form aria-label="Sign up">
        <Input label="Name" name="name" defaultValue="" />
        <Button type="reset">Reset</Button>
      </Form>,
    );
    const input = screen.getByRole("textbox", { name: "Name" });
    await user.type(input, "Ada Lovelace");
    expect(input).toHaveValue("Ada Lovelace");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(input).toHaveValue("");
  });

  it("forwards className alongside the wsu-Form class", () => {
    render(
      <Form aria-label="Sign up" className="custom">
        <Input label="Name" name="name" />
      </Form>,
    );
    expect(screen.getByRole("form", { name: "Sign up" })).toHaveClass("wsu-Form", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Form aria-label="Sign up">
        <Input label="Name" name="name" isRequired />
        <Input label="Email" name="email" type="email" isRequired />
        <Button type="submit">Submit</Button>
      </Form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
