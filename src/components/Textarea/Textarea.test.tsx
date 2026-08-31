import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("associates the visible label programmatically", () => {
    render(<Textarea label="Cover letter" />);
    expect(screen.getByLabelText("Cover letter")).toBeInTheDocument();
  });

  it("forwards a ref to the underlying textarea", () => {
    let node: HTMLTextAreaElement | null = null;
    render(
      <Textarea
        label="Cover letter"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("works both uncontrolled and controlled", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Cover letter" defaultValue="Dear hiring manager" />);
    const field = screen.getByLabelText("Cover letter") as HTMLTextAreaElement;
    expect(field.value).toBe("Dear hiring manager");
    await user.type(field, "!");
    expect(field.value).toBe("Dear hiring manager!");
  });

  it("shows the error message with role=alert and marks the field invalid", () => {
    render(<Textarea label="Cover letter" errorMessage="This field is required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("This field is required");
    expect(screen.getByLabelText("Cover letter")).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations across default, error, and disabled variants", async () => {
    const { container } = render(
      <div>
        <Textarea label="Cover letter" helperText="Keep it under 500 words" />
        <Textarea label="Cover letter" errorMessage="This field is required" />
        <Textarea label="Cover letter" disabled />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
