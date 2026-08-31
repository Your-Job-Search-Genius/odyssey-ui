import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DropZone, Text } from "./DropZone";

describe("DropZone", () => {
  it("renders its label content", () => {
    render(
      <DropZone aria-label="Drop files here">
        <Text slot="label">Drop or paste files here</Text>
      </DropZone>,
    );
    expect(screen.getByText("Drop or paste files here")).toBeInTheDocument();
  });

  it("exposes an accessible, focusable target named by aria-label", () => {
    render(<DropZone aria-label="Drop files here" />);
    expect(screen.getByRole("button", { name: "Drop files here" })).toBeInTheDocument();
  });

  it("marks itself disabled via data-disabled and ignores a paste while disabled", () => {
    const onDrop = vi.fn();
    const { container } = render(<DropZone aria-label="Drop files here" isDisabled onDrop={onDrop} />);
    expect(container.querySelector(".wsu-DropZone")).toHaveAttribute("data-disabled", "true");

    const target = screen.getByRole("button", { name: "Drop files here" });
    act(() => {
      target.focus();
    });
    const clipboardData = {
      types: ["text/plain"],
      items: [{ kind: "string", type: "text/plain" }],
      getData: (type: string) => (type === "text/plain" ? "hello world" : ""),
    };
    const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(pasteEvent, "clipboardData", { value: clipboardData });
    act(() => {
      document.dispatchEvent(pasteEvent);
    });

    expect(onDrop).not.toHaveBeenCalled();
  });

  it("merges a custom className alongside the base class", () => {
    const { container } = render(<DropZone aria-label="Drop files here" className="custom-zone" />);
    const zone = container.querySelector(".wsu-DropZone");
    expect(zone).toHaveClass("wsu-DropZone", "custom-zone");
  });

  it("accepts a pasted item — the keyboard/screen-reader equivalent of a drop", () => {
    const onDrop = vi.fn();
    render(<DropZone aria-label="Drop files here" onDrop={onDrop} />);

    const target = screen.getByRole("button", { name: "Drop files here" });
    act(() => {
      target.focus();
    });

    const clipboardData = {
      types: ["text/plain"],
      items: [{ kind: "string", type: "text/plain" }],
      getData: (type: string) => (type === "text/plain" ? "hello world" : ""),
    };
    const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(pasteEvent, "clipboardData", { value: clipboardData });
    act(() => {
      document.dispatchEvent(pasteEvent);
    });

    expect(onDrop).toHaveBeenCalledTimes(1);
    const event = onDrop.mock.calls[0]?.[0];
    expect(event.items[0].kind).toBe("text");
  });

  it("ignores a paste when it isn't focused", () => {
    const onDrop = vi.fn();
    render(<DropZone aria-label="Drop files here" onDrop={onDrop} />);

    const clipboardData = {
      types: ["text/plain"],
      items: [{ kind: "string", type: "text/plain" }],
      getData: (type: string) => (type === "text/plain" ? "hello world" : ""),
    };
    const pasteEvent = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(pasteEvent, "clipboardData", { value: clipboardData });
    act(() => {
      document.dispatchEvent(pasteEvent);
    });

    expect(onDrop).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DropZone aria-label="Drop files here">
        <Text slot="label">Drop or paste files here</Text>
      </DropZone>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
