import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TagsInput } from "./TagsInput";

describe("TagsInput", () => {
  it("adds a tag on Enter and clears the draft", async () => {
    const user = userEvent.setup();
    render(<TagsInput label="Skills" />);
    const field = screen.getByLabelText("Skills");
    await user.type(field, "React{Enter}");
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(field).toHaveValue("");
  });

  it("removes the last tag on Backspace in an empty field", async () => {
    const user = userEvent.setup();
    render(<TagsInput label="Skills" defaultValue={["React", "CSS"]} />);
    await user.click(screen.getByLabelText("Skills"));
    await user.keyboard("{Backspace}");
    expect(screen.queryByText("CSS")).not.toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("gives every tag its own removal button", async () => {
    const user = userEvent.setup();
    render(<TagsInput label="Skills" defaultValue={["React", "CSS"]} />);
    await user.click(screen.getByRole("button", { name: "Remove React" }));
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
  });

  it("rejects duplicates unless allowDuplicates is set", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TagsInput label="Skills" defaultValue={["React"]} />);
    await user.type(screen.getByLabelText("Skills"), "React{Enter}");
    expect(screen.getAllByText("React")).toHaveLength(1);

    rerender(<TagsInput label="Skills" allowDuplicates defaultValue={["React"]} />);
    await user.type(screen.getByLabelText("Skills"), "React{Enter}");
    expect(screen.getAllByText("React").length).toBeGreaterThan(1);
  });

  it("supports a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TagsInput label="Skills" value={[]} onValueChange={onValueChange} />);
    await user.type(screen.getByLabelText("Skills"), "React{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(["React"]);
  });

  it("announces changes through a live region", async () => {
    const user = userEvent.setup();
    render(<TagsInput label="Skills" />);
    await user.type(screen.getByLabelText("Skills"), "React{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("React added");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TagsInput label="Skills" defaultValue={["React", "CSS"]} helperText="Press Enter to add" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
