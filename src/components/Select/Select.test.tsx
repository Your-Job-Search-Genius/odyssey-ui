import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Select } from "./Select";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio", disabled: true },
];

describe("Select", () => {
  it("associates the visible label and shows the placeholder when nothing is selected", () => {
    render(<Select label="Document type" items={items} placeholder="Choose a document" />);
    const trigger = screen.getByRole("button", { name: /Document type/ });
    expect(trigger).toHaveTextContent("Choose a document");
  });

  it("opens the listbox and selects an option on click", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Select label="Document type" items={items} onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByRole("button", { name: /Document type/ }));
    const option = await screen.findByRole("option", { name: "Resume" });
    await user.click(option);
    expect(onSelectionChange).toHaveBeenCalledWith("resume");
    expect(screen.getByRole("button", { name: /Document type/ })).toHaveTextContent("Resume");
  });

  it("supports full keyboard operation: open, navigate, select", async () => {
    const user = userEvent.setup();
    render(<Select label="Document type" items={items} defaultSelectedKey="resume" />);
    const trigger = screen.getByRole("button", { name: /Document type/ });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(trigger).toHaveTextContent("Cover letter");
  });

  it("skips disabled options", async () => {
    const user = userEvent.setup();
    render(<Select label="Document type" items={items} />);
    await user.click(screen.getByRole("button", { name: /Document type/ }));
    expect(screen.getByRole("option", { name: "Portfolio" })).toHaveAttribute("aria-disabled", "true");
  });

  it("shows the error message and links it to the trigger via aria-describedby", () => {
    render(<Select label="Document type" items={items} errorMessage="Pick a document type" />);
    const message = screen.getByText("Pick a document type");
    const trigger = screen.getByRole("button", { name: /Document type/ });
    expect(trigger).toHaveAttribute("aria-describedby", message.id);
  });

  it("disables the trigger", () => {
    render(<Select label="Document type" items={items} disabled />);
    expect(screen.getByRole("button", { name: /Document type/ })).toBeDisabled();
  });

  it("filters options as the user types when searchable", async () => {
    const user = userEvent.setup();
    render(<Select label="Document type" items={items} searchable searchLabel="Search document types" />);
    await user.click(screen.getByRole("button", { name: /Document type/ }));
    const search = await screen.findByRole("searchbox", { name: "Search document types" });
    await user.type(search, "cover");
    expect(await screen.findByRole("option", { name: "Cover letter" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Resume" })).not.toBeInTheDocument();
  });

  it("has no axe violations, closed and open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Select label="Document type" items={items} helperText="Used for the export filename" />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: /Document type/ }));
    await screen.findByRole("listbox");
    expect(await axe(container)).toHaveNoViolations();
  });
});
