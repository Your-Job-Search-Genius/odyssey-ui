import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useDrag, useDrop } from "react-aria";
import type { FileDropItem } from "react-aria";
import "../shared/hook-demos.css";

const meta: Meta = {
  title: "React Aria Hooks/Drag and Drop/useDrop",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`useDrop` is the receiving half of `useDrag`'s mouse/touch/keyboard/screen-reader " +
          "parity. Dropped data arrives as one of three item kinds — text, file, or directory — " +
          "each with its own way to read the payload. `getDropOperation` lets a target reject " +
          "types it doesn't understand *before* anything visually indicates the drop would be " +
          "accepted, which is what the demo below uses to only ever accept images.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Draggable() {
  const { dragProps, isDragging } = useDrag({
    getItems() {
      return [{ "text/plain": "hello world" }];
    },
  });

  return (
    <div
      {...dragProps}
      role="button"
      tabIndex={0}
      className="wsu-hookDemo__draggable"
      data-dragging={isDragging}
    >
      Drag me (rejected — text)
    </div>
  );
}

function ImageDropTarget() {
  const [file, setFile] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    getDropOperation(types) {
      return types.has("image/png") || types.has("image/jpeg") ? "copy" : "cancel";
    },
    async onDrop(e) {
      const image = e.items.find(
        (item) =>
          item.kind === "file" && (item.type === "image/png" || item.type === "image/jpeg"),
      ) as FileDropItem | undefined;
      if (image) {
        setFile(URL.createObjectURL(await image.getFile()));
      }
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
      {file ? (
        <img
          src={file}
          alt="Dropped"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        "Drop a PNG/JPEG image here"
      )}
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div className="wsu-hookDemo">
      <p className="wsu-hookDemo__intro">
        Drag the text chip onto the box — it&rsquo;s rejected, since this target only accepts
        images. Instead, drag a PNG or JPEG file from your desktop straight into the browser.
      </p>
      <div className="wsu-hookDemo__row">
        <Draggable />
        <ImageDropTarget />
      </div>
    </div>
  ),
};
