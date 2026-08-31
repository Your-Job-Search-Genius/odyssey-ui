import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DragPreview, useDrag, useDrop } from "react-aria";
import type { TextDropItem } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Drag and Drop/useDrag",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useDrag` makes an element draggable with full parity across mouse/touch *and* " +
          "keyboard/screen-reader users: pressing Enter enters an accessible drag mode, Tab " +
          "cycles between valid drop targets, and Enter drops (Escape cancels). Data can be " +
          "provided in multiple formats via `getItems`, and a custom `DragPreview` replaces the " +
          "default 'ghost' shown under the pointer while dragging.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Draggable() {
  const preview = useRef(null);
  const { dragProps, isDragging } = useDrag({
    preview,
    getItems() {
      return [{ "text/plain": "hello world" }];
    },
  });

  return (
    <>
      <div
        {...dragProps}
        role="button"
        tabIndex={0}
        className="wsu-hookDemo__draggable"
        data-dragging={isDragging}
      >
        Drag me
      </div>
      <DragPreview ref={preview}>
        {(items) => <div className="wsu-hookDemo__draggable">{items[0]?.["text/plain"]}</div>}
      </DragPreview>
    </>
  );
}

function DropTarget() {
  const [dropped, setDropped] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      const items = await Promise.all(
        e.items
          .filter(
            (item): item is TextDropItem => item.kind === "text" && item.types.has("text/plain"),
          )
          .map((item) => item.getText("text/plain")),
      );
      setDropped(items.join("\n"));
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
      {dropped ?? "Drop here"}
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Drag the chip onto the box with a mouse or touch — or Tab to it, press <kbd>Enter</kbd>{" "}
        to start an accessible drag, <kbd>Tab</kbd> to the drop target, and <kbd>Enter</kbd> again
        to drop.
      </p>
      <div className="wsu-hookDemo__row">
        <Draggable />
        <DropTarget />
      </div>
    </div>
  ),
};
