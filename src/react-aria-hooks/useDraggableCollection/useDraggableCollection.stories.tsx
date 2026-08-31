import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  mergeProps,
  useDraggableCollection,
  useDraggableItem,
  useDrop,
  useFocusRing,
  useListBox,
  useOption,
} from "react-aria";
import { Item, useDraggableCollectionState, useListState } from "react-stately";
import type { Node } from "@react-types/shared";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Drag and Drop/useDraggableCollection",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useDraggableCollection` extends `useDrag`'s mouse/touch/keyboard parity to an entire " +
          "collection component (list box, grid, table, etc.) at once — each item becomes " +
          "individually draggable via `useDraggableItem`, and a multi-selection drags every " +
          "selected item together. This is the primitive a reorderable list or an 'export " +
          "selected rows' interaction would be built on.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ListBox(props: Parameters<typeof useListState>[0] & Parameters<typeof useListBox>[0]) {
  const state = useListState(props);
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxProps } = useListBox({ ...props, shouldSelectOnPressUp: true }, state, ref);

  const dragState = useDraggableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager,
    getItems: (keys) =>
      [...keys].map((key) => ({ "text/plain": state.collection.getItem(key)?.textValue ?? "" })),
  });
  useDraggableCollection(props, dragState, ref);

  return (
    <ul {...listBoxProps} ref={ref} className="wsu-hookDemo__list">
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} dragState={dragState} />
      ))}
    </ul>
  );
}

function Option({
  item,
  state,
  dragState,
}: {
  item: Node<unknown>;
  state: ReturnType<typeof useListState>;
  dragState: ReturnType<typeof useDraggableCollectionState>;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps } = useOption({ key: item.key }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { dragProps } = useDraggableItem({ key: item.key }, dragState);

  return (
    <li
      {...mergeProps(optionProps, dragProps, focusProps)}
      ref={ref}
      className="wsu-hookDemo__listItem"
      data-focus-visible={isFocusVisible}
      style={{ cursor: "grab" }}
    >
      {item.rendered}
    </li>
  );
}

function DropTarget() {
  const [dropped, setDropped] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      const texts = await Promise.all(
        e.items.map((item) => (item.kind === "text" ? item.getText("text/plain") : null)),
      );
      setDropped(texts.filter(Boolean).join(", "));
    },
  });

  return (
    <div
      {...dropProps}
      role="button"
      tabIndex={0}
      ref={ref}
      className="wsu-hookDemo__droppable"
      data-drop-target={isDropTarget}
    >
      {dropped || "Drop here"}
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Select one or more categories (click, or Space/Enter with the keyboard), then drag the
        selection onto the drop target — or press <kbd>Enter</kbd> on a selected item to start an
        accessible drag.
      </p>
      <div className="wsu-hookDemo__row">
        <ListBox aria-label="Categories" selectionMode="multiple">
          <Item key="animals">Animals</Item>
          <Item key="people">People</Item>
          <Item key="plants">Plants</Item>
        </ListBox>
        <DropTarget />
      </div>
    </div>
  ),
};
