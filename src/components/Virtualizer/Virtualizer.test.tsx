import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ListBox as AriaListBox, ListBoxItem, GridList as AriaGridList, GridListItem } from "react-aria-components";
import { Size } from "react-aria-components/Virtualizer";
import { Virtualizer, ListLayout, GridLayout } from "./Virtualizer";

// jsdom performs no real layout, so `Virtualizer` can't be asserted to
// actually window a collection down to a handful of rows here — that's
// covered by the `play` functions on Virtualizer.stories.tsx, which run
// against a real browser. These tests cover what jsdom can verify: the
// wrapper renders its child collection through to real, correctly-roled
// DOM without crashing or introducing accessibility violations.

const items = Array.from({ length: 30 }, (_, i) => ({ id: i, name: `Item ${i + 1}` }));

describe("Virtualizer", () => {
  it("renders a ListBox collection under a ListLayout", () => {
    render(
      <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 32 }}>
        <AriaListBox aria-label="Items" items={items} style={{ height: 200 }}>
          {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
        </AriaListBox>
      </Virtualizer>,
    );
    expect(screen.getByRole("listbox", { name: "Items" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Item 1" })).toBeInTheDocument();
  });

  it("renders a GridList collection under a GridLayout", () => {
    render(
      <Virtualizer layout={GridLayout} layoutOptions={{ minItemSize: new Size(100, 100) }}>
        <AriaGridList layout="grid" aria-label="Cards" items={items} style={{ height: 200 }}>
          {(item) => <GridListItem textValue={item.name}>{item.name}</GridListItem>}
        </AriaGridList>
      </Virtualizer>,
    );
    // GridLayout computes its column count from the container's measured
    // width to window rows, which jsdom (no real layout) always reports as
    // 0 — so no rows render here even though they do in a real browser
    // (verified by Virtualizer.stories.tsx's play function). Only the
    // collection root itself is asserted.
    expect(screen.getByRole("grid", { name: "Cards" })).toBeInTheDocument();
  });

  it("supports shouldObserveItemSize without crashing", () => {
    render(
      <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 32 }} shouldObserveItemSize>
        <AriaListBox aria-label="Items" items={items.slice(0, 5)} style={{ height: 200 }}>
          {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
        </AriaListBox>
      </Virtualizer>,
    );
    expect(screen.getAllByRole("option")).toHaveLength(5);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 32 }}>
        <AriaListBox aria-label="Items" items={items} style={{ height: 200 }}>
          {(item) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
        </AriaListBox>
      </Virtualizer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
