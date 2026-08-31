import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  it("associates the visible label with the search input", () => {
    render(<SearchField label="Search" />);
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
  });

  it("supports a visually hidden label", () => {
    render(<SearchField label="Search commands" hideLabel />);
    expect(screen.getByRole("searchbox", { name: "Search commands" })).toBeInTheDocument();
    expect(screen.queryByText("Search commands")).not.toBeInTheDocument();
  });

  it("reports changes as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchField label="Search" onChange={onChange} />);
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "react");
    expect(onChange).toHaveBeenLastCalledWith("react");
  });

  it("clears the value via the clear button and via Escape", async () => {
    const user = userEvent.setup();
    render(<SearchField label="Search" defaultValue="react" />);
    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(input).toHaveValue("react");
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");

    await user.type(input, "vue");
    expect(input).toHaveValue("vue");
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("");
  });

  it("shows the error message and marks the field invalid", () => {
    render(<SearchField label="Search" errorMessage="Query too short" />);
    expect(screen.getByText("Query too short")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SearchField label="Search" helperText="Matches by title" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
