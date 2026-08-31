import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";

describe("Tooltip", () => {
  it("is not rendered until triggered", () => {
    render(
      <Tooltip content="Delete this item">
        <Button>Delete</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on focus and describes the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete this item" delay={0}>
        <Button>Delete</Button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    await user.tab();
    expect(button).toHaveFocus();

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Delete this item");
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete this item" delay={0}>
        <Button>Delete</Button>
      </Tooltip>,
    );
    await user.tab();
    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("hides again when focus moves away", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="Delete this item" delay={0}>
          <Button>Delete</Button>
        </Tooltip>
        <Button>Somewhere else</Button>
      </div>,
    );
    await user.tab();
    await screen.findByRole("tooltip");
    await user.tab();
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Delete this item" delay={0}>
        <Button>Delete</Button>
      </Tooltip>,
    );
    await user.tab();
    await screen.findByRole("tooltip");
    expect(await axe(container)).toHaveNoViolations();
  });
});
