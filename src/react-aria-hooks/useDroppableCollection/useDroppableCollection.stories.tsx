import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ListDropTargetDelegate,
  ListKeyboardDelegate,
  mergeProps,
  useDrag,
  useDroppableCollection,
  useDroppableItem,
  useDropIndicator,
  useFocusRing,
  useListBox,
  useOption,
} from "react-aria";
import { Item, useDroppableCollectionState, useListState } from "react-stately";
import type { Node } from "@react-types/shared";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Drag and Drop/useDroppableCollection",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useDroppableCollection` is the collection-level counterpart to `useDrop`: instead of " +
          "a single drop target, an entire list, grid, or table becomes droppable, with " +
          "per-item and between-item ('before'/'after') drop positions each reported through a " +
          "`DropIndicator`. Keyboard and screen reader users get the same experience as pointer " +
          "users, via `ListKeyboardDelegate` and `ListDropTargetDelegate`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ListBox(
  props: Parameters<typeof useListState>[0] &
    Parameters<typeof useListBox>[0] & {
      onItemDrop?: Parameters<typeof useDroppableCollection>[0]["onItemDrop"];
    },
) {
  const state = useListState(props);
  const ref = useRef<HTMLUListElement>(null);
  const { listBoxProps } = useListBox(props, state, ref);

  const dropState = useDroppableCollectionState({
    ...props,
    collection: state.collection,
    selectionManager: state.selectionManager,
  });
  const { collectionProps } = useDroppableCollection(
    {
      ...props,
      keyboardDelegate: new ListKeyboardDelegate(state.collection, state.disabledKeys, ref),
      dropTargetDelegate: new ListDropTargetDelegate(state.collection, ref),
    },
    dropState,
    ref,
  );

  const isDropTarget = dropState.isDropTarget({ type: "root" });

  return (
    <ul
      {...mergeProps(listBoxProps, collectionProps)}
      ref={ref}
      className="wsu-hookDemo__list"
      data-drop-target={isDropTarget}
    >
      <DropIndicator target={{ type: "root" }} dropState={dropState} />
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} dropState={dropState} />
      ))}
    </ul>
  );
}

function Option({
  item,
  state,
  dropState,
}: {
  item: Node<unknown>;
  state: ReturnType<typeof useListState>;
  dropState: ReturnType<typeof useDroppableCollectionState>;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps } = useOption({ key: item.key }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { dropProps, isDropTarget } = useDroppableItem(
    { target: { type: "item", key: item.key, dropPosition: "on" } },
    dropState,
    ref,
  );

  return (
    <>
      <DropIndicator
        target={{ type: "item", key: item.key, dropPosition: "before" }}
        dropState={dropState}
      />
      <li
        {...mergeProps(optionProps, dropProps, focusProps)}
        ref={ref}
        className="wsu-hookDemo__listItem"
        data-focus-visible={isFocusVisible}
        data-drop-target={isDropTarget}
      >
        {item.rendered}
      </li>
      {state.collection.getKeyAfter(item.key) == null && (
        <DropIndicator
          target={{ type: "item", key: item.key, dropPosition: "after" }}
          dropState={dropState}
        />
      )}
    </>
  );
}

function DropIndicator(
  props: Parameters<typeof useDropIndicator>[0] & {
    dropState: ReturnType<typeof useDroppableCollectionState>;
  },
) {
  const ref = useRef<HTMLLIElement>(null);
  const { dropIndicatorProps, isHidden, isDropTarget } = useDropIndicator(
    props,
    props.dropState,
    ref,
  );
  if (isHidden) return null;

  return (
    <li
      {...dropIndicatorProps}
      role="option"
      aria-selected="false"
      ref={ref}
      className="wsu-hookDemo__dropIndicator"
      data-drop-target={isDropTarget}
    />
  );
}

function Draggable() {
  const { dragProps, isDragging } = useDrag({
    getItems: () => [{ "text/plain": "budget.xls" }],
  });

  return (
    <div
      {...dragProps}
      role="button"
      tabIndex={0}
      className="wsu-hookDemo__draggable"
      data-dragging={isDragging}
    >
      budget.xls
    </div>
  );
}

function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Drag the file chip onto one of the list items below — a drop indicator shows above,
        below, or directly on the row you&rsquo;re hovering.
      </p>
      <div className="wsu-hookDemo__row">
        <Draggable />
        <ListBox
          aria-label="Files"
          selectionMode="single"
          onItemDrop={(e) => setMessage(`Dropped on ${String(e.target.key)}`)}
        >
          <Item key="documents">Documents</Item>
          <Item key="proposal">proposal.doc</Item>
          <Item key="presentation">presentation.ppt</Item>
        </ListBox>
      </div>
      {message && <p className="wsu-hookDemo__intro">{message}</p>}
    </div>
  );
}

export const Basic: Story = {
  render: () => <Demo />,
};
