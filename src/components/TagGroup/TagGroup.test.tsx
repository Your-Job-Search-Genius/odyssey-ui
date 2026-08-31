import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TagGroup } from "./TagGroup";

const items = [
  { id: "news", label: "News" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming", disabled: true },
];

describe("TagGroup", () => {
  it("associates the visible label with the group", () => {
    render(<TagGroup label="Interests" items={items} />);
    expect(screen.getByText("Interests")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Travel")).toBeInTheDocument();
  });

  it("selects a tag and reports the selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<TagGroup label="Interests" items={items} selectionMode="multiple" onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByText("Travel"));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it("shows a remove button only when onRemove is supplied", () => {
    const { rerender } = render(<TagGroup label="Interests" items={items} />);
    expect(screen.queryByRole("button", { name: /Remove News/ })).not.toBeInTheDocument();
    rerender(<TagGroup label="Interests" items={items} onRemove={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Remove News/ })).toBeInTheDocument();
  });

  it("removes a tag via its remove button", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<TagGroup label="Interests" items={items} onRemove={onRemove} />);
    // react-aria-components appends the row's own accessible name to this button's
    // name ("Remove News News") — match by substring, as ComboBox's toggle button does.
    await user.click(screen.getByRole("button", { name: /Remove News/ }));
    expect(onRemove).toHaveBeenCalledWith(new Set(["news"]));
  });

  it("filters tags as the user types when searchable", async () => {
    const user = userEvent.setup();
    render(<TagGroup label="Interests" items={items} searchable searchLabel="Search interests" />);
    const search = screen.getByRole("searchbox", { name: "Search interests" });
    await user.type(search, "Trav");
    expect(await screen.findByText("Travel")).toBeInTheDocument();
    expect(screen.queryByText("News")).not.toBeInTheDocument();
  });

  it("shows the error message", () => {
    render(<TagGroup label="Interests" items={items} errorMessage="Choose at least one." />);
    expect(screen.getByText("Choose at least one.")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TagGroup label="Interests" items={items} selectionMode="multiple" helperText="Pick a few" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
