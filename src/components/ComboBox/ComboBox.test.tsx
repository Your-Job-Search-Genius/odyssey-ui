import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ComboBox } from "./ComboBox";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio", disabled: true },
];

describe("ComboBox", () => {
  it("associates the visible label with the text input", () => {
    render(<ComboBox label="Document type" items={items} />);
    expect(screen.getByRole("combobox", { name: "Document type" })).toBeInTheDocument();
  });

  it("filters options as the user types", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Document type" items={items} />);
    const input = screen.getByRole("combobox", { name: "Document type" });
    await user.click(input);
    await user.type(input, "cover");
    expect(await screen.findByRole("option", { name: "Cover letter" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Resume" })).not.toBeInTheDocument();
  });

  it("selects an option and reports the selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<ComboBox label="Document type" items={items} onSelectionChange={onSelectionChange} />);
    const input = screen.getByRole("combobox", { name: "Document type" });
    await user.click(input);
    await user.click(await screen.findByRole("option", { name: "Resume" }));
    expect(onSelectionChange).toHaveBeenCalledWith("resume");
    expect(input).toHaveValue("Resume");
  });

  it("opens via the toggle button and supports arrow-key selection", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Document type" items={items} />);
    // react-aria-components appends the field's own label to this button's accessible
    // name ("Show suggestions Document type") for context — match by substring.
    await user.click(screen.getByRole("button", { name: /Show suggestions/ }));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("combobox", { name: "Document type" })).toHaveValue("Resume");
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Document type" items={items} />);
    const input = screen.getByRole("combobox", { name: "Document type" });
    await user.click(input);
    await user.type(input, "zzz-no-match");
    expect(await screen.findByText("No matches")).toBeInTheDocument();
  });

  it("has no axe violations, closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboBox label="Document type" items={items} helperText="Start typing to filter" />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("combobox"));
    await screen.findByRole("listbox");
    expect(await axe(container)).toHaveNoViolations();
  });
});
