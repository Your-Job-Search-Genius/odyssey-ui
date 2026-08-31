import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Autocomplete } from "./Autocomplete";

const items = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
];

describe("Autocomplete", () => {
  it("accepts a custom value that doesn't match any suggestion", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Skill" items={items} />);
    const input = screen.getByRole("combobox", { name: "Skill" });
    await user.type(input, "Rust");
    await user.tab();
    expect(input).toHaveValue("Rust");
  });

  it("still offers and accepts a matching suggestion", async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Skill" items={items} />);
    const input = screen.getByRole("combobox", { name: "Skill" });
    await user.type(input, "Type");
    await user.click(await screen.findByRole("option", { name: "TypeScript" }));
    expect(input).toHaveValue("TypeScript");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Autocomplete label="Skill" items={items} helperText="Type any skill" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
